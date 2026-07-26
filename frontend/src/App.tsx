import { useEffect, useState } from "react";
import VehicleTable from "./components/VehicleTable";
import VehicleHistory from "./components/VehicleHistory";
import { VehicleStats } from "./components/VehicleStats";
import { VehicleMap } from "./components/VehicleMap";
import { fetchLatestVehicles } from "./api/vehicles";
import type { VehiclePosition } from "./types/vehicle";
import "./App.css";

function App() {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial laddning
  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setError(null);

    fetchLatestVehicles()
      .then((data) => {
        if (!isCancelled) {
          setVehicles(data);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError(
            "Kunde inte hämta fordonsdata. Kontrollera att API:et körs."
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Auto-refresh var 10:e sekund
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestVehicles()
        .then((data) => {
          setVehicles(data);
        })
        .catch((err) => {
          console.error("Auto refresh failed:", err);
        });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const selectedVehicle = vehicles.find(
    (v) => v.vehicle_id === selectedVehicleId
  );

  return (
    <div className="app">
      <h1>Vehicle Monitoring Dashboard</h1>

      {isLoading && <p>Laddar fordon...</p>}

      {error && <p className="app__error">{error}</p>}

      {!isLoading && !error && (
        <>
          <VehicleStats vehicles={vehicles} />

          {/* Kartvy högst upp i huvudinnehållet */}
          <div className="app__map-section">
            <VehicleMap
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
            />
          </div>

          <div className="app__split-view">
            <VehicleTable
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
            />

            <VehicleHistory
              vehicleId={selectedVehicleId}
              selectedVehicle={selectedVehicle}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
