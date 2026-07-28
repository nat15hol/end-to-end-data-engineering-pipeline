from types import SimpleNamespace

from src.ingestion.transformer import extract_vehicle_positions


def test_extract_vehicle_positions():
    feed = SimpleNamespace(
        entity=[
            SimpleNamespace(
                vehicle=SimpleNamespace(
                    vehicle=SimpleNamespace(
                        id="BUS123"
                    ),
                    trip=SimpleNamespace(
                        trip_id="TRIP456"
                    ),
                    position=SimpleNamespace(
                        latitude=55.605,
                        longitude=13.003,
                        bearing=180,
                        speed=12.5,
                    ),
                    timestamp=1234567890,
                    current_status=1,
                ),
                HasField=lambda field: True,
            )
        ]
    )

    result = extract_vehicle_positions(feed)

    assert len(result) == 1
    assert result[0]["vehicle_id"] == "BUS123"
    assert result[0]["trip_id"] == "TRIP456"
    assert result[0]["latitude"] == 55.605
    assert result[0]["longitude"] == 13.003


def test_extract_vehicle_positions_ignores_missing_vehicle():
    feed = SimpleNamespace(
        entity=[
            SimpleNamespace(
                HasField=lambda field: False
            )
        ]
    )

    result = extract_vehicle_positions(feed)

    assert result == []