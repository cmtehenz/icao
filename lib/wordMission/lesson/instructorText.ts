import { toSpeechText } from "@/lib/captainDelta/voiceText";

const MAX_INSTRUCTOR_SPEECH_CHARS = 4500;

/** Trim premium instructor prose for on-screen cards. */
export function instructorOpening(text: string, maxChars = 480): string {
  const paras = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("-") && !/^\*\*/.test(line));

  let out = "";
  for (const para of paras) {
    const next = out ? `${out}\n\n${para}` : para;
    if (next.length > maxChars) break;
    out = next;
  }
  return out || text.trim().slice(0, maxChars);
}

export function captainChallengeLine(question: string): string {
  const trimmed = question.trim();
  if (/^captain challenge:/i.test(trimmed)) return trimmed;
  return `Captain Challenge: ${trimmed}`;
}

/** Join instructor blocks for display (paragraphs preserved). */
export function instructorDisplayText(...parts: Array<string | undefined>): string {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join("\n\n");
}

/** Full Captain Delta voice script — mission brief, teaching, step detail, etc. */
export function instructorSpeechFromParts(...parts: Array<string | undefined>): string {
  const raw = instructorDisplayText(...parts);
  if (!raw) return "";
  const normalized = toSpeechText(raw.replace(/\n+/g, " "));
  if (normalized.length <= MAX_INSTRUCTOR_SPEECH_CHARS) return normalized;
  const clipped = normalized.slice(0, MAX_INSTRUCTOR_SPEECH_CHARS);
  return clipped.replace(/\s+\S*$/, "").trim();
}
