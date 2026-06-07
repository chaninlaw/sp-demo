import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/styles/globals.css";

// Router will be wired in Phase 2 after routeTree.gen.ts is generated
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <h1 className="text-2xl font-bold">SP ConsTrack 🚧</h1>
    </div>
  </StrictMode>
);
