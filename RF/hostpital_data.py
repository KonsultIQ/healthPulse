from datetime import datetime, timedelta

import numpy as np
from flask import Flask, jsonify, request

app = Flask(__name__)

def generate_hospital_data(date, region):
    day_of_year = date.timetuple().tm_yday
  
    flu_base = 50 + 30 * np.sin(2 * np.pi * (day_of_year - 30) / 365)
    hospital_flu = int(flu_base + np.random.normal(0, 10))
    gp_flu = int(hospital_flu * 0.4 + np.random.normal(0, 5))
    hospital_resp = int(hospital_flu * 0.6 + np.random.normal(0, 5))
    gp_resp = int(gp_flu * 0.5 + np.random.normal(0, 3))
    medicine_demand = {
        "FluVax": int((hospital_flu + gp_flu) * 2 + np.random.normal(0, 20)),
        "AntiViral": int((hospital_resp + gp_resp) * 1.5 + np.random.normal(0, 15))
    }
    return {
        "date": date.strftime('%Y-%m-%d'),
        "region": region,
        "hospital_flu_cases": hospital_flu,
        "gp_flu_cases": gp_flu,
        "hospital_respiratory_cases": hospital_resp,
        "gp_respiratory_cases": gp_resp,
        "medicine_demand": medicine_demand
    }

@app.route('/hospital_data', methods=['GET'])
def get_hospital_data():
    region = request.args.get('region', 'A')
    date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
    date = datetime.strptime(date_str, '%Y-%m-%d')
    data = generate_hospital_data(date, region)
    return jsonify(data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)