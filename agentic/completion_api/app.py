import os
import json
import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = "/host_data"
PREDICTIONS_FILE = f"{DATA_DIR}/inferences.csv"
INVENTORY_FILE = f"{DATA_DIR}/inventory.json"


def load_predictions():
    try:
        df = pd.read_csv(PREDICTIONS_FILE)
    except (FileNotFoundError, pd.errors.EmptyDataError):
        raise HTTPException(status_code=404, detail="Prediction file not found or empty.")
    
    required = {"date", "region", "predicted_demand", "interpretation"}
    if not required.issubset(df.columns):
        missing = required - set(df.columns)
        raise HTTPException(
            status_code=422,
            detail=f"Missing columns in predictions: {', '.join(sorted(missing))}"
        )

    latest_date = df["date"].max()
    latest_df = df[df["date"] == latest_date]
    data = {
        row["region"]: {
            "predicted_demand": row["predicted_demand"],
            "interpretation": row["interpretation"],
        }
        for _, row in latest_df.iterrows()
    }
    return latest_date, data


def load_inventory():
    try:
        with open(INVENTORY_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Inventory file not found.")


def build_prompt(query: str, date: str, preds: dict, inventory: dict) -> str:
    lines = [
        f"User query: {query}",
        "",
        f"Latest Predictions (Date: {date}):"
    ]
    for region, info in preds.items():
        lines.extend([
            f"- Region {region}:",
            f"  • Predicted Demand: {info['predicted_demand']}",
            f"  • Interpretation: {info['interpretation']}",
        ])
    lines.append("")
    lines.append("Current Inventory:")
    for facility, meds in inventory.items():
        lines.append(f"- {facility}:")
        for med, qty in meds.items():
            lines.append(f"  • {med}: {qty}")
    lines.append("")
    lines.append("Please respond concisely and professionally.")
    return "\n".join(lines)


@app.post("/completion")
async def completion(request: Request):
    payload = await request.json()
    query = payload.get("text", "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Request must include a non-empty 'text' field.")

    latest_date, predictions = load_predictions()
    inventory = load_inventory()

    prompt = build_prompt(query, latest_date, predictions, inventory)
    try:
        stream = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a healthcare logistics assistant."},
                {"role": "user", "content": prompt},
            ],
            stream=True,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {exc}")

    return StreamingResponse(
        (chunk.choices[0].delta.content for chunk in stream if chunk.choices[0].delta.content),
        media_type="text/plain",
    )
