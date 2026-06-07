import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";
import type { VehicleStatus } from "../model/vehicle";

const STATUS_CONFIG: Record<
  VehicleStatus,
  { label: string; className: string }
> = {
  active: {
    label: "ใช้งาน",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  },
  idle: {
    label: "รอการใช้งาน",
    className: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  },
  offline: {
    label: "ออฟไลน์",
    className: "bg-slate-500/15 text-slate-600 border-slate-500/30",
  },
};

interface StatusBadgeProps {
  status: VehicleStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
