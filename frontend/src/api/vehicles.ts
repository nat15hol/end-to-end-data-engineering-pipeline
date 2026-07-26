import type { VehiclePosition } from "../types/vehicle";

const API_BASE_URL = "http://localhost:8000";

export async function fetchLatestVehicles(): Promise<VehiclePosition[]> {
  const response = await fetch(`${API_BASE_URL}/vehicles/latest`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch latest vehicles: ${response.status}`
    );
  }

  return response.json();
}

export async function fetchVehicleHistory(
  vehicleId: string
): Promise<VehiclePosition[]> {
  const response = await fetch(
    `${API_BASE_URL}/vehicles/${vehicleId}/history`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch history for ${vehicleId}: ${response.status}`
    );
  }

  return response.json();
}