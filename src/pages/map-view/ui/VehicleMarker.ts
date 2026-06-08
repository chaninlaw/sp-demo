import {
  VEHICLE_COLORS,
  VEHICLE_ICONS,
  VEHICLE_LABELS,
} from "@/shared/lib/vehicle-colors";
import type { Vehicle, VehicleStatus } from "@/entities/vehicle";

const STATUS_STYLES: Record<
  VehicleStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  active: {
    bg: "rgba(16,185,129,0.12)",
    text: "#059669",
    dot: "#10b981",
    label: "ใช้งาน",
  },
  idle: {
    bg: "rgba(245,158,11,0.12)",
    text: "#d97706",
    dot: "#f59e0b",
    label: "รอการใช้งาน",
  },
  offline: {
    bg: "rgba(100,116,139,0.12)",
    text: "#475569",
    dot: "#94a3b8",
    label: "ออฟไลน์",
  },
};

export function createMarkerElement(vehicle: Vehicle): HTMLElement {
  const color = VEHICLE_COLORS[vehicle.type];
  const icon = VEHICLE_ICONS[vehicle.type];

  const el = document.createElement("div");
  el.style.cssText = "width:36px;height:44px;position:relative;cursor:pointer;";
  el.innerHTML = `
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.059 27.941 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="18" r="10" fill="white" fill-opacity="0.25"/>
    </svg>
    <div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:36px;height:36px;font-size:14px;line-height:1">${icon}</div>
  `;
  return el;
}

export function createPopupHTML(vehicle: Vehicle): string {
  const sc = STATUS_STYLES[vehicle.status];

  const rows = [
    `<div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#64748b">
      <span>${VEHICLE_ICONS[vehicle.type]}</span>
      <span>${VEHICLE_LABELS[vehicle.type]}</span>
    </div>`,
    `<div style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:9999px;background:${sc.bg}">
      <span style="width:6px;height:6px;border-radius:50%;background:${sc.dot};display:inline-block;flex-shrink:0"></span>
      <span style="font-size:12px;color:${sc.text};font-weight:500">${sc.label}</span>
    </div>`,
    `<div style="font-size:13px;color:#64748b">📍 ${vehicle.location}</div>`,
    vehicle.licensePlate
      ? `<div style="font-size:12px;color:#94a3b8">🚗 ${vehicle.licensePlate}</div>`
      : "",
    vehicle.driverName
      ? `<div style="font-size:13px;color:#64748b">👤 ${vehicle.driverName}</div>`
      : "",
    vehicle.taskDescription
      ? `<div style="font-size:12px;color:#64748b;margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0">${vehicle.taskDescription}</div>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <div style="font-family:system-ui,sans-serif;min-width:200px;padding:2px">
      <div style="font-weight:700;font-size:15px;color:#1e293b;margin-bottom:8px">${vehicle.name}</div>
      <div style="display:flex;flex-direction:column;gap:5px">${rows}</div>
    </div>
  `;
}
