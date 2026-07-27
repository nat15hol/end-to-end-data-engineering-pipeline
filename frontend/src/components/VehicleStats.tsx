import { useMemo, useState, useEffect } from "react";
import type { VehiclePosition } from "../types/vehicle";
import "./VehicleStats.css";

// 5 minuter i millisekunder
const FRESH_THRESHOLD_MS = 5 * 60 * 1000;

interface VehicleStatsProps {
  vehicles: VehiclePosition[];
}

export function VehicleStats({ vehicles }: VehicleStatsProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000); // Uppdatera var 30:e sekund för att hålla tidsberäkningen färsk

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    let freshCount = 0;
    let staleCount = 0;
    let movingCount = 0;

    vehicles.forEach((v) => {
      // 1. Fresh vs Stale (< 5 minuter)
      const recordedTime = new Date(v.recorded_at).getTime();
      const ageInMs = now - recordedTime;

      if (ageInMs < FRESH_THRESHOLD_MS) {
        freshCount++;
      } else {
        staleCount++;
      }

      // 2. Moving vs Idle (> 2.0 km/h)
      const speedKmh = v.speed * 3.6;
      if (speedKmh > 2.0) {
        movingCount++;
      }
    });

    return {
      total: vehicles.length,
      fresh: freshCount,
      stale: staleCount,
      moving: movingCount,
    };
  }, [vehicles, now]);

  return (
    <div className="vehicle-stats">
      <div className="stat-card">
        <span className="stat-card__label">Total Vehicles</span>
        <span className="stat-card__value">{stats.total}</span>
      </div>

      <div className="stat-card stat-card--fresh">
        <span className="stat-card__label">Fresh Data (&lt; 5m)</span>
        <span className="stat-card__value">{stats.fresh}</span>
      </div>

      <div className="stat-card stat-card--stale">
        <span className="stat-card__label">Stale Data (≥ 5m)</span>
        <span className="stat-card__value">{stats.stale}</span>
      </div>

      <div className="stat-card stat-card--moving">
        <span className="stat-card__label">Moving Vehicles</span>
        <span className="stat-card__value">{stats.moving}</span>
      </div>
    </div>
  );
}