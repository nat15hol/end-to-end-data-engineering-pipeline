export interface VehiclePosition {
  vehicle_id: string;
  trip_id: string;
  recorded_at: string;
  latitude: number;
  longitude: number;
  speed: number;
  bearing: number;
  current_status: number;
}