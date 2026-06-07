import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
});
