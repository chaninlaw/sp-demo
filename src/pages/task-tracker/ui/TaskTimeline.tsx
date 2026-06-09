import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import { TaskCard } from "./TaskCard";
import type { Vehicle } from "@/entities/vehicle";

interface TaskTimelineProps {
  vehicles: Vehicle[];
}

export function TaskTimeline({ vehicles }: TaskTimelineProps) {
  if (vehicles.length === 0) {
    return (
      <Empty className="border-0 py-16">
        <EmptyMedia>
          <span className="text-3xl opacity-30">◌</span>
        </EmptyMedia>
        <EmptyTitle className="text-muted-foreground">
          ไม่มีงานในขณะนี้
        </EmptyTitle>
        <EmptyDescription>ลองเปลี่ยนตัวกรองสถานะ</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="relative">
            <TaskCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    </div>
  );
}
