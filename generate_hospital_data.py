"""
Generate synthetic hospital admission data for Dubai healthcare system.
This script creates realistic hospital admission records that reflect
Dubai's demographic and health patterns using a simplified approach.
"""

import pandas as pd
import random
from datetime import datetime, timedelta
import json
import csv

# Set random seed for reproducibility
random.seed(42)

# Define constants
NUM_RECORDS = 5000  # Reduced from 10000 to avoid memory issues
START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2025, 4, 1)
FACILITIES = [
    {"id": "H001", "name": "Dubai Hospital", "district": "Deira"},
    {"id": "H002", "name": "Rashid Hospital", "district": "Bur Dubai"},
    {"id": "H003", "name": "Latifa Hospital", "district": "Al Jaddaf"},
    {"id": "H004", "name": "Hatta Hospital", "district": "Hatta"},
    {"id": "H005", "name": "American Hospital Dubai", "district": "Oud Metha"},
    {"id": "H006", "name": "Saudi German Hospital", "district": "Al Barsha"},
    {"id": "H007", "name": "Mediclinic City Hospital", "district": "Dubai Healthcare City"},
    {"id": "H008", "name": "NMC Royal Hospital", "district": "Dubai Investments Park"}
]

DISTRICTS = [
    "Deira", "Bur Dubai", "Al Barsha", "Jumeirah", "Dubai Marina", 
    "Palm Jumeirah", "Dubai Healthcare City", "Al Qusais", "International City",
    "Dubai Silicon Oasis", "Mirdif", "Al Karama", "Oud Metha", "Business Bay",
    "Downtown Dubai", "Al Jaddaf", "Hatta", "Dubai Investments Park"
]

# Common diseases in Dubai based on research
COMMON_DIAGNOSES = {
    # Cardiovascular diseases (leading cause of death)
    "I10": {"name": "Essential (primary) hypertension", "weight": 10, "seasonal": False},
    "I21.9": {"name": "Acute myocardial infarction, unspecified", "weight": 7, "seasonal": False},
    "I50.9": {"name": "Heart failure, unspecified", "weight": 8, "seasonal": False},
    "I63.9": {"name": "Cerebral infarction, unspecified", "weight": 6, "seasonal": False},
    
    # Diabetes (affects 20% of population)
    "E11.9": {"name": "Type 2 diabetes mellitus without complications", "weight": 15, "seasonal": False},
    "E11.2": {"name": "Type 2 diabetes mellitus with kidney complications", "weight": 7, "seasonal": False},
    "E11.5": {"name": "Type 2 diabetes mellitus with circulatory complications", "weight": 6, "seasonal": False},
    
    # Respiratory conditions
    "J00": {"name": "Acute nasopharyngitis [common cold]", "weight": 8, "seasonal": True, "peak_months": [12, 1, 2]},
    "J06.9": {"name": "Acute upper respiratory infection, unspecified", "weight": 9, "seasonal": True, "peak_months": [12, 1, 2]},
    "J45.909": {"name": "Unspecified asthma, uncomplicated", "weight": 7, "seasonal": True, "peak_months": [6, 7, 8]},
    
    # Mental health issues
    "F32.9": {"name": "Major depressive disorder, single episode, unspecified", "weight": 9, "seasonal": False},
    "F41.9": {"name": "Anxiety disorder, unspecified", "weight": 8, "seasonal": False},
    
    # Injuries
    "S06.0": {"name": "Concussion", "weight": 5, "seasonal": False},
    "S52.50": {"name": "Fracture of lower end of radius, unspecified", "weight": 4, "seasonal": False},
    "T07": {"name": "Unspecified multiple injuries", "weight": 3, "seasonal": False},
    
    # Heat-related illnesses
    "T67.0": {"name": "Heatstroke and sunstroke", "weight": 4, "seasonal": True, "peak_months": [6, 7, 8, 9]},
    "T67.1": {"name": "Heat syncope", "weight": 3, "seasonal": True, "peak_months": [6, 7, 8, 9]},
    
    # Other common conditions
    "K29.7": {"name": "Gastritis, unspecified", "weight": 6, "seasonal": False},
    "N39.0": {"name": "Urinary tract infection, site not specified", "weight": 7, "seasonal": False},
    "M54.5": {"name": "Low back pain", "weight": 8, "seasonal": False}
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

# Function to generate length of stay based on diagnosis severity
def generate_length_of_stay(diagnosis_code):
    # Base length of stay depends on the condition
    if diagnosis_code.startswith("I21") or diagnosis_code.startswith("I50"):  # Heart conditions
        base_los = random.lognormvariate(1.8, 0.4)  # Longer stays
    elif diagnosis_code.startswith("T67"):  # Heat-related
        base_los = random.lognormvariate(0.8, 0.3)  # Shorter stays
    elif diagnosis_code.startswith("S") or diagnosis_code.startswith("T"):  # Injuries
        base_los = random.lognormvariate(1.5, 0.5)
    elif diagnosis_code.startswith("F"):  # Mental health
        base_los = random.lognormvariate(1.7, 0.6)
    else:  # Other conditions
        base_los = random.lognormvariate(1.2, 0.4)
    
    # Round to whole days with minimum of 1 day
    return max(1, round(base_los))

# Generate synthetic hospital admission data
def generate_hospital_admissions(num_records):
    # Open CSV file for writing directly instead of storing everything in memory
    with open('/home/ubuntu/synthetic_data/hospital_admissions.csv', 'w', newline='') as csvfile:
        # Define CSV headers
        fieldnames = [
            "admission_id", "facility_id", "facility_name", "facility_district",
            "admission_timestamp", "discharge_timestamp", "patient_age_group",
            "patient_gender", "patient_district", "diagnosis_primary",
            "diagnosis_primary_name", "diagnosis_secondary", "diagnosis_secondary_name",
            "admission_type", "severity_score", "length_of_stay"
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
            
            # Generate secondary diagnosis (30% chance)
            diagnosis_secondary = None
            diagnosis_secondary_name = None
            if random.random() < 0.3:
                diagnosis_secondary = get_diagnosis_with_seasonality(admission_date)
                # Ensure secondary is different from primary
                while diagnosis_secondary == diagnosis_primary:
                    diagnosis_secondary = get_diagnosis_with_seasonality(admission_date)
                diagnosis_secondary_name = COMMON_DIAGNOSES[diagnosis_secondary]["name"]
            
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
            
            # Generate length of stay and discharge date
            length_of_stay = generate_length_of_stay(diagnosis_primary)
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
                "diagnosis_secondary": diagnosis_secondary,
                "diagnosis_secondary_name": diagnosis_secondary_name,
                "admission_type": admission_type,
                "severity_score": severity_score,
                "length_of_stay": length_of_stay
            }
            
            # Write record directly to CSV
            writer.writerow(record)
            
            # Print progress every 1000 records
            if (i + 1) % 1000 == 0:
                print(f"Generated {i + 1} records...")
    
    # Return metadata for the dataset
    return {
        "dataset_name": "Dubai Synthetic Hospital Admissions",
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
print(f"Data saved to /home/ubuntu/synthetic_data/hospital_admissions.csv")
print(f"Metadata saved to /home/ubuntu/synthetic_data/hospital_admissions_metadata.json")
