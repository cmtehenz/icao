/** Common Azure/browser STT mishearings for aviation English (PT-BR speakers). */
const PHRASE_FIXES: [RegExp, string][] = [
  [/\bmessage approach procedure\b/gi, "missed approach procedure"],
  [/\bmissing approach procedure\b/gi, "missed approach procedure"],
  [/\bmessage approach\b/gi, "missed approach"],
  [/\bmissing approach\b/gi, "missed approach"],
  [/\bwrong way obstruction\b/gi, "runway obstruction"],
  [/\bwrong way\b/gi, "runway"],
  [/\batc in structure\b/gi, "atc instructions"],
  [/\bor divert is necessary\b/gi, "or divert if necessary"],
];

/**
 * Normalize transcript before content/keyword scoring.
 * Pronunciation scores still use raw audio — this only helps idea/term matching.
 */
export function normalizeAviationTranscript(transcript: string): string {
  let out = transcript;
  for (const [pattern, replacement] of PHRASE_FIXES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}
