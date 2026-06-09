import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Layers, Zap, Clock, WifiOff } from "lucide-react";
import { vehicleQueryOptions } from "@/shared/lib/polling";
import { Skeleton } from "@/shared/ui/skeleton";
import { QueryErrorBoundary } from "@/shared/ui/query-error-boundary";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/cn";
import type { VehicleStatus } from "@/entities/vehicle";
import { TaskTimeline } from "./TaskTimeline";
import type { LucideIcon } from "lucide-react";

type StatusFilter = VehicleStatus | "all";

const FILTERS: Array<{ value: StatusFilter; label: string; icon: LucideIcon }> =
  [
    { value: "all", label: "ทั้งหมด", icon: Layers },
    { value: "active", label: "ใช้งาน", icon: Zap },
    { value: "idle", label: "รอการใช้งาน", icon: Clock },
    { value: "offline", label: "ออฟไลน์", icon: WifiOff },
  ];

function TaskTrackerContent() {
  const { data: vehicles } = useSuspenseQuery(vehicleQueryOptions);
  const [filter, setFilter] = useState<StatusFilter>("active");

  const sorted = [...vehicles].sort(
    (a, b) =>
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
  );

  const filtered =
    filter === "all" ? sorted : sorted.filter((v) => v.status === filter);

  const counts: Record<StatusFilter, number> = {
    all: vehicles.length,
    active: vehicles.filter((v) => v.status === "active").length,
    idle: vehicles.filter((v) => v.status === "idle").length,
    offline: vehicles.filter((v) => v.status === "offline").length,
  };

  return (
    <div className="p-4 space-y-5">
      <div>
        <h1
          className="text-2xl font-black text-foreground tracking-tight leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          TASK TRACKER
        </h1>
        <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-mono">
          {counts.active} คันกำลังทำงาน
        </p>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {FILTERS.map(({ value, label, icon: Icon }) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border/80",
                )}
              >
                <Icon size={12} strokeWidth={2} />
                {label}
                <span
                  className={cn(
                    "text-[10px] rounded-full px-1.5 py-px font-mono",
                    isActive ? "bg-primary-foreground/20" : "bg-muted",
                  )}
                >
                  {counts[value]}
                </span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TaskTimeline vehicles={filtered} />
    </div>
  );
}

function TaskTrackerSkeleton() {
  return (
    <div className="p-4 space-y-5">
      <div>
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-3 w-36 mt-2" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function TaskTrackerPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<TaskTrackerSkeleton />}>
        <TaskTrackerContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
