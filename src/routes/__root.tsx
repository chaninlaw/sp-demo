import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AppHeader } from "@/widgets/app-header/ui/AppHeader";
import { BottomNav } from "@/widgets/bottom-nav/ui/BottomNav";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
      <TanStackRouterDevtools />
    </div>
  ),
});
