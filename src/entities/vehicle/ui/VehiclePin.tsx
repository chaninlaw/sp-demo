import { VEHICLE_COLORS, VEHICLE_ICONS } from "@/shared/lib/vehicle-colors";
import type { VehicleType } from "../model/vehicle";

interface VehiclePinProps {
  type: VehicleType;
  size?: number;
}

export function VehiclePin({ type, size = 36 }: VehiclePinProps) {
  const color = VEHICLE_COLORS[type];
  const icon = VEHICLE_ICONS[type];

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <path
          d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.059 27.941 0 18 0z"
          fill={color}
        />
        <circle cx="18" cy="18" r="10" fill="white" fillOpacity="0.25" />
      </svg>
      <span
        className="relative z-10 text-base leading-none"
        style={{ fontSize: size * 0.4, marginTop: -(size * 0.1) }}
      >
        {icon}
      </span>
    </div>
  );
}
