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
    handlers=[logging.FileHandler('simulation.log')]
)
logger = logging.getLogger(__name__)

def fetch_historical_data(agent: AgenticAILogistics, region: str, date_str: str) -> Optional[Tuple]:
    try:
        hospital_data, social_data = agent.fetch_data(region, date_str)
        return hospital_data, social_data
    except Exception as e:
        logger.error(f"Failed to fetch historical data for {date_str}, region {region}: {e}")
        return None, None

def main() -> None:
    try:
        agent = AgenticAILogistics()
        start_date = datetime(2024, 1, 1)
        end_date = datetime(2024, 1, 31)
        date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
        regions = ["A", "B", "C"]
        region_map = {"A": "Deira", "B": "Bur Dubai", "C": "Jumeirah"}

        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(fetch_historical_data, agent, region, d.strftime('%Y-%m-%d'))
                for d in date_range for region in regions
            ]
            for future in as_completed(futures):
                hospital_data, social_data = future.result()
                if hospital_data and social_data:
                    agent.historical_hospital.append(hospital_data)
                    agent.historical_social.append(social_data)

        if agent.historical_hospital and agent.historical_social:
            agent.train_model(agent.historical_hospital, agent.historical_social)
        else:
            logger.error("No historical data fetched. Model training skipped.")
            return

        csv_file = 'inferences.csv'
        if not os.path.exists(csv_file):
            with open(csv_file, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([
                    'date', 'region', 'hospital_flu_cases', 'gp_flu_cases',
                    'hospital_respiratory_cases', 'gp_respiratory_cases', 'flu_mentions',
                    'predicted_demand', 'interpretation'
                ])

        while True:
            current_date = datetime.now().strftime('%Y-%m-%d')
            for region in regions:
                try:
                    hospital_data, social_data = agent.fetch_data(region, current_date)
                    if not agent.is_trained:
                        logger.warning(f"Model not trained for region {region}. Skipping prediction.")
                        continue
                    predicted_demand, features = agent.predict_demand(hospital_data, social_data)
                    order = agent.optimize_logistics(predicted_demand)
                    interpretation = agent.interpret_prediction(hospital_data, social_data, predicted_demand, features)

                    with open(csv_file, 'a', newline='') as f:
                        writer = csv.writer(f)
                        writer.writerow([
                            current_date, region_map[region], *features, predicted_demand, interpretation
                        ])

                    actual_demand = max(0, predicted_demand * (1 + np.random.normal(0, 0.1)))
                    agent.incorporate_human_feedback(predicted_demand, actual_demand, True)
                    agent.update_model(hospital_data, social_data)

                except Exception as e:
                    logger.error(f"Error processing region {region}: {e}")
                    continue

            time.sleep(int(os.environ.get("WAIT_TIME", 3600)))

    except KeyboardInterrupt:
        logger.info("System shutdown initiated.")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
    finally:
        logger.info("Terminating services.")

if __name__ == "__main__":
    main()