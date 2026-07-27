import { useEffect, useState } from "react";
import type { VehiclePosition } from "../types/vehicle";
import { fetchVehicleHistory } from "../api/vehicles";
import "./VehicleHistory.css";

interface VehicleHistoryProps {
  vehicleId: string | null;
  selectedVehicle?: VehiclePosition;
}

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function VehicleHistory({ vehicleId, selectedVehicle }: VehicleHistoryProps) {
  const [history, setHistory] = useState<VehiclePosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicleId) {
      return;
    }

    let isCancelled = false;

    setIsLoading(true);
    setError(null);

    fetchVehicleHistory(vehicleId)
      .then((data) => {
        if (!isCancelled) {
          setHistory(data);
          setIsLoading(false);
          setError(null);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError("Failed to fetch vehicle history.");
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [vehicleId]);

  if (!vehicleId) {
    return (
      <div className="vehicle-history vehicle-history--empty">
        <p>Select a vehicle from the list to view details and history.</p>
      </div>
    );
  }

  const speedKmh = selectedVehicle ? (selectedVehicle.speed * 3.6) : 0;
  const isMoving = speedKmh > 2.0;

  return (
    <div className="vehicle-history">
      <h2>Vehicle Overview</h2>
      <p className="vehicle-history__id">{vehicleId}</p>

      {/* Selected Vehicle Info Card */}
      {selectedVehicle && (
        <div className="vehicle-history__summary-card">
          <div className="summary-item">
            <span className="summary-label">Status</span>
            <span className={`speed-badge ${isMoving ? "speed-badge--moving" : "speed-badge--idle"}`}>
              <span className="speed-badge__dot"></span>
              {isMoving ? "Moving" : "Idle"}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Speed</span>
            <span className="summary-value">{speedKmh.toFixed(1)} km/h</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Last Position</span>
            <span className="summary-value">
              {selectedVehicle.latitude.toFixed(4)}, {selectedVehicle.longitude.toFixed(4)}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Last Update</span>
            <span className="summary-value">{formatTimeAgo(selectedVehicle.recorded_at)}</span>
          </div>
        </div>
      )}

      <h3>Location History</h3>

      {isLoading && <p>Fetching history...</p>}

      {error && <p className="vehicle-history__error">{error}</p>}

      {!isLoading && !error && (
        <div className="vehicle-history__scroll-container">
          <table>
            <thead>
              <tr>
                <th>Recorded at</th>
                <th>Speed</th>
                <th>Coordinates</th>
              </tr>
            </thead>
            <tbody>
              {history.map((position, index) => (
                <tr key={`${position.recorded_at}-${index}`}>
                  <td>{new Date(position.recorded_at).toLocaleTimeString()}</td>
                  <td>{(position.speed * 3.6).toFixed(1)} km/h</td>
                  <td>
                    {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
                  </td>
                </tr>
              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan={3}>No history found for this vehicle.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VehicleHistory;