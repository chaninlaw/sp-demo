import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { StatusBadge } from "@/entities/vehicle";
import { VEHICLE_ICONS, VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import { formatDate } from "@/shared/lib/format-date";
import type { Vehicle } from "@/entities/vehicle";

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export function VehicleTable({ vehicles }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <span className="text-4xl mb-3">🚧</span>
        <p className="text-sm">ไม่พบรถในหมวดหมู่นี้</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">รหัส</TableHead>
          <TableHead>ชื่อรถ</TableHead>
          <TableHead className="hidden sm:table-cell">ทะเบียน</TableHead>
          <TableHead>ประเภท</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead className="hidden md:table-cell">ไซต์งาน</TableHead>
          <TableHead className="hidden lg:table-cell">อัปเดตล่าสุด</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {vehicle.id}
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium text-foreground">{vehicle.name}</p>
                {vehicle.driverName && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {vehicle.driverName}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell font-mono text-sm">
              {vehicle.licensePlate}
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1 text-sm">
                <span>{VEHICLE_ICONS[vehicle.type]}</span>
                <span className="hidden xs:inline">
                  {VEHICLE_LABELS[vehicle.type]}
                </span>
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge status={vehicle.status} />
            </TableCell>
            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
              {vehicle.location}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
              {formatDate(vehicle.lastUpdated)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
