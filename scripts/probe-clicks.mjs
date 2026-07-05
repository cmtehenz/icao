import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

async function probe(x, y, label) {
  const stack = await page.evaluate(({ x, y }) => {
    const out = [];
    let el = document.elementFromPoint(x, y);
    while (el) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out.push({
        tag: el.tagName,
        class: String(el.className).slice(0, 80),
        pe: cs.pointerEvents,
        z: cs.zIndex,
        pos: cs.position,
        display: cs.display,
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top),
        left: Math.round(r.left),
      });
      el = el.parentElement;
      if (out.length > 12) break;
    }
    return out;
  }, { x, y });
  console.log(`\n${label} @ ${x},${y}:`);
  for (const e of stack) console.log(" ", e);
}

// Try login with test user from env or skip to home if redirect
await page.goto("http://localhost:3456/", { waitUntil: "networkidle" });
const url = page.url();
console.log("URL after /:", url);

if (url.includes("/login")) {
  const email = process.env.TEST_EMAIL || "gustavo@test.com";
  const password = process.env.TEST_PASSWORD || "test1234";
  await page.fill('input[type="email"]', email).catch(() => {});
  await page.fill('input[type="password"]', password).catch(() => {});
  const hasForm = await page.locator(".auth-form").count();
  if (hasForm) {
    await page.click('button[type="submit"]').catch(() => {});
    await page.waitForTimeout(2000);
  }
  await page.goto("http://localhost:3456/", { waitUntil: "networkidle" });
}

console.log("Final URL:", page.url());

// List all fixed full-screen-ish elements
const blockers = await page.evaluate(() => {
  return [...document.querySelectorAll("*")]
    .filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "absolute") return false;
      const r = el.getBoundingClientRect();
      return r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.5;
    })
    .map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        class: String(el.className).slice(0, 80),
        pe: cs.pointerEvents,
        z: cs.zIndex,
        display: cs.display,
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    });
});
console.log("\nLarge fixed/absolute elements:", blockers);

await probe(130, 300, "sidebar link area");
await probe(640, 400, "main content");
await probe(640, 760, "bottom nav");
await probe(1200, 700, "captain fab area");

await browser.close();
