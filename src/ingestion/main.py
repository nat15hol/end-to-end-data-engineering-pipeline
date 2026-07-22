from src.ingestion.api_client import fetch_vehicle_positions
from src.ingestion.transformer import extract_vehicle_positions
from src.database.repository import insert_vehicle_positions


def main():
    feed = fetch_vehicle_positions()

    vehicles = extract_vehicle_positions(feed)

    print(f"Extracted vehicles: {len(vehicles)}")
    print(vehicles[0])

    insert_vehicle_positions(vehicles)


if __name__ == "__main__":
    main()