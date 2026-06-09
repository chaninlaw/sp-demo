import { cn } from "@/shared/lib/cn";
import type { VehicleStatus } from "../model/vehicle";

const STATUS_CONFIG: Record<
  VehicleStatus,
  { label: string; dot: string; className: string }
> = {
  active: {
    label: "ใช้งาน",
    dot: "bg-emerald-400",
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
  },
  idle: {
    label: "รอการใช้งาน",
    dot: "bg-primary",
    className: "text-primary bg-primary/10 border-primary/25",
  },
  offline: {
    label: "ออฟไลน์",
    dot: "bg-slate-500",
    className: "text-slate-500 bg-slate-500/10 border-slate-500/25",
  },
};

interface StatusBadgeProps {
  status: VehicleStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.offline;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border tracking-wide uppercase",
        config.className,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
