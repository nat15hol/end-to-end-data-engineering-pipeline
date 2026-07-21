import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

TRAFIKLAB_API_KEY = os.getenv("TRAFIKLAB_API_KEY")

if not TRAFIKLAB_API_KEY:
    raise ValueError("TRAFIKLAB_API_KEY is not set in .env")