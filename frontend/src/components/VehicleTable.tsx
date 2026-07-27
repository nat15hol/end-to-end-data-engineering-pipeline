import { useEffect, useMemo, useRef, useState } from "react";
import type { VehiclePosition } from "../types/vehicle";
import "./VehicleTable.css";

// Tröskel för vad som räknas som färsk data (5 minuter = 300 sekunder)
const FRESH_DATA_THRESHOLD_SECONDS = 5 * 60;

type SortField = "vehicle_id" | "speed" | "recorded_at";
type SortDirection = "asc" | "desc";

interface VehicleTableProps {
  vehicles: VehiclePosition[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string) => void;
}

function formatTimeAgo(isoString: string, nowTimestamp: number): string {
  const date = new Date(isoString);
  const seconds = Math.floor((nowTimestamp - date.getTime()) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function VehicleTable({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: VehicleTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "moving" | "idle">("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "recent" | "stale">("all");

  // Sorterings-state (Standard: Sortera på senast sedd, nyast först)
  const [sortField, setSortField] = useState<SortField>("recorded_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Håller koll på nuvarande tid för realtidssekunder
  const [now, setNow] = useState<number>(() => Date.now());

  // 1. Ref-map för tabellrader
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Auto-scrolla till valt fordon när selectedVehicleId ändras
  useEffect(() => {
    if (selectedVehicleId && rowRefs.current[selectedVehicleId]) {
      rowRefs.current[selectedVehicleId]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest", // Scrollar ENDAST om raden inte redan är synlig!
      });
    }
  }, [selectedVehicleId]);

  // Hantera klick på kolumnrubriker
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "recorded_at" || field === "speed" ? "desc" : "asc");
    }
  };

  const filteredAndSortedVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    // 1. Filtrering
    const filtered = vehicles.filter((vehicle) => {
      const matchesSearch =
        !query || vehicle.vehicle_id.toLowerCase().includes(query);

      const speedKmh = vehicle.speed * 3.6;
      const isMoving = speedKmh > 2.0;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "moving" && isMoving) ||
        (statusFilter === "idle" && !isMoving);

      const secondsAgo = (now - new Date(vehicle.recorded_at).getTime()) / 1000;
      const matchesTime =
        timeFilter === "all" ||
        (timeFilter === "recent" && secondsAgo < FRESH_DATA_THRESHOLD_SECONDS) ||
        (timeFilter === "stale" && secondsAgo >= FRESH_DATA_THRESHOLD_SECONDS);

      return matchesSearch && matchesStatus && matchesTime;
    });

    // 2. Sortering
    return [...filtered].sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (sortField === "recorded_at") {
        aVal = new Date(a.recorded_at).getTime();
        bVal = new Date(b.recorded_at).getTime();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [vehicles, search, statusFilter, timeFilter, now, sortField, sortDirection]);

  // Hjälpfunktion för att visa sorteringsindikator
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="sort-icon sort-icon--idle">↕</span>;
    return <span className="sort-icon">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="vehicle-table">
      {/* Kontroller: Sökfält och Dropplistor */}
      <div className="vehicle-table__controls">
        <input
          type="text"
          className="vehicle-table__search"
          placeholder="Search by vehicle ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="vehicle-table__select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "moving" | "idle")
          }
        >
          <option value="all">All Statuses</option>
          <option value="moving">🟢 Moving</option>
          <option value="idle">⚪ Idle</option>
        </select>

        <select
          className="vehicle-table__select"
          value={timeFilter}
          onChange={(e) =>
            setTimeFilter(e.target.value as "all" | "recent" | "stale")
          }
        >
          <option value="all">All Data Freshness</option>
          <option value="recent">⏱️ Fresh Data (&lt; 5m)</option>
          <option value="stale">⌛ Stale Data (≥ 5m)</option>
        </select>
      </div>

      <p className="vehicle-table__count">
        Showing <strong>{filteredAndSortedVehicles.length}</strong> of {vehicles.length}{" "}
        vehicles
      </p>

      <div className="vehicle-table__scroll-container">
        <table>
          <thead>
            <tr>
              <th className="vehicle-table__th">Vehicle ID</th>
              <th
                className="vehicle-table__th vehicle-table__th--sortable"
                onClick={() => handleSort("speed")}
              >
                Speed {renderSortIcon("speed")}
              </th>
              <th
                className="vehicle-table__th vehicle-table__th--sortable"
                onClick={() => handleSort("recorded_at")}
              >
                Last seen {renderSortIcon("recorded_at")}
              </th>
              <th className="vehicle-table__th">Coordinates</th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedVehicles.map((vehicle) => {
              const speedKmh = vehicle.speed > 0 ? vehicle.speed * 3.6 : 0;
              const isMoving = speedKmh > 2.0;
              const isSelected = vehicle.vehicle_id === selectedVehicleId;

              return (
                <tr
                  key={vehicle.vehicle_id}
                  // 3. Koppla ref till denna specifika rad
                  ref={(el) => {
                    rowRefs.current[vehicle.vehicle_id] = el;
                  }}
                  className={`vehicle-table__row ${
                    isSelected ? "vehicle-table__row--selected" : ""
                  }`}
                  onClick={() => onSelectVehicle(vehicle.vehicle_id)}
                >
                  <td className="vehicle-table__id">{vehicle.vehicle_id}</td>

                  <td>
                    <span
                      className={`speed-badge ${
                        isMoving ? "speed-badge--moving" : "speed-badge--idle"
                      }`}
                    >
                      <span className="speed-badge__dot"></span>
                      {speedKmh.toFixed(1)} km/h
                    </span>
                  </td>

                  <td title={new Date(vehicle.recorded_at).toLocaleString()}>
                    {formatTimeAgo(vehicle.recorded_at, now)}
                  </td>

                  <td className="vehicle-table__coords">
                    {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                  </td>
                </tr>
              );
            })}

            {filteredAndSortedVehicles.length === 0 && (
              <tr>
                <td colSpan={4} className="vehicle-table__empty">
                  No vehicles match the search or filter query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VehicleTable;