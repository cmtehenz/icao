export type AzureWordScore = {
  word: string;
  accuracyScore: number;
  errorType?: string;
};

export type AzurePronunciationResult = {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  recognizedText: string;
  words: AzureWordScore[];
};

export function isScriptedAssessment(type: string): boolean {
  return type === "part2-readback" || type === "part2-reported";
}

/** Reference text for scripted Azure assessment (shorter = more reliable). */
export function azureReferenceText(modelAnswer: string, type: string): string {
  if (!isScriptedAssessment(type)) return "";
  return modelAnswer.slice(0, 500);
}

const ERROR_LABELS: Record<string, string> = {
  None: "ok",
  Mispronunciation: "pronúncia errada",
  Omission: "omitida",
  Insertion: "palavra extra",
  UnexpectedBreak: "pausa inesperada",
  MissingBreak: "falta pausa",
  Monotone: "monótono",
};

export function errorTypeLabel(errorType?: string): string {
  if (!errorType || errorType === "None") return "ok";
  return ERROR_LABELS[errorType] ?? errorType;
}

/** Words Azure flagged or scored below 80 — sorted worst first. */
export function getMispronouncedWords(words: AzureWordScore[]): AzureWordScore[] {
  return words
    .filter((w) => {
      if (!w.word?.trim()) return false;
      const err = w.errorType ?? "None";
      if (err !== "None") return true;
      return w.accuracyScore < 80;
    })
    .sort((a, b) => a.accuracyScore - b.accuracyScore);
}
