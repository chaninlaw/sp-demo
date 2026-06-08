import { Card, CardContent } from "@/shared/ui/card";
import { StatusBadge } from "@/entities/vehicle/ui/StatusBadge";
import { VEHICLE_ICONS, VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import { formatRelative } from "@/shared/lib/format-date";
import type { Vehicle } from "@/entities/vehicle";

interface TaskCardProps {
  vehicle: Vehicle;
}

export function TaskCard({ vehicle }: TaskCardProps) {
  return (
    <Card
      className="border-l-4"
      style={{ borderLeftColor: getStatusColor(vehicle.status) }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">
              {VEHICLE_ICONS[vehicle.type]}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm leading-tight truncate">
                {vehicle.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {vehicle.licensePlate}
              </p>
            </div>
          </div>
          <StatusBadge status={vehicle.status} className="shrink-0" />
        </div>

        <div className="mt-3 space-y-1.5">
          <InfoRow icon="🔧" label={VEHICLE_LABELS[vehicle.type]} />
          <InfoRow icon="📍" label={vehicle.location} />
          {vehicle.driverName && (
            <InfoRow icon="👤" label={vehicle.driverName} />
          )}
          {vehicle.taskDescription && (
            <InfoRow icon="📋" label={vehicle.taskDescription} highlight />
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground text-right">
          {formatRelative(vehicle.lastUpdated)}
        </p>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon,
  label,
  highlight,
}: {
  icon: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="text-xs mt-px">{icon}</span>
      <p
        className={`text-xs leading-snug ${highlight ? "text-foreground font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </p>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "#10b981";
    case "idle":
      return "#f59e0b";
    default:
      return "#94a3b8";
  }
}
