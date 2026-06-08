import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { vehicleQueryOptions } from "@/shared/lib/polling";
import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent } from "@/shared/ui/card";
import type { VehicleType } from "@/entities/vehicle";
import { VehicleTypeFilter } from "./VehicleTypeFilter";
import { VehicleTable } from "./VehicleTable";

function VehicleListContent() {
  const { data: vehicles } = useSuspenseQuery(vehicleQueryOptions);
  const [filter, setFilter] = useState<VehicleType | "all">("all");

  const filtered =
    filter === "all" ? vehicles : vehicles.filter((v) => v.type === filter);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">รายการรถ</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          ทั้งหมด {vehicles.length} คัน
        </p>
      </div>

      <VehicleTypeFilter selected={filter} onChange={setFilter} />

      <Card>
        <CardContent className="p-0">
          <VehicleTable vehicles={filtered} />
        </CardContent>
      </Card>
    </div>
  );
}

function VehicleListSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function VehicleListPage() {
  return (
    <Suspense fallback={<VehicleListSkeleton />}>
      <VehicleListContent />
    </Suspense>
  );
}
