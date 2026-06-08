import { Button } from "@/shared/ui/button";
import { VEHICLE_ICONS, VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import type { VehicleType } from "@/entities/vehicle";

const ALL_TYPES: Array<VehicleType | "all"> = [
  "all",
  "excavator",
  "dump_truck",
  "concrete_mixer",
  "crane",
  "roller",
  "other",
];

interface VehicleTypeFilterProps {
  selected: VehicleType | "all";
  onChange: (type: VehicleType | "all") => void;
}

export function VehicleTypeFilter({
  selected,
  onChange,
}: VehicleTypeFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {ALL_TYPES.map((type) => {
        const isActive = selected === type;
        const label = type === "all" ? "ทั้งหมด" : VEHICLE_LABELS[type];
        const icon = type === "all" ? "🚗" : VEHICLE_ICONS[type];
        return (
          <Button
            key={type}
            variant={isActive ? "default" : "secondary"}
            size="sm"
            className="rounded-full shrink-0"
            onClick={() => onChange(type)}
          >
            <span className="mr-1">{icon}</span>
            {label}
          </Button>
        );
      })}
    </div>
  );
}
