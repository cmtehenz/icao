import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto("https://icao-delta.vercel.app/login", { waitUntil: "networkidle", timeout: 30000 });

const blockers = await page.evaluate(() => {
  return [...document.querySelectorAll("*")]
    .filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      if (cs.pointerEvents === "none") return false;
      const r = el.getBoundingClientRect();
      if (r.width < 100 || r.height < 100) return false;
      return (
        (cs.position === "fixed" || cs.position === "absolute") &&
        r.width >= window.innerWidth * 0.5 &&
        r.height >= window.innerHeight * 0.3
      );
    })
    .map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        class: String(el.className).slice(0, 100),
        pe: cs.pointerEvents,
        z: cs.zIndex,
        pos: cs.position,
        display: cs.display,
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top),
        left: Math.round(r.left),
      };
    });
});

console.log("Production login blockers:", JSON.stringify(blockers, null, 2));

await browser.close();
