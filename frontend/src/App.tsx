import { useEffect, useState } from "react";

type Vehicle = {
  vehicle_id: string;
  recorded_at: string;
  latitude: number;
  longitude: number;
};

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/vehicles/latest")
      .then((response) => response.json())
      .then((data) => setVehicles(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <h1>Vehicle Monitoring Dashboard</h1>

      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle.vehicle_id}>
            {vehicle.vehicle_id} - {vehicle.latitude}, {vehicle.longitude}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
