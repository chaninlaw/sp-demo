import type { Vehicle, VehicleStatus, VehicleType } from "@/entities/vehicle";

export function groupByStatus(
  vehicles: Vehicle[],
): Record<VehicleStatus, number> {
  return vehicles.reduce(
    (acc, v) => {
      acc[v.status] = (acc[v.status] ?? 0) + 1;
      return acc;
    },
    { active: 0, idle: 0, offline: 0 } as Record<VehicleStatus, number>,
  );
}

export function groupByType(vehicles: Vehicle[]): Record<VehicleType, number> {
  return vehicles.reduce(
    (acc, v) => {
      acc[v.type] = (acc[v.type] ?? 0) + 1;
      return acc;
    },
    {
      excavator: 0,
      dump_truck: 0,
      concrete_mixer: 0,
      crane: 0,
      roller: 0,
      other: 0,
    } as Record<VehicleType, number>,
  );
}
