import logging
from typing import List, Dict, Tuple
import requests
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime
import numpy as np
from openai import OpenAI
import os

logger = logging.getLogger(__name__)

class AgenticAILogistics:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.inventory = {"FluVax": 5000, "AntiViral": 2000}
        self.threshold = 100
        self.is_trained = False
        self.historical_hospital: List[Dict] = []
        self.historical_social: List[Dict] = []
        self.region_map = {"A": "Deira", "B": "Bur Dubai", "C": "Jumeirah"}
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY environment variable is required")
        logger.info("AgenticAILogistics initialized")

    def fetch_data(self, region: str, date: str) -> Tuple[Dict, Dict]:
        """Fetch hospital and social media data for the given region and date."""
        logger.info(f"Fetching data for region {region}, date {date}")
        hospital_url = f"http://localhost:5002/hospital_data?region={region}&date={date}"
        social_url = f"http://localhost:5001/social_data?region={region}&date={date}"
        try:
            hospital_response = requests.get(hospital_url)
            hospital_response.raise_for_status()
            hospital_data = hospital_response.json()
            social_response = requests.get(social_url)
            social_response.raise_for_status()
            social_data = social_response.json()
            logger.info("Data fetched successfully")
            return hospital_data, social_data
        except requests.RequestException as e:
            logger.error(f"Failed to fetch data: {e}")
            raise

    def train_model(self, historical_hospital: List[Dict], historical_social: List[Dict]) -> Dict[str, str]:
        """Train the model with historical hospital and social media data."""
        if len(historical_hospital) != len(historical_social):
            raise ValueError("Historical hospital and social data must have the same length")
        features = [
            [h['hospital_flu_cases'], h['gp_flu_cases'], 
             h['hospital_respiratory_cases'], h['gp_respiratory_cases'], len(s['posts'])]
            for h, s in zip(historical_hospital, historical_social)
        ]
        targets = [h['medicine_demand']['FluVax'] for h in historical_hospital]
        logger.info(f"Training model with {len(features)} data points")
        self.model.fit(features, targets)
        self.is_trained = True
        logger.info("Model trained successfully")
        return {"status": "success", "message": f"Model trained on {len(features)} data points"}

    def predict_demand(self, hospital_data: Dict, social_data: Dict) -> Tuple[float, List[float]]:
        """Predict FluVax demand based on current hospital and social media data."""
        if not self.is_trained:
            raise Exception("Model not trained yet!")
        flu_mentions = len(social_data['posts'])
        features = [
            hospital_data['hospital_flu_cases'], hospital_data['gp_flu_cases'],
            hospital_data['hospital_respiratory_cases'], hospital_data['gp_respiratory_cases'], flu_mentions
        ]
        predicted_demand = self.model.predict([features])[0]
        logger.info(f"Predicted demand: {predicted_demand}")
        return predicted_demand, features

    def optimize_logistics(self, predicted_demand: float, medicine: str = "FluVax") -> Dict[str, any]:
        """Optimize inventory based on predicted demand."""
        current_stock = self.inventory[medicine]
        if current_stock < predicted_demand + self.threshold:
            order_qty = int(predicted_demand - current_stock + self.threshold)
            self.inventory[medicine] += order_qty
            logger.info(f"Ordered {order_qty} units of {medicine}")
            return {"medicine": medicine, "quantity": order_qty, "status": "order_placed"}
        logger.info(f"Sufficient stock for {medicine}")
        return {"medicine": medicine, "quantity": 0, "status": "sufficient_stock"}

    def interpret_prediction(self, hospital_data: Dict, social_data: Dict, predicted_demand: float, features: List[float]) -> str:
        """Interpret the prediction using OpenAI."""
        prompt = f"""
            Analyze the following healthcare data to explain the predicted demand of {predicted_demand:.0f} units of FluVax:

            - Hospital flu cases: {hospital_data['hospital_flu_cases']}
            - GP flu cases: {hospital_data['gp_flu_cases']}
            - Hospital respiratory cases: {hospital_data['hospital_respiratory_cases']}
            - GP respiratory cases: {hospital_data['gp_respiratory_cases']}
            - Social media flu mentions: {len(social_data['posts'])}

            Provide:
            1. Why this prediction makes sense.
            2. The most influential factors.
            3. Recommendations for the logistics team.
            4. Potential risks or uncertainties.

            Keep the response concise and professional and objective as possible. Be short as possible.
            """
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a healthcare analytics expert specializing in pharmaceutical logistics."},
                    {"role": "user", "content": prompt}
                ]
            )
            interpretation = response.choices[0].message.content
            logger.info("Interpretation generated")
            return interpretation
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            raise

    def generate_report(self, predicted_demand: float, order: Dict, interpretation: str) -> Dict:
        """Generate a report with prediction, action, and insights."""
        report = {
            "date": datetime.now().strftime('%Y-%m-%d'),
            "prediction": {
                "medicine": "FluVax",
                "demand": predicted_demand,
                "confidence": "high" if predicted_demand > 100 else "medium",
                "interpretation": interpretation
            },
            "action": order,
            "personalized_insights": {
                "Dr_Ayesha": f"Predicted FluVax demand: {predicted_demand:.0f} units. Stock updated to prevent shortages.",
                "Imran": f"Order status: {order['status']}. {order['quantity']} units requested." if order['quantity'] > 0 else "No new orders needed.",
                "Leila": f"Ensure FluVax stock > {predicted_demand + self.threshold:.0f} units for potential surge."
            }
        }
        logger.info("Report generated")
        return report

    def incorporate_human_feedback(self, prediction: float, actual_demand: float, human_approved: bool = False) -> Dict[str, str]:
        """Incorporate human feedback into the model."""
        error = abs(prediction - actual_demand) / max(1, actual_demand)
        if human_approved or error < 0.15:
            if len(self.historical_hospital) > 0 and len(self.historical_social) > 0:
                h = self.historical_hospital[-1].copy()
                s = self.historical_social[-1].copy()
                h['medicine_demand']['FluVax'] = actual_demand
                self.historical_hospital.append(h)
                self.historical_social.append(s)
                self.train_model(self.historical_hospital, self.historical_social)
                logger.info("Feedback incorporated into model")
                return {"status": "success", "message": "Feedback incorporated into model"}
            else:
                logger.warning("No historical data available for feedback")
                return {"status": "error", "message": "No historical data available"}
        logger.info("Feedback did not meet criteria for incorporation")
        return {"status": "ignored", "message": "Feedback did not meet criteria for incorporation"}

    def update_model(self, new_hospital: Dict, new_social: Dict) -> Dict[str, str]:
        """Update the model with new data."""
        self.historical_hospital.append(new_hospital)
        self.historical_social.append(new_social)
        return self.train_model(self.historical_hospital, self.historical_social)