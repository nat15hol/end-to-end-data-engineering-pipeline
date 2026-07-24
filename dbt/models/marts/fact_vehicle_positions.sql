with positions as (

    select *
    from {{ ref('stg_vehicle_positions') }}

)

select
    vehicle_id,
    trip_id,
    recorded_at,
    latitude,
    longitude,
    speed,
    bearing,
    current_status

from positions