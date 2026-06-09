import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/widgets/app-header/ui/AppHeader";
import { BottomNav } from "@/widgets/bottom-nav/ui/BottomNav";
import { AppDevtools } from "@/shared/ui/devtools/AppDevtools";

export const Route = createRootRoute({
  component: () => (
    <div className="h-dvh">
      <AppHeader />
      <main className="h-full overflow-auto pt-(--header-height) pb-(--bottom-nav-height)">
        <Outlet />
      </main>
      <BottomNav />
      <AppDevtools />
    </div>
  ),
});
