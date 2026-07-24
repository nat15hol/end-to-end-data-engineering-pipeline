with positions as (

    select *
    from {{ ref('fact_vehicle_positions') }}

)

select
    date_trunc('hour', recorded_at) as activity_hour,
    count(distinct vehicle_id) as active_vehicles,
    count(*) as observations,
    avg(speed) as avg_speed,
    max(speed) as max_speed

from positions

group by 1
order by 1