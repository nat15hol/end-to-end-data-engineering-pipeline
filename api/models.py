from pydantic import BaseModel
from datetime import datetime


class VehiclePosition(BaseModel):
    vehicle_id: str
    trip_id: str
    recorded_at: datetime
    latitude: float
    longitude: float
    speed: float
    bearing: float
    current_status: int