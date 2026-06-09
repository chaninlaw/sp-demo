import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Empty, EmptyMedia, EmptyTitle } from "@/shared/ui/empty";
import { StatusBadge } from "@/entities/vehicle";
import { VEHICLE_LABELS } from "@/shared/lib/vehicle-colors";
import { formatDate } from "@/shared/lib/format-date";
import type { Vehicle } from "@/entities/vehicle";

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export function VehicleTable({ vehicles }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <Empty className="border-0 py-14">
        <EmptyMedia>
          <span className="text-3xl opacity-20">◌</span>
        </EmptyMedia>
        <EmptyTitle className="text-muted-foreground text-sm">
          ไม่พบรถในหมวดหมู่นี้
        </EmptyTitle>
      </Empty>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="w-[72px] text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            รหัส
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            รถ / คนขับ
          </TableHead>
          <TableHead className="hidden sm:table-cell text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            ทะเบียน
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            ประเภท
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            สถานะ
          </TableHead>
          <TableHead className="hidden md:table-cell text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            ไซต์งาน
          </TableHead>
          <TableHead className="hidden lg:table-cell text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            อัปเดต
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow
            key={vehicle.id}
            className="border-border hover:bg-muted/30 transition-colors"
          >
            <TableCell className="font-mono text-[11px] text-muted-foreground py-2.5">
              {vehicle.id}
            </TableCell>
            <TableCell className="py-2.5">
              <div>
                <p
                  className="font-semibold text-foreground text-sm leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {vehicle.name}
                </p>
                {vehicle.driverName && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {vehicle.driverName}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground py-2.5 tracking-wider">
              {vehicle.licensePlate}
            </TableCell>
            <TableCell className="py-2.5">
              <span className="text-xs text-muted-foreground">
                {VEHICLE_LABELS[vehicle.type]}
              </span>
            </TableCell>
            <TableCell className="py-2.5">
              <StatusBadge status={vehicle.status} />
            </TableCell>
            <TableCell className="hidden md:table-cell text-xs text-muted-foreground py-2.5">
              {vehicle.location}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-[11px] text-muted-foreground py-2.5 font-mono">
              {formatDate(vehicle.lastUpdated)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
