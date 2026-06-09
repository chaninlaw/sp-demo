import { useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Map, Truck, ClipboardList } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: Array<{
  label: string;
  icon: LucideIcon;
  to: string;
}> = [
  { label: "ภาพรวม", icon: LayoutDashboard, to: "/" },
  { label: "แผนที่", icon: Map, to: "/map" },
  { label: "รายการรถ", icon: Truck, to: "/vehicles" },
  { label: "งาน", icon: ClipboardList, to: "/tasks" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { location } = useRouterState();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border h-[var(--bottom-nav-height)]">
      <div className="flex h-full">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <button
              key={item.to}
              type="button"
              onClick={() => navigate({ to: item.to })}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary rounded-full" />
              )}
              <Icon
                className={cn(
                  "transition-transform",
                  isActive ? "scale-110" : "scale-100",
                )}
                size={24}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className="text-[11px] font-semibold tracking-wide"
                style={{
                  fontFamily: isActive ? "var(--font-display)" : undefined,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
