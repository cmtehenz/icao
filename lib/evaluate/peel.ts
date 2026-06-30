import {
  connectorBankGroupByTitle,
  getConnectorBankGroups,
  transcriptHasConnectorGroup,
} from "@/lib/connectors";

const STRUCTURE_GROUPS = getConnectorBankGroups();

export function peelMissingConnectors(transcript: string): string[] {
  return STRUCTURE_GROUPS.filter((g) => !transcriptHasConnectorGroup(transcript, g)).map(
    (g) => g.title,
  );
}

export function peelStructureScore(transcript: string): number {
  let found = 0;
  for (const group of STRUCTURE_GROUPS) {
    if (transcriptHasConnectorGroup(transcript, group)) found++;
  }
  return Math.round((found / STRUCTURE_GROUPS.length) * 100);
}

export function hasFullPeelStructure(text: string): boolean {
  const example = connectorBankGroupByTitle("Example");
  const conclusion = connectorBankGroupByTitle("Conclusion");
  if (!example || !conclusion) return false;
  return (
    transcriptHasConnectorGroup(text, example) && transcriptHasConnectorGroup(text, conclusion)
  );
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
      `Faltam conectores do banco na resposta: ${missing.join(", ")}. Qualquer frase do banco serve.`,
    );
  }
  lines.push("A gramática e a escolha de palavras precisam ser mais precisas.");
  lines.push(
    "Estrutura: abertura (Openers) → ideia 1 → ideia 2 → ideia 3 → exemplo → conclusão — use o banco de conectores.",
  );
  return lines;
}
