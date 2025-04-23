#
import os
import logging
from datetime import datetime, timedelta
import time
import numpy as np
from agent import AgenticAILogistics
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Tuple, Optional
import csv

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s [%(name)s] %(message)s',
    handlers=[
        logging.FileHandler('simulation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def fetch_historical_data(agent: AgenticAILogistics, region: str, date_str: str) -> Optional[Tuple]:
    try:
        hospital_data, social_data = agent.fetch_data(region, date_str)
        return hospital_data, social_data
    except Exception as e:
        logger.error(f"Error fetching historical data for {date_str}, region {region}: {e}")
        return None, None

def main() -> None:
    try:
        agent = AgenticAILogistics()
        logger.info("AgenticAILogistics initialized")

        start_date = datetime(2024, 1, 1)
        end_date = datetime(2024, 1, 31)
        date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
        regions = ["A", "B", "C"]

        region_map = {"A": "Deira", "B": "Bur Dubai", "C": "Jumeirah"}

        logger.info("Fetching historical data in parallel...")
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(fetch_historical_data, agent, region, d.strftime('%Y-%m-%d'))
                for d in date_range for region in regions
            ]
            for future in as_completed(futures):
                h, s = future.result()
                if h and s:
                    agent.historical_hospital.append(h)
                    agent.historical_social.append(s)

        result = agent.train_model(agent.historical_hospital, agent.historical_social)
        logger.info(f"Initial training complete: {result['message']}")
        print(f"Initial training complete: {result['message']}")

        csv_file = 'inferences.csv'
        if not os.path.exists(csv_file):
            with open(csv_file, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([
                    'date', 'region', 'hospital_flu_cases', 'gp_flu_cases',
                    'hospital_respiratory_cases', 'gp_respiratory_cases', 'flu_mentions',
                    'predicted_demand', 'interpretation'
                ])

        print("\nStarting continuous monitoring and prediction across regions...")
        while True:
            current_date = datetime.now().strftime('%Y-%m-%d')
            print(f"\n=== HEALTHCARE LOGISTICS UPDATE: {current_date} ===")

            for region in regions:
                print(f"\nRegion {region} Analysis:")
                try:
                    hospital_data, social_data = agent.fetch_data(region, current_date)
                    predicted_demand, features = agent.predict_demand(hospital_data, social_data)
                    order = agent.optimize_logistics(predicted_demand)
                    interpretation = agent.interpret_prediction(hospital_data, social_data, predicted_demand, features)
                    report = agent.generate_report(predicted_demand, order, interpretation)

                    with open(csv_file, 'a', newline='') as f:
                        writer = csv.writer(f)
                        writer.writerow([
                            current_date,
                            region_map[region],
                            *features,  
                            predicted_demand,
                            interpretation
                        ])

                    print(f"Predicted FluVax Demand: {predicted_demand:.0f} units")
                    print(f"Action: {order['status']}")
                    if order['quantity'] > 0:
                        print(f"Ordered {order['quantity']} units of {order['medicine']}")

                    print("\nAI Interpretation:")
                    shortened_interp = "\n".join(interpretation.split("\n")[:5]) + "\n..."
                    print(shortened_interp)

                    feedback_choice = input("\nProvide feedback for this prediction? (y/n): ").lower()
                    if feedback_choice == 'y':
                        actual_demand = max(0, predicted_demand * (1 + np.random.normal(0, 0.1)))
                        print(f"Actual demand turned out to be: {actual_demand:.0f}")
                        approval = input("Approve this data for model improvement? (y/n): ").lower() == 'y'
                        feedback_result = agent.incorporate_human_feedback(predicted_demand, actual_demand, approval)
                        print(f"Feedback result: {feedback_result['message']}")
                        logger.info(f"Feedback incorporated for region {region}: {feedback_result['message']}")

                    agent.update_model(hospital_data, social_data)
                    logger.info(f"Model updated for region {region} with new data")

                except Exception as e:
                    logger.error(f"Error processing region {region}: {e}")
                    print(f"Error in region {region} analysis: {e}")

            wait_time = 60  # this is a demo
            print(f"\nWaiting {wait_time} seconds for next update cycle...")
            time.sleep(wait_time)

    except KeyboardInterrupt:
        print("\nShutting down agentic AI system...")
        logger.info("System shutdown via KeyboardInterrupt")
    except Exception as e:
        logger.error(f"Unexpected error in main loop: {e}")
        print(f"An error occurred: {e}")
    finally:
        print("Terminating API services...")

if __name__ == "__main__":
    main()
