"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadVault, saveVault, VAULT_CHANGE_EVENT } from "@/lib/pronunciationVault";
import type { VaultWord } from "@/lib/pronunciationVault";
import { mergeVaultWords } from "@/lib/vaultMerge";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, name?: string) => Promise<string | null>;
  logout: () => Promise<void>;
  syncVault: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function pullVaultFromServer(): Promise<VaultWord[] | null> {
  const res = await fetch("/api/vault");
  if (!res.ok) return null;
  const data = await res.json();
  return data.words as VaultWord[];
}

async function pushVaultToServer(words: VaultWord[]): Promise<VaultWord[] | null> {
  const res = await fetch("/api/vault", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ words }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.words as VaultWord[];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncVault = useCallback(async () => {
    const local = loadVault();
    const merged = await pushVaultToServer(local);
    if (merged) saveVault(merged);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);

      if (data.user) {
        const remote = await pullVaultFromServer();
        if (remote) {
          const local = loadVault();
          const merged = mergeVaultWords(local, remote);
          saveVault(merged);
          if (local.length > 0 || merged.length !== remote.length) {
            const pushed = await pushVaultToServer(merged);
            if (pushed) saveVault(pushed);
          }
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const onVaultChange = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void syncVault();
      }, 600);
    };

    window.addEventListener(VAULT_CHANGE_EVENT, onVaultChange);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(VAULT_CHANGE_EVENT, onVaultChange);
    };
  }, [user, syncVault]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Erro ao entrar.";
    setUser(data.user);
    await syncVault();
    return null;
  }, [syncVault]);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Erro ao criar conta.";
    setUser(data.user);
    await syncVault();
    return null;
  }, [syncVault]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, syncVault }),
    [user, loading, login, register, logout, syncVault],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
