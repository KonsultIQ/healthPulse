# Sample Hospital Admission Data for Dubai

This file contains manually created sample data to demonstrate the HealthPulse system's capabilities for predicting and responding to healthcare demands in Dubai.

## Hospital Admissions Sample Data

| admission_id | facility_name | admission_date | patient_age_group | patient_gender | diagnosis | admission_type | severity |
|-------------|---------------|----------------|-------------------|----------------|-----------|----------------|----------|
| ADM000001 | Dubai Hospital | 2023-01-15 | 45-64 | Male | Type 2 diabetes mellitus | planned | 3 |
| ADM000002 | Rashid Hospital | 2023-01-16 | 25-44 | Female | Acute upper respiratory infection | emergency | 6 |
| ADM000003 | Latifa Hospital | 2023-01-18 | 0-4 | Male | Common cold | emergency | 5 |
| ADM000004 | Dubai Hospital | 2023-01-20 | 65+ | Female | Essential hypertension | planned | 4 |
| ADM000005 | Rashid Hospital | 2023-01-22 | 25-44 | Male | Low back pain | emergency | 7 |
| ADM000006 | Hatta Hospital | 2023-01-25 | 15-24 | Male | Concussion | emergency | 8 |
| ADM000007 | Dubai Hospital | 2023-01-28 | 45-64 | Female | Major depressive disorder | planned | 5 |
| ADM000008 | Mediclinic City Hospital | 2023-01-30 | 25-44 | Male | Gastritis | emergency | 6 |
| ADM000009 | Saudi German Hospital | 2023-02-02 | 5-14 | Female | Acute upper respiratory infection | emergency | 5 |
| ADM000010 | Dubai Hospital | 2023-02-05 | 45-64 | Male | Heart failure | emergency | 9 |

## GP Visit Sample Data

| visit_id | clinic_name | visit_date | patient_age_group | patient_gender | symptoms | diagnosis | medications_prescribed |
|----------|-------------|------------|-------------------|----------------|----------|-----------|------------------------|
| GP000001 | Al Barsha Clinic | 2023-01-10 | 25-44 | Male | Fatigue, excessive thirst | Type 2 diabetes | Metformin |
| GP000002 | Jumeirah Primary Care | 2023-01-12 | 5-14 | Female | Cough, runny nose | Common cold | Paracetamol |
| GP000003 | Deira Health Center | 2023-01-14 | 45-64 | Female | Headache, dizziness | Hypertension | Amlodipine |
| GP000004 | Dubai Marina Clinic | 2023-01-15 | 25-44 | Male | Back pain | Muscle strain | Ibuprofen |
| GP000005 | Al Qusais Clinic | 2023-01-18 | 65+ | Male | Chest pain | Angina | Nitroglycerin |
| GP000006 | Mirdif Health Center | 2023-01-20 | 15-24 | Female | Anxiety, insomnia | Anxiety disorder | Escitalopram |
| GP000007 | Business Bay Clinic | 2023-01-22 | 0-4 | Male | Fever, ear pain | Otitis media | Amoxicillin |
| GP000008 | Palm Jumeirah Clinic | 2023-01-25 | 25-44 | Female | Abdominal pain | Gastritis | Omeprazole |
| GP000009 | Downtown Dubai Clinic | 2023-01-28 | 45-64 | Male | Joint pain | Osteoarthritis | Diclofenac |
| GP000010 | International City Clinic | 2023-01-30 | 25-44 | Female | Sore throat | Pharyngitis | Azithromycin |

## Social Media Health Mentions Sample Data

| mention_id | post_date | district | symptoms_mentioned | sentiment_score |
|------------|-----------|----------|-------------------|-----------------|
| SM000001 | 2023-01-08 | Dubai Marina | Feeling tired all the time, so thirsty | -0.6 |
| SM000002 | 2023-01-09 | Jumeirah | Everyone in my office has a cold | -0.4 |
| SM000003 | 2023-01-11 | Deira | Headache won't go away, might be my blood pressure | -0.7 |
| SM000004 | 2023-01-13 | Al Barsha | My back is killing me after moving | -0.8 |
| SM000005 | 2023-01-16 | Business Bay | Chest pain when I exercise lately | -0.9 |
| SM000006 | 2023-01-17 | Downtown Dubai | Can't sleep, feeling anxious | -0.7 |
| SM000007 | 2023-01-19 | Palm Jumeirah | My kid has a fever and pulling at his ear | -0.6 |
| SM000008 | 2023-01-21 | Al Qusais | Stomach pain after every meal | -0.5 |
| SM000009 | 2023-01-24 | Mirdif | Knees hurting when climbing stairs | -0.4 |
| SM000010 | 2023-01-27 | Dubai Marina | Sore throat and can't swallow | -0.8 |

## Pharmaceutical Inventory Sample Data

| inventory_id | facility_name | medication_name | medication_category | current_stock | min_stock_level | expiration_date |
|--------------|---------------|-----------------|---------------------|---------------|-----------------|-----------------|
| INV000001 | Dubai Hospital Pharmacy | Metformin 500mg | Antidiabetic | 2500 | 1000 | 2024-06-30 |
| INV000002 | Rashid Hospital Pharmacy | Paracetamol 500mg | Analgesic | 5000 | 2000 | 2024-03-15 |
| INV000003 | Latifa Hospital Pharmacy | Amlodipine 5mg | Antihypertensive | 1800 | 800 | 2024-08-22 |
| INV000004 | Hatta Hospital Pharmacy | Ibuprofen 400mg | NSAID | 3200 | 1500 | 2024-05-10 |
| INV000005 | Dubai Hospital Pharmacy | Nitroglycerin 0.4mg | Antianginal | 950 | 500 | 2023-12-28 |
| INV000006 | Rashid Hospital Pharmacy | Escitalopram 10mg | Antidepressant | 1200 | 600 | 2024-07-15 |
| INV000007 | Latifa Hospital Pharmacy | Amoxicillin 250mg | Antibiotic | 2800 | 1200 | 2024-04-18 |
| INV000008 | Hatta Hospital Pharmacy | Omeprazole 20mg | Proton Pump Inhibitor | 1600 | 700 | 2024-09-05 |
| INV000009 | Dubai Hospital Pharmacy | Diclofenac 50mg | NSAID | 2200 | 1000 | 2024-02-28 |
| INV000010 | Rashid Hospital Pharmacy | Azithromycin 250mg | Antibiotic | 1400 | 800 | 2024-06-10 |

## Environmental Data Sample

| record_id | date | district | temperature | humidity | air_quality_index | special_event |
|-----------|------|----------|-------------|----------|-------------------|---------------|
| ENV000001 | 2023-01-01 | Dubai Marina | 24 | 65 | 42 | New Year's Day |
| ENV000002 | 2023-01-15 | Deira | 22 | 70 | 45 | None |
| ENV000003 | 2023-02-01 | Al Barsha | 23 | 68 | 50 | None |
| ENV000004 | 2023-02-15 | Jumeirah | 25 | 62 | 48 | None |
| ENV000005 | 2023-03-01 | Business Bay | 27 | 60 | 52 | None |
| ENV000006 | 2023-03-15 | Downtown Dubai | 29 | 55 | 55 | None |
| ENV000007 | 2023-04-01 | Palm Jumeirah | 31 | 50 | 60 | None |
| ENV000008 | 2023-04-15 | Al Qusais | 33 | 45 | 65 | None |
| ENV000009 | 2023-05-01 | Mirdif | 35 | 40 | 70 | None |
| ENV000010 | 2023-05-15 | Dubai Marina | 37 | 35 | 75 | None |
| ENV000011 | 2023-06-01 | Deira | 39 | 30 | 80 | None |
| ENV000012 | 2023-06-15 | Al Barsha | 41 | 25 | 85 | None |
| ENV000013 | 2023-07-01 | Jumeirah | 43 | 20 | 90 | None |
| ENV000014 | 2023-07-15 | Business Bay | 44 | 18 | 95 | None |
| ENV000015 | 2023-08-01 | Downtown Dubai | 43 | 20 | 90 | None |
| ENV000016 | 2023-08-15 | Palm Jumeirah | 42 | 22 | 85 | None |
| ENV000017 | 2023-09-01 | Al Qusais | 40 | 25 | 80 | None |
| ENV000018 | 2023-09-15 | Mirdif | 38 | 30 | 75 | None |
| ENV000019 | 2023-10-01 | Dubai Marina | 35 | 35 | 70 | None |
| ENV000020 | 2023-10-15 | Deira | 32 | 40 | 65 | None |
| ENV000021 | 2023-11-01 | Al Barsha | 29 | 45 | 60 | None |
| ENV000022 | 2023-11-15 | Jumeirah | 26 | 50 | 55 | None |
| ENV000023 | 2023-12-01 | Business Bay | 24 | 55 | 50 | National Day |
| ENV000024 | 2023-12-15 | Downtown Dubai | 22 | 60 | 45 | None |
