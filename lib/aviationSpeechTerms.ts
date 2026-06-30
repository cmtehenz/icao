/** ICAO phonetic alphabet (spoken letter names). */
const ICAO_LETTERS: Record<string, string> = {
  a: "Alpha",
  b: "Bravo",
  c: "Charlie",
  d: "Delta",
  e: "Echo",
  f: "Foxtrot",
  g: "Golf",
  h: "Hotel",
  i: "India",
  j: "Juliet",
  k: "Kilo",
  l: "Lima",
  m: "Mike",
  n: "November",
  o: "Oscar",
  p: "Papa",
  q: "Quebec",
  r: "Romeo",
  s: "Sierra",
  t: "Tango",
  u: "Uniform",
  v: "Victor",
  w: "Whiskey",
  x: "X-ray",
  y: "Yankee",
  z: "Zulu",
};

/** Spoken as letter names or standard aviation abbreviations — not dictionary words. */
const AVIATION_ACRONYMS = new Set([
  "vor",
  "ndb",
  "dme",
  "ils",
  "loc",
  "gps",
  "rnav",
  "rnp",
  "atc",
  "atis",
  "twip",
  "metar",
  "taf",
  "sigmet",
  "notam",
  "qnh",
  "qfe",
  "agl",
  "msl",
  "ifr",
  "vfr",
  "tcas",
  "egpws",
  "gpws",
  "fms",
  "fadec",
  "apu",
  "adf",
  "vhf",
  "uhf",
  "om",
  "mm",
  "im",
  "sid",
  "star",
  "iap",
  "rwy",
  "twy",
]);

function lettersOnly(word: string): string {
  return word.replace(/[^a-zA-Z]/g, "");
}

/** Navaid / fix / airfield designator (e.g. SAU, BCN) — spell with ICAO alphabet. */
export function isIcaoDesignator(word: string): boolean {
  const letters = lettersOnly(word);
  if (letters.length < 2 || letters.length > 5) return false;
  if (letters !== letters.toUpperCase()) return false;
  if (!/^[A-Z]+$/.test(letters)) return false;
  return true;
}

export function icaoSpellOut(word: string): string | null {
  const letters = lettersOnly(word).toLowerCase();
  if (!letters || letters.length > 8) return null;
  const parts = [...letters].map((ch) => ICAO_LETTERS[ch]);
  if (parts.some((p) => !p)) return null;
  return parts.join(" ");
}

/**
 * Azure often flags these as "mispronounced" when the reference is a word
 * but pilots say letter names (VOR, SAU) or standard abbreviations.
 */
export function shouldSkipPronunciationVaultWord(word: string): boolean {
  const trimmed = word.trim();
  if (!trimmed) return true;

  const normalized = lettersOnly(trimmed).toLowerCase();
  if (!normalized) return true;

  if (AVIATION_ACRONYMS.has(normalized)) return true;
  if (isIcaoDesignator(trimmed)) return true;

  return false;
}

export function aviationSpeechHint(word: string): string | null {
  if (!shouldSkipPronunciationVaultWord(word)) return null;

  const spelled = icaoSpellOut(word);
  if (spelled && isIcaoDesignator(word)) {
    return `Soletre: ${spelled}`;
  }

  const key = lettersOnly(word).toLowerCase();
  if (key === "vor") {
    return "Sigla V-O-R (VHF Omnidirectional Range), não se lê como palavra em inglês.";
  }

  return "Sigla ou identificador aeronáutico — não use YouGlish como palavra comum.";
}
