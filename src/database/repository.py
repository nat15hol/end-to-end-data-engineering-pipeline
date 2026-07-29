import logging

from src.database.connection import get_connection

logger = logging.getLogger(__name__)


def insert_vehicle_positions(vehicles):
    if not vehicles:
        logger.info("No vehicle positions to insert")
        return

    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO raw_vehicle_positions (
            vehicle_id,
            trip_id,
            latitude,
            longitude,
            bearing,
            speed,
            timestamp,
            current_status
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """

    values = [
        (
            vehicle["vehicle_id"],
            vehicle["trip_id"],
            vehicle["latitude"],
            vehicle["longitude"],
            vehicle["bearing"],
            vehicle["speed"],
            vehicle["timestamp"],
            vehicle["current_status"],
        )
        for vehicle in vehicles
    ]

    try:
        cursor.executemany(query, values)
        conn.commit()

        logger.info("Inserted %s vehicle positions", len(vehicles))

    except Exception:
        conn.rollback()
        logger.exception("Failed inserting vehicle positions")
        raise

    finally:
        cursor.close()
        conn.close()