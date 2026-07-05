/** Development-only Azure mic / recognizer diagnostics. */
export function logAzureRuntime(scope: string, message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[Azure · ${scope}]`, message);
}
