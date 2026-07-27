# End-to-End Data Engineering Pipeline

## Overview

This project demonstrates the design and implementation of an end-to-end data engineering pipeline using modern data engineering practices.

The goal of the project is to build a complete data workflow where data is collected from an external source, stored, transformed, validated, exposed through an API, and consumed through an interactive dashboard.

The project demonstrates a professional data engineering workflow including:

* Data ingestion from external APIs
* Workflow orchestration
* Data storage and management
* Data transformation using dbt
* Data quality validation
* Analytical data modeling
* API development
* Interactive dashboard development
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
* API development
* Interactive data visualization
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
FastAPI Backend
        |
        v
React + TypeScript Dashboard
        |
        +--> Vehicle Monitoring Table
        +--> KPI Overview
        +--> Interactive Vehicle Map
        +--> Vehicle History
```

The architecture separates:

* Data collection
* Data storage
* Data transformation
* Data serving
* Data visualization

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

The current pipeline schedule runs every two minutes:

```text
schedule = "*/2 * * * *"
```

---

# Technology Stack

| Area | Technology |
| ---- | ---------- |
| Programming | Python |
| Backend API | FastAPI |
| Frontend | React + TypeScript |
| Orchestration | Apache Airflow |
| Containerization | Docker |
| Database | PostgreSQL |
| Transformation | dbt |
| Data Validation | dbt Tests |
| Mapping | Interactive Map |
| Version Control | Git & GitHub |
| Project Management | GitHub Projects |
| CI/CD | GitHub Actions |

---

# Project Structure

```text
end-to-end-data-engineering-pipeline/

├── airflow/
│   ├── dags/
│   ├── logs/
│   └── plugins/
│
├── api/
│   ├── main.py
│   ├── models.py
│   └── queries.py
│
├── dbt/
│   ├── models/
│   │   ├── staging/
│   │   └── marts/
│   ├── dbt_project.yml
│   └── profiles.yml
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
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
6. FastAPI exposes analytical vehicle data through REST endpoints.
7. React consumes the API and provides an interactive monitoring dashboard.

Implemented dbt models:

* `stg_vehicle_positions`
* `fact_vehicle_positions`
* `fact_vehicle_activity`
* `dim_vehicle`

Current PostgreSQL data layers:

## Raw Layer

```text
raw_vehicle_positions
```

Contains ingested vehicle position observations.

## Analytics Layer

```text
stg_vehicle_positions
fact_vehicle_positions
fact_vehicle_activity
dim_vehicle
```

Provides structured analytical data for downstream applications.

---

# API Layer

The FastAPI backend provides REST endpoints for accessing vehicle data.

Implemented endpoints:

```text
GET /vehicles/latest

GET /vehicles/{vehicle_id}/history
```

The API acts as a bridge between the analytical database layer and the React dashboard.

---

# Dashboard Features

The interactive React + TypeScript dashboard provides:

* Near real-time vehicle monitoring
* Vehicle search by ID
* Vehicle status filtering
* Data freshness monitoring
* Moving / idle vehicle classification
* Interactive vehicle map
* KPI overview
* Vehicle selection between map and table
* Automatic scrolling to selected vehicles
* Historical vehicle position analysis

The dashboard monitors data freshness using:

```text
Fresh Data: < 5 minutes
Stale Data: >= 5 minutes
```

This threshold aligns with the pipeline execution frequency.

---

# Development Process

The project follows an agile Kanban workflow using GitHub Projects.

Workflow:

```text
Backlog → Ready → In Progress → In Review → Done
```

Development practices include:

* Feature branches
* Pull Requests
* Issue-based development
* Documentation-driven decisions
* Automated quality checks

Further documentation:

* `docs/project_plan.md`
* `docs/delivery_process.md`

---

# Verification

The complete application has been manually verified through end-to-end testing.

The verification confirms successful integration between:

* GTFS data ingestion
* PostgreSQL
* dbt transformations
* FastAPI backend
* React frontend

Verified functionality includes:

* Backend startup
* API health endpoint
* Latest vehicle endpoint
* Vehicle history endpoint
* Frontend startup
* Vehicle monitoring dashboard
* Vehicle selection
* Vehicle overview
* Location history

A complete verification report is available in:

```text
docs/verification-test.md
```

---

# Data Pipeline Status

| Component | Status |
| --------- | ------ |
| Repository setup | ✅ Completed |
| Project documentation | ✅ Completed |
| System architecture | ✅ Completed |
| Data ingestion | ✅ Completed |
| Database setup | ✅ Completed |
| Airflow orchestration | ✅ Completed |
| dbt transformations | ✅ Completed |
| Data quality tests | ✅ Completed |
| FastAPI backend | ✅ Completed |
| React dashboard | ✅ Completed |
| End-to-end verification | ✅ Completed |
| CI/CD pipeline | ✅ CI Completed |

---

# Documentation

Available documentation:

* Project Plan
* Delivery Process
* Verification Test Report
* System Architecture
* Data Model
* Architecture Decision Records (ADRs)
* Test Strategy
* CI/CD Documentation

---

# Future Improvements

Potential future improvements:

* Automated end-to-end testing
* Advanced dashboard analytics
* Event-driven streaming architecture
* Cloud deployment
* Additional data sources
* Enhanced data quality checks
* Automated metadata generation
* Production-ready CI/CD deployment

---

# Author

**Henrik Oldehed**

Data Engineer | Analytics Specialist

GitHub: https://github.com/nat15hol

LinkedIn: https://www.linkedin.com/in/henrikoldehed/

Portfolio project demonstrating modern Data Engineering practices.