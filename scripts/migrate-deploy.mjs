#!/usr/bin/env node
/**
 * Neon: migrations must use the direct host (no "-pooler") to avoid advisory-lock timeouts.
 * Vercel runtime can keep DATABASE_URL with pooler; this script prefers DIRECT_DATABASE_URL.
 */
import { execSync } from "node:child_process";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local" });

const pooler = process.env.DATABASE_URL?.trim();
const directEnv = process.env.DIRECT_DATABASE_URL?.trim();
const direct =
  directEnv || (pooler?.includes("-pooler") ? pooler.replace("-pooler", "") : pooler);

if (!direct) {
  console.warn("[migrate] DATABASE_URL is not set — skipping migrate deploy.");
  process.exit(0);
}

const env = { ...process.env, DATABASE_URL: direct };
const mode = directEnv ? "DIRECT_DATABASE_URL" : direct.includes("-pooler") ? "pooler" : "direct";

function runCapture(command) {
  return execSync(command, { encoding: "utf8", env, stdio: ["ignore", "pipe", "pipe"] });
}

console.log(`[migrate] checking status (${mode})`);

let statusOutput = "";
try {
  statusOutput = runCapture("npx prisma migrate status");
  process.stdout.write(statusOutput);
} catch (error) {
  const err = error;
  statusOutput = `${err.stdout ?? ""}${err.stderr ?? ""}`;
  if (statusOutput) process.stdout.write(statusOutput);
}

if (statusOutput.includes("Database schema is up to date")) {
  console.log("[migrate] database already up to date — skipping deploy");
  process.exit(0);
}

console.log("[migrate] applying pending migrations…");
execSync("npx prisma migrate deploy", { stdio: "inherit", env });
