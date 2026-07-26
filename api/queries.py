from sqlalchemy import text

from database import engine


def get_latest_vehicle_positions():

    query = text("""
        SELECT *
        FROM fact_vehicle_latest_position
    """)

    with engine.connect() as connection:
        result = connection.execute(query)

        vehicles = [
            dict(row._mapping)
            for row in result
        ]

    return vehicles


def get_vehicle_history(vehicle_id):

    query = text("""
        SELECT *
        FROM fact_vehicle_positions
        WHERE vehicle_id = :vehicle_id
        ORDER BY recorded_at
    """)

    with engine.connect() as connection:
        result = connection.execute(
            query,
            {
                "vehicle_id": vehicle_id
            }
        )

        positions = [
            dict(row._mapping)
            for row in result
        ]

    return positions