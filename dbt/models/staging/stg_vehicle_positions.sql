with source as (

    select *
    from raw_vehicle_positions

),

staged as (

    select
        vehicle_id,
        trip_id,
        latitude,
        longitude,
        bearing,
        speed,
        to_timestamp(timestamp) as recorded_at,
        current_status,
        ingested_at

    from source

)

select *
from staged