import { createFileRoute } from "@tanstack/react-router";
import { VehicleListPage } from "@/pages/vehicle-list/ui/VehicleListPage";

export const Route = createFileRoute("/vehicles")({
  component: VehicleListPage,
});
