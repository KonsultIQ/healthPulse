from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import pandas as pd
import json
import os
from typing import Optional, Dict, Any, Tuple
from pydantic import BaseModel

app = FastAPI(
    title="Healthcare Logistics API",
    description="API for processing healthcare logistics queries with flu prediction and inventory data",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class QueryRequest(BaseModel):
    text: str

def load_predictions() -> Tuple[Optional[str], Dict[str, Any]]:
    """
    Load the latest predictions from inferences.csv.
    Returns a tuple of the latest date and predictions or an error message.
    """
    try:
        df = pd.read_csv('/host_data/inferences.csv')
        if df.empty:
            return None, {"error": "No prediction data available"}

        required_columns = [
            'date', 'region', 'hospital_flu_cases', 'gp_flu_cases',
            'hospital_respiratory_cases', 'gp_respiratory_cases',
            'flu_mentions', 'predicted_demand', 'interpretation'
        ]
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return None, {
                "error": f"Missing required columns: {', '.join(missing_columns)}"
            }

        latest_date = df['date'].max()
        latest_df = df[df['date'] == latest_date]
        predictions = {
            row['region']: {
                'hospital_flu_cases': row['hospital_flu_cases'],
                'gp_flu_cases': row['gp_flu_cases'],
                'hospital_respiratory_cases': row['hospital_respiratory_cases'],
                'gp_respiratory_cases': row['gp_respiratory_cases'],
                'flu_mentions': row['flu_mentions'],
                'predicted_demand': round(row['predicted_demand'], 2),
                'interpretation': row['interpretation']
            }
            for _, row in latest_df.iterrows()
        }
        return latest_date, predictions

    except (FileNotFoundError, pd.errors.EmptyDataError):
        return None, {"error": "Prediction file not found or empty"}

def load_inventory() -> Dict[str, Any]:
    """
    Load inventory data from inventory.json.
    Returns inventory data or an error message.
    """
    try:
        with open('/host_data/inventory.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {"error": "Inventory file not found"}

def create_prompt(user_query: str, latest_date: Optional[str], predictions: Dict[str, Any], 
                 inventory: Dict[str, Any]) -> str:
    """
    Generate a structured prompt for the OpenAI API based on flu predictions and inventory.
    """
    prompt = [
        f"User Query: {user_query}\n",
        "Context:\n"
    ]

    if isinstance(predictions, dict) and "error" in predictions:
        prompt.append(f"Predictions unavailable: {predictions['error']}\n")
    else:
        prompt.append(f"Latest Flu Predictions (Date: {latest_date}):\n")
        for region, data in predictions.items():
            prompt.append(
                f"  {region}:\n"
                f"    - Hospital Flu Cases: {data['hospital_flu_cases']}\n"
                f"    - GP Flu Cases: {data['gp_flu_cases']}\n"
                f"    - Hospital Respiratory Cases: {data['hospital_respiratory_cases']}\n"
                f"    - GP Respiratory Cases: {data['gp_respiratory_cases']}\n"
                f"    - Social Media Flu Mentions: {data['flu_mentions']}\n"
                f"    - Predicted FluVax Demand: {data['predicted_demand']} units\n"
                f"    - Interpretation:\n{data['interpretation']}\n"
            )

    if isinstance(inventory, dict) and "error" in inventory:
        prompt.append(f"Inventory unavailable: {inventory['error']}\n")
    else:
        prompt.append("Current Inventory:\n")
        for facility, medications in inventory.items():
            prompt.append(f"  {facility}:\n")
            for med, qty in medications.items():
                prompt.append(f"    - {med}: {qty} units\n")

    prompt.append("\nProvide a concise, professional response addressing the query, incorporating relevant data from predictions and inventory.")
    return "".join(prompt)

@app.post("/completion", response_class=StreamingResponse)
async def process_query(request: Request):
    """
    Process a user query and stream the response from OpenAI.
    """
    try:
        data = await request.json()
        query = QueryRequest(text=data.get("text", ""))
        
        latest_date, predictions = load_predictions()
        inventory = load_inventory()
        prompt = create_prompt(query.text, latest_date, predictions, inventory)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a healthcare logistics assistant specializing in flu vaccination strategies. "
                        "Provide accurate, professional, and data-driven responses based on the provided context"
                        "Response must be concise, professional objective and please be SHORT as possible, you response need to be short and to not contain any special sign like markdown signs."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            stream=True
        )
        
        async def stream_response():
            for chunk in response:
                if content := chunk.choices[0].delta.content:
                    yield content
        
        return StreamingResponse(stream_response(), media_type="text/plain")
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid request data: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)