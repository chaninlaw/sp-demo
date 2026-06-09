import { Suspense, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import maplibregl from "maplibre-gl";
import { vehicleQueryOptions } from "@/shared/lib/polling";
import { Skeleton } from "@/shared/ui/skeleton";
import { QueryErrorBoundary } from "@/shared/ui/query-error-boundary";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/shared/ui/map";
import { useMapFilters } from "../model/map-filters";
import { MapFilters } from "./MapFilters";
import { VehicleMarkerIcon, VehiclePopupContent } from "./VehicleMarker";
import type { Vehicle } from "@/entities/vehicle";

const THAILAND_CENTER: [number, number] = [100.5018, 13.7563];

function MapBoundsFitter({ vehicles }: { vehicles: Vehicle[] }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || vehicles.length === 0) return;
    const lngs = vehicles.map((v) => v.lng);
    const lats = vehicles.map((v) => v.lat);
    const bounds = new maplibregl.LngLatBounds(
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    );
    map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 600 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return null;
}

function MapContent() {
  const { data: vehicles } = useSuspenseQuery(vehicleQueryOptions);
  const { activeFilter, setActiveFilter } = useMapFilters();

  const filtered =
    activeFilter === "all"
      ? vehicles
      : vehicles.filter((v) => v.type === activeFilter);

  return (
    <div className="relative h-[calc(100dvh-var(--header-height)-var(--bottom-nav-height))]">
      <Map
        className="w-full h-full"
        center={THAILAND_CENTER}
        zoom={10}
        maplibreLogo={false}
      >
        <MapBoundsFitter vehicles={vehicles} />
        <MapControls position="bottom-right" showZoom />
        {filtered.map((vehicle) => (
          <MapMarker
            key={vehicle.id}
            longitude={vehicle.lng}
            latitude={vehicle.lat}
            anchor="bottom"
          >
            <MarkerContent>
              <VehicleMarkerIcon vehicle={vehicle} />
            </MarkerContent>
            <MarkerPopup closeButton className="p-4">
              <VehiclePopupContent vehicle={vehicle} />
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>

      {/* Filter bar */}
      <div className="absolute top-3 left-0 right-0 z-10 px-3">
        <MapFilters activeFilter={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* Vehicle count pill */}
      <div className="absolute bottom-4 left-3 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/85 backdrop-blur-md border border-border rounded-full shadow-lg">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
          <span className="text-[11px] font-mono text-foreground tracking-widest">
            {filtered.length} คัน
          </span>
        </div>
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="relative bg-muted h-[calc(100dvh-var(--header-height)-var(--bottom-nav-height))]">
      <Skeleton className="w-full h-full rounded-none" />
      <div className="absolute top-3 left-0 right-0 px-3 flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
        ))}
      </div>
    </div>
  );
}

export function MapViewPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<MapSkeleton />}>
        <MapContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
