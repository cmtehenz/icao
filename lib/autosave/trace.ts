export type AutosaveTracePayload = {
  source: string;
  component: string;
  reason: string;
  payloadChanged: boolean;
  previousHash: string | null;
  nextHash: string;
  skipped?: boolean;
};

export function traceAutosave(payload: AutosaveTracePayload): void {
  console.info("[Autosave]", payload);
}
