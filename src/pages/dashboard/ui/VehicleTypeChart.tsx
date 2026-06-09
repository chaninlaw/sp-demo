import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { VEHICLE_COLORS, VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import { Empty, EmptyTitle } from "@/shared/ui/empty";
import type { VehicleType } from "@/entities/vehicle";

interface VehicleTypeChartProps {
  data: Record<VehicleType, number>;
}

export function VehicleTypeChart({ data }: VehicleTypeChartProps) {
  const chartData = (Object.entries(data) as [VehicleType, number][])
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({
      name: VEHICLE_LABELS[type],
      value: count,
      color: VEHICLE_COLORS[type],
    }));

  if (chartData.length === 0) {
    return (
      <Empty className="border-0 h-40">
        <EmptyTitle className="text-sm">ไม่มีข้อมูลรถ</EmptyTitle>
      </Empty>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{
            background: "oklch(0.17 0.009 55)",
            border: "1px solid oklch(0.30 0.016 72 / 45%)",
            borderRadius: "6px",
            fontSize: 12,
            color: "oklch(0.93 0.006 60)",
            fontFamily: "var(--font-sans)",
          }}
          itemStyle={{ color: "oklch(0.93 0.006 60)" }}
          cursor={false}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            fontSize: 11,
            color: "oklch(0.52 0.012 60)",
            fontFamily: "var(--font-sans)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
