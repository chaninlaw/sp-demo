import { MapPin, User, FileText } from "lucide-react";
import { VEHICLE_COLORS, VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import { StatusBadge } from "@/entities/vehicle/ui/StatusBadge";
import type { Vehicle } from "@/entities/vehicle";

export function VehicleMarkerIcon({ vehicle }: { vehicle: Vehicle }) {
  const color = VEHICLE_COLORS[vehicle.type] ?? VEHICLE_COLORS.other;

  return (
    <div
      className="relative cursor-pointer group"
      style={{ width: 32, height: 40 }}
    >
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        fill="none"
        className="absolute inset-0 drop-shadow-md"
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24S32 28 32 16C32 7.163 24.837 0 16 0z"
          fill={color}
        />
        <circle cx="16" cy="16" r="7" fill="white" fillOpacity="0.3" />
        <circle cx="16" cy="16" r="4" fill="white" fillOpacity="0.7" />
      </svg>
    </div>
  );
}

export function VehiclePopupContent({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="min-w-[200px]" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p
            className="font-bold text-sm text-foreground leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {vehicle.name}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono tracking-wider mt-0.5">
            {vehicle.licensePlate}
          </p>
        </div>
        <StatusBadge status={vehicle.status} />
      </div>

      <div className="text-[11px] text-muted-foreground mb-2">
        {VEHICLE_LABELS[vehicle.type]}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MapPin size={10} strokeWidth={1.75} />
          {vehicle.location}
        </div>
        {vehicle.driverName && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <User size={10} strokeWidth={1.75} />
            {vehicle.driverName}
          </div>
        )}
      </div>

      {vehicle.taskDescription && (
        <div className="mt-2 pt-2 border-t border-border flex items-start gap-1.5">
          <FileText
            size={10}
            className="text-primary mt-0.5 shrink-0"
            strokeWidth={1.75}
          />
          <p className="text-[11px] text-foreground leading-snug">
            {vehicle.taskDescription}
          </p>
        </div>
      )}
    </div>
  );
}
