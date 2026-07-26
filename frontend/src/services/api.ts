import type { Vehicle } from "../types/vehicle";

const API_URL = "http://localhost:8000";

export async function getLatestVehicles(): Promise<Vehicle[]> {
  const response = await fetch(`${API_URL}/vehicles/latest`);

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  return response.json();
}