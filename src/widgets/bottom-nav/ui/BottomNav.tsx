import { useRouterState, useNavigate } from "@tanstack/react-router";
import { cn } from "@/shared/lib/cn";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", to: "/" },
  { label: "แผนที่", icon: "🗺️", to: "/map" },
  { label: "รายการรถ", icon: "🚛", to: "/vehicles" },
  { label: "งาน", icon: "📋", to: "/tasks" },
] as const;

export function BottomNav() {
  const navigate = useNavigate();
  const { location } = useRouterState();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <button
              key={item.to}
              type="button"
              onClick={() => navigate({ to: item.to })}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
