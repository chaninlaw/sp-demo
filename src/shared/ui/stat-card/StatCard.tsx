import { cn } from "@/shared/lib/cn";

interface StatCardProps {
  title: string;
  value: number | string;
  accent?: "amber" | "emerald" | "slate" | "red";
  className?: string;
  description?: string;
}

const ACCENT_STYLES = {
  amber: "border-l-primary text-primary",
  emerald: "border-l-emerald-400 text-emerald-400",
  slate: "border-l-slate-500 text-slate-400",
  red: "border-l-red-500 text-red-400",
};

export function StatCard({
  title,
  value,
  accent = "amber",
  className,
  description,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border border-l-2 rounded-lg px-4 py-3",
        ACCENT_STYLES[accent],
        className,
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-1">
        {title}
      </p>
      <p
        className="text-4xl font-black leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      {description && (
        <p className="text-[10px] text-muted-foreground mt-1.5 tracking-wide">
          {description}
        </p>
      )}
    </div>
  );
}
