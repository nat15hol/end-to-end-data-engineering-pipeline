from api_client import fetch_vehicle_positions


def main():
    feed = fetch_vehicle_positions()

    print(f"Number of vehicle entities: {len(feed.entity)}")


if __name__ == "__main__":
    main()