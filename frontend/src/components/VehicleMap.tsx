import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { VehiclePosition } from '../types/vehicle';

// Fix för Leaflets standardikoner i Vite/React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface VehicleMapProps {
  vehicles: VehiclePosition[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
}

export const VehicleMap = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: VehicleMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // 1. Initialisera kartan
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Skåne (t.ex. Hässleholm/Lund-området)
    const map = L.map(mapContainerRef.current).setView([55.8, 13.5], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Uppdatera markörer när vehicles ändras
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Rensa gamla markörer
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    vehicles.forEach((vehicle) => {
      const lat = vehicle.latitude;
      const lng = vehicle.longitude;
      const vehicleId = vehicle.vehicle_id;

      if (lat === undefined || lng === undefined || !vehicleId) return;

      const speedKmh = (vehicle.speed * 3.6).toFixed(1);
      const isMoving = vehicle.speed * 3.6 > 2.0;

      const marker = L.marker([lat, lng], { icon: DefaultIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; line-height: 1.4;">
            <strong style="font-size: 1.05rem;">Fordon: ${vehicleId}</strong><br/>
            <span>Hastighet: ${speedKmh} km/h</span><br/>
            <span>Status: ${isMoving ? '🟢 I rörelse' : '⚪ Stillastående'}</span><br/>
            <small style="color: #6b7280;">Senast: ${new Date(vehicle.recorded_at).toLocaleTimeString()}</small>
          </div>
        `);

      marker.on('click', () => {
        onSelectVehicle(vehicleId);
      });

      markersRef.current[vehicleId] = marker;
    });
  }, [vehicles, onSelectVehicle]);

  // 3. Animera kartan till valt fordon (flyTo) och öppna dess popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedVehicleId) return;

    const selectedVehicle = vehicles.find((v) => v.vehicle_id === selectedVehicleId);

    if (selectedVehicle) {
      const lat = selectedVehicle.latitude;
      const lng = selectedVehicle.longitude;

      if (lat !== undefined && lng !== undefined) {
        map.flyTo([lat, lng], 14, {
          duration: 1.2,
        });

        const marker = markersRef.current[selectedVehicleId];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }, [selectedVehicleId, vehicles]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        zIndex: 1,
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    />
  );
};