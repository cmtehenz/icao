/** Callsign padrão SDEA / simulados deste app. */
export const EXAM_CALLSIGN = "ANAC 123";

/** ICAO Doc 9432 — dígitos falados em inglês aeronáutico. */
const ICAO_DIGITS: Record<string, string> = {
  "0": "zero",
  "1": "wun",
  "2": "too",
  "3": "tree",
  "4": "fower",
  "5": "fife",
  "6": "six",
  "7": "seven",
  "8": "ait",
  "9": "niner",
};

export function icaoDigitSpeech(digit: string): string {
  return ICAO_DIGITS[digit] ?? digit;
}

export function icaoNumberSpeech(digits: string): string {
  return [...digits].map(icaoDigitSpeech).join(" ");
}

export function parseCallsign(raw: string): { letters: string; digits: string } | null {
  const match = raw.trim().match(/^([A-Za-z]+)\s*(\d+)?$/);
  if (!match) return null;
  return { letters: match[1].toUpperCase(), digits: match[2] ?? "" };
}

/**
 * Forma falada no simulado SDEA: bloco ANAC + dígitos ICAO.
 * Não usa alfabeto fonético (Alpha November…) — fala-se “ANAC” junto.
 */
export function buildCallsignSpeech(callsign = EXAM_CALLSIGN): string {
  const parsed = parseCallsign(callsign);
  if (!parsed) return callsign.trim();
  const parts = [parsed.letters];
  if (parsed.digits) parts.push(icaoNumberSpeech(parsed.digits));
  return parts.join(" ");
}

export type CallsignDrillStep = {
  id: "block" | "numbers" | "full";
  label: string;
  hint: string;
  referenceText: string;
  display: string;
};

export function callsignDrillSteps(callsign = EXAM_CALLSIGN): CallsignDrillStep[] {
  const parsed = parseCallsign(callsign);
  if (!parsed) return [];

  const numberSpeech = parsed.digits ? icaoNumberSpeech(parsed.digits) : "";
  const fullSpeech = buildCallsignSpeech(callsign);

  const steps: CallsignDrillStep[] = [
    {
      id: "block",
      label: "Bloco ANAC",
      hint: "Fale “ANAC” junto, em ritmo natural — como no simulador. Não use Alpha November Alpha Charlie.",
      referenceText: parsed.letters,
      display: parsed.letters,
    },
  ];

  if (parsed.digits) {
    steps.push({
      id: "numbers",
      label: "Números 1–2–3",
      hint: "Cada dígito separado: wun — too — tree. Nunca “one hundred twenty-three”.",
      referenceText: numberSpeech,
      display: parsed.digits,
    });
  }

  steps.push({
    id: "full",
    label: "Callsign completo",
    hint: "ANAC + pausa curta + wun too tree. É assim no readback e no reporte ao ATC.",
    referenceText: fullSpeech,
    display: callsign.trim(),
  });

  return steps;
}
