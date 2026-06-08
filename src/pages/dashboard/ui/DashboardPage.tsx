import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { vehicleQueryOptions } from "@/shared/lib/polling";
import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { groupByStatus, groupByType } from "../model/dashboard";
import { StatsSummary } from "./StatsSummary";
import { VehicleTypeChart } from "./VehicleTypeChart";

function DashboardContent() {
  const { data: vehicles } = useSuspenseQuery(vehicleQueryOptions);
  const byStatus = groupByStatus(vehicles);
  const byType = groupByType(vehicles);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">ภาพรวมรถ</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          อัปเดตอัตโนมัติทุก 30 วินาที
        </p>
      </div>

      <StatsSummary
        total={vehicles.length}
        active={byStatus.active}
        idle={byStatus.idle}
        offline={byStatus.offline}
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            สัดส่วนตามประเภทรถ
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <VehicleTypeChart data={byType} />
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-3 w-48 mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 col-span-2 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 col-span-2 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
