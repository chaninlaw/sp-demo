import type { VehicleType } from "@/shared/lib/vehicle-colors";

export type { VehicleType };

export type VehicleStatus = "active" | "idle" | "offline";

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  lat: number;
  lng: number;
  location: string;
  lastUpdated: string;
  driverName?: string;
  taskDescription?: string;
}
