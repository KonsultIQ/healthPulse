import requests
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta
import time

class AgenticAILogistics:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.inventory = {"FluVax": 5000, "AntiViral": 2000}
        self.threshold = 100
        self.is_trained = False
        self.historical_hospital = []  # Store historical data persistently
        self.historical_social = []

    def fetch_data(self, region, date):
        hospital_url = f"http://localhost:5000/hospital_data?region={region}&date={date}"
        social_url = f"http://localhost:5001/social_data?region={region}&date={date}"
        hospital_data = requests.get(hospital_url).json()
        social_data = requests.get(social_url).json()
        return hospital_data, social_data

    def train_model(self, historical_hospital, historical_social):
        features = []
        targets = []
        for h, s in zip(historical_hospital, historical_social):
            flu_mentions = len(s['posts'])
            features.append([h['hospital_flu_cases'], h['gp_flu_cases'], 
                            h['hospital_respiratory_cases'], h['gp_respiratory_cases'], flu_mentions])
            targets.append(h['medicine_demand']['FluVax'])
        self.model.fit(features, targets)
        self.is_trained = True

    def predict_demand(self, hospital_data, social_data):
        flu_mentions = len(social_data['posts'])
        features = [hospital_data['hospital_flu_cases'], hospital_data['gp_flu_cases'],
                   hospital_data['hospital_respiratory_cases'], hospital_data['gp_respiratory_cases'], flu_mentions]
        if not self.is_trained:
            raise Exception("Model not trained yet!")
        return self.model.predict([features])[0]

    def optimize_logistics(self, predicted_demand, medicine="FluVax"):
        current_stock = self.inventory[medicine]
        if current_stock < predicted_demand + self.threshold:
            order_qty = int(predicted_demand - current_stock + self.threshold)
            self.inventory[medicine] += order_qty
            return {"medicine": medicine, "quantity": order_qty}
        return None

    def generate_report(self, predicted_demand, order):
        #I will come back to this later 
        report = {
            "Dr_Ayesha": f"Predicted FluVax demand: {predicted_demand:.0f} units. Stock updated to prevent shortages.",
            "Imran": f"Order placed: {order if order else 'None'}. Prioritize region A delivery.",
            "Leila": f"Ensure FluVax stock > {predicted_demand + self.threshold:.0f} units for surge."
        }
        return report

    def update_model(self, new_hospital, new_social):
        self.historical_hospital.append(new_hospital)
        self.historical_social.append(new_social)
        self.train_model(self.historical_hospital, self.historical_social)


if __name__ == "__main__":
    agent = AgenticAILogistics()
    
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2024, 12, 31)
    dates = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
    for d in dates:
        date_str = d.strftime('%Y-%m-%d')
        h, s = agent.fetch_data("A", date_str)
        agent.historical_hospital.append(h)
        agent.historical_social.append(s)
    agent.train_model(agent.historical_hospital, agent.historical_social)
    
    retrain_interval = 24  # Retrain every 24 hours
    hours_since_retrain = 0
    while True:
        current_date = datetime.now().strftime('%Y-%m-%d')
        hospital_data, social_data = agent.fetch_data("A", current_date)
        predicted_demand = agent.predict_demand(hospital_data, social_data)
        order = agent.optimize_logistics(predicted_demand)
        report = agent.generate_report(predicted_demand, order)
        print(report)
        

        agent.update_model(hospital_data, social_data)
        hours_since_retrain += 1
        if hours_since_retrain >= retrain_interval:
            print("Retraining model with new data...")
            agent.train_model(agent.historical_hospital, agent.historical_social)
            hours_since_retrain = 0
        
        time.sleep(60) # let's  just test the prediction every min   