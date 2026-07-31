# Engineering Review & Future Improvements

> **What this is:** A structured self-review of the codebase's architecture, robustness,
> and readiness for scale, produced as part of the project's development process. This
> is a point-in-time snapshot (2026-07), not a living document — see
> [Known Limitations](../known-limitations.md) for the current, maintained list of gaps.

## Summary

This is a working end-to-end pipeline that pulls real-time vehicle position data from
Trafiklab's GTFS-RT feed (Skåne), stores raw data in PostgreSQL, transforms it through
dbt into dimensional/fact models, exposes it via FastAPI, and visualizes it in a React
dashboard, orchestrated with Airflow.

The architecture is cleanly layered
(`src/ingestion` → `src/database` → `dbt/` → `api/` → `frontend/`), and CI
(`.github/workflows/ci.yml`) runs real checks — tests, dbt runs, linting, a Docker
build, and dependency auditing via `pip-audit` — rather than just reporting a status
badge.

The main strength is that the whole system actually holds together end-to-end for a
solo project. The main open risk is production hardening: deduplication, deployment
automation, API error handling, and pagination are not yet in place.

## Architecture

```text
Trafiklab GTFS-RT API → Python ingestion (api_client.py, retry+backoff)
  → PostgreSQL raw_vehicle_positions
  → dbt staging (stg_vehicle_positions) → dbt marts (dim_vehicle,
     fact_vehicle_positions, fact_vehicle_activity, fact_vehicle_latest_position)
  → FastAPI (queries.py, parameterized SQL via SQLAlchemy)
  → React/TypeScript dashboard (Leaflet map, table, history view)
```

Orchestration is handled by an Airflow DAG (`airflow/dags/vehicle_pipeline_dag.py`).
The design is proportionate to the problem size — there's no sign of over-engineering,
and the layers are cleanly separated.

One detail worth calling out explicitly: `dbt/dbt_project.yml` sets
`+materialized: view` for all models. Since the marts are views rather than tables,
every dbt run and every API query against the analytical layer re-scans the raw table
in full — there's no materialized cache in between. This compounds the scaling
consideration described below.

## Pipeline design

**Ingestion** (`src/ingestion/api_client.py`) has real retry handling — `Retry`/
`HTTPAdapter`, exponential backoff on 429/5xx responses, a 30s timeout, and structured
logging on failure. Source fetching and transformation are cleanly separated;
`transformer.py` is side-effect free.

**Transformation** (`extract_vehicle_positions`) is deterministic and covered by tests,
including an edge case for a missing vehicle (`tests/test_transformer.py`). The dbt
models themselves are simple, readable SQL layers.

**Loading** (`insert_vehicle_positions` in `repository.py`) uses `executemany` with
parameterized SQL and a `rollback()` on failure — solid handling for the current volume.

**Pipeline characteristics worth noting:** ingestion is append-only without
idempotency — `schema.sql` has no unique constraint on `(vehicle_id, timestamp)`, so a
retried Airflow task can duplicate data. Materialization is `view`, not `incremental`.
Schema evolution and formal data contracts aren't in place, which is reasonable at the
current scale.

## What would break first at 10x data volume

Two connected bottlenecks, both confirmed in code:

1. `raw_vehicle_positions` (`src/database/schema.sql`) has no partitioning or indexing
   beyond the primary key, and grows without any retention policy.
2. Because the marts are views (`dbt/dbt_project.yml`), every dbt run and every API
   query effectively scans the entire raw table. At 10x volume, this means every
   dashboard request gets more expensive, not just ingestion.

Secondarily, `get_vehicle_history` in `api/queries.py` has no `LIMIT`, so it becomes a
growing-response bottleneck for vehicles with long history.

## Strengths

- **`src/ingestion/api_client.py`** — a genuine retry strategy (`Retry`/`HTTPAdapter`,
  backoff on 429/5xx), timeout handling, and structured logging.
- **`.github/workflows/ci.yml`** — runs pytest, dbt run/test, ESLint, a Docker build,
  and `pip-audit` as separate jobs; unusually thorough for a solo project.
- **`api/database.py`** — validates required environment variables at startup and
  fails loudly with a clear error instead of silently falling back to `None`.
- **`README.md`** — includes an honest "Project Status" table that states plainly
  what is and isn't implemented.
- **`tests/test_api.py`** — uses `monkeypatch` to mock the database layer, keeping API
  tests fast and independent of a live database.

## Risks / open items

- `src/database/repository.py` — no unique constraint or dedupe on insert; a retried
  Airflow task can duplicate rows.
- `src/ingestion/main.py` — `print(vehicles[0])` raises an unhandled `IndexError` if a
  poll returns zero vehicles.
- `api/queries.py` — no `try/except` around `connection.execute()`; a database outage
  currently produces an unformatted 500 response.
- `api/queries.py`, `get_vehicle_history` — no `LIMIT`/pagination.
- No CD pipeline (also stated openly in the README's status table).

## Suggested priorities

**High priority**
- Add a unique constraint on `(vehicle_id, timestamp)` in `raw_vehicle_positions` to
  prevent duplicate inserts on Airflow retry.
- Guard against an empty `vehicles` list in `main.py`.
- Add `try/except` around database calls in `api/queries.py` to avoid unformatted
  500 responses.

**Medium priority**
- Add pagination to `get_vehicle_history`.
- Add partitioning/retention policy on `raw_vehicle_positions`, and evaluate
  `materialized='table'` or `incremental` in dbt ahead of any significant volume growth.
- Add volume/duplicate-detection dbt tests.
- Build out a CD pipeline.

**Lower priority**
- Replace remaining `print()` calls with structured logging (`main.py`,
  `create_tables.py`, `test_connection.py`, `analysis/check_vehicle_data.py`).
- Add an alerting hook (e.g. Slack/email) for Airflow task failures.

## Conclusion

The project holds up well against professional-quality expectations, with the main
gap being production hardening rather than fundamentals. The strongest points are the
retry logic in ingestion, the CI pipeline's thoroughness (including dependency
scanning), and clear, honest documentation. The main open items are ingestion
idempotency, API-layer error handling and pagination, and a partitioning/materialization
strategy ahead of scale.
