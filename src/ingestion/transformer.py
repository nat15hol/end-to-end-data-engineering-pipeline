def extract_vehicle_positions(feed):
    vehicles = []

    for entity in feed.entity:
        if not entity.HasField("vehicle"):
            continue

        vehicle = entity.vehicle

        vehicles.append(
            {
                "vehicle_id": vehicle.vehicle.id,
                "trip_id": vehicle.trip.trip_id,
                "latitude": vehicle.position.latitude,
                "longitude": vehicle.position.longitude,
                "bearing": vehicle.position.bearing,
                "speed": vehicle.position.speed,
                "timestamp": vehicle.timestamp,
                "current_status": vehicle.current_status,
            }
        )

    return vehicles