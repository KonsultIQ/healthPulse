from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import numpy as np

app = Flask(__name__)

def generate_hospital_data(date, region):
    day_of_year = date.timetuple().tm_yday
    day_of_week = date.weekday() 

    flu_base = 50 + 30 * np.sin(2 * np.pi * (day_of_year - 30) / 365)
    
    weekday_factor = 0.8 if day_of_week >= 5 else 1.0
    
    outbreak_factor = np.random.choice([1.0, 2.5], p=[0.95, 0.05])
    
    region_factor = 1.0
    if region == 'A':
        region_factor = 1.2  
    elif region == 'B':
        region_factor = 0.8
    elif region == 'C':
        region_factor = 1.1
    
    hospital_flu = int(flu_base * weekday_factor * outbreak_factor * region_factor + np.random.normal(0, 10))
    gp_flu = int(hospital_flu * 0.4 * (1 + np.random.normal(0, 0.1)) + np.random.normal(0, 5))
    hospital_resp = int(hospital_flu * 0.6 * (1 + np.random.normal(0, 0.1)) + np.random.normal(0, 5))
    gp_resp = int(gp_flu * 0.5 * (1 + np.random.normal(0, 0.1)) + np.random.normal(0, 3))
    
    hospital_flu = max(0, hospital_flu)
    gp_flu = max(0, gp_flu)
    hospital_resp = max(0, hospital_resp)
    gp_resp = max(0, gp_resp)
    
    medicine_demand = {
        "FluVax": max(0, int((hospital_flu + gp_flu) * 2 * (1 + np.random.normal(0, 0.1)))),
        "AntiViral": max(0, int((hospital_resp + gp_resp) * 1.5 * (1 + np.random.normal(0, 0.1)))),
        "PainRelief": max(0, int((hospital_flu + hospital_resp) * 0.8 * (1 + np.random.normal(0, 0.15))))
    }
    
    return {
        "date": date.strftime('%Y-%m-%d'),
        "region": region,
        "hospital_flu_cases": hospital_flu,
        "gp_flu_cases": gp_flu,
        "hospital_respiratory_cases": hospital_resp,
        "gp_respiratory_cases": gp_resp,
        "medicine_demand": medicine_demand,
        "factors": {
            "seasonal": flu_base,
            "weekday": weekday_factor,
            "outbreak": outbreak_factor,
            "regional": region_factor
        }
    }

@app.route('/hospital_data', methods=['GET'])
def get_hospital_data():
    region = request.args.get('region', 'A')
    date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
    date = datetime.strptime(date_str, '%Y-%m-%d')
    
    data = generate_hospital_data(date, region)
    
    return jsonify(data)

@app.route('/regions', methods=['GET'])
def get_regions():
    return jsonify(["A", "B", "C"])

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002)
    print("Hospital data API running on port 5002")