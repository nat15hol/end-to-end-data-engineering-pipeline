import requests

from config import TRAFIKLAB_API_KEY


BASE_URL = "https://api.resrobot.se/v2.1"


def get_data():
    headers = {
        "Authorization": f"Bearer {TRAFIKLAB_API_KEY}"
    }

    response = requests.get(
        BASE_URL,
        headers=headers
    )

    response.raise_for_status()

    return response.json()