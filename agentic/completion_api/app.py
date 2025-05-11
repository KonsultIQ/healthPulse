from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
from openai import OpenAI
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS with explicit configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_latest_predictions():
    try:
        df = pd.read_csv('/host_data/inferences.csv')
        if df.empty:
            logger.warning("inferences.csv is empty")
            return None, {"error": "No prediction data available"}
        # Check for required columns
        required_columns = ['date', 'region', 'predicted_demand', 'interpretation']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            logger.error(f"Missing columns in inferences.csv: {missing_columns}")
            return None, {"error": f"Missing required columns in inferences.csv: {', '.join(missing_columns)}"}
        latest_date = df['date'].max()
        latest_df = df[df['date'] == latest_date]
        predictions = {}
        for _, row in latest_df.iterrows():
            region = row['region']
            predictions[region] = {
                'predicted_demand': row['predicted_demand'],
                'interpretation': row['interpretation']
            }
        logger.info(f"Retrieved predictions for date: {latest_date}")
        return latest_date, predictions
    except (FileNotFoundError, pd.errors.EmptyDataError) as e:
        logger.error(f"Error reading inferences.csv: {str(e)}")
        return None, {"error": "Prediction file not found or empty"}

def get_inventory():
    try:
        with open('/host_data/inventory.json', 'r') as f:
            inventory = json.load(f)
        logger.info("Successfully loaded inventory.json")
        return inventory
    except FileNotFoundError:
        logger.error("inventory.json not found")
        return {"error": "Inventory file not found"}

def generate_prompt(user_text, latest_date, predictions, inventory):
    prompt = f"Based on the latest predictions and current inventory, please provide a response to the following query: {user_text}\n\n"
    if isinstance(predictions, dict) and "error" in predictions:
        prompt += f"No predictions available: {predictions['error']}\n"
    else:
        prompt += f"Latest Predictions (Date: {latest_date}):\n"
        for region, data in predictions.items():
            prompt += f"Region {region}:\n"
            prompt += f"- Predicted Demand: {data['predicted_demand']}\n"
            prompt += f"- Interpretation: {data['interpretation']}\n\n"
    if isinstance(inventory, dict) and "error" in inventory:
        prompt += f"No inventory available: {inventory['error']}\n"
    else:
        prompt += "Current Inventory:\n"
        for facility, meds in inventory.items():
            prompt += f"{facility}:\n"
            for med, qty in meds.items():
                prompt += f"- {med}: {qty}\n"
    prompt += "\nPlease provide a concise and professional response."
    return prompt

@app.post("/completion")
async def completion(request: Request):
    logger.info(f"Received request from {request.client.host}")
    data = await request.json()
    user_text = data.get("text", "")
    logger.info(f"Processing query: {user_text}")
    latest_date, predictions = get_latest_predictions()
    inventory = get_inventory()
    prompt = generate_prompt(user_text, latest_date, predictions, inventory)
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a healthcare logistics assistant."},
                {"role": "user", "content": prompt}
            ],
            stream=True
        )
        
        async def stream_response():
            for chunk in response:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        
        return StreamingResponse(stream_response(), media_type="text/plain")
    except Exception as e:
        logger.error(f"Error in OpenAI API call: {str(e)}")
        raise