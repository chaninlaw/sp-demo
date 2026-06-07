import { env } from "@/shared/config/env";
import type { Vehicle, VehicleStatus, VehicleType } from "@/entities/vehicle";

const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

// columns: id | name | licensePlate | type | status | lat | lng | location | lastUpdated | driverName | taskDescription
export async function fetchVehiclesFromSheet(): Promise<Vehicle[]> {
  const { sheetsId, googleApiKey } = env;
  const range = "Sheet1!A2:K";
  const url = `${BASE_URL}/${sheetsId}/values/${range}?key=${googleApiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);

  const data = (await res.json()) as { values?: string[][] };
  return parseSheetRows(data.values ?? []);
}

function parseSheetRows(rows: string[][]): Vehicle[] {
  return rows
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0] ?? "",
      name: row[1] ?? "",
      licensePlate: row[2] ?? "",
      type: (row[3] as VehicleType) ?? "other",
      status: (row[4] as VehicleStatus) ?? "offline",
      lat: parseFloat(row[5] ?? "0"),
      lng: parseFloat(row[6] ?? "0"),
      location: row[7] ?? "",
      lastUpdated: row[8] ?? new Date().toISOString(),
      driverName: row[9] || undefined,
      taskDescription: row[10] || undefined,
    }));
}
