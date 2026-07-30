# End-to-End Data Engineering Pipeline

[![CI](https://github.com/nat15hol/end-to-end-data-engineering-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/nat15hol/end-to-end-data-engineering-pipeline/actions)
[![License](https://img.shields.io/github/license/nat15hol/end-to-end-data-engineering-pipeline)](https://github.com/nat15hol/end-to-end-data-engineering-pipeline/blob/main/LICENSE)
[![Python](https://img.shields.io/badge/python-3.12-blue?logo=python&logoColor=white)](https://www.python.org/)
[![dbt](https://img.shields.io/badge/dbt-1.12-orange)](https://www.getdbt.com/)
[![Docker](https://img.shields.io/badge/docker-compose-blue?logo=docker)](https://www.docker.com/)

# Overview

This project demonstrates the design and implementation of an end-to-end data engineering pipeline using modern data engineering practices.

The goal is to demonstrate a complete data workflow where data is collected from an external source, stored, transformed, validated, exposed through an API, and consumed through an interactive dashboard.

The project demonstrates a professional data engineering workflow including:

* Data ingestion from external APIs
* Workflow orchestration using Apache Airflow
* Data storage and management using PostgreSQL
* Data transformation using dbt
* Data quality validation
* Automated testing and quality assurance
* Analytical data modeling
* API development
* Interactive dashboard development
* Containerized development environment
* Continuous Integration and security validation
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

The pipeline is orchestrated using Apache Airflow:

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

# Current Airflow Validation

The complete pipeline has been validated locally using Docker Compose and Apache Airflow.

Validated execution:

```text
run_ingestion
        |
        v
dbt_run
        |
        v
dbt_test
```

All pipeline tasks completed successfully in Apache Airflow.

This confirms successful integration between:

* Python ingestion
* PostgreSQL storage
* dbt transformations
* dbt data quality validation
* Airflow orchestration

---

# Reliability

To reduce the impact of transient failures, the pipeline includes:

* Retry logic with exponential backoff in the ingestion client, handling HTTP 429 and 5xx responses from the Trafiklab API
* Structured logging around ingestion requests and failures
* Airflow DAG-level retries and retry delays using shared `default_args`
* Automated dependency security scanning through CI

---

# Technology Stack

| Area                   | Technology                                        |
| ---------------------- | ------------------------------------------------- |
| Programming            | Python                                            |
| Backend API            | FastAPI                                           |
| Frontend               | React + TypeScript                                |
| Orchestration          | Apache Airflow                                    |
| Containerization       | Docker & Docker Compose                           |
| Database               | PostgreSQL                                        |
| Transformation         | dbt                                               |
| Data Quality           | dbt Tests (`not_null`, `unique`, `relationships`) |
| Automated Testing      | pytest                                            |
| Security Scanning      | pip-audit                                         |
| Mapping                | Interactive Map                                   |
| Version Control        | Git & GitHub                                      |
| Project Management     | GitHub Projects                                   |
| Continuous Integration | GitHub Actions                                    |

---

# Getting Started

Follow these instructions to run the project locally.

## Prerequisites

Make sure you have the following installed:

* **Docker Desktop & Docker Compose**
* **Python 3.12+**
* **Node.js 22+**

---

## 1. Clone the repository

```bash
git clone https://github.com/nat15hol/end-to-end-data-engineering-pipeline.git
cd end-to-end-data-engineering-pipeline
```

---

## 2. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env
```

Update the variables with your local configuration.

Required configuration:

* PostgreSQL database settings
* Trafiklab API key

Example:

```dotenv
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

TRAFIKLAB_API_KEY=your_api_key_here
```

## PostgreSQL hostname configuration

When running applications directly from the local machine, PostgreSQL is accessed through:

```text
localhost:5432
```

Inside Docker Compose, services communicate using Docker service names.

For example, dbt connects to PostgreSQL using:

```text
postgres:5432
```

This is because Docker Compose creates an internal network where services discover each other by service name.

---

## 3. Start PostgreSQL and Airflow

Build and start the containerized services:

```bash
docker compose build
docker compose up -d
```

This starts:

| Service                  | URL                   |
| ------------------------ | --------------------- |
| Apache Airflow Webserver | http://localhost:8080 |
| PostgreSQL Database      | localhost:5432        |

Development credentials configured in `docker-compose.yml` are intended only for local development and testing.

For production environments:

* change default credentials
* use environment variables or secrets management
* never store production credentials directly in configuration files

---

## 4. Run the FastAPI backend

The backend is started separately.

Open a new terminal:

```bash
cd api
pip install -r ../requirements.txt
uvicorn main:app --reload
```

API available at:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

---

## 5. Run the React dashboard

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Dashboard available at:

```text
http://localhost:5173
```