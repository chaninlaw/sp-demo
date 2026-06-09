import axios, { AxiosError } from "axios";
import { env } from "@/shared/config/env";
import type { Vehicle, VehicleStatus, VehicleType } from "@/entities/vehicle";
import { SHEETS_BASE_URL, SHEETS_DATA_RANGE } from "../config/sheets";

const sheetsClient = axios.create({ baseURL: SHEETS_BASE_URL });

// columns: id | name | licensePlate | type | status | lat | lng | location | lastUpdated | driverName | taskDescription
export async function fetchVehiclesFromSheet(): Promise<Vehicle[]> {
  const { sheetsId, googleApiKey } = env;

  try {
    const { data } = await sheetsClient.get<{ values?: string[][] }>(
      `/${sheetsId}/values/${SHEETS_DATA_RANGE}`,
      { params: { key: googleApiKey } },
    );
    return parseSheetRows(data.values ?? []);
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      const status = err.response.status;
      const message =
        (err.response.data as { error?: { message?: string } })?.error
          ?.message ?? err.message;

      if (status === 400)
        throw new Error(`Sheets: คำขอไม่ถูกต้อง — ${message}`);
      if (status === 403)
        throw new Error(`Sheets: API key ไม่มีสิทธิ์ — ${message}`);
      if (status === 404)
        throw new Error(`Sheets: ไม่พบ Spreadsheet — ${message}`);
      throw new Error(`Sheets API error ${status}: ${message}`);
    }
    throw err;
  }
}

const VALID_STATUSES: VehicleStatus[] = ["active", "idle", "offline"];
const VALID_TYPES: VehicleType[] = [
  "excavator",
  "dump_truck",
  "concrete_mixer",
  "crane",
  "roller",
  "other",
];

function toStatus(raw: string): VehicleStatus {
  const v = raw.trim().toLowerCase() as VehicleStatus;
  return VALID_STATUSES.includes(v) ? v : "offline";
}

function toType(raw: string): VehicleType {
  const v = raw.trim().toLowerCase() as VehicleType;
  return VALID_TYPES.includes(v) ? v : "other";
}

function parseSheetRows(rows: string[][]): Vehicle[] {
  return rows
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0] ?? "",
      name: row[1] ?? "",
      licensePlate: row[2] ?? "",
      type: toType(row[3] ?? ""),
      status: toStatus(row[4] ?? ""),
      lat: parseFloat(row[5] ?? "0"),
      lng: parseFloat(row[6] ?? "0"),
      location: row[7] ?? "",
      lastUpdated: row[8] ?? new Date().toISOString(),
      driverName: row[9] || undefined,
      taskDescription: row[10] || undefined,
    }));
}
