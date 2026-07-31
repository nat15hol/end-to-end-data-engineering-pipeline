import logging

from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from api.database import engine

logger = logging.getLogger(__name__)


def get_latest_vehicle_positions():

    query = text("""
        SELECT *
        FROM fact_vehicle_latest_position
    """)

    try:
        with engine.connect() as connection:
            result = connection.execute(query)

            vehicles = [
                dict(row._mapping)
                for row in result
            ]
    except SQLAlchemyError:
        logger.exception("Database error while fetching latest vehicle positions")
        raise HTTPException(
            status_code=503,
            detail="Unable to fetch vehicle positions right now. Please try again shortly."
        )

    return vehicles


def get_vehicle_history(vehicle_id):

    query = text("""
        SELECT *
        FROM fact_vehicle_positions
        WHERE vehicle_id = :vehicle_id
        ORDER BY recorded_at
    """)

    try:
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
    except SQLAlchemyError:
        logger.exception(
            "Database error while fetching vehicle history for vehicle_id=%s",
            vehicle_id
        )
        raise HTTPException(
            status_code=503,
            detail="Unable to fetch vehicle history right now. Please try again shortly."
        )

    return positions