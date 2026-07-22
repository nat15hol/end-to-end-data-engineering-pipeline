import requests
from google.transit import gtfs_realtime_pb2

from src.ingestion.config import TRAFIKLAB_API_KEY


BASE_URL = "https://opendata.samtrafiken.se/gtfs-rt/{operator}/VehiclePositions.pb"

REQUEST_TIMEOUT_SECONDS = 30


def fetch_vehicle_positions(operator: str = "skane"):
    """
    Fetch vehicle positions from Trafiklab's GTFS Regional Realtime API.

    Args:
        operator: Trafiklab operator identifier (e.g. "skane", "sl").
    """
    url = BASE_URL.format(operator=operator)

    response = requests.get(
        url,
        params={"key": TRAFIKLAB_API_KEY},
        timeout=REQUEST_TIMEOUT_SECONDS
    )

    response.raise_for_status()

    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)

    return feed