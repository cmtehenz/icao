/** Strip emojis and markdown, then expand ICAO radiotelephony for natural Azure speech. */
import { expandRadioSpeech } from "@/lib/captainDelta/icaoRadioSpeech";

export function toSpeechText(text: string): string {
  const cleaned = text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/[✔✓•→↓↑]/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return expandRadioSpeech(cleaned);
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
