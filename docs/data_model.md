# Data Model

## 1. Overview

This document describes the data model for the End-to-End Data Engineering Pipeline project.

The purpose of the data model is to transform GTFS Realtime vehicle position data into a structured analytical model that supports reporting, analysis, and visualization.

The project follows a layered data architecture using:

* Raw source data
* Cleaned and transformed data
* Analytical fact and dimension tables

The data source used in this project is GTFS Realtime Vehicle Positions from Trafiklab.

---

# 2. Data Modeling Approach

The project uses a layered data architecture:

```
Raw Layer
    |
    v
Staging Layer
    |
    v
Analytics Layer
```

## Raw Layer

Purpose:

* Store extracted data from the GTFS Realtime API
* Preserve the original ingested data
* Enable traceability and reprocessing

Characteristics:

* Minimal transformation
* Historical data preservation
* Source of truth for downstream transformations

Current raw table:

```
raw_vehicle_positions
```

---

## Staging Layer

Purpose:

* Clean and standardize raw vehicle position data
* Prepare data for analytical models
* Apply controlled transformations using dbt

Expected transformations:

* Rename columns
* Convert timestamps
* Standardize data types
* Handle missing values
* Validate data quality

Current staging model:

```
stg_vehicle_positions
```

---

## Analytics Layer

Purpose:

* Provide structured data for analysis and visualization
* Support dashboards and analytical queries

The analytics layer follows a dimensional modeling approach.

Main analytical models:

```
fact_vehicle_positions
dim_vehicle
```

---

# 3. Raw Model

## raw_vehicle_positions

Purpose:

Stores vehicle position records extracted from the GTFS Realtime API.

Each row represents one vehicle position event received during ingestion.

Current structure:

| Column         | Description                    |
| -------------- | ------------------------------ |
| id             | Unique database identifier     |
| vehicle_id     | Identifier for the vehicle     |
| trip_id        | Current trip identifier        |
| latitude       | Vehicle latitude position      |
| longitude      | Vehicle longitude position     |
| bearing        | Direction of travel            |
| speed          | Current speed                  |
| timestamp      | Source event timestamp         |
| current_status | Current vehicle status         |
| ingested_at    | Timestamp when data was stored |

---

# 4. Staging Model

## stg_vehicle_positions

Purpose:

Creates a cleaned and standardized version of vehicle position data.

The staging model acts as the bridge between raw ingestion data and analytical models.

Expected improvements:

* Convert timestamps into readable datetime formats
* Standardize column names
* Validate required fields
* Prepare data for analytical usage

Example structure:

| Column         | Description              |
| -------------- | ------------------------ |
| vehicle_id     | Vehicle identifier       |
| trip_id        | Trip identifier          |
| latitude       | Clean latitude value     |
| longitude      | Clean longitude value    |
| speed          | Standardized speed value |
| recorded_at    | Converted timestamp      |
| current_status | Vehicle status           |

---

# 5. Fact Tables

## fact_vehicle_positions

Purpose:

Stores measurable vehicle movement events.

Grain:

One row represents one recorded vehicle position at a specific point in time.

Example structure:

| Column      | Description                    |
| ----------- | ------------------------------ |
| vehicle_id  | Reference to vehicle dimension |
| recorded_at | Position timestamp             |
| latitude    | Vehicle latitude               |
| longitude   | Vehicle longitude              |
| speed       | Vehicle speed                  |
| bearing     | Direction                      |

Possible analytical use cases:

* Vehicle movement analysis
* Speed analysis
* Position history
* Traffic pattern analysis

---

# 6. Dimension Tables

## dim_vehicle

Purpose:

Stores descriptive information about vehicles.

Grain:

One row per vehicle.

Example structure:

| Column     | Description               |
| ---------- | ------------------------- |
| vehicle_id | Unique vehicle identifier |
| first_seen | First observed timestamp  |
| last_seen  | Latest observed timestamp |

Possible future attributes:

* Vehicle type
* Operator
* Route information

---

# 7. Data Relationships

Expected relationships:

```
        dim_vehicle
             |
             |
             v
fact_vehicle_positions
```

A vehicle can have many recorded position events.

Future dimensions may include:

```
dim_route
dim_time
dim_location
```

depending on future analytical requirements.

---

# 8. Data Quality Requirements

The analytical model should include validation through dbt tests.

Expected tests:

## Primary Keys

* Unique values
* Not null values

## Relationships

* Vehicle references exist
* Foreign keys are valid

## Data Completeness

* Required fields populated
* Valid geographic coordinates
* Expected data types maintained

Example dbt tests:

```yaml
tests:
  - unique
  - not_null
  - relationships
```

---

# 9. dbt Model Structure

Planned dbt structure:

```
dbt/

├── models/
│
├── staging/
│   └── stg_vehicle_positions.sql
│
├── marts/
│   ├── fact_vehicle_positions.sql
│   └── dim_vehicle.sql
│
└── schema.yml
```

---

# 10. Design Principles

The data model follows these principles:

## Simplicity

The model should be understandable and easy to maintain.

## Analytics Focus

Models should support analytical questions rather than simply mirror source data.

## Data Quality

Data should be validated before reaching the analytics layer.

## Scalability

The model should allow additional dimensions and analytical use cases in the future.

---

# 11. Future Improvements

Possible improvements:

* Additional dimensions such as route and stop information
* Slowly Changing Dimensions (SCD)
* Additional analytical fact tables
* Advanced dbt testing
* Data quality monitoring

---

# Related Documentation

* Project Plan
* Delivery Process
* System Architecture