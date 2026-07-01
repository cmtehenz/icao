function norm(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalize readback transcript for element matching. */
export function normalizeReadbackTranscript(transcript: string): string {
  let t = norm(transcript);
  t = t.replace(/\band\s+and\b/g, "and");
  t = t.replace(/\b(\d)\s*-\s*(\d)\b/g, "$1 $2");
  t = t.replace(/\b5000\b/g, "five thousand");
  t = t.replace(/\b3432\b/g, "three four three two");
  t = t.replace(/\b119\s*45\b/g, "one one niner point four five");
  t = t.replace(/\bpoint\s+4\s+5\b/g, "point four five");
  return t;
}

export type ReadbackElementResult = {
  id: string;
  label: string;
  found: boolean;
};

export type ReadbackScore = {
  score: number;
  elements: ReadbackElementResult[];
  missing: string[];
};

type ElementCheck = {
  id: string;
  label: string;
  test: (t: string, model: string) => boolean;
};

function hasCallsign(t: string): boolean {
  return /\banac\s*123\b/.test(t) || /\banac\s*wun\s*too\s*tree\b/.test(t);
}

function hasClimbMaintain(t: string): boolean {
  return /\bclimb\b/.test(t) && /\bmaintain\b/.test(t);
}

function altitudeFromModel(model: string): RegExp | null {
  const m = model.match(
    /(?:climb\s+and\s+)?maintain\s+((?:one|two|three|four|five|six|seven|eight|nine|niner|\d|\s)+?)\s*feet/i,
  );
  if (!m) return null;
  const spoken = norm(m[1]);
  if (spoken.includes("five thousand") || spoken.includes("5 thousand")) {
    return /(five\s*thousand|5000|5\s*000)/;
  }
  if (spoken.includes("four thousand")) return /(four\s*thousand|4000|4\s*000)/;
  if (spoken.includes("six thousand")) return /(six\s*thousand|6000|6\s*000)/;
  const digits = spoken.replace(/\D/g, "");
  if (digits) return new RegExp(digits);
  return new RegExp(spoken.replace(/\s+/g, "\\s*"));
}

function hasAltitude(t: string, model: string): boolean {
  const pattern = altitudeFromModel(model);
  if (!pattern) return /\b\d{3,5}\s*feet\b/.test(t) || /\bthousand\s*feet\b/.test(t);
  return pattern.test(t);
}

function squawkFromModel(model: string): RegExp | null {
  const spoken = model.match(/squawk\s+((?:one|two|three|four|five|six|seven|eight|nine|niner|\d|\s)+?)(?:,|\.|and|$)/i);
  if (spoken) {
    const phrase = norm(spoken[1]);
    const digits = phrase.replace(/\b(one|wun)\b/g, "1")
      .replace(/\b(two|too)\b/g, "2")
      .replace(/\b(three|tree)\b/g, "3")
      .replace(/\b(four|fower)\b/g, "4")
      .replace(/\b(five|fife)\b/g, "5")
      .replace(/\b(six)\b/g, "6")
      .replace(/\b(seven)\b/g, "7")
      .replace(/\b(eight|ate)\b/g, "8")
      .replace(/\b(nine|niner)\b/g, "9")
      .replace(/\s+/g, "");
    if (/^\d{4}$/.test(digits)) {
      return new RegExp(`(squawk\\s*${digits}|${digits.split("").join("\\s*")})`);
    }
    return new RegExp(phrase.replace(/\s+/g, "\\s*"));
  }
  return /\bsquawk\b/.test(model) ? /\bsquawk\b/ : null;
}

function hasSquawk(t: string, model: string): boolean {
  if (!/\bsquawk\b/.test(t)) return false;
  const pattern = squawkFromModel(model);
  if (!pattern) return true;
  return pattern.test(t);
}

function hasRouteFix(t: string, model: string): boolean {
  const m = norm(model);
  const needsVortac = /vortac|vor\b|fll|lima|waypoint|direct/.test(m);
  if (!needsVortac) return true;
  return (
    /\bproceed\b/.test(t) &&
    /(vortac|vor\b|fll|lima|fox|direct|heading)/.test(t)
  );
}

function hasContact(t: string, model: string): boolean {
  const m = norm(model);
  const needsContact = /(call|contact)\s/.test(m);
  if (!needsContact) return true;
  const facility =
    m.match(/(?:call|contact)\s+([a-z\s]+?)(?:\s+on|\s+frequency|,|\.|$)/)?.[1]?.trim() ?? "";
  if (!facility) {
    return /\b(call|contact)\b/.test(t);
  }
  const words = facility.split(/\s+/).filter((w) => w.length > 3);
  return /\b(call|contact)\b/.test(t) && words.filter((w) => t.includes(w)).length >= Math.min(2, words.length);
}

function frequencyFromModel(model: string): RegExp | null {
  const spoken = model.match(
    /(?:frequency\s+)?((?:one|two|three|four|five|six|seven|eight|nine|niner|point|decimal|\d|\s)+?)(?:,|\.|$)/i,
  );
  if (!spoken) return null;
  const phrase = norm(spoken[1]);
  if (phrase.includes("one one niner point four five") || phrase.includes("119 point 45")) {
    return /(119\.?\s*45|one\s*one\s*niner\s*point\s*four\s*five|niner\s*point\s*four\s*five|point\s*four\s*five)/;
  }
  if (phrase.includes("one one niner decimal two five")) {
    return /(119\.?\s*25|one\s*one\s*niner\s*decimal\s*two\s*five|niner\s*decimal\s*two\s*five)/;
  }
  const digits = phrase.replace(/[^0-9]/g, "");
  if (digits.length >= 3) return new RegExp(digits);
  return new RegExp(phrase.replace(/\s+/g, "\\s*"));
}

function hasFrequency(t: string, model: string): boolean {
  const m = norm(model);
  if (!/frequency|point|decimal|one one niner|\d{3}/.test(m)) return true;
  const pattern = frequencyFromModel(model);
  if (!pattern) return /\b(point|decimal|frequency|\d{3})\b/.test(t);
  return pattern.test(t);
}

function buildChecks(model: string): ElementCheck[] {
  const checks: ElementCheck[] = [
    { id: "callsign", label: "Callsign ANAC 123", test: (t) => hasCallsign(t) },
    { id: "climb", label: "Climb and maintain", test: (t) => hasClimbMaintain(t) },
    { id: "altitude", label: "Altitude", test: (t, m) => hasAltitude(t, m) },
    { id: "squawk", label: "Squawk code", test: (t, m) => hasSquawk(t, m) },
    { id: "route", label: "Proceed / fix", test: (t, m) => hasRouteFix(t, m) },
    { id: "contact", label: "Contact facility", test: (t, m) => hasContact(t, m) },
    { id: "frequency", label: "Frequency", test: (t, m) => hasFrequency(t, m) },
  ];

  const m = norm(model);
  return checks.filter((c) => {
    if (c.id === "climb") return /\bclimb\b/.test(m) || /\bmaintain\b/.test(m);
    if (c.id === "squawk") return /\bsquawk\b/.test(m);
    if (c.id === "route") return /\bproceed\b/.test(m) || /\bdirect\b/.test(m);
    if (c.id === "contact") return /\b(call|contact)\b/.test(m);
    if (c.id === "frequency") return /frequency|point|decimal|niner/.test(m);
    if (c.id === "altitude") return /\bfeet\b/.test(m) || /\bthousand\b/.test(m);
    return true;
  });
}

/** Score readback by clearance elements — not word-for-word PEEL overlap. */
export function scoreReadback(transcript: string, modelAnswer: string): ReadbackScore {
  const t = normalizeReadbackTranscript(transcript);
  const model = norm(modelAnswer);
  const checks = buildChecks(model);

  const elements: ReadbackElementResult[] = checks.map((c) => ({
    id: c.id,
    label: c.label,
    found: c.test(t, model),
  }));

  const found = elements.filter((e) => e.found).length;
  const score = checks.length ? Math.round((found / checks.length) * 100) : overlapFallback(t, model);
  const missing = elements.filter((e) => !e.found).map((e) => e.label);

  return { score, elements, missing };
}

function overlapFallback(t: string, model: string): number {
  const mw = model.split(/\s+/).filter((w) => w.length > 3);
  if (!mw.length) return 0;
  const hits = mw.filter((w) => t.includes(w)).length;
  return Math.round((hits / mw.length) * 100);
}
