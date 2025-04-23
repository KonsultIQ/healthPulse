import requests
from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import numpy as np
import random

app = Flask(__name__)

symptoms = ["fever", "cough", "headache", "chills", "sore throat", "fatigue", "body aches", 
            "runny nose", "congestion", "nausea"]
locations = ["work", "school", "home", "office", "gym", "mall", "restaurant", "grocery store", 
             "pharmacy", "doctor's office"]
sentiments = ["negative", "neutral", "very negative"]
intensities = ["mild", "bad", "terrible", "awful", "unbearable"]

def generate_post(symptom=None):
    if not symptom:
        symptom = random.choice(symptoms)
    
    location = random.choice(locations)
    intensity = random.choice(intensities)
    
    templates = [
        f"Feeling sick with {intensity} {symptom}, might be flu.",
        f"Everyone at {location} has this {symptom}, probably flu going around.",
        f"Doctor says it could be flu. Have {intensity} {symptom}.",
        f"Can't go to {location} because of this {symptom}. Flu season is bad!",
        f"Just got back from the {location} and now I have {symptom}. Hope it's not flu.",
        f"Woke up with {intensity} {symptom}. Worried it might be flu.",
        f"My whole family has {symptom}. This flu is spreading fast!",
        f"Had to cancel plans because of {intensity} {symptom}. Flu season is the worst.",
        f"Taking medication for my {symptom}. This flu is not letting up.",
        f"Second day with {symptom}. This flu is knocking me out."
    ]
    
    text = random.choice(templates)
    sentiment = "very negative" if intensity in ["terrible", "awful", "unbearable"] else "negative"
    
    return {"text": text, "sentiment": sentiment, "symptom": symptom}

def generate_social_media_data(date, region, hospital_data=None):
    if hospital_data:
        lead_indicator_factor = 1.3 
        base_mentions = hospital_data['hospital_flu_cases'] / 10 * lead_indicator_factor
    else:

        day_of_year = date.timetuple().tm_yday
        base_mentions = 5 + 3 * np.sin(2 * np.pi * (day_of_year - 20) / 365)  
    
    day_of_week = date.weekday()
    weekday_factor = 1.2 if day_of_week >= 5 else 1.0
    
    region_factor = 1.0
    if region == 'A':
        region_factor = 1.3  
    elif region == 'B':
        region_factor = 0.7
    elif region == 'C':
        region_factor = 1.1
    
    # (10% chance)
    viral_factor = np.random.choice([1.0, 2.0], p=[0.9, 0.1])
    

    mentions = int(base_mentions * weekday_factor * region_factor * viral_factor + np.random.normal(0, 3))
    mentions = max(0, mentions) 
    
    primary_symptom = random.choice(symptoms)  
    
    posts = []
    for i in range(mentions):
        if random.random() < 0.6:
            symptom = primary_symptom
        else:
            symptom = random.choice(symptoms)
            
        posts.append(generate_post(symptom))
    
    return {
        "date": date.strftime('%Y-%m-%d'),
        "region": region,
        "posts": posts,
        "trending_topics": [primary_symptom, "flu", "sick"],
        "sentiment_summary": {
            "negative": sum(1 for p in posts if p["sentiment"] == "negative"),
            "very_negative": sum(1 for p in posts if p["sentiment"] == "very negative"),
            "neutral": sum(1 for p in posts if p["sentiment"] == "neutral")
        }
    }

@app.route('/social_data', methods=['GET'])
def get_social_data():
    region = request.args.get('region', 'A')
    date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
    date = datetime.strptime(date_str, '%Y-%m-%d')
    
    try:
        hospital_url = f"http://localhost:5000/hospital_data?region={region}&date={date_str}"
        hospital_response = requests.get(hospital_url, timeout=2)
        if hospital_response.status_code == 200:
            hospital_data = hospital_response.json()
            data = generate_social_media_data(date, region, hospital_data)
        else:
            data = generate_social_media_data(date, region)
    except:

        data = generate_social_media_data(date, region)
    
    return jsonify(data)

@app.route('/trending', methods=['GET'])
def get_trending():
    regions = ["A", "B", "C"]
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    trending = {}
    for region in regions:
        data = generate_social_media_data(datetime.now(), region)
        trending[region] = data["trending_topics"]
    
    return jsonify({
        "date": current_date,
        "trending_by_region": trending
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
    print("Social media API running on port 5001")