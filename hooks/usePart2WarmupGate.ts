"use client";

import { useCallback, useEffect, useState } from "react";
import {
  canUsePart2Coach,
  isPart2WarmupRequired,
  part2WarmupMessage,
  PART2_WARMUP_CHANGE_EVENT,
} from "@/lib/part2Warmup";
import { VAULT_CHANGE_EVENT } from "@/lib/pronunciationVault";

export function usePart2WarmupGate() {
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = useCallback(() => {
    setBlocked(isPart2WarmupRequired());
    setMessage(part2WarmupMessage());
  }, []);

  useEffect(() => {
    refresh();
    const events = [PART2_WARMUP_CHANGE_EVENT, VAULT_CHANGE_EVENT];
    for (const ev of events) window.addEventListener(ev, refresh);
    return () => {
      for (const ev of events) window.removeEventListener(ev, refresh);
    };
  }, [refresh]);

  return {
    blocked,
    message,
    canRecord: canUsePart2Coach(),
  };
}
