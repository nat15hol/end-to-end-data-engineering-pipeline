# End-to-End Data Engineering Pipeline

## Overview

This project demonstrates the design and implementation of an end-to-end data engineering pipeline using modern data engineering practices.

The goal of the project is to build a complete data workflow where data is collected from an external source, stored, transformed, validated, and prepared for analytical use.

The project demonstrates a professional data engineering workflow including:

* Data ingestion from external APIs
* Workflow orchestration
* Data storage and management
* Data transformation using dbt
* Data quality validation
* Analytical data modeling
* Containerized development environment
* Version control and documentation practices

---

# Project Goals

The main objectives of this project are to demonstrate:

* Data ingestion from external sources
* Data storage and management
* Data transformation using modern engineering practices
* Data quality validation
* Workflow orchestration
* Analytical data modeling
* Professional software development workflow

---

# Architecture Overview

The implemented high-level architecture:

```text
Trafiklab GTFS-RT API
        |
        v
Python Data Ingestion
        |
        v
PostgreSQL Raw Layer
(raw_vehicle_positions)
        |
        v
dbt Transformations
        |
        v
Analytical Data Models
(dim_vehicle,
 fact_vehicle_positions,
 fact_vehicle_activity)
        |
        v
Dashboard / BI Layer
```

The architecture separates data collection, storage, transformation, and analytical consumption.

The pipeline is orchestrated using Apache Airflow, which controls the execution order:

```text
Airflow DAG

run_ingestion
        |
        v
dbt_run
        |
        v
dbt_test
```

---

# Technology Stack

The project uses the following technologies:

| Area               | Technology      |
| ------------------ | --------------- |
| Programming        | Python          |
| Orchestration      | Apache Airflow  |
| Containerization   | Docker          |
| Database           | PostgreSQL      |
| Transformation     | dbt             |
| Data Validation    | dbt Tests       |
| Version Control    | Git & GitHub    |
| Project Management | GitHub Projects |
| CI/CD              | GitHub Actions  |
| Visualization      | BI Dashboard    |

---

# Project Structure

```text
end-to-end-data-engineering-pipeline/

├── airflow/
│   ├── dags/
│   ├── logs/
│   └── plugins/
│
├── dbt/
│   ├── models/
│   │   ├── staging/
│   │   └── marts/
│   ├── dbt_project.yml
│   └── profiles.yml
│
├── src/
│   ├── ingestion/
│   └── database/
│
├── tests/
│
├── docs/
│
├── docker/
│
├── docker-compose.yml
├── requirements.txt
├── README.md
└── .gitignore
```

---

# Implemented Pipeline

The current pipeline executes the following workflow:

1. Airflow triggers the ingestion process.
2. Python retrieves vehicle position data from Trafiklab GTFS-RT.
3. Vehicle position data is stored in PostgreSQL.
4. dbt transforms raw data into analytical models.
5. dbt tests validate the transformed data.

Implemented dbt models:

* `stg_vehicle_positions`
* `fact_vehicle_positions`
* `fact_vehicle_activity`
* `dim_vehicle`

Current PostgreSQL data layers:

### Raw Layer

```text
raw_vehicle_positions
```

Contains ingested vehicle position observations.

### Analytics Layer

```text
stg_vehicle_positions
fact_vehicle_positions
fact_vehicle_activity
dim_vehicle
```

Provides structured data for analytical usage.

---

# Development Process

The project follows an agile Kanban workflow using GitHub Projects.

The workflow is:

```text
Backlog → Ready → In Progress → In Review → Done
```

Development follows:

* Feature branches
* Pull Requests
* Issue-based development
* Documentation-driven decisions
* Automated quality checks

More details can be found in:

* [Project Plan](docs/project_plan.md)
* [Delivery Process](docs/delivery_process.md)

---

# Data Pipeline Status

Current project status:

| Component             | Status    |
| --------------------- | --------- |
| Repository setup      | Completed |
| Project documentation | Completed |
| System architecture   | Completed |
| Data ingestion        | Completed |
| Database setup        | Completed |
| Airflow orchestration | Completed |
| dbt transformations   | Completed |
| Data quality tests    | Completed |
| CI/CD pipeline        | Planned   |
| Dashboard             | Planned   |

---

# Documentation

Project documentation:

* Project Plan
* Delivery Process
* System Architecture
* Data Model
* Architecture Decision Records
* Test Strategy
* CI/CD Documentation

---

# Future Improvements

Potential future improvements:

* Dashboard implementation
* Advanced monitoring and observability
* Cloud deployment
* Additional data sources
* Enhanced data quality checks
* Automated metadata generation
* Production CI/CD deployment

---

# Author

**Henrik Oldehed**
Data Engineer | Analytics Specialist

[GitHub](https://github.com/nat15hol) | [LinkedIn](https://www.linkedin.com/in/henrikoldehed/)

Portfolio project demonstrating modern Data Engineering practices.