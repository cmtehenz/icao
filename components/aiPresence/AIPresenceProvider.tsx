"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  AI_PRESENCE_CLEAR_HEX,
  AI_PRESENCE_UPDATE,
} from "@/lib/aiPresence/events";
import {
  defaultRoutePresence,
  presenceFromPhase,
} from "@/lib/aiPresence/conversationPresence";
import type { AIPresenceSnapshot } from "@/lib/aiPresence/types";

type AIPresenceContextValue = {
  presence: AIPresenceSnapshot;
};

const AIPresenceCtx = createContext<AIPresenceContextValue | null>(null);

export function AIPresenceProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [presence, setPresence] = useState<AIPresenceSnapshot>(defaultRoutePresence());

  useEffect(() => {
    setPresence(defaultRoutePresence());
  }, [pathname]);

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<AIPresenceSnapshot>).detail;
      if (detail) setPresence(detail);
    };
    const onClearHex = () => setPresence(defaultRoutePresence());
    window.addEventListener(AI_PRESENCE_UPDATE, onUpdate);
    window.addEventListener(AI_PRESENCE_CLEAR_HEX, onClearHex);
    return () => {
      window.removeEventListener(AI_PRESENCE_UPDATE, onUpdate);
      window.removeEventListener(AI_PRESENCE_CLEAR_HEX, onClearHex);
    };
  }, []);

  return (
    <AIPresenceCtx.Provider value={{ presence }}>{children}</AIPresenceCtx.Provider>
  );
}

export function useAIPresence(): AIPresenceSnapshot {
  const ctx = useContext(AIPresenceCtx);
  return ctx?.presence ?? defaultRoutePresence();
}
