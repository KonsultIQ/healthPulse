import requests  # Added to make HTTP requests
from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import numpy as np

app = Flask(__name__)

# let's simulate:  correlation
hospital_data_cache = []  

def generate_social_media_data(date, region, hospital_data):

    mentions = int(hospital_data['hospital_flu_cases'] / 10 + np.random.normal(0, 2))
    posts = [{"text": f"Feeling sick, might be flu. {i}", "sentiment": "negative"} for i in range(max(0, mentions))]
    return {
        "date": date.strftime('%Y-%m-%d'),
        "region": region,
        "posts": posts
    }

@app.route('/social_data', methods=['GET'])
def get_social_data():
    region = request.args.get('region', 'A')
    date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
    date = datetime.strptime(date_str, '%Y-%m-%d')

    hospital_url = f"http://localhost:5000/hospital_data?region={region}&date={date_str}"
    hospital_response = requests.get(hospital_url)
    hospital_data = hospital_response.json()
    data = generate_social_media_data(date, region, hospital_data)
    return jsonify(data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)