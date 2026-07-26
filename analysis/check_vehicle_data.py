import requests
from datetime import datetime, timezone

data = requests.get(
    "http://localhost:8000/vehicles/latest"
).json()

timestamps = [
    datetime.fromisoformat(
        v["recorded_at"].replace("Z", "+00:00")
    )
    for v in data
]

print("Antal fordon:", len(data))
print("Senaste observation:", max(timestamps))
print("Äldsta observation:", min(timestamps))

from datetime import datetime, timezone

now = datetime.now(timezone.utc)

for minutes in [5, 10, 15, 30, 60]:
    active = sum(
        (now - t).total_seconds() < minutes * 60
        for t in timestamps
    )

    print(
        f"Aktiva senaste {minutes} min:",
        active
    )