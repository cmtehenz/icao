export function findCaptainTarget(targetId: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(`[data-captain-target="${targetId}"]`);
}

export function findAllCaptainTargets(): HTMLElement[] {
  if (typeof document === "undefined") return [];
  return Array.from(document.querySelectorAll<HTMLElement>("[data-captain-target]"));
}
