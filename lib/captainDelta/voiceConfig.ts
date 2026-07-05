/** Proactive coaching UI (tips, suggestions, briefing cards) — independent of voice. */
export const CAPTAIN_DELTA_PROACTIVE_ENABLED = true;

/** Shown in the coaching card when voice output is off or failed. */
export const CAPTAIN_VOICE_TEXT_MODE_LABEL = "Voice unavailable — text mode.";

function parseVoiceEnv(): boolean {
  const raw = process.env.NEXT_PUBLIC_CAPTAIN_DELTA_VOICE_ENABLED;
  if (raw === undefined || raw === "") return true;
  return raw !== "0" && raw.toLowerCase() !== "false";
}

/** Captain TTS output — optional channel; intelligence and UI work when this is false. */
export function isCaptainDeltaVoiceEnabled(): boolean {
  return parseVoiceEnv();
}

/** Route tips, home briefing card, session close suggestions — not TTS. */
export function isCaptainDeltaProactiveEnabled(): boolean {
  return CAPTAIN_DELTA_PROACTIVE_ENABLED;
}
