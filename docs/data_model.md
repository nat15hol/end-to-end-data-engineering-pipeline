# Data Model

## 1. Overview

This document describes the data model for the End-to-End Data Engineering Pipeline project.

The purpose of the data model is to transform GTFS Realtime vehicle position data into a structured analytical model that supports reporting, analysis, and visualization.

The project follows a layered data architecture using:

* Raw source data
* Cleaned and transformed data
* Analytical fact and dimension models

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

The transformation process is managed using dbt.

---

## Raw Layer

Purpose:

* Store extracted data from the GTFS Realtime API
* Preserve ingested source data
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

Implemented transformations:

* Standardize column names
* Convert timestamps into readable datetime formats
* Prepare fields for analytical usage
* Apply data quality validation through dbt tests

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

Implemented analytical models:

```
fact_vehicle_positions
fact_vehicle_activity
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

Structure:

| Column         | Description              |
| -------------- | ------------------------ |
| vehicle_id     | Vehicle identifier       |
| trip_id        | Trip identifier          |
| latitude       | Clean latitude value     |
| longitude      | Clean longitude value    |
| speed          | Standardized speed value |
| bearing        | Direction of travel      |
| recorded_at    | Converted timestamp      |
| current_status | Vehicle status           |

---

# 5. Fact Tables

## fact_vehicle_positions

Purpose:

Stores measurable vehicle movement events.

Grain:

One row represents one recorded vehicle position at a specific point in time.

Structure:

| Column         | Description                    |
| -------------- | ------------------------------ |
| vehicle_id     | Reference to vehicle dimension |
| trip_id        | Trip identifier                |
| recorded_at    | Position timestamp             |
| latitude       | Vehicle latitude               |
| longitude      | Vehicle longitude              |
| speed          | Vehicle speed                  |
| bearing        | Direction                      |
| current_status | Vehicle status                 |

Possible analytical use cases:

* Vehicle movement analysis
* Speed analysis
* Position history
* Traffic pattern analysis

---

## fact_vehicle_activity

Purpose:

Aggregates vehicle activity over time to support operational analysis.

Grain:

One row represents aggregated vehicle activity during one hour.

Structure:

| Column          | Description                     |
| --------------- | ------------------------------- |
| activity_hour   | Hourly activity timestamp       |
| active_vehicles | Number of active vehicles       |
| observations    | Number of position observations |
| avg_speed       | Average vehicle speed           |
| max_speed       | Maximum recorded speed          |

Possible analytical use cases:

* Traffic activity analysis
* Hourly vehicle utilization
* Speed pattern analysis
* Operational monitoring

---

# 6. Dimension Tables

## dim_vehicle

Purpose:

Stores descriptive information about vehicles.

Grain:

One row per vehicle.

Structure:

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

Current analytical relationships:

```
             dim_vehicle
                  |
                  |
                  v
       fact_vehicle_positions


       fact_vehicle_activity
                  |
                  v
       Hourly aggregated vehicle metrics
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

Data quality is validated through dbt tests.

Implemented tests include:

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

Implemented dbt structure:

```
dbt/

├── models/
│
├── staging/
│   └── stg_vehicle_positions.sql
│
├── marts/
│   ├── fact_vehicle_positions.sql
│   ├── fact_vehicle_activity.sql
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

Data is validated before reaching the analytics layer.

## Scalability

The model allows additional dimensions and analytical use cases in the future.

---

# 11. Future Improvements

Possible improvements:

* Additional dimensions such as route and stop information
* Slowly Changing Dimensions (SCD)
* Additional analytical fact tables
* More advanced dbt testing
* Data quality monitoring
* Dashboard implementation

---

# Related Documentation

* Project Plan
* Delivery Process
* System Architecture
* README