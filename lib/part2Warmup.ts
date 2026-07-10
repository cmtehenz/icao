/** Part 2 recording gate removed — stubs kept for shadow/coach panels and pronunciation flow. */

export function markWarmupSatisfied(): void {
  /* no-op: Part 2 no longer blocks on pronunciation warm-up */
}

export function recordPart2RecordingScore(_accuracy: number): void {
  /* no-op */
}

export function isPart2WarmupRequired(): boolean {
  return false;
}

export function canUsePart2Coach(): boolean {
  return true;
}

export function part2WarmupMessage(): string {
  return "";
}
