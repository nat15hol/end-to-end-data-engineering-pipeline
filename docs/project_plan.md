# Project Plan

## 1. Project Overview

### Project Name

**End-to-End Data Engineering Pipeline**

### Purpose

The purpose of this project is to design and implement an end-to-end data engineering pipeline following modern industry practices.

The project focuses not only on building a functional data solution, but also on demonstrating a professional development process with documentation, version control, automated quality checks, and reproducible workflows.

The project is structured as a portfolio project demonstrating capabilities within data engineering, including:

* Data ingestion
* Data storage
* Workflow orchestration
* Data transformation
* Data modeling
* Data quality validation
* Analytics preparation
* Technical documentation

---

## 2. Vision

The vision of this project is to create a production-inspired data platform that demonstrates how raw data can be transformed into reliable analytical data through a structured and automated data engineering workflow.

The project demonstrates:

* Professional Git workflow
* Agile project management
* Clear system architecture
* Data quality practices
* Automated data validation
* Reproducible development environments
* Well-documented technical decisions

---

## 3. Goals and Objectives

### Technical Goals

The project aims to build an end-to-end data pipeline containing:

* Data ingestion from an external API source
* Data storage using PostgreSQL
* Workflow orchestration using Apache Airflow
* Data transformation using dbt
* Analytical data modeling using fact and dimension models
* Data quality validation
* Preparation for dashboard and analytics consumption

### Implemented Capabilities

The current implementation includes:

* GTFS Realtime vehicle data ingestion
* PostgreSQL raw data storage
* Airflow pipeline orchestration
* dbt staging and analytical models
* Analytical data models:

  * fact_vehicle_positions
  * fact_vehicle_activity
  * dim_vehicle
* dbt data quality tests

### Process Goals

The project demonstrates:

* GitHub Projects Kanban workflow
* Issue-driven development
* Feature branches
* Pull Requests
* Documentation-first development
* Architecture Decision Records (ADR)
* Definition of Done (DoD)

---

# 4. Project Scope

## In Scope

The implemented MVP includes:

* Repository setup and documentation structure
* GitHub Project Kanban board
* System architecture documentation
* Data model design
* GTFS Realtime API ingestion pipeline
* PostgreSQL database environment
* Airflow workflow orchestration
* dbt transformation layer
* Analytical data models
* Data quality tests
* Complete project documentation

---

## Out of Scope

The following areas are considered future improvements:

* Full cloud deployment
* Advanced monitoring and observability
* Large-scale production infrastructure
* Complex machine learning solutions
* Advanced AI functionality
* Dashboard implementation
* Full CI/CD automation

These may be considered after the MVP has been completed.

---

# 5. MVP Definition

The Minimum Viable Product is considered complete when:

* Data can be extracted from an external source
* Data is stored reliably in PostgreSQL
* Airflow orchestrates the pipeline workflow
* dbt transformations create analytical data models
* Data quality checks are implemented
* Documentation explains architecture and development process

The current MVP implementation fulfills these requirements.

---

# 6. Technical Overview

The implemented architecture follows this data flow:

```text
External API (GTFS Realtime)
          |
          v
Data Ingestion (Python)
          |
          v
PostgreSQL Raw Layer
          |
          v
Apache Airflow Orchestration
          |
          v
dbt Transformations
(Staging + Analytics Models)
          |
          v
Analytical Data Models
          |
          v
Future BI Dashboard
```

The architecture separates:

* Data collection
* Data storage
* Workflow management
* Data transformation
* Analytical consumption

---

# 7. Development Process

The project follows an agile development approach using GitHub Projects as a Kanban board.

## Workflow

Tasks are managed through GitHub Issues and progress through:

```text
Backlog → Ready → In Progress → In Review → Done
```

## Version Control Strategy

The project uses:

* Feature branches for development
* Pull Requests before merging
* Clear commit messages
* Documentation updates as part of development

## Definition of Done

A task is considered complete when:

* The implementation works as expected
* Code quality requirements are fulfilled
* Documentation is updated when required
* Relevant tests pass
* Changes have been reviewed
* The related issue can be closed

---

# 8. Timeline and Milestones

The project was planned as a 14-day development cycle.

The first phases focused on implementing the core pipeline. Remaining time is used for improvements, documentation, testing, and optional extensions.

---

## Phase 1: Foundation and Planning

### Goals

* Establish project structure
* Create documentation foundation
* Define architecture and data model

### Deliverables

* GitHub repository setup
* GitHub Projects Kanban board
* Project Plan
* Delivery Process
* Initial README
* System architecture design
* Data model design

Status:

Completed

---

## Phase 2: Data Pipeline Development

### Goals

* Build a working data pipeline
* Connect external data source to database
* Create automated workflow execution

### Deliverables

* GTFS Realtime ingestion script
* PostgreSQL environment
* Raw data storage
* Airflow DAG orchestration
* dbt project setup
* Transformation models

Status:

Completed

---

## Phase 3: Data Quality and Transformation

### Goals

* Improve reliability and analytical usability

### Deliverables

* dbt staging models
* Analytical fact and dimension models
* dbt tests
* Data validation

Status:

Completed

---

## Phase 4: Finalization and Improvements

### Goals

* Improve project quality
* Prepare portfolio presentation

### Deliverables

* Updated README
* Architecture Decision Records
* Additional documentation
* Optional dashboard
* CI/CD implementation
* Final review

Status:

In progress

---

# 9. Project Deliverables

The repository contains:

## Documentation

* README.md
* Project Plan
* Delivery Process
* System Architecture
* Data Model
* ADR documentation
* Test Strategy
* CI/CD documentation

## Technical Implementation

* Python data ingestion pipeline
* PostgreSQL database
* Airflow DAG orchestration
* dbt models
* Data quality tests

## Future Improvements

* GitHub Actions CI/CD workflow
* Dashboard implementation
* Cloud deployment
* Advanced monitoring

---

# 10. Risks and Mitigation

| Risk                    | Impact                         | Mitigation                                            |
| ----------------------- | ------------------------------ | ----------------------------------------------------- |
| API availability issues | Pipeline development delayed   | Use reliable data source and implement error handling |
| Limited project time    | Features may remain incomplete | Prioritize MVP functionality                          |
| Data quality problems   | Incorrect analytics results    | Implement dbt validation tests                        |
| Technical complexity    | Development slowdown           | Build incrementally and document decisions            |
| Environment differences | Setup problems                 | Use Docker-based development environment              |

---

# 11. Success Criteria

The project is successful when it demonstrates:

* A complete end-to-end data engineering workflow
* Reliable and tested data transformations
* Professional development practices
* Clear technical documentation
* Reproducible development workflows
* A repository structure suitable for portfolio presentation

The final result demonstrates both technical capability and understanding of modern data engineering workflows.