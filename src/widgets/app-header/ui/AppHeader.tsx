import { HardHat, Sun, Moon } from "lucide-react";
import { useLiff } from "@/app/providers/liff-provider";
import { useTheme } from "@/shared/lib/use-theme";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";

export function AppHeader() {
  const { profile } = useLiff();
  const { theme, toggle } = useTheme();

  return (
    <header className="shrink-0 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-primary">
            <HardHat
              className="w-4 h-4 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-primary leading-none tracking-widest text-sm font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SP
            </span>
            <span
              className="text-foreground leading-none tracking-[0.2em] text-sm font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ConsTrack
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label="สลับธีม"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
              LIVE
            </span>
          </div>
          <Avatar className="size-8 ring-1 ring-border">
            <AvatarImage src={profile?.pictureUrl} alt={profile?.displayName} />
            <AvatarFallback className="text-[10px] text-muted-foreground bg-muted uppercase">
              {profile?.displayName.slice(0, 4) || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="h-px bg-linear-to-r from-primary/60 via-primary/20 to-transparent" />
    </header>
  );
}
