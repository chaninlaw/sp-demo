import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { vehicleQueryOptions } from "@/shared/lib/polling";
import { Skeleton } from "@/shared/ui/skeleton";
import { QueryErrorBoundary } from "@/shared/ui/query-error-boundary";
import { groupByStatus, groupByType } from "../model/dashboard";
import { StatsSummary } from "./StatsSummary";
import { VehicleTypeChart } from "./VehicleTypeChart";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span
        className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function DashboardContent() {
  const { data: vehicles } = useSuspenseQuery(vehicleQueryOptions);
  const byStatus = groupByStatus(vehicles);
  const byType = groupByType(vehicles);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-black text-foreground tracking-tight leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            FLEET STATUS
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase font-mono">
            Auto-refresh · 30s
          </p>
        </div>
      </div>

      <div>
        <SectionLabel>สถิติรวม</SectionLabel>
        <StatsSummary
          total={vehicles.length}
          active={byStatus.active}
          idle={byStatus.idle}
          offline={byStatus.offline}
        />
      </div>

      <div>
        <SectionLabel>สัดส่วนตามประเภทรถ</SectionLabel>
        <div className="bg-card border border-border rounded-lg p-4">
          <VehicleTypeChart data={byType} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-3 w-32 mt-2" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <Skeleton className="h-20 col-span-2 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 col-span-2 rounded-lg" />
      </div>
      <Skeleton className="h-60 rounded-lg" />
    </div>
  );
}

export function DashboardPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
