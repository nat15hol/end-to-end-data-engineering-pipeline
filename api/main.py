from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from queries import (
    get_latest_vehicle_positions,
    get_vehicle_history
)

from models import VehiclePosition


app = FastAPI(
    title="Fleet Intelligence API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",  # <--- Lägg till din nuvarande port!
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Fleet Intelligence API running"
    }


@app.get(
    "/vehicles/latest",
    response_model=list[VehiclePosition]
)
def get_latest_vehicles():

    return get_latest_vehicle_positions()


@app.get("/vehicles/{vehicle_id}/history")
def get_vehicle_history_endpoint(vehicle_id: str):

    return get_vehicle_history(vehicle_id)