import { Suspense, useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { vehicleQueryOptions } from "@/shared/lib/polling";
import { Skeleton } from "@/shared/ui/skeleton";
import { useMapFilters } from "../model/map-filters";
import { createMarkerElement, createPopupHTML } from "./VehicleMarker";
import { MapFilters } from "./MapFilters";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const THAILAND_CENTER: [number, number] = [100.5018, 13.7563];
const MAP_HEIGHT = "calc(100dvh - 64px)";

function MapContent() {
  const { data: vehicles } = useSuspenseQuery(vehicleQueryOptions);
  const { activeFilter, setActiveFilter } = useMapFilters();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Init map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: THAILAND_CENTER,
      zoom: 10,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left",
    );
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.once("load", () => setIsMapLoaded(true));
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
      setIsMapLoaded(false);
    };
  }, []);

  // Fit bounds to all vehicles once map loads
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded || vehicles.length === 0) return;

    const lngs = vehicles.map((v) => v.lng);
    const lats = vehicles.map((v) => v.lat);
    const bounds = new maplibregl.LngLatBounds(
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    );
    map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 600 });
  }, [isMapLoaded]); // intentionally runs only when map loads

  // Sync markers when vehicles or filter changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const filtered =
      activeFilter === "all"
        ? vehicles
        : vehicles.filter((v) => v.type === activeFilter);

    filtered.forEach((vehicle) => {
      const el = createMarkerElement(vehicle);
      const popup = new maplibregl.Popup({
        offset: [0, -40],
        closeButton: true,
        maxWidth: "260px",
      }).setHTML(createPopupHTML(vehicle));

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([vehicle.lng, vehicle.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.set(vehicle.id, marker);
    });
  }, [vehicles, activeFilter, isMapLoaded]);

  return (
    <div className="relative" style={{ height: MAP_HEIGHT }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 left-0 right-0 z-10 px-3">
        <MapFilters activeFilter={activeFilter} onChange={setActiveFilter} />
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="relative bg-muted" style={{ height: MAP_HEIGHT }}>
      <Skeleton className="w-full h-full rounded-none" />
      <div className="absolute top-3 left-0 right-0 px-3 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

export function MapViewPage() {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <MapContent />
    </Suspense>
  );
}
