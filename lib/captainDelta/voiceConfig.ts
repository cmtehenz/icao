/** Captain TTS + proactive tips. Debrief text still shows when false. */
export const CAPTAIN_DELTA_VOICE_ENABLED = false;

export function isCaptainDeltaVoiceEnabled(): boolean {
  return CAPTAIN_DELTA_VOICE_ENABLED;
}

/** Route tips, home briefing, session close — not debrief after practice. */
export function isCaptainDeltaProactiveEnabled(): boolean {
  return CAPTAIN_DELTA_VOICE_ENABLED;
}
