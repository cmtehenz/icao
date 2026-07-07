/** Expand written phraseology into ICAO radiotelephony for Captain Delta TTS. */

const ICAO_LETTER: Record<string, string> = {
  A: "Alpha",
  B: "Bravo",
  C: "Charlie",
  D: "Delta",
  E: "Echo",
  F: "Foxtrot",
  G: "Golf",
  H: "Hotel",
  I: "India",
  J: "Juliett",
  K: "Kilo",
  L: "Lima",
  M: "Mike",
  N: "November",
  O: "Oscar",
  P: "Papa",
  Q: "Quebec",
  R: "Romeo",
  S: "Sierra",
  T: "Tango",
  U: "Uniform",
  V: "Victor",
  W: "Whiskey",
  X: "X-ray",
  Y: "Yankee",
  Z: "Zulu",
};

const ICAO_DIGIT: Record<string, string> = {
  "0": "zero",
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "niner",
};

/** Tokens that should stay spoken as words, not spelled letter-by-letter. */
const SKIP_IDENTIFIERS = new Set([
  "ATC",
  "ICAO",
  "VFR",
  "IFR",
  "GPS",
  "VOR",
  "ILS",
  "RNAV",
  "LUAW",
  "SKYBRARY",
  "ADS",
  "FAA",
  "AIM",
  "DOC",
  "PANS",
  "ATM",
  "VMC",
  "NM",
  "OK",
  "HOLD",
  "SHORT",
  "LINE",
  "WAIT",
  "CLEARED",
  "LAND",
  "TAKEOFF",
  "ROGER",
  "WILCO",
  "MAYDAY",
  "PAN",
]);

export function spellIcaoLetters(sequence: string): string {
  return sequence
    .toUpperCase()
    .split("")
    .filter((ch) => /[A-Z]/.test(ch))
    .map((ch) => ICAO_LETTER[ch] ?? ch)
    .join(" ");
}

export function spellIcaoDigits(sequence: string): string {
  return sequence
    .split("")
    .map((d) => ICAO_DIGIT[d] ?? d)
    .join(" ");
}

export function expandAnacCallsign(raw: string): string {
  const match = raw.match(/^ANAC\s*(\d{3})$/i);
  if (!match) return raw;
  return `${spellIcaoLetters("ANAC")} ${spellIcaoDigits(match[1]!)}`;
}

export function expandPtCallsign(raw: string): string {
  const compact = raw.replace(/[\s-]/g, "").toUpperCase();
  if (!/^PT[A-Z]{3}$/.test(compact)) return raw;
  return spellIcaoLetters(compact);
}

function shouldSpellIdentifier(token: string): boolean {
  if (token.length < 2 || token.length > 8) return false;
  if (!/^[A-Z]{2,8}$/.test(token)) return false;
  return !SKIP_IDENTIFIERS.has(token);
}

/**
 * Converts written radio text for natural Captain speech:
 * PT-ABC → Papa Tango Alpha Bravo Charlie
 * ANAC123 → Alpha November Alpha Charlie one two three
 * FLL / NITUX → Foxtrot Lima Lima / November India Tango Uniform X-ray
 */
export function expandRadioSpeech(text: string): string {
  let out = text;

  out = out.replace(/\bANAC\s*(\d{3})\b/gi, (_, digits: string) =>
    expandAnacCallsign(`ANAC${digits}`),
  );

  out = out.replace(/\bPT[-\s]?([A-Z]{3})\b/gi, (match) => expandPtCallsign(match));

  out = out.replace(/\b[A-Z]{2,8}\b/g, (token) =>
    shouldSpellIdentifier(token) ? spellIcaoLetters(token) : token,
  );

  return out;
}
