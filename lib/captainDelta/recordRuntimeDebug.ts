export const PRON_RECORD_DEBUG_EVENT = "icao-pron-record-debug";

export type PronRecordDebugPayload = {
  source: string;
  phase: "pointerdown" | "mousedown" | "click" | "handler";
  hitTarget?: string | null;
};

export function emitPronRecordDebug(payload: PronRecordDebugPayload): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PRON_RECORD_DEBUG_EVENT, { detail: payload }));
}

export function describeElementFromPoint(x: number, y: number): string {
  const el = document.elementFromPoint(x, y);
  if (!el) return "null";
  const id = el.id ? `#${el.id}` : "";
  const classes = el.className
    ? `.${String(el.className).trim().split(/\s+/).slice(0, 3).join(".")}`
    : "";
  return `${el.tagName}${id}${classes}`;
}
