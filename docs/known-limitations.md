# Known Limitations

This document lists known gaps and edge cases in the current implementation. It is
maintained as a living document — items should be removed once fixed, not left to
go stale.

Last updated: 2026-08-01

## Analytics layer materialization

- **Marts are views, not tables.** `dbt/dbt_project.yml` sets `+materialized: view`
  for all models. This means every `dbt run` and every API query against the analytical
  layer re-scans `raw_vehicle_positions` in full — there is no materialized cache to
  fall back on. As the raw table grows, this makes both dbt runs and dashboard queries
  progressively more expensive. Moving to `table` or `incremental` materialization
  should be considered before scaling data volume significantly.

## Storage growth

- **No partitioning or retention policy.** `raw_vehicle_positions` has no partitioning
  and no retention/archival strategy, so it grows unbounded. Combined with the view-based
  marts above, this is the most likely first bottleneck under significantly higher data
  volume.

## API robustness

- **No pagination on vehicle history.** `get_vehicle_history` in `api/queries.py`
  returns the full position history for a vehicle in a single response, with no
  `LIMIT` or paging. Vehicles with long history will return increasingly large
  payloads over time.

## Testing coverage

- dbt tests currently cover `not_null`, `unique`, and `relationships` constraints, but
  there are no volume or duplicate-detection checks.
- Unit test coverage is solid for `transformer.py` and the API layer (with mocked DB
  access via `monkeypatch`), but there is no test coverage for `repository.py` or for
  ingestion-side failure handling.

## Operational maturity

- **No cloud deployment.** CI (`.github/workflows/ci.yml`) runs tests, dbt
  run/test, linting, and Docker build validation; `pip-audit` scans dependencies;
  and a separate workflow (`.github/workflows/publish-ghcr.yml`) builds and
  publishes the Airflow Docker image to GitHub Container Registry on merge to
  `main`. There is no automated deployment to a cloud environment yet. This is
  also noted in the README's Project Status table.
- **No alerting on pipeline failures.** Airflow DAG failures are not currently
  surfaced anywhere outside the Airflow UI.

---

For prioritized next steps addressing these items, see
[Future Improvements](../README.md#future-improvements) in the README and the
[technical review](reviews/technical-review-2026-07.md).