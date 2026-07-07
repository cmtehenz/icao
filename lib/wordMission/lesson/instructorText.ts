/** Trim premium instructor prose for UI and Captain Delta speech. */
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
