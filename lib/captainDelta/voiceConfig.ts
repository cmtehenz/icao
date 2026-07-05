/** Captain TTS output — presentation only. Intelligence works when this is false. */
export const CAPTAIN_DELTA_VOICE_ENABLED = false;

/** Proactive coaching UI (tips, suggestions, briefing cards) — independent of voice. */
export const CAPTAIN_DELTA_PROACTIVE_ENABLED = true;

export function isCaptainDeltaVoiceEnabled(): boolean {
  return CAPTAIN_DELTA_VOICE_ENABLED;
}

/** Route tips, home briefing card, session close suggestions — not TTS. */
export function isCaptainDeltaProactiveEnabled(): boolean {
  return CAPTAIN_DELTA_PROACTIVE_ENABLED;
}
