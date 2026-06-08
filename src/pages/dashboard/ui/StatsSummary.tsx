import { StatCard } from "@/shared/ui/stat-card/StatCard";

interface StatsSummaryProps {
  active: number;
  idle: number;
  offline: number;
  total: number;
}

export function StatsSummary({
  active,
  idle,
  offline,
  total,
}: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="ทั้งหมด"
        value={total}
        icon="🚛"
        className="col-span-2"
        description="รถทุกคันในระบบ"
      />
      <StatCard title="ใช้งานอยู่" value={active} icon="🟢" />
      <StatCard title="รอการใช้งาน" value={idle} icon="🟡" />
      <StatCard
        title="ออฟไลน์"
        value={offline}
        icon="🔴"
        className="col-span-2"
      />
    </div>
  );
}
