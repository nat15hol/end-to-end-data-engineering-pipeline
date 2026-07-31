CREATE TABLE IF NOT EXISTS raw_vehicle_positions (
    id SERIAL PRIMARY KEY,
    vehicle_id TEXT,
    trip_id TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    bearing DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    timestamp BIGINT,
    current_status INTEGER,
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_vehicle_positions_vehicle_id_timestamp UNIQUE (vehicle_id, timestamp)
);