import { MapPin, User, Wrench, FileText } from "lucide-react";
import { StatusBadge } from "@/entities/vehicle/ui/StatusBadge";
import { VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import { formatRelative } from "@/shared/lib/format-date";
import { cn } from "@/shared/lib/cn";
import type { Vehicle, VehicleStatus } from "@/entities/vehicle";

const STATUS_ACCENT: Record<VehicleStatus, string> = {
  active: "border-t-emerald-400",
  idle: "border-t-primary",
  offline: "border-t-slate-600",
};

interface TaskCardProps {
  vehicle: Vehicle;
}

export function TaskCard({ vehicle }: TaskCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border border-t-2 rounded-lg p-3.5",
        STATUS_ACCENT[vehicle.status] ?? STATUS_ACCENT.offline,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className="font-bold text-foreground text-base leading-tight truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {vehicle.name}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono tracking-wider">
            {vehicle.licensePlate}
          </p>
        </div>
        <StatusBadge status={vehicle.status} className="shrink-0 mt-0.5" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
        <InfoRow icon={Wrench} label={VEHICLE_LABELS[vehicle.type]} />
        <InfoRow icon={MapPin} label={vehicle.location} />
        {vehicle.driverName && (
          <InfoRow icon={User} label={vehicle.driverName} />
        )}
      </div>

      {vehicle.taskDescription && (
        <div className="mt-2.5 flex items-start gap-1.5 bg-muted/50 rounded-md px-2.5 py-2">
          <FileText size={11} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-foreground leading-snug">
            {vehicle.taskDescription}
          </p>
        </div>
      )}

      <p className="mt-2.5 text-[10px] text-muted-foreground text-right font-mono tracking-wide">
        {formatRelative(vehicle.lastUpdated)}
      </p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon
        size={11}
        className="text-muted-foreground shrink-0"
        strokeWidth={1.75}
      />
      <p className="text-xs text-muted-foreground leading-snug truncate">
        {label}
      </p>
    </div>
  );
}
