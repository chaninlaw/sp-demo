import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import { cn } from "@/shared/lib/cn";
import type { MapFilter } from "../model/map-filters";

const FILTERS: { value: MapFilter; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "excavator", label: VEHICLE_LABELS.excavator },
  { value: "dump_truck", label: VEHICLE_LABELS.dump_truck },
  { value: "concrete_mixer", label: VEHICLE_LABELS.concrete_mixer },
  { value: "crane", label: VEHICLE_LABELS.crane },
  { value: "roller", label: VEHICLE_LABELS.roller },
  { value: "other", label: VEHICLE_LABELS.other },
];

interface MapFiltersProps {
  activeFilter: MapFilter;
  onChange: (filter: MapFilter) => void;
}

export function MapFilters({ activeFilter, onChange }: MapFiltersProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-1.5 pb-3">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={cn(
              "px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all border backdrop-blur-md shadow-lg",
              activeFilter === value
                ? "bg-primary text-primary-foreground border-primary/80"
                : "bg-card/80 text-muted-foreground border-border/60 hover:text-foreground hover:bg-card/95",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
