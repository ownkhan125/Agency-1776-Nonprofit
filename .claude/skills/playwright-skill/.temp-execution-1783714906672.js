const { chromium } = require('playwright');

const BPS = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'tablet', w: 820, h: 1180 },
  { name: 'mobile', w: 390, h: 844 },
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });

  for (const b of BPS) {
    console.log(`\n=== ${b.name} ===`);
    await page.setViewportSize({ width: b.w, height: b.h });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    // Take multiple samples 500ms apart to gauge velocity
    const snap = () =>
      page.evaluate(() => {
        const stars = document.querySelectorAll('[data-star-inner]');
        return {
          count: stars.length,
          sample: Array.from(stars)
            .slice(0, 8)
            .map((s) => ({
              t: getComputedStyle(s).transform,
              o: parseFloat(getComputedStyle(s).opacity),
            })),
        };
      });

    const s0 = await snap();
    console.log(`  count=${s0.count}`);
    await page.waitForTimeout(500);
    const s1 = await snap();
    await page.waitForTimeout(500);
    const s2 = await snap();

    // Count how many stars changed opacity by >= 0.1 in 500ms window
    // (proxy for "clearly moving")
    let bigChange500 = 0;
    for (let i = 0; i < s0.sample.length; i++) {
      const d = Math.abs(s0.sample[i].o - s1.sample[i].o);
      if (d > 0.1) bigChange500++;
    }
    let bigChange1000 = 0;
    for (let i = 0; i < s0.sample.length; i++) {
      const d = Math.abs(s0.sample[i].o - s2.sample[i].o);
      if (d > 0.2) bigChange1000++;
    }
    console.log(`  stars with |Δopacity|>0.1 in 500ms: ${bigChange500}/${s0.sample.length}`);
    console.log(`  stars with |Δopacity|>0.2 in 1000ms: ${bigChange1000}/${s0.sample.length}`);

    // Transform-matrix change count
    let anyMotion = 0;
    for (let i = 0; i < s0.sample.length; i++) {
      if (s0.sample[i].t !== s1.sample[i].t) anyMotion++;
    }
    console.log(`  stars with transform change in 500ms: ${anyMotion}/${s0.sample.length}`);

    const overflow = await page.evaluate(() => ({
      s: document.documentElement.scrollWidth,
      i: window.innerWidth,
    }));
    console.log(`  overflow: ${overflow.s > overflow.i + 2 ? '❌' : '✅'}`);
  }

  console.log(`\nConsole errors: ${consoleErrors.length}`);
  consoleErrors.forEach((e) => console.log('  ', e));
  console.log(`Page errors: ${pageErrors.length}`);

  await browser.close();
})();
