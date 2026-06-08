import { TaskCard } from "./TaskCard";
import type { Vehicle } from "@/entities/vehicle";

interface TaskTimelineProps {
  vehicles: Vehicle[];
}

export function TaskTimeline({ vehicles }: TaskTimelineProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">📭</span>
        <p className="text-sm font-medium text-foreground">ไม่มีงานในขณะนี้</p>
        <p className="text-xs text-muted-foreground mt-1">
          ลองเปลี่ยนตัวกรองสถานะ
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-3 pl-10">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="relative">
            <div
              className="absolute -left-[2.15rem] top-4 size-3 rounded-full border-2 border-background"
              style={{ backgroundColor: getStatusDotColor(vehicle.status) }}
            />
            <TaskCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusDotColor(status: string): string {
  switch (status) {
    case "active":
      return "#10b981";
    case "idle":
      return "#f59e0b";
    default:
      return "#94a3b8";
  }
}
