# End-to-End Data Engineering Pipeline

[![CI](https://github.com/nat15hol/end-to-end-data-engineering-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/nat15hol/end-to-end-data-engineering-pipeline/actions)
[![License](https://img.shields.io/github/license/nat15hol/end-to-end-data-engineering-pipeline)](https://github.com/nat15hol/end-to-end-data-engineering-pipeline/blob/main/LICENSE)
[![Python](https://img.shields.io/badge/python-3.12-blue?logo=python&logoColor=white)](https://www.python.org/)

## Overview

This project demonstrates the design and implementation of an end-to-end data engineering pipeline using modern data engineering practices.

The goal of the project is to demonstrate a complete data workflow where data is collected from an external source, stored, transformed, validated, exposed through an API, and consumed through an interactive dashboard.

The project demonstrates a professional data engineering workflow including:

* Data ingestion from external APIs
* Workflow orchestration
* Data storage and management
* Data transformation using dbt
* Data quality validation
* Automated testing and quality assurance
* Analytical data modeling
* API development
* Interactive dashboard development
* Containerized development environment
* Version control and documentation practices

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

## Reliability

To reduce the impact of transient failures, the pipeline includes:

* Retry logic with exponential backoff in the ingestion client, handling HTTP 429 and 5xx responses from the Trafiklab API
* Structured logging around ingestion requests and failures
* Airflow DAG-level retries and retry delays via shared `default_args`, so temporary task failures do not halt the schedule

---

# Technology Stack

| Area | Technology |
| ---- | ---------- |
| Programming | Python |
| Backend API | FastAPI |
| Frontend | React + TypeScript |
| Orchestration | Apache Airflow |
| Containerization | Docker & Docker Compose |
| Database | PostgreSQL |
| Transformation | dbt |
| Data Quality | dbt Tests |
| Automated Testing | pytest |
| Mapping | Interactive Map |
| Version Control | Git & GitHub |
| Project Management | GitHub Projects |
| Continuous Integration | GitHub Actions |

---

# Getting Started

Follow these instructions to run the project locally.

## Prerequisites

Make sure you have the following installed:

* **Docker Desktop & Docker Compose** (for PostgreSQL and Apache Airflow)
* **Python 3.12+** (for the FastAPI backend)
* **Node.js 22+** (for the React frontend)

## 1. Clone the repository

```bash
git clone https://github.com/nat15hol/end-to-end-data-engineering-pipeline.git
cd end-to-end-data-engineering-pipeline
```

## 2. Configure environment variables

Create a local environment file from the provided example:

```bash
cp .env.example .env
```

Update the environment variables with your local configuration, including your Trafiklab API key.

Required configuration includes:

* PostgreSQL database settings
* Trafiklab API key for data ingestion

Example variables:

```dotenv
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

TRAFIKLAB_API_KEY=your_api_key_here
```

## 3. Start PostgreSQL and Airflow

Start the containerized services:

```bash
docker compose up --build
```

This starts:

| Service | URL |
| ------- | --- |
| Apache Airflow Webserver | http://localhost:8080 |
| PostgreSQL Database | localhost:5432 |

## 4. Run the FastAPI backend

The FastAPI backend is currently started separately.

Open a new terminal:

```bash
cd api
pip install -r ../requirements.txt
uvicorn main:app --reload
```

The API will be available at:

* http://localhost:8000
* Interactive API documentation: http://localhost:8000/docs

## 5. Run the React dashboard

The React dashboard is currently started separately.

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

---

# Project Structure

```text
end-to-end-data-engineering-pipeline/

├── .github/
│   └── workflows/
│
├── airflow/
│   ├── dags/
│   └── plugins/
│
├── api/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   └── queries.py
│
├── analysis/
│   └── check_vehicle_data.py
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
│   ├── __init__.py
│   ├── ingestion/
│   └── database/
│
├── tests/
│   ├── test_transformer.py
│   └── test_api.py
│
├── docs/
│   ├── ci-cd.md
│   ├── data_model.md
│   ├── delivery_process.md
│   ├── project_plan.md
│   ├── system_architecture.md
│   └── verification-test.md
│
├── docker/
│   └── airflow/
│       └── Dockerfile
│
├── docker-compose.yml
├── pytest.ini
├── requirements.txt
├── .env.example
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
GET /                                  Health check
GET /vehicles/latest
GET /vehicles/{vehicle_id}/history
```

The API acts as a bridge between the analytical database layer and the React dashboard.

FastAPI automatically provides interactive OpenAPI documentation through Swagger UI, available at `/docs`.

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

# Dashboard Preview

The dashboard provides near real-time visibility into vehicle positions, status, and historical movement.

![Dashboard overview](docs/images/dashboard-overview.png)

## Dashboard Interaction

The dashboard supports interaction between the vehicle table and map view.
Selecting a vehicle highlights the corresponding row and updates the map position.

![Dashboard detail view](docs/images/dashboard-detail-v2.png)

---

# Testing

The project includes an automated test suite built with `pytest`, covering both the data transformation logic and the API layer.

## Ingestion Tests

Unit tests validate the GTFS-RT transformation logic, including:

* Correct transformation of valid vehicle position data
* Filtering of records missing vehicle information

## API Tests

API tests use FastAPI's `TestClient` to validate the following endpoints:

```text
GET /
GET /vehicles/latest
GET /vehicles/{vehicle_id}/history
```

The database layer is mocked using `monkeypatch`, so these tests run without requiring a live PostgreSQL instance.

## Running the Tests

```bash
pytest
```

Current test suite:

```text
5 passed
```

The full test suite runs automatically in GitHub Actions on every push and pull request targeting `main`.

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

The application has been manually verified through complete system validation, and core backend logic is additionally verified through an automated test suite (see [Testing](#testing)).

The verification confirms successful integration between:

* GTFS-RT data ingestion
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

Automated validation is performed through GitHub Actions.

The CI workflow validates:

Backend:

* Automated test suite (`pytest`) for ingestion logic and API endpoints
* Python code compilation for backend components

Frontend:

* Linting
* Production build

The CI workflow runs on:

* Pushes to main
* Pull requests targeting main

The complete verification report is available in [Verification Test Report](docs/verification-test.md).

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
| Data quality validation | ✅ Completed |
| Automated testing | ✅ Completed |
| FastAPI backend | ✅ Completed |
| React dashboard | ✅ Completed |
| End-to-end verification | ✅ Completed |
| CI workflow | ✅ Completed |

---

# Documentation

Available documentation:

* [Project Plan](docs/project_plan.md)
* [Delivery Process](docs/delivery_process.md)
* [Verification Test Report](docs/verification-test.md)
* [System Architecture](docs/system_architecture.md)
* [Data Model](docs/data_model.md)
* [CI Documentation](docs/ci-cd.md)

---

# Future Improvements

Potential future improvements:

* Full automated pipeline execution testing
* Browser-based end-to-end testing
* Advanced dashboard analytics
* Event-driven streaming architecture
* Additional data sources
* Enhanced data quality checks (freshness checks, anomaly detection)
* Automated metadata generation
* Alerting on Airflow task failures
* Cloud-based production deployment

---

# Author

**Henrik Oldehed**

Data Engineer | Analytics Specialist

GitHub: https://github.com/nat15hol

LinkedIn: https://www.linkedin.com/in/henrikoldehed/

Portfolio project demonstrating modern Data Engineering practices.