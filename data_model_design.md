# Synthetic Data Model Design

This document outlines the approach for creating realistic synthetic data to demonstrate the HealthPulse system for Dubai's healthcare logistics challenge.

## Data Types to Generate

### 1. Hospital Data
- Patient admissions with anonymized demographics
- Diagnoses using ICD-10 codes
- Medication dispensing records
- Emergency department visits

### 2. GP/Clinic Data
- Outpatient visits with anonymized demographics
- Diagnoses and symptoms
- Prescription records
- Referral patterns

### 3. Social Media Data
- Health-related mentions with sentiment
- Symptom descriptions at varying levels of specificity
- Geolocation data at district level
- Temporal patterns reflecting real-world behavior

### 4. Pharmaceutical Inventory Data
- Stock levels across facilities
- Medication categories and specific drugs
- Expiration dates
- Temperature monitoring data

### 5. Environmental Data
- Temperature and humidity patterns specific to Dubai
- Air quality measurements
- Seasonal variations
- Special events calendar

## Data Generation Methodology

### 1. Base Population Model
- Create synthetic population reflecting Dubai's demographic profile
- Model age distribution, gender ratios, and district-level population density
- Incorporate expatriate vs. local citizen proportions (85% expats)
- Model healthcare utilization patterns based on demographic segments

### 2. Disease Prevalence Patterns
- Model common health issues identified in research:
  - Cardiovascular diseases (leading cause of death)
  - Diabetes (affects 20% of population)
  - Respiratory conditions
  - Mental health issues (depression affecting 18%)
  - Injuries from accidents
- Incorporate seasonal patterns specific to Dubai:
  - Heat-related illnesses during summer months
  - Respiratory conditions during winter
  - Influenza patterns
  - Ramadan-related health patterns

### 3. Outbreak Simulation
- Create realistic outbreak scenarios for common infectious diseases
- Model disease spread patterns based on:
  - Geographic proximity
  - Population density
  - Social interaction patterns
  - Environmental factors
- Include early warning signals across different data sources

### 4. Supply Chain Dynamics
- Model realistic pharmaceutical inventory fluctuations
- Create patterns of medication usage correlated with disease prevalence
- Simulate temperature excursions during transportation
- Model expiration patterns and waste generation

### 5. Temporal Correlation
- Ensure temporal correlation between data sources
- Model realistic time delays between:
  - Social media mentions and GP visits
  - GP visits and hospital admissions
  - Disease onset and medication demand
- Create realistic noise and variability in the data

## Implementation Approach

### 1. Python-Based Generation Framework
- Use Python with pandas, NumPy, and specialized libraries
- Implement statistical distributions based on research findings
- Create modular generation components for each data type
- Ensure reproducibility with fixed random seeds

### 2. Realistic Anomaly Injection
- Add realistic anomalies and outliers
- Create data quality issues similar to real-world scenarios
- Incorporate missing data patterns
- Model sensor failures for temperature monitoring

### 3. Validation Approach
- Validate synthetic data against known patterns from research
- Ensure statistical properties match expected distributions
- Verify temporal and spatial correlations
- Test with domain experts for realism assessment

### 4. Data Volume and Timespan
- Generate 2 years of historical data for training
- Create 3 months of current data for demonstration
- Include future projection period for prediction validation
- Scale data volume to represent Dubai's healthcare system

## Data Schema Design

### Hospital Admissions
```
admission_id: unique identifier
facility_id: hospital identifier
admission_timestamp: date and time of admission
discharge_timestamp: date and time of discharge (if applicable)
patient_age_group: age range (0-4, 5-14, 15-24, 25-44, 45-64, 65+)
patient_gender: gender
patient_district: residential district in Dubai
diagnosis_primary: ICD-10 code
diagnosis_secondary: additional ICD-10 codes (optional)
admission_type: emergency, planned, transfer
severity_score: numerical score indicating severity
```

### GP Visits
```
visit_id: unique identifier
clinic_id: clinic identifier
visit_timestamp: date and time of visit
patient_age_group: age range
patient_gender: gender
patient_district: residential district
symptoms: list of reported symptoms
diagnosis: diagnosis code
medications_prescribed: list of medications
referral_made: boolean indicating if specialist referral was made
```

### Social Media Health Mentions
```
mention_id: unique identifier
timestamp: date and time of post
district: general location (if available)
symptoms_mentioned: list of symptoms described
sentiment_score: negative to positive scale
demographic_indicators: any available demographic information
platform: social media platform source
mention_text: anonymized/synthetic text content
```

### Pharmaceutical Inventory
```
inventory_id: unique identifier
facility_id: location identifier
medication_id: medication identifier
medication_category: therapeutic category
current_stock: quantity available
min_stock_level: minimum required level
expiration_date: date of expiration
temperature_log: time series of storage temperatures
reorder_status: pending, ordered, received
last_updated: timestamp of last inventory update
```

### Environmental Data
```
record_id: unique identifier
timestamp: date and time of measurement
district: location in Dubai
temperature: temperature in Celsius
humidity: relative humidity percentage
air_quality_index: AQI measurement
special_event: any special event occurring (Ramadan, major conference, etc.)
```

## Implementation Timeline

1. **Week 1**: Design and implement base population model
2. **Week 2**: Generate hospital and GP visit data
3. **Week 3**: Create social media and environmental data
4. **Week 4**: Develop pharmaceutical inventory data
5. **Week 5**: Validate and refine all datasets
6. **Week 6**: Create documentation and integration with visualization system
