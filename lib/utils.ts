export function parseMemoryFlow(memory: string): string[] {
  const m = memory.trim();
  if (m.includes("→")) return m.split("→").map((x) => x.trim()).filter(Boolean);
  if (m.includes("-") && !m.includes(" ")) return m.split("-").map((x) => x.trim()).filter(Boolean);
  return [m];
}

export function formatIdea(text: string): { label: string; rest: string } | null {
  const match = text.match(/^([0-9] - [^:]+:)(.*)/);
  if (!match) return null;
  return { label: match[1], rest: match[2] };
}
