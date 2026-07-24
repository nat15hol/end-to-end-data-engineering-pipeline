# System Architecture

## 1. Overview

This document describes the system architecture of the **End-to-End Data Engineering Pipeline** project.

The purpose of the architecture is to define how data flows through the system, from external data sources to analytical data models.

The architecture follows modern data engineering principles:

* Separation of ingestion, storage, transformation, and analytics layers
* Reproducible development environments
* Workflow orchestration
* Data quality validation
* Clear documentation of technical decisions

The implemented solution collects GTFS Realtime vehicle position data, stores the raw data in PostgreSQL, transforms the data using dbt, and prepares analytical models for reporting and future visualization.

---

# 2. Architecture Overview

The implemented architecture follows this data flow:

```text
External Data Source
(Trafiklab GTFS Realtime)
        |
        v
Data Ingestion Layer
(Python)
        |
        v
Workflow Orchestration
(Apache Airflow)
        |
        v
Raw Data Storage
(PostgreSQL)
        |
        v
Transformation Layer
(dbt)
        |
        v
Analytical Data Models
(Facts and Dimensions)
        |
        v
BI / Dashboard Layer
(Future)
```

The architecture separates:

* Data collection
* Pipeline execution
* Data storage
* Data transformation
* Analytical consumption

---

# 3. Architecture Components

## 3.1 Data Source Layer

The pipeline receives GTFS Realtime vehicle position data from:

**Trafiklab GTFS Realtime Vehicle Positions API**

The source provides real-time public transport vehicle information.

Responsibilities:

* Provide vehicle position data
* Define source data structure
* Provide API access
* Maintain consistent data format

---

## 3.2 Data Ingestion Layer

The ingestion layer extracts data from the external source and loads it into PostgreSQL.

Technology:

* Python

Responsibilities:

* Connect to the Trafiklab API
* Extract GTFS Realtime vehicle positions
* Parse incoming data
* Validate basic responses
* Store raw records in PostgreSQL

The ingestion process is designed to be repeatable and executed through the Airflow pipeline.

---

## 3.3 Workflow Orchestration Layer

The pipeline workflow is orchestrated using:

**Apache Airflow**

Airflow manages execution, monitoring, and scheduling of pipeline tasks.

Current DAG:

```text
vehicle_pipeline

├── run_ingestion
├── dbt_run
└── dbt_test
```

Responsibilities:

* Execute ingestion tasks
* Run dbt transformations
* Execute data quality tests
* Monitor task execution
* Provide execution logs

---

## 3.4 Storage Layer

The storage layer uses PostgreSQL as the primary database.

PostgreSQL contains the raw source data and analytical models.

Current structure:

```text
PostgreSQL

├── Raw Layer
│
│   └── raw_vehicle_positions
│
└── Analytics Layer
    │
    ├── fact_vehicle_positions
    ├── fact_vehicle_activity
    └── dim_vehicle
```

The staging layer is managed through dbt models rather than separate database tables.

Responsibilities:

* Store extracted source data
* Maintain historical records
* Provide data for transformations
* Support analytical queries

---

## 3.5 Transformation Layer

The transformation layer uses dbt.

Responsibilities:

* Clean raw data
* Standardize fields
* Create analytical models
* Apply business logic
* Document transformations
* Execute data quality tests

The transformation process follows:

```text
Raw Data
    |
    v
Staging Model
(stg_vehicle_positions)
    |
    v
Analytics Models

fact_vehicle_positions
fact_vehicle_activity
dim_vehicle
```

---

## 3.6 Analytical Layer

The analytical layer provides structured data for reporting and analysis.

The model follows a dimensional modeling approach.

Current analytical models:

```text
dim_vehicle
      |
      |
fact_vehicle_positions


fact_vehicle_activity
(hourly aggregated metrics)
```

The analytical layer supports:

* Vehicle movement analysis
* Speed analysis
* Activity monitoring
* Future dashboard development

---

# 4. Data Flow

The complete pipeline flow:

```text
1. Trafiklab provides GTFS Realtime vehicle data

2. Python ingestion retrieves and parses vehicle positions

3. Raw data is stored in PostgreSQL

4. Airflow orchestrates pipeline execution

5. dbt transforms and validates the data

6. Analytical models are created

7. Data becomes available for reporting and future dashboard consumption
```

---

# 5. Development Environment

The project uses a reproducible local development environment.

Current components:

| Component      | Purpose                           |
| -------------- | --------------------------------- |
| GitHub         | Version control and collaboration |
| Docker         | Environment reproducibility       |
| PostgreSQL     | Database storage                  |
| Apache Airflow | Workflow orchestration            |
| dbt            | Data transformation and testing   |
| Python         | Data ingestion                    |

---

# 6. Future CI/CD Architecture

Automated CI/CD is planned as a future improvement.

The intended workflow:

```text
Pull Request Created
        |
        v
GitHub Actions Triggered
        |
        v
Code Quality Checks
        |
        v
Tests Executed
        |
        v
Validation Passed
```

The goal is to automate validation and prevent untested changes from being merged.

---

# 7. Data Quality Strategy

Data quality is handled during the transformation process.

Validation includes:

* Unique identifiers
* Required fields
* Valid relationships
* Expected data types
* Analytical model validation

dbt tests are used for automated validation.

Examples:

```yaml
tests:
  - unique
  - not_null
  - relationships
```

---

# 8. Architecture Principles

The architecture follows these principles:

## Maintainability

Components are separated into clear layers and responsibilities.

## Reproducibility

The development environment can be recreated using Docker and project documentation.

## Scalability

The design allows additional sources, models, and analytical use cases.

## Quality First

Testing and validation are integrated into the transformation workflow.

---

# 9. Future Improvements

Possible improvements:

* Cloud deployment
* GitHub Actions CI/CD automation
* Advanced monitoring and logging
* Data catalog integration
* Improved observability
* Dashboard implementation
* Additional analytical dimensions

---

# 10. Related Documentation

Additional project documentation:

* [Project Plan](project_plan.md)
* [Delivery Process](delivery_process.md)
* [Data Model](data_model.md)
* Architecture Decision Records (ADR)