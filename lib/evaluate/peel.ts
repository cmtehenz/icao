const PEEL_CONNECTORS = [
  { key: "first of all", label: "First of all" },
  { key: "additionally", label: "Additionally" },
  { key: "finally", label: "Finally" },
  { key: "for example", label: "For example" },
  { key: "overall", label: "Overall" },
] as const;

const PARTIAL_PEEL = [
  { pattern: /\bfirst\b/, replaces: "first of all" },
  { pattern: /\bsecond\b/, replaces: "additionally" },
  { pattern: /\bthird\b/, replaces: "finally" },
] as const;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function peelMissingConnectors(transcript: string): string[] {
  const t = normalize(transcript);
  const missing: string[] = [];

  for (const { key, label } of PEEL_CONNECTORS) {
    if (t.includes(key)) continue;
    const partial = PARTIAL_PEEL.find((p) => p.replaces === key && p.pattern.test(t));
    if (partial) continue;
    missing.push(label);
  }

  return missing;
}

export function peelStructureScore(transcript: string): number {
  const t = normalize(transcript);
  let found = 0;
  for (const { key } of PEEL_CONNECTORS) {
    if (t.includes(key)) {
      found++;
      continue;
    }
    const partial = PARTIAL_PEEL.find((p) => p.replaces === key && p.pattern.test(t));
    if (partial) found += 0.5;
  }
  return Math.round((found / PEEL_CONNECTORS.length) * 100);
}

export function hasFullPeelStructure(text: string): boolean {
  const t = normalize(text);
  return t.includes("for example") && t.includes("overall");
}

/** Part 1 suggestions must include example + conclusion — otherwise use the card model. */
export function ensurePart1SuggestedAnswer(modelAnswer: string, suggested?: string): string {
  if (!suggested?.trim()) return modelAnswer;
  if (hasFullPeelStructure(suggested)) return suggested.trim();
  return modelAnswer;
}

export function peelStructureFeedbackPt(missing: string[]): string[] {
  const lines: string[] = [];
  if (missing.length) {
    lines.push(
      `A estrutura da resposta não segue o formato PEEL corretamente. Faltam: ${missing.join(", ")}.`,
    );
  }
  lines.push("A gramática e a escolha de palavras precisam ser mais precisas.");
  lines.push(
    "Use: abertura → First of all (ideia 1) → Additionally (ideia 2) → Finally (ideia 3) → For example → Overall.",
  );
  return lines;
}
