with positions as (

    select *
    from {{ ref('stg_vehicle_positions') }}

)

select
    vehicle_id,
    min(recorded_at) as first_seen,
    max(recorded_at) as last_seen

from positions

group by vehicle_id