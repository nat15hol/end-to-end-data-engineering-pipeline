# Delivery Process

## 1. Overview

This document describes how the project is developed, managed, and delivered.

The purpose is to establish a professional and reproducible development workflow where planning, implementation, testing, and documentation are integrated throughout the project lifecycle.

The project follows an agile workflow using GitHub Projects, Issues, feature branches, Pull Requests, and continuous documentation.

The development process supports the implementation of:

* Data ingestion pipelines
* Database development
* Workflow orchestration
* Data transformation
* Data quality validation
* Technical documentation

---

# 2. Development Methodology

The project uses a lightweight agile approach based on Kanban.

Work is managed through a GitHub Projects board where every task is represented as an Issue.

The workflow is:

```
Backlog → Ready → In Progress → In Review → Done
```

Each Issue should represent a clear piece of work with:

* A defined purpose
* A description
* Relevant labels
* Clear acceptance criteria when applicable

Examples of project work items:

* API ingestion development
* PostgreSQL database configuration
* Airflow pipeline orchestration
* dbt model development
* Data quality validation
* Documentation updates

---

# 3. Git Strategy

The project follows a feature branch workflow.

The main branch represents the stable version of the project.

Development work should be performed in separate branches.

## Branch Structure

```
main
 |
 └── feature/*
```

## Branch Naming Convention

Branches should follow this format:

```
feature/<short-description>
```

Examples:

```
feature/api-ingestion
feature/postgres-integration
feature/airflow-pipeline
feature/dbt-models
feature/data-quality-tests
feature/add-ci-pipeline
```

---

# 4. Commit Guidelines

Commits should be small, focused, and describe the change clearly.

Examples:

```
Create initial project plan
Add PostgreSQL docker configuration
Implement API ingestion script
Add Airflow DAG orchestration
Create dbt staging models
Add dbt data quality tests
Update project documentation
```

Commits should avoid:

* Large unrelated changes
* Unclear messages
* Temporary debugging code

---

# 5. Pull Request Process

All significant changes should be reviewed before being merged.

The Pull Request process:

1. Create a feature branch
2. Implement the change
3. Test locally
4. Create a Pull Request
5. Review changes
6. Merge after approval

Pull Requests should include:

* Description of the change
* Related Issue reference
* Testing performed
* Any important decisions or limitations

Example:

```
Closes #12
```

---

# 6. Issue Management

Issues are used to plan and track project work.

Each Issue should contain:

* Title
* Description
* Label
* Acceptance criteria when relevant

Examples of labels:

| Label           | Purpose                |
| --------------- | ---------------------- |
| `documentation` | Documentation tasks    |
| `feature`       | New functionality      |
| `database`      | Database-related work  |
| `ingestion`     | Data collection        |
| `airflow`       | Workflow orchestration |
| `dbt`           | Data transformation    |
| `testing`       | Quality assurance      |
| `ci/cd`         | Automation             |
| `bug`           | Problem fixing         |

---

# 7. Definition of Done

A task is considered complete when the following criteria are fulfilled.

## Code Quality

* Code follows project standards
* No sensitive information is stored in the repository
* Changes have been tested locally

## Data Engineering Requirements

* Data ingestion logic is documented
* Database changes are documented
* Airflow workflows are tested
* dbt models contain appropriate documentation
* Data quality tests are implemented where applicable

## Testing

* Relevant tests pass
* No known issues remain
* CI checks pass when CI/CD automation is implemented

## Documentation

* Documentation is updated if the change affects architecture, usage, or workflow

## Version Control

* Changes are committed
* Pull Request process is followed when applicable
* Related Issue is updated

---

# 8. Documentation Process

Documentation is treated as part of development, not as a final step.

Important project documents include:

```
docs/

├── project_plan.md
├── delivery_process.md
├── system_architecture.md
├── data_model.md
├── test_strategy.md
├── ci_cd.md
└── adr/
```

Technical decisions are documented using Architecture Decision Records (ADR).

---

# 9. Development Principles

The project follows these principles:

## Documentation First

Important decisions and architecture choices should be documented before implementation.

## Automation Where Possible

Repeated manual processes should be automated through tools such as:

* Apache Airflow
* dbt tests
* GitHub Actions
* Automated validation

## Reproducibility

The project should be possible to set up and run by another developer using the provided documentation.

## Incremental Delivery

The project is developed in small, working increments rather than one large final delivery.

---

# 10. Quality Goals

The project aims to demonstrate:

* Professional software development practices
* Reliable data pipelines
* Clear architecture decisions
* Automated quality assurance
* Maintainable documentation
* Reproducible development workflows

The delivery process should make the project understandable, reproducible, and suitable as a professional Data Engineering portfolio project.