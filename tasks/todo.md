# SP ConsTrack — Implementation Plan

> **Goal:** LIFF-based demo app แสดงตำแหน่งรถประเภทต่างๆ ใน LINE OA พร้อม Rich Menu
> ข้อมูลมาจาก Google Sheets (manual update) แสดงผลบน map และ dashboard

**Stack:** React 18 + Vite + TanStack Router + shadcn/ui + Tailwind CSS v4 + Biome + Bun  
**Architecture:** Feature-Sliced Design (FSD) v2.1  
**Map:** mapcn.dev (MapLibre-based)  
**Data:** Google Sheets API v4  
**Hosting:** Vercel

---

## สถานะรวม

| Phase    | ชื่อ                                | สถานะ          |
| -------- | ----------------------------------- | -------------- |
| Phase 1  | Project Bootstrap & Tooling         | ✅ done        |
| Phase 2  | FSD Folder Structure + Shared Layer | ✅ done        |
| Phase 3  | Entities & Data Layer (Sheets API)  | ✅ done        |
| Phase 4  | Pages — Dashboard                   | ✅ done        |
| Phase 5  | Pages — Map View                    | ✅ done        |
| Phase 6  | Pages — Vehicle List                | ✅ done        |
| Phase 7  | Pages — Task Tracker                | ✅ done        |
| Phase 8  | Widgets (App Shell)                 | ✅ done        |
| Phase 9  | LIFF Integration                    | ✅ done        |
| Phase 10 | LINE Rich Menu Setup                | 🔄 in progress |
| Phase 11 | Deploy to Vercel                    | ⬜ todo        |

---

## Phase 1 — Project Bootstrap & Tooling

### 1.1 Init project ด้วย Bun + Vite

- [ ] รัน `bun create vite sp-constrack --template react-ts`
- [ ] เปลี่ยน workdir เข้า `sp-constrack/`
- [ ] รัน `bun install`
- [ ] ตรวจสอบ dev server รันได้ด้วย `bun run dev`

### 1.2 ติดตั้ง dependencies ทั้งหมด

**Core:**

```bash
bun add @tanstack/react-router @tanstack/router-devtools
bun add @tanstack/react-query @tanstack/react-query-devtools
bun add react-router   # ไม่ต้อง — ใช้ TanStack Router แทน
```

**UI:**

```bash
bun add tailwindcss @tailwindcss/vite
bun add -d @types/node
```

**shadcn setup:** (ใช้ shadcn CLI)

```bash
bunx shadcn@latest init
```

**Map:**

```bash
bun add maplibre-gl @mapcomponents/react-maplibre
# หรือ package ของ mapcn.dev ตามที่ docs กำหนด
```

**Chart:**

```bash
bun add recharts
```

**LINE:**

```bash
bun add @line/liff
```

**Utilities:**

```bash
bun add date-fns clsx tailwind-merge lucide-react
```

**Dev tools:**

```bash
bun add -d @biomejs/biome simple-git-hooks lint-staged
bun add -d @tanstack/router-plugin
```

### 1.3 Config Biome

- [ ] สร้าง `biome.json` ด้วย config ต่อไปนี้:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  },
  "files": {
    "ignore": ["node_modules", "dist", "src/routeTree.gen.ts"]
  }
}
```

- [ ] เพิ่ม scripts ใน `package.json`:

```json
{
  "scripts": {
    "lint": "biome lint ./src",
    "format": "biome format ./src --write",
    "check": "biome check ./src --write"
  }
}
```

### 1.4 Config simple-git-hooks + lint-staged

- [ ] เพิ่มใน `package.json`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "bunx lint-staged"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json}": ["biome check --write --no-errors-on-unmatched"]
  }
}
```

- [ ] รัน `bunx simple-git-hooks` เพื่อ install hooks

### 1.5 Config TanStack Router (file-based)

- [ ] แก้ `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "@/app": resolve(__dirname, "src/app"),
      "@/pages": resolve(__dirname, "src/pages"),
      "@/widgets": resolve(__dirname, "src/widgets"),
      "@/features": resolve(__dirname, "src/features"),
      "@/entities": resolve(__dirname, "src/entities"),
      "@/shared": resolve(__dirname, "src/shared"),
    },
  },
});
```

- [ ] แก้ `tsconfig.app.json` เพิ่ม paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/app/*": ["src/app/*"],
      "@/pages/*": ["src/pages/*"],
      "@/widgets/*": ["src/widgets/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

### 1.6 Config Tailwind CSS v4

- [ ] ลบ `src/index.css` เดิม
- [ ] สร้าง `src/app/styles/globals.css`:

```css
@import "tailwindcss";
```

- [ ] ตรวจสอบ `@tailwindcss/vite` plugin ใน `vite.config.ts` ถูกเพิ่มแล้ว

### 1.7 Init shadcn

- [ ] รัน `bunx shadcn@latest init` เลือก:
  - Style: Default
  - Base color: Neutral
  - CSS variables: Yes
- [ ] ตรวจสอบ `components.json` ถูก generate
- [ ] ติดตั้ง shadcn components เริ่มต้น:

```bash
bunx shadcn@latest add button card badge table tabs
bunx shadcn@latest add select sheet skeleton
```

### 1.8 สร้าง .env files

- [ ] สร้าง `.env.example`:

```env
VITE_LIFF_ID=your-liff-id
VITE_GOOGLE_SHEETS_ID=your-sheet-id
VITE_GOOGLE_API_KEY=your-api-key
VITE_LINE_CHANNEL_ACCESS_TOKEN=your-token
```

- [ ] สร้าง `.env.local` (ไม่ commit) จาก template ด้านบน
- [ ] เพิ่ม `.env.local` ใน `.gitignore`

### 1.9 Init git

- [ ] `git init`
- [ ] สร้าง `.gitignore` (node_modules, dist, .env.local)
- [ ] `git add . && git commit -m "chore: initial project setup"`

---

## Phase 2 — FSD Folder Structure + Shared Layer

### 2.1 สร้าง folder skeleton ทั้งหมด

- [x] สร้าง directories ตาม FSD structure:

```
src/
  app/providers/
  app/styles/
  routes/
  pages/dashboard/ui/
  pages/dashboard/model/
  pages/map-view/ui/
  pages/map-view/model/
  pages/vehicle-list/ui/
  pages/vehicle-list/model/
  pages/task-tracker/ui/
  widgets/app-header/ui/
  widgets/bottom-nav/ui/
  entities/vehicle/model/
  entities/vehicle/ui/
  shared/ui/stat-card/
  shared/api/
  shared/config/
  shared/lib/
```

### 2.2 สร้าง shared/config

- [x] สร้าง `src/shared/config/env.ts`:

```ts
export const env = {
  liffId: import.meta.env.VITE_LIFF_ID as string,
  sheetsId: import.meta.env.VITE_GOOGLE_SHEETS_ID as string,
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY as string,
} as const;
```

- [x] สร้าง `src/shared/config/liff.ts`:

```ts
export const LIFF_CONFIG = {
  liffId: import.meta.env.VITE_LIFF_ID as string,
};
```

- [x] สร้าง `src/shared/config/index.ts` (re-export)

### 2.3 สร้าง shared/lib utilities

- [x] สร้าง `src/shared/lib/format-date.ts`
- [x] สร้าง `src/shared/lib/vehicle-colors.ts` — color/icon map ต่อ VehicleType
- [x] สร้าง `src/shared/lib/cn.ts` — `clsx` + `tailwind-merge` wrapper

### 2.4 สร้าง shared/ui components

- [x] สร้าง `src/shared/ui/stat-card/StatCard.tsx`
- [x] สร้าง `src/shared/ui/index.ts` (re-export shadcn + custom)

### 2.5 Setup app providers

- [x] สร้าง `src/app/providers/query-provider.tsx` — TanStack Query QueryClientProvider
- [x] สร้าง `src/app/providers/liff-provider.tsx` — init LIFF, gate render จนกว่า ready
- [x] สร้าง `src/app/providers/index.tsx` — compose providers

### 2.6 Setup TanStack Router routes skeleton

- [x] สร้าง `src/routes/__root.tsx` — root layout + `<Outlet />`
- [x] สร้าง `src/routes/index.tsx` → DashboardPage
- [x] สร้าง `src/routes/map.tsx` → MapViewPage
- [x] สร้าง `src/routes/vehicles.tsx` → VehicleListPage
- [x] สร้าง `src/routes/tasks.tsx` → TaskTrackerPage
- [x] รัน dev server ตรวจสอบ `routeTree.gen.ts` ถูก generate

### 2.7 Setup entry point

- [x] แก้ `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Providers } from "@/app/providers";
import "@/app/styles/globals.css";

const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
```

- [x] `git commit -m "feat: fsd folder structure + shared layer"`

---

## Phase 3 — Entities & Data Layer (Sheets API)

### 3.1 สร้าง vehicle entity types

- [x] สร้าง `src/entities/vehicle/model/vehicle.ts`:

```ts
export type VehicleType =
  | "excavator" // รถขุด
  | "dump_truck" // รถดั้ม
  | "concrete_mixer" // รถผสมปูน
  | "crane" // เครนยก
  | "roller" // รถบดถนน
  | "other";

export type VehicleStatus = "active" | "idle" | "offline";

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  lat: number;
  lng: number;
  location: string; // ชื่อไซต์งาน
  lastUpdated: string; // ISO string
  driverName?: string;
  taskDescription?: string;
}
```

- [x] สร้าง `src/entities/vehicle/ui/StatusBadge.tsx` — shadcn Badge + color ตาม status
- [x] สร้าง `src/entities/vehicle/ui/VehiclePin.tsx` — SVG pin icon ตาม vehicleType
- [x] สร้าง `src/entities/vehicle/index.ts` (public API)

### 3.2 สร้าง Google Sheets API client

- [x] สร้าง `src/shared/api/sheets.ts`:

```ts
// Sheets API v4 — public read (API key only, no OAuth)
// Sheet columns: id | name | licensePlate | type | status | lat | lng | location | lastUpdated | driverName | taskDescription

const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

export async function fetchVehiclesFromSheet(): Promise<Vehicle[]> {
  const { sheetsId, googleApiKey } = env;
  const range = "Sheet1!A2:K"; // header row ข้าม
  const url = `${BASE_URL}/${sheetsId}/values/${range}?key=${googleApiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch sheet data");

  const data = await res.json();
  return parseSheetRows(data.values ?? []);
}

function parseSheetRows(rows: string[][]): Vehicle[] {
  // map rows → Vehicle[]
}
```

- [x] สร้าง `src/shared/api/index.ts` (re-export)

### 3.3 สร้าง TanStack Query hook

- [x] สร้าง `src/shared/lib/polling.ts` — query options factory:

```ts
export const vehicleQueryOptions = queryOptions({
  queryKey: ["vehicles"],
  queryFn: fetchVehiclesFromSheet,
  refetchInterval: 30_000, // 30 วินาที
  staleTime: 25_000,
});
```

### 3.4 สร้าง Google Sheet template

- [ ] สร้าง Google Sheet ใหม่ ชื่อ "SP ConsTrack Data"
- [ ] สร้าง header row: `id | name | licensePlate | type | status | lat | lng | location | lastUpdated | driverName | taskDescription`
- [ ] ใส่ mock data ทดสอบ 5-8 คัน แต่ละประเภท
- [ ] Share sheet เป็น "Anyone with link can view"
- [ ] บันทึก Sheet ID ลง `.env.local`

- [x] `git commit -m "feat: vehicle entity + sheets api client"`

---

## Phase 4 — Pages: Dashboard

### 4.1 สร้าง DashboardPage

- [x] สร้าง `src/pages/dashboard/ui/DashboardPage.tsx`:
  - ใช้ `vehicleQueryOptions` ดึงข้อมูล
  - แสดง loading skeleton ระหว่างโหลด
  - แสดง total รถทั้งหมด, แยกตาม status (active/idle/offline)

### 4.2 สร้าง StatsSummary component

- [x] สร้าง `src/pages/dashboard/ui/StatsSummary.tsx`:
  - StatCard 3 ใบ: 🟢 Active | 🟡 Idle | 🔴 Offline
  - ใช้ `shared/ui/stat-card/StatCard.tsx`

### 4.3 สร้าง VehicleTypeChart

- [x] สร้าง `src/pages/dashboard/ui/VehicleTypeChart.tsx`:
  - Recharts `PieChart` แสดงสัดส่วนรถแต่ละประเภท
  - ใช้สีจาก `shared/lib/vehicle-colors.ts`

### 4.4 สร้าง dashboard model

- [x] สร้าง `src/pages/dashboard/model/dashboard.ts`:
  - derived stats functions: `groupByStatus`, `groupByType`

- [x] `git commit -m "feat: dashboard page"`

---

## Phase 5 — Pages: Map View

### 5.1 Setup MapLibre / mapcn.dev

- [x] สร้าง `src/pages/map-view/ui/MapViewPage.tsx`:
  - maplibre-gl + CARTO Positron style (no API key required)
  - loop `vehicles` → VehicleMarker ต่อคัน
  - Suspense skeleton ระหว่างโหลด
  - fitBounds ไปยังตำแหน่งรถทั้งหมดเมื่อโหลดครั้งแรก

### 5.2 สร้าง VehicleMarker

- [x] สร้าง `src/pages/map-view/ui/VehicleMarker.ts`:
  - `createMarkerElement(vehicle)` — DOM element (pin SVG + emoji icon)
  - `createPopupHTML(vehicle)` — popup แสดง: ชื่อรถ, ประเภท, status, ไซต์งาน, driver, task

### 5.3 สร้าง MapFilters

- [x] สร้าง `src/pages/map-view/ui/MapFilters.tsx`:
  - filter chip แยกตาม VehicleType
  - "ทั้งหมด" + แต่ละประเภท (7 chips)
  - state อยู่ใน `pages/map-view/model/map-filters.ts`
  - overlaid บน map ด้านบน (absolute positioning)

- [x] `git commit -m "feat: map view page"`

---

## Phase 6 — Pages: Vehicle List

### 6.1 สร้าง VehicleListPage

- [x] สร้าง `src/pages/vehicle-list/ui/VehicleListPage.tsx`

### 6.2 สร้าง VehicleTable

- [x] สร้าง `src/pages/vehicle-list/ui/VehicleTable.tsx`:
  - shadcn `Table`
  - columns: รหัส, ชื่อ, ทะเบียน, ประเภท, สถานะ, ไซต์งาน, อัพเดตล่าสุด
  - StatusBadge ใน column สถานะ

### 6.3 สร้าง VehicleTypeFilter

- [x] สร้าง `src/pages/vehicle-list/ui/VehicleTypeFilter.tsx`:
  - chip filter (rounded Button variant)
  - filter ตาม VehicleType ทั้ง 6 ประเภท + "ทั้งหมด"

- [x] `git commit -m "feat: vehicle list page"`

---

## Phase 7 — Pages: Task Tracker

### 7.1 สร้าง TaskTrackerPage

- [x] สร้าง `src/pages/task-tracker/ui/TaskTrackerPage.tsx`

### 7.2 สร้าง TaskCard

- [x] สร้าง `src/pages/task-tracker/ui/TaskCard.tsx`:
  - แสดง: ชื่อรถ, ประเภท, taskDescription, ไซต์งาน, status badge

### 7.3 สร้าง TaskTimeline (optional สำหรับ demo)

- [x] สร้าง `src/pages/task-tracker/ui/TaskTimeline.tsx`:
  - list รายการรถที่ active เรียงตาม lastUpdated

- [x] `git commit -m "feat: task tracker page"`

---

## Phase 8 — Widgets (Shared UI Shell)

### 8.1 สร้าง AppHeader

- [x] สร้าง `src/widgets/app-header/ui/AppHeader.tsx`:
  - Logo / ชื่อโปรเจ็ค "SP ConsTrack"
  - LINE user profile picture (จาก LIFF `liff.getProfile()`)

### 8.2 สร้าง BottomNav

- [x] สร้าง `src/widgets/bottom-nav/ui/BottomNav.tsx`:
  - 4 tabs: Dashboard, แผนที่, รายการรถ, งาน
  - `useRouterState` highlight active tab
  - navigate ด้วย `useNavigate` จาก TanStack Router

### 8.3 Wire เข้า root layout

- [x] แก้ `src/routes/__root.tsx`:

```tsx
export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  ),
});
```

- [x] `git commit -m "feat: app shell — header + bottom nav"`

---

## Phase 9 — LIFF Integration

### 9.1 สร้าง LIFF Provider

- [x] แก้ `src/app/providers/liff-provider.tsx`:
  - init liff on mount ✅
  - gate children render จนกว่า liff.ready ✅
  - expose context: isLoggedIn, profile, lineId ✅

### 9.2 สร้าง LIFF App ใน LINE Developers Console

- [ ] เปิด [developers.line.biz](https://developers.line.biz)
- [ ] สร้าง Provider ถ้ายังไม่มี
- [ ] สร้าง LINE Login Channel
- [ ] สร้าง LIFF App:
  - Endpoint URL: `https://sp-constrack.vercel.app` (ใส่ชั่วคราว แก้ทีหลัง)
  - Scope: `profile openid`
  - Bot link feature: On (linked กับ LINE OA)
- [ ] บันทึก LIFF ID ลง `.env.local`

### 9.3 สร้าง LINE OA

- [ ] เปิด [manager.line.biz](https://manager.line.biz)
- [ ] สร้าง LINE Official Account ใหม่ ชื่อ "SP ConsTrack"
- [ ] Link กับ Messaging API Channel ใน LINE Developers
- [ ] บันทึก Channel Access Token ลง `.env.local`

- [ ] `git commit -m "feat: liff integration"`

---

## Phase 10 — LINE Rich Menu

### 10.1 ออกแบบ Rich Menu image

- [ ] เปิด `rich-menu/template.html` ใน browser แล้ว screenshot
- [ ] บันทึกเป็น `rich-menu/background.png` (2500 × 1686px)

### 10.2 สร้าง Rich Menu layout config

- [x] สร้าง `rich-menu/layout.json` ✅

### 10.3 สร้าง setup script

- [x] สร้าง `rich-menu/setup.ts` ✅
  - สร้าง Rich Menu ผ่าน LINE Messaging API
  - upload background image
  - set เป็น default Rich Menu
- [ ] เตรียม `background.png` แล้วรัน: `bun run rich-menu/setup.ts`

- [ ] `git commit -m "feat: rich menu setup"`

---

## Phase 11 — Flex Message Template

### 11.1 สร้าง Flex Message template

- [ ] สร้าง `flex-templates/vehicle-alert.json`:
  - แสดง: ชื่อรถ, ประเภท, สถานะใหม่, ไซต์งาน
  - CTA button: "ดูบน Map" → deep-link เข้า LIFF `/map`

---

## Phase 12 — Deploy to Vercel

### 12.1 สร้าง Vercel project

- [ ] Push code ขึ้น GitHub repo ใหม่ `sp-constrack`
- [ ] เปิด [vercel.com](https://vercel.com) → Import Project
- [ ] ตั้งค่า Environment Variables ทั้งหมดจาก `.env.example`

### 12.2 ตั้งค่า build

- [ ] ตรวจสอบ `vercel.json` หรือ build settings:
  - Framework: Vite
  - Build Command: `bun run build`
  - Output Directory: `dist`

### 12.3 อัพเดต LIFF Endpoint URL

- [ ] นำ Vercel URL → อัพเดตใน LINE Developers Console
- [ ] อัพเดต Rich Menu URLs ให้ตรงกับ LIFF ID จริง
- [ ] ทดสอบเปิด LIFF ใน LINE app

- [ ] `git commit -m "chore: production deploy"`

---

## Notes & Constraints

- Google Sheets ต้อง share เป็น **public (view only)** สำหรับ API key auth
- LIFF ต้องใช้ **HTTPS** → Vercel จัดการให้อัตโนมัติ
- polling interval ตั้งไว้ 30 วินาที เหมาะกับ manual update
- Rich Menu image ต้องเป็น JPEG หรือ PNG ขนาดไม่เกิน 1MB
- mapcn.dev — ต้องอ่าน docs สำหรับ API key หรือ token requirement ก่อน Phase 5
