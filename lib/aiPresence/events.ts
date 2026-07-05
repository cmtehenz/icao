import type { AIPresenceSnapshot } from "@/lib/aiPresence/types";

export const AI_PRESENCE_UPDATE = "icao-ai-presence-update";
export const AI_PRESENCE_CLEAR_HEX = "icao-ai-presence-clear-hex";

export function emitAIPresenceUpdate(snapshot: AIPresenceSnapshot): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AI_PRESENCE_UPDATE, { detail: snapshot }));
}

export function emitAIPresenceClearHex(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AI_PRESENCE_CLEAR_HEX));
}
