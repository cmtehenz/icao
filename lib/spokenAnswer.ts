/** Remove study labels like "1 - PREPARATION:" from card text for speaking and Azure reference. */
export function stripIdeaLabels(text: string): string {
  return text.replace(/\b\d+\s*-\s*[^:]+:\s*/g, "");
}

export function buildSpokenAnswer(answer: string): string {
  return stripIdeaLabels(answer).replace(/\s+/g, " ").trim();
}
