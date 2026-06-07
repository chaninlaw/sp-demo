export type VehicleType =
  | "excavator"
  | "dump_truck"
  | "concrete_mixer"
  | "crane"
  | "roller"
  | "other";

export const VEHICLE_COLORS: Record<VehicleType, string> = {
  excavator: "#f59e0b",
  dump_truck: "#3b82f6",
  concrete_mixer: "#8b5cf6",
  crane: "#ef4444",
  roller: "#10b981",
  other: "#6b7280",
};

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  excavator: "รถขุด",
  dump_truck: "รถดั้ม",
  concrete_mixer: "รถผสมปูน",
  crane: "เครนยก",
  roller: "รถบดถนน",
  other: "อื่นๆ",
};

export const VEHICLE_ICONS: Record<VehicleType, string> = {
  excavator: "⛏️",
  dump_truck: "🚛",
  concrete_mixer: "🔄",
  crane: "🏗️",
  roller: "🛞",
  other: "🚧",
};
