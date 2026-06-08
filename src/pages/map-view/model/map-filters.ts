import { useState } from "react";
import type { VehicleType } from "@/entities/vehicle";

export type MapFilter = VehicleType | "all";

export function useMapFilters() {
  const [activeFilter, setActiveFilter] = useState<MapFilter>("all");
  return { activeFilter, setActiveFilter };
}
