/** Developer-only — premium batch-01 concepts in Word Mission when true. */
export function isDevKnowledgeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEV_KNOWLEDGE === "true";
}
