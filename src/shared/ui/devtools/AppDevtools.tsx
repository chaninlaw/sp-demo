import { lazy, Suspense } from "react";
import type { TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools";
import { SHEETS_DATA_RANGE } from "@/shared/config/sheets";

// ---------------------------------------------------------------------------
// Built-in plugin definitions
// Panels are lazy-imported so they are excluded from the production bundle.
// ---------------------------------------------------------------------------

const ReactQueryDevtoolsPanel = lazy(() =>
  import("@tanstack/react-query-devtools").then((m) => ({
    default: m.ReactQueryDevtoolsPanel,
  })),
);

const TanStackRouterDevtoolsPanel = lazy(() =>
  import("@tanstack/react-router-devtools").then((m) => ({
    default: m.TanStackRouterDevtoolsPanel,
  })),
);

// ---------------------------------------------------------------------------
// Custom product plugin — "Sheets API" inspector
// Shows the active Google Sheets config without touching product code.
// ---------------------------------------------------------------------------

function SheetsInspectorPanel() {
  const sheetsId = import.meta.env.VITE_SHEETS_ID ?? "(not set)";
  const apiKeySet = Boolean(import.meta.env.VITE_GOOGLE_API_KEY);

  return (
    <div style={{ padding: "16px", fontFamily: "monospace", fontSize: "13px" }}>
      <h3 style={{ marginBottom: "12px", fontWeight: 600 }}>
        Sheets API Config
      </h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {[
            ["Spreadsheet ID", sheetsId],
            ["API Key", apiKeySet ? "✓ set" : "✗ missing"],
            ["Base range", SHEETS_DATA_RANGE],
            [
              "Columns",
              "id · name · licensePlate · type · status · lat · lng · location · lastUpdated · driverName · taskDescription",
            ],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: "1px solid #333" }}>
              <td
                style={{
                  padding: "6px 12px 6px 0",
                  opacity: 0.6,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </td>
              <td style={{ padding: "6px 0", wordBreak: "break-all" }}>
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Plugin registry
// Add or remove entries here — the shell picks them up automatically.
// ---------------------------------------------------------------------------

export const devtoolsPlugins: TanStackDevtoolsReactPlugin[] = [
  {
    id: "react-query",
    name: "Query",
    render: () => (
      <Suspense fallback={null}>
        <ReactQueryDevtoolsPanel />
      </Suspense>
    ),
  },
  {
    id: "router",
    name: "Router",
    render: () => (
      <Suspense fallback={null}>
        <TanStackRouterDevtoolsPanel />
      </Suspense>
    ),
  },
  {
    id: "sheets-inspector",
    name: "Sheets API",
    render: () => <SheetsInspectorPanel />,
  },
];

// ---------------------------------------------------------------------------
// Unified shell — rendered only in development
// ---------------------------------------------------------------------------

const TanStackDevtools = lazy(() =>
  import("@tanstack/react-devtools").then((m) => ({
    default: m.TanStackDevtools,
  })),
);

export function AppDevtools() {
  if (import.meta.env.PROD) return null;

  return (
    <Suspense fallback={null}>
      <TanStackDevtools
        plugins={devtoolsPlugins}
        config={{ position: "bottom-left" }}
      />
    </Suspense>
  );
}
