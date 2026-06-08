import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { VEHICLE_COLORS, VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
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
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        ไม่มีข้อมูลรถ
      </div>
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
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
