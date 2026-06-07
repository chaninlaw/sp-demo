import { createFileRoute } from "@tanstack/react-router";
import { MapViewPage } from "@/pages/map-view/ui/MapViewPage";

export const Route = createFileRoute("/map")({
  component: MapViewPage,
});
