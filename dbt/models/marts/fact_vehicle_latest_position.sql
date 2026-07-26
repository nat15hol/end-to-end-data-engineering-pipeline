with positions as (

    select *
    from {{ ref('fact_vehicle_positions') }}

),

ranked as (

    select
        *,
        row_number() over (
            partition by vehicle_id
            order by recorded_at desc
        ) as rn

    from positions

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

from ranked
where rn = 1