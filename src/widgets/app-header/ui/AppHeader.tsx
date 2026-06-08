import { useLiff } from "@/app/providers/liff-provider";

export function AppHeader() {
  const { profile } = useLiff();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xl">🏗️</span>
        <span className="font-semibold text-foreground text-base tracking-tight">
          SP ConsTrack
        </span>
      </div>

      {profile ? (
        <img
          src={profile.pictureUrl}
          alt={profile.displayName}
          className="w-8 h-8 rounded-full object-cover border border-border"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">👤</span>
        </div>
      )}
    </header>
  );
}
