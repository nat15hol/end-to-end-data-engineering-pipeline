-- Migration: enforce uniqueness on (vehicle_id, timestamp) in raw_vehicle_positions
--
-- Context: Airflow task retries could previously insert the same vehicle position
-- more than once, since raw_vehicle_positions had no constraint beyond the
-- auto-incrementing id. This migration is safe to run multiple times.
--
-- Run manually against an existing database:
--   psql -h <host> -U <user> -d <db> -f src/database/migrations/001_add_unique_constraint_vehicle_positions.sql

BEGIN;

-- Step 1: remove duplicate rows, keeping the earliest-inserted row per
-- (vehicle_id, timestamp) pair. Uses id as the tiebreaker since it is
-- monotonically increasing (SERIAL).
DELETE FROM raw_vehicle_positions a
USING raw_vehicle_positions b
WHERE a.vehicle_id = b.vehicle_id
  AND a.timestamp = b.timestamp
  AND a.id > b.id;

-- Step 2: add the unique constraint, now that duplicates are gone.
-- IF NOT EXISTS guard so this migration is safe to re-run.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_vehicle_positions_vehicle_id_timestamp'
    ) THEN
        ALTER TABLE raw_vehicle_positions
            ADD CONSTRAINT uq_vehicle_positions_vehicle_id_timestamp
            UNIQUE (vehicle_id, timestamp);
    END IF;
END $$;

COMMIT;