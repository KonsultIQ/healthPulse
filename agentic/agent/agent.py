import logging
from typing import List, Dict, Tuple
import requests
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime
import numpy as np
from openai import OpenAI
import os
from tenacity import retry, stop_after_attempt, wait_fixed

logger = logging.getLogger(__name__)

class AgenticAILogistics:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.inventory = {"FluVax":0, "AntiViral": 0}
        self.threshold = 100
        self.is_trained = False
        self.historical_hospital: List[Dict] = []
        self.historical_social: List[Dict] = []
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY environment variable is required")

    @retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
    def fetch_data(self, region: str, date: str) -> Tuple[Dict, Dict]:
        hospital_url = f"http://localhost:5002/hospital_data?region={region}&date={date}"
        social_url = f"http://localhost:5001/social_data?region={region}&date={date}"
        try:
            hospital_response = requests.get(hospital_url, timeout=10)
            hospital_response.raise_for_status()
            hospital_data = hospital_response.json()
            social_response = requests.get(social_url, timeout=10)
            social_response.raise_for_status()
            social_data = social_response.json()

            required_hospital_keys = ['hospital_flu_cases', 'gp_flu_cases', 'hospital_respiratory_cases', 'gp_respiratory_cases']
            if not all(key in hospital_data for key in required_hospital_keys):
                raise ValueError(f"Invalid hospital data format: {hospital_data}")
            if 'posts' not in social_data:
                raise ValueError(f"Invalid social data format: {social_data}")

            return hospital_data, social_data
        except requests.RequestException as e:
            logger.error(f"Failed to fetch data for region {region}, date {date}: {e}")
            raise

    def train_model(self, historical_hospital: List[Dict], historical_social: List[Dict]) -> None:
        if len(historical_hospital) != len(historical_social) or not historical_hospital:
            raise ValueError("Invalid historical data")
        features = [
            [h['hospital_flu_cases'], h['gp_flu_cases'],
             h['hospital_respiratory_cases'], h['gp_respiratory_cases'], len(s['posts'])]
            for h, s in zip(historical_hospital, historical_social)
        ]
        targets = [h['medicine_demand']['FluVax'] for h in historical_hospital]
        self.model.fit(features, targets)
        self.is_trained = True

    def predict_demand(self, hospital_data: Dict, social_data: Dict) -> Tuple[float, List[float]]:
        if not self.is_trained:
            raise ValueError("Model not trained")
        features = [
            hospital_data['hospital_flu_cases'], hospital_data['gp_flu_cases'],
            hospital_data['hospital_respiratory_cases'], hospital_data['gp_respiratory_cases'], len(social_data['posts'])
        ]
        predicted_demand = self.model.predict([features])[0]
        return predicted_demand, features

    def optimize_logistics(self, predicted_demand: float, medicine: str = "FluVax") -> Dict[str, any]:
        current_stock = self.inventory[medicine]
        if current_stock < predicted_demand + self.threshold:
            order_qty = int(predicted_demand - current_stock + self.threshold)
            self.inventory[medicine] += order_qty
            return {"medicine": medicine, "quantity": order_qty, "status": "order_placed"}
        return {"medicine": medicine, "quantity": 0, "status": "sufficient_stock"}

    def interpret_prediction(self, hospital_data: Dict, social_data: Dict, predicted_demand: float, features: List[float]) -> str:
        prompt = f"""
        Analyze healthcare data to explain the predicted demand of {predicted_demand:.0f} units of FluVax:
        - Hospital flu cases: {hospital_data['hospital_flu_cases']}
        - GP flu cases: {hospital_data['gp_flu_cases']}
        - Hospital respiratory cases: {hospital_data['hospital_respiratory_cases']}
        - GP respiratory cases: {hospital_data['gp_respiratory_cases']}
        - Social media flu mentions: {len(social_data['posts'])}
        Provide:
        1. Rationale for prediction.
        2. Key influential factors.
        3. Logistics team recommendations.
        4. Potential risks.
        Response must be concise, professional, and objective and please be SHORT as possible, you response need to be short and to not contain any special sign like markdown signs.
        """
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a healthcare analytics expert."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            raise

    def generate_report(self, predicted_demand: float, order: Dict, interpretation: str) -> Dict:
        return {
            "date": datetime.now().strftime('%Y-%m-%d'),
            "prediction": {
                "medicine": "FluVax",
                "demand": predicted_demand,
                "confidence": "high" if predicted_demand > 100 else "medium",
                "interpretation": interpretation
            },
            "action": order
        }

    def incorporate_human_feedback(self, prediction: float, actual_demand: float, human_approved: bool = False) -> None:
        error = abs(prediction - actual_demand) / max(1, actual_demand)
        if (human_approved or error < 0.15) and self.historical_hospital and self.historical_social:
            h = self.historical_hospital[-1].copy()
            s = self.historical_social[-1].copy()
            h['medicine_demand']['FluVax'] = actual_demand
            self.historical_hospital.append(h)
            self.historical_social.append(s)
            self.train_model(self.historical_hospital, self.historical_social)

    def update_model(self, new_hospital: Dict, new_social: Dict) -> None:
        self.historical_hospital.append(new_hospital)
        self.historical_social.append(new_social)
        self.train_model(self.historical_hospital, self.historical_social)