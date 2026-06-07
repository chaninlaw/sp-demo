import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { LiffProvider } from "./liff-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <LiffProvider>{children}</LiffProvider>
    </QueryProvider>
  );
}
