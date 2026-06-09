import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import { cn } from "@/shared/lib/cn";
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

const TYPE_LABELS: Record<VehicleType | "all", string> = {
  all: "ทั้งหมด",
  excavator: VEHICLE_LABELS.excavator,
  dump_truck: VEHICLE_LABELS.dump_truck,
  concrete_mixer: VEHICLE_LABELS.concrete_mixer,
  crane: VEHICLE_LABELS.crane,
  roller: VEHICLE_LABELS.roller,
  other: VEHICLE_LABELS.other,
};

interface VehicleTypeFilterProps {
  selected: VehicleType | "all";
  onChange: (type: VehicleType | "all") => void;
}

export function VehicleTypeFilter({
  selected,
  onChange,
}: VehicleTypeFilterProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-3">
        {ALL_TYPES.map((type) => {
          const isActive = selected === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:text-foreground",
              )}
            >
              {TYPE_LABELS[type]}
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
