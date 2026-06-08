import liff from "@line/liff";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { LIFF_CONFIG } from "@/shared/config";

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

interface LiffContextValue {
  isReady: boolean;
  isLoggedIn: boolean;
  profile: LiffProfile | null;
  lineId: string | null;
}

const LiffContext = createContext<LiffContextValue>({
  isReady: false,
  isLoggedIn: false,
  profile: null,
  lineId: null,
});

export function useLiff() {
  return useContext(LiffContext);
}

export function LiffProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [lineId, setLineId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: LIFF_CONFIG.liffId });
        const loggedIn = liff.isLoggedIn();
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          const p = await liff.getProfile();
          setLineId(p.userId);
          setProfile({
            userId: p.userId,
            displayName: p.displayName,
            pictureUrl: p.pictureUrl,
          });
        }
      } catch {
        // LIFF init may fail in non-LINE browser; app still renders
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <LiffContext.Provider value={{ isReady, isLoggedIn, profile, lineId }}>
      {children}
    </LiffContext.Provider>
  );
}
