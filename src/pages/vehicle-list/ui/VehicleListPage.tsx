import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { vehicleQueryOptions } from "@/shared/lib/polling";
import { Skeleton } from "@/shared/ui/skeleton";
import { QueryErrorBoundary } from "@/shared/ui/query-error-boundary";
import type { VehicleType } from "@/entities/vehicle";
import { VehicleTypeFilter } from "./VehicleTypeFilter";
import { VehicleTable } from "./VehicleTable";

function VehicleListContent() {
  const { data: vehicles } = useSuspenseQuery(vehicleQueryOptions);
  const [filter, setFilter] = useState<VehicleType | "all">("all");

  const filtered =
    filter === "all" ? vehicles : vehicles.filter((v) => v.type === filter);

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-black text-foreground tracking-tight leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            FLEET ROSTER
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-mono">
            {vehicles.length} คันในระบบ · แสดง {filtered.length} คัน
          </p>
        </div>
      </div>

      <VehicleTypeFilter selected={filter} onChange={setFilter} />

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <VehicleTable vehicles={filtered} />
      </div>
    </div>
  );
}

function VehicleListSkeleton() {
  return (
    <div className="p-4 space-y-5">
      <div>
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-3 w-32 mt-2" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

export function VehicleListPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<VehicleListSkeleton />}>
        <VehicleListContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
