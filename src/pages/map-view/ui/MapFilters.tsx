import { Button } from "@/shared/ui/button";
import { VEHICLE_ICONS, VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import type { MapFilter } from "../model/map-filters";

const FILTERS: { value: MapFilter; label: string; icon: string }[] = [
  { value: "all", label: "ทั้งหมด", icon: "🗺️" },
  {
    value: "excavator",
    label: VEHICLE_LABELS.excavator,
    icon: VEHICLE_ICONS.excavator,
  },
  {
    value: "dump_truck",
    label: VEHICLE_LABELS.dump_truck,
    icon: VEHICLE_ICONS.dump_truck,
  },
  {
    value: "concrete_mixer",
    label: VEHICLE_LABELS.concrete_mixer,
    icon: VEHICLE_ICONS.concrete_mixer,
  },
  { value: "crane", label: VEHICLE_LABELS.crane, icon: VEHICLE_ICONS.crane },
  { value: "roller", label: VEHICLE_LABELS.roller, icon: VEHICLE_ICONS.roller },
  { value: "other", label: VEHICLE_LABELS.other, icon: VEHICLE_ICONS.other },
];

interface MapFiltersProps {
  activeFilter: MapFilter;
  onChange: (filter: MapFilter) => void;
}

export function MapFilters({ activeFilter, onChange }: MapFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {FILTERS.map(({ value, label, icon }) => (
        <Button
          key={value}
          variant={activeFilter === value ? "default" : "secondary"}
          size="sm"
          className="rounded-full whitespace-nowrap shadow-md gap-1.5 flex-shrink-0"
          onClick={() => onChange(value)}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
