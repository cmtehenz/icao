/** Development-only Captain Delta diagnostics — never swallow failures silently. */
export function warnCaptain(scope: string, message: string, err?: unknown): void {
  if (process.env.NODE_ENV === "production") return;
  if (err !== undefined) {
    console.warn(`[Captain Delta · ${scope}]`, message, err);
    return;
  }
  console.warn(`[Captain Delta · ${scope}]`, message);
}
