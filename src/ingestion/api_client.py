import logging

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from google.transit import gtfs_realtime_pb2

from src.ingestion.config import TRAFIKLAB_API_KEY


logger = logging.getLogger(__name__)

BASE_URL = "https://opendata.samtrafiken.se/gtfs-rt/{operator}/VehiclePositions.pb"

REQUEST_TIMEOUT_SECONDS = 30


def create_session():
    retry_strategy = Retry(
        total=3,
        backoff_factor=2,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )

    adapter = HTTPAdapter(max_retries=retry_strategy)

    session = requests.Session()
    session.mount("https://", adapter)

    return session


def fetch_vehicle_positions(operator: str = "skane"):
    """
    Fetch vehicle positions from Trafiklab's GTFS Regional Realtime API.
    """

    url = BASE_URL.format(operator=operator)

    session = create_session()

    try:
        logger.info("Fetching vehicle positions for operator=%s", operator)

        response = session.get(
            url,
            params={"key": TRAFIKLAB_API_KEY},
            timeout=REQUEST_TIMEOUT_SECONDS
        )

        response.raise_for_status()

        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)

        logger.info(
            "Successfully fetched %s entities",
            len(feed.entity)
        )

        return feed

    except requests.RequestException:
        logger.exception(
            "Failed fetching vehicle positions for operator=%s",
            operator
        )
        raise