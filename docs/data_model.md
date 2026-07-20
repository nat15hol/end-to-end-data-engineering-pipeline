# Data Model

## 1. Overview

This document describes the planned data model for the **End-to-End Data Engineering Pipeline** project.

The purpose of the data model is to transform raw source data into a structured analytical model that supports reporting, analysis, and business insights.

The project follows a dimensional modeling approach using a **star schema**.

The model separates:

* Raw source data
* Cleaned and transformed data
* Analytical fact and dimension tables

---

# 2. Data Modeling Approach

The project uses a layered data architecture:

```text
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

* Store extracted data from external sources
* Preserve original source structure
* Enable traceability

Characteristics:

* Minimal transformation
* Historical data preservation
* Used as input for transformation processes

---

## Staging Layer

Purpose:

* Clean and standardize raw data
* Prepare data for analytical modeling

Transformations may include:

* Renaming columns
* Data type conversions
* Removing duplicates
* Handling missing values

---

## Analytics Layer

Purpose:

* Provide structured data for reporting and analysis

The analytics layer follows a star schema design.

---

# 3. Star Schema Overview

The analytical model consists of:

* Fact tables containing measurable events
* Dimension tables providing descriptive context

General structure:

```text
              Dimension
                  |
                  |
Dimension ---- Fact Table ---- Dimension
                  |
                  |
              Dimension
```

---

# 4. Fact Tables

Fact tables represent measurable business events.

A fact table should contain:

* Foreign keys to dimensions
* Numeric measurements
* Event timestamps
* Business metrics

Example structure:

## fact_events

| Column       | Description                     |
| ------------ | ------------------------------- |
| event_id     | Unique identifier               |
| date_key     | Reference to date dimension     |
| location_key | Reference to location dimension |
| metric_value | Measured value                  |
| created_at   | Record creation timestamp       |

The exact fact table structure will be finalized after the data source has been selected.

---

# 5. Dimension Tables

Dimension tables provide descriptive information used for filtering and analysis.

## dim_date

Purpose:

Provides time-based analysis.

Example attributes:

| Column   | Description            |
| -------- | ---------------------- |
| date_key | Unique date identifier |
| date     | Calendar date          |
| year     | Year                   |
| month    | Month                  |
| day      | Day                    |

---

## dim_location

Purpose:

Provides geographic context if applicable.

Example attributes:

| Column        | Description        |
| ------------- | ------------------ |
| location_key  | Unique identifier  |
| location_name | Location name      |
| region        | Region information |
| country       | Country            |

---

## dim_source

Purpose:

Tracks information about the original data source.

Example attributes:

| Column         | Description        |
| -------------- | ------------------ |
| source_key     | Unique identifier  |
| source_name    | Source system      |
| source_type    | API, dataset, file |
| ingestion_date | Extraction date    |

---

# 6. Data Relationships

The expected relationships:

```text
dim_date
    |
    |
    v
fact_events
    ^
    |
    |
dim_location


dim_source
    |
    |
    v
fact_events
```

Relationships will be refined after the final dataset has been selected.

---

# 7. Data Quality Requirements

The analytical model should include validation through dbt tests.

Expected tests:

## Primary Keys

* Unique values
* Not null values

## Relationships

* Foreign keys exist
* Valid dimension references

## Data Completeness

* Required fields populated
* Expected data types maintained

Example:

```yaml
tests:
  - unique
  - not_null
  - relationships
```

---

# 8. dbt Model Structure

The planned dbt structure:

```text
dbt/

├── models/
│
├── staging/
│   └── stg_source_data.sql
│
├── marts/
│   ├── fact_events.sql
│   ├── dim_date.sql
│   └── dim_location.sql
│
└── schema.yml
```

---

# 9. Design Principles

The data model follows these principles:

## Simplicity

The model should be understandable and easy to maintain.

## Analytics Focus

Tables should support analytical questions rather than simply mirror source data.

## Data Quality

Data should be validated before reaching the analytics layer.

## Scalability

The model should allow additional dimensions and metrics in the future.

---

# 10. Future Improvements

Possible improvements:

* Slowly Changing Dimensions (SCD)
* Additional fact tables
* Data warehouse optimization
* Metadata management
* Advanced data quality monitoring

---

# Related Documentation

* [Project Plan](project_plan.md)
* [Delivery Process](delivery_process.md)
* [System Architecture](system_architecture.md)