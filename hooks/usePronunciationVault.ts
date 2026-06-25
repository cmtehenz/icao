"use client";

import { useCallback, useEffect, useState } from "react";
import { PRONUNCIATION_HREF } from "@/lib/navigation";
import { loadVault, VAULT_CHANGE_EVENT, vaultStats } from "@/lib/pronunciationVault";

export function usePronunciationVault() {
  const [stats, setStats] = useState(() => vaultStats(loadVault()));

  const refresh = useCallback(() => {
    setStats(vaultStats(loadVault()));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(VAULT_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(VAULT_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return { ...stats, href: PRONUNCIATION_HREF };
}
