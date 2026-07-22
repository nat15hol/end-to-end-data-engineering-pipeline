from src.database.connection import get_connection


def insert_vehicle_positions(vehicles):
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

    for vehicle in vehicles:
        cursor.execute(
            query,
            (
                vehicle["vehicle_id"],
                vehicle["trip_id"],
                vehicle["latitude"],
                vehicle["longitude"],
                vehicle["bearing"],
                vehicle["speed"],
                vehicle["timestamp"],
                vehicle["current_status"],
            ),
        )

    conn.commit()

    cursor.close()
    conn.close()

    print(f"Inserted {len(vehicles)} vehicle positions")