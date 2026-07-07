const AVIATION_HOOKS: Record<string, string> = {
  climb:
    "Tower may tell you: 'Climb and maintain three thousand.' That's one of the first clearances every pilot learns.",
  engine:
    "Before departure, crew often say: 'Check the engine.' Short, clear, operational — exactly what examiners want to hear.",
  clearance:
    "You'll hear: 'Cleared to land.' One idea, no story — that's the radio style we're building.",
  maintain:
    "ATC uses 'maintain' constantly: 'Maintain heading two seven zero.' Keep it steady and calm.",
  departure:
    "Ground or Tower: 'Cleared for departure.' Say it like you expect to fly, not like you're reading a list.",
  approach:
    "Tower: 'Cleared ILS approach runway two four.' Pilots answer short — acknowledge, read back essentials.",
  autorotation:
    "In training we drill autorotation calls early — calm voice, clear words, even when the scenario is urgent.",
  helicopter:
    "Helicopter ops stay concise: position, intention, request. No extra story on frequency.",
};

export function aviationHookForWord(word: string): string | null {
  const key = word.trim().toLowerCase();
  if (AVIATION_HOOKS[key]) return AVIATION_HOOKS[key];
  for (const [token, line] of Object.entries(AVIATION_HOOKS)) {
    if (key.includes(token)) return line;
  }
  return null;
}

export function aviationStoryForWord(word: string): string | null {
  const key = word.trim().toLowerCase();
  if (key === "engine") {
    return "I've heard many pilots rush 'engine' in a checklist. Native pilots usually stress EN-gine — short, clear, then move on.";
  }
  if (key === "climb") {
    return "I've heard pilots say 'climb' flat in a readback. Tower still understands — but native pilots lift the first syllable slightly.";
  }
  if (key === "maintain") {
    return "Many students pause before 'maintain' in a clearance. Experienced pilots link it: 'climb and maintain' — one flow.";
  }
  return null;
}
