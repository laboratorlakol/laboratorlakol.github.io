"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: string;
  emailVerified: boolean;
  citizenId?: string | null;
  characterName?: string | null;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      let res = await fetch("/api/auth/me", { cache: "no-store" });
      let data = await res.json();

      if (!data.user) {
        // Access token may have simply expired (15 min) — the refresh
        // cookie lives much longer (30 days), so try silently renewing
        // before treating this as "logged out".
        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
        if (refreshRes.ok) {
          res = await fetch("/api/auth/me", { cache: "no-store" });
          data = await res.json();
        }
      }

      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = setTimeout(refresh, 0);
    const interval = setInterval(refresh, 10 * 60 * 1000); // every 10 min, access token lives 15
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
