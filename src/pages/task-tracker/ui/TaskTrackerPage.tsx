import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { vehicleQueryOptions } from "@/shared/lib/polling";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import type { VehicleStatus } from "@/entities/vehicle";
import { TaskTimeline } from "./TaskTimeline";

type StatusFilter = VehicleStatus | "all";

const FILTERS: Array<{ value: StatusFilter; label: string; icon: string }> = [
  { value: "all", label: "ทั้งหมด", icon: "📋" },
  { value: "active", label: "ใช้งาน", icon: "🟢" },
  { value: "idle", label: "รอการใช้งาน", icon: "🟡" },
  { value: "offline", label: "ออฟไลน์", icon: "⚫" },
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
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">ติดตามงาน</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          รถ {counts.active} คันกำลังทำงาน
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(({ value, label, icon }) => (
          <Button
            key={value}
            variant={filter === value ? "default" : "secondary"}
            size="sm"
            className="rounded-full shrink-0"
            onClick={() => setFilter(value)}
          >
            <span className="mr-1">{icon}</span>
            {label}
            <span className="ml-1.5 text-xs opacity-70">({counts[value]})</span>
          </Button>
        ))}
      </div>

      <TaskTimeline vehicles={filtered} />
    </div>
  );
}

function TaskTrackerSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-3 w-40 mt-1" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="space-y-3 pl-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function TaskTrackerPage() {
  return (
    <Suspense fallback={<TaskTrackerSkeleton />}>
      <TaskTrackerContent />
    </Suspense>
  );
}
