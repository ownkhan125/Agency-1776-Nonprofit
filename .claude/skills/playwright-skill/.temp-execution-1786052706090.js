const { chromium } = require("playwright");
const TARGET_URL = "http://localhost:3002/build-finder";
const OUT = "C:\\Users\\user\\AppData\\Local\\Temp\\claude\\C--Users-user-Documents-development-claude-projects-Agency-1776-Nonprofit\\3097e95e-8e21-4fd4-8833-88bc6693c057\\scratchpad";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(TARGET_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  // Hero eyebrow + divider label computed sizes/weights
  const hero = await page.evaluate(() => {
    const g = (el) => (el ? (() => { const s = getComputedStyle(el); return { fontSize: s.fontSize, fontWeight: s.fontWeight }; })() : null);
    const eyebrow = document.querySelector("#build-finder-hero span")?.parentElement;
    // divider label: the span with 'Match the Mission'
    const labels = [...document.querySelectorAll("#build-finder-hero span")];
    const divLabel = labels.find((s) => /Match the Mission/i.test(s.textContent || ""));
    const eyeRow = labels.find((s) => /Build Finder/i.test(s.textContent || ""))?.parentElement;
    return { eyebrow: g(eyeRow), divider: g(divLabel) };
  });
  console.log("HERO eyebrow row:", JSON.stringify(hero.eyebrow), "(expect ~13px desktop, weight 500)");
  console.log("HERO divider label:", JSON.stringify(hero.divider), "(expect ~11px, weight 500)");

  // Screenshot hero
  await page.screenshot({ path: `${OUT}\\bf-hero.png` });

  // Scroll to results; measure a card paragraph + input font size, and seam alignment
  await page.locator("#build-finder-results").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const card = await page.evaluate(() => {
    const p = document.querySelector("#build-finder-results li p");
    const inp = document.querySelector("#build-finder select");
    const fs = (el) => (el ? getComputedStyle(el).fontSize : null);
    const seams = [...document.querySelectorAll("#build-finder-results [data-animate-seam]")]
      .map((s) => Math.round(s.getBoundingClientRect().top));
    return { cardPara: fs(p), select: fs(inp), seams };
  });
  console.log("\nCard paragraph font-size:", card.cardPara, "(expect 16px desktop)");
  console.log("Finder select font-size:", card.select, "(expect 16px desktop)");
  console.log("Seam tops:", JSON.stringify(card.seams), "-> spread:", Math.max(...card.seams) - Math.min(...card.seams), "px (expect 0)");
  await page.screenshot({ path: `${OUT}\\bf-cards-final.png`, fullPage: false });

  console.log("\nConsole/page errors:", errors.length ? errors.join("\n") : "(none)");
  await browser.close();
})();
