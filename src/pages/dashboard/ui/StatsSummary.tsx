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
    <div className="grid grid-cols-2 gap-2.5">
      <StatCard
        title="ยานพาหนะทั้งหมด"
        value={total}
        accent="amber"
        className="col-span-2"
        description="รถทุกคันในระบบ"
      />
      <StatCard title="ใช้งานอยู่" value={active} accent="emerald" />
      <StatCard title="รอการใช้งาน" value={idle} accent="amber" />
      <StatCard
        title="ออฟไลน์"
        value={offline}
        accent="slate"
        className="col-span-2"
      />
    </div>
  );
}
