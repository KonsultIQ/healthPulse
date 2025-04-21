"""
Generate synthetic hospital admission data for Dubai healthcare system.
This script creates a small sample dataset of hospital admissions
that reflect Dubai's demographic and health patterns.
"""

import csv
import random
import json
from datetime import datetime, timedelta

# Set random seed for reproducibility
random.seed(42)

# Define constants - reduced scope for testing
NUM_RECORDS = 100
START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2025, 4, 1)
FACILITIES = [
    {"id": "H001", "name": "Dubai Hospital", "district": "Deira"},
    {"id": "H002", "name": "Rashid Hospital", "district": "Bur Dubai"},
    {"id": "H003", "name": "Latifa Hospital", "district": "Al Jaddaf"},
    {"id": "H004", "name": "Hatta Hospital", "district": "Hatta"}
]

DISTRICTS = [
    "Deira", "Bur Dubai", "Al Barsha", "Jumeirah", "Dubai Marina", 
    "Palm Jumeirah", "Dubai Healthcare City", "Al Qusais"
]

# Simplified list of common diseases in Dubai
COMMON_DIAGNOSES = {
    "I10": {"name": "Essential hypertension", "weight": 10, "seasonal": False},
    "E11.9": {"name": "Type 2 diabetes mellitus", "weight": 15, "seasonal": False},
    "J00": {"name": "Common cold", "weight": 8, "seasonal": True, "peak_months": [12, 1, 2]},
    "F32.9": {"name": "Major depressive disorder", "weight": 9, "seasonal": False},
    "T67.0": {"name": "Heatstroke", "weight": 4, "seasonal": True, "peak_months": [6, 7, 8, 9]}
}

ADMISSION_TYPES = ["emergency", "planned", "transfer"]

# Function to generate random date between start and end
def random_date(start_date, end_date):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_hour = random.randrange(24)
    random_minute = random.randrange(60)
    result_date = start_date + timedelta(days=random_number_of_days, hours=random_hour, minutes=random_minute)
    return result_date

# Function to adjust diagnosis probability based on seasonality
def get_diagnosis_with_seasonality(date):
    month = date.month
    
    # Adjust weights based on seasonality
    adjusted_weights = {}
    for code, info in COMMON_DIAGNOSES.items():
        weight = info["weight"]
        
        # Apply seasonal adjustments
        if info.get("seasonal", False):
            peak_months = info.get("peak_months", [])
            if month in peak_months:
                # Increase weight during peak months
                weight = weight * 3
            else:
                # Decrease weight during off-peak months
                weight = weight * 0.5
                
        adjusted_weights[code] = weight
    
    # Convert to list for random.choices
    codes = list(adjusted_weights.keys())
    weights = list(adjusted_weights.values())
    
    # Select diagnosis based on adjusted weights
    return random.choices(codes, weights=weights, k=1)[0]

# Generate synthetic hospital admission data
def generate_hospital_admissions(num_records):
    # Open CSV file for writing
    with open('/home/ubuntu/synthetic_data/hospital_admissions_sample.csv', 'w', newline='') as csvfile:
        # Define CSV headers
        fieldnames = [
            "admission_id", "facility_id", "facility_name", "facility_district",
            "admission_timestamp", "discharge_timestamp", "patient_age_group",
            "patient_gender", "patient_district", "diagnosis_primary",
            "diagnosis_primary_name", "admission_type", "severity_score", "length_of_stay"
        ]
        
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        # Track statistics for metadata
        min_date = END_DATE
        max_date = START_DATE
        facility_ids = set()
        age_group_counts = {}
        gender_counts = {}
        
        for i in range(num_records):
            # Generate admission date
            admission_date = random_date(START_DATE, END_DATE)
            
            # Update min/max dates for metadata
            if admission_date < min_date:
                min_date = admission_date
            if admission_date > max_date:
                max_date = admission_date
            
            # Select facility
            facility = random.choice(FACILITIES)
            facility_ids.add(facility["id"])
            
            # Generate patient demographics
            age_groups = ["0-4", "5-14", "15-24", "25-44", "45-64", "65+"]
            age_weights = [0.08, 0.12, 0.15, 0.40, 0.18, 0.07]  # Adjusted for Dubai's younger population
            
            patient_age_group = random.choices(age_groups, weights=age_weights, k=1)[0]
            patient_gender = random.choices(["Male", "Female"], weights=[0.55, 0.45], k=1)[0]  # Dubai has more males
            patient_district = random.choice(DISTRICTS)
            
            # Update demographic counts for metadata
            age_group_counts[patient_age_group] = age_group_counts.get(patient_age_group, 0) + 1
            gender_counts[patient_gender] = gender_counts.get(patient_gender, 0) + 1
            
            # Generate diagnosis with seasonality
            diagnosis_primary = get_diagnosis_with_seasonality(admission_date)
            diagnosis_name = COMMON_DIAGNOSES[diagnosis_primary]["name"]
            
            # Generate admission type with weighted probabilities
            admission_type = random.choices(
                ADMISSION_TYPES, 
                weights=[0.6, 0.35, 0.05],  # Emergency more common
                k=1
            )[0]
            
            # Generate severity score (1-10)
            if admission_type == "emergency":
                severity_score = random.randint(5, 10)
            elif admission_type == "transfer":
                severity_score = random.randint(4, 9)
            else:  # planned
                severity_score = random.randint(1, 7)
            
            # Generate length of stay (1-14 days, weighted toward shorter stays)
            length_of_stay = min(14, max(1, int(random.expovariate(0.5))))
            discharge_date = admission_date + timedelta(days=length_of_stay)
            
            # Create record
            record = {
                "admission_id": f"ADM{i+1:06d}",
                "facility_id": facility["id"],
                "facility_name": facility["name"],
                "facility_district": facility["district"],
                "admission_timestamp": admission_date.strftime("%Y-%m-%d %H:%M:%S"),
                "discharge_timestamp": discharge_date.strftime("%Y-%m-%d %H:%M:%S"),
                "patient_age_group": patient_age_group,
                "patient_gender": patient_gender,
                "patient_district": patient_district,
                "diagnosis_primary": diagnosis_primary,
                "diagnosis_primary_name": diagnosis_name,
                "admission_type": admission_type,
                "severity_score": severity_score,
                "length_of_stay": length_of_stay
            }
            
            # Write record directly to CSV
            writer.writerow(record)
    
    # Return metadata for the dataset
    return {
        "dataset_name": "Dubai Synthetic Hospital Admissions (Sample)",
        "records_count": num_records,
        "date_range": {
            "start": min_date.strftime("%Y-%m-%d"),
            "end": max_date.strftime("%Y-%m-%d")
        },
        "facilities_count": len(facility_ids),
        "common_diagnoses": [
            {"code": code, "name": info["name"]} 
            for code, info in COMMON_DIAGNOSES.items()
        ],
        "demographics": {
            "age_groups": age_group_counts,
            "gender": gender_counts
        },
        "generation_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# Generate the data and get metadata
print("Starting hospital admission data generation...")
metadata = generate_hospital_admissions(NUM_RECORDS)

# Save metadata about the dataset
with open('/home/ubuntu/synthetic_data/hospital_admissions_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"Generated {NUM_RECORDS} hospital admission records")
print(f"Data saved to /home/ubuntu/synthetic_data/hospital_admissions_sample.csv")
print(f"Metadata saved to /home/ubuntu/synthetic_data/hospital_admissions_metadata.json")
