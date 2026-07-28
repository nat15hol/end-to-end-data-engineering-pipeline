from fastapi.testclient import TestClient

from api.main import app
from api import main


client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Fleet Intelligence API running"
    }


def test_latest_vehicles(monkeypatch):
    mock_vehicles = [
        {
            "vehicle_id": "123",
            "trip_id": "trip_001",
            "recorded_at": "2026-07-28T21:00:00",
            "latitude": 55.605,
            "longitude": 13.003,
            "speed": 12.5,
            "bearing": 90.0,
            "current_status": 1
        }
    ]

    monkeypatch.setattr(
        main,
        "get_latest_vehicle_positions",
        lambda: mock_vehicles
    )

    response = client.get("/vehicles/latest")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["vehicle_id"] == "123"
    assert data[0]["latitude"] == 55.605
    
def test_vehicle_history(monkeypatch):
    mock_history = [
        {
            "vehicle_id": "123",
            "trip_id": "trip_001",
            "recorded_at": "2026-07-28T21:00:00",
            "latitude": 55.605,
            "longitude": 13.003,
            "speed": 12.5,
            "bearing": 90.0,
            "current_status": 1
        }
    ]

    monkeypatch.setattr(
        main,
        "get_vehicle_history",
        lambda vehicle_id: mock_history
    )

    response = client.get("/vehicles/123/history")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["vehicle_id"] == "123"
    assert data[0]["trip_id"] == "trip_001"