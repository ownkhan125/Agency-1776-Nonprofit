const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const TARGET_URL = 'http://localhost:3000';
const OUT_DIR = 'C:/Users/General/AppData/Local/Temp/theme-swap';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 390,  height: 844 },
];

const readPixel = (file, x, y) => {
  const png = PNG.sync.read(fs.readFileSync(path.join(OUT_DIR, file)));
  if (x >= png.width || y >= png.height) return { r: 0, g: 0, b: 0 };
  const i = (png.width * y + x) << 2;
  return { r: png.data[i], g: png.data[i+1], b: png.data[i+2] };
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  for (const vp of VIEWPORTS) {
    console.log(`\n########## ${vp.name} (${vp.width}x${vp.height}) ##########`);
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));

    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // === Initial (light) state ===
    const before = await page.evaluate(() => ({
      theme:      document.documentElement.dataset.theme,
      bodyBg:     getComputedStyle(document.body).backgroundColor,
      heroBg:     getComputedStyle(document.querySelector('#hero')).backgroundColor,
      h1Color:    getComputedStyle(document.querySelector('#hero h1')).color,
      bodyColor:  getComputedStyle(document.querySelector('#hero p')).color,
      ctaBg:      getComputedStyle(document.querySelector('#hero .tac-btn')).backgroundColor,
      ctaText:    getComputedStyle(document.querySelector('#hero .tac-btn')).color,
    }));
    console.log('BEFORE:', JSON.stringify(before, null, 2));
    await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}-1-light.png`), fullPage: false });
    const lightSample = readPixel(`${vp.name}-1-light.png`, Math.floor(vp.width/2), Math.floor(vp.height/2));
    console.log(`Center pixel (light): rgb(${lightSample.r},${lightSample.g},${lightSample.b})`);

    // === Toggle to dark WITHOUT refresh ===
    const themeButton = await page.$('button[aria-label*="dark"], button[aria-label*="Dark"], button[aria-label*="Switch to dark"]');
    if (!themeButton) {
      console.log('❌ Theme toggle button not found!');
      await ctx.close();
      continue;
    }
    await themeButton.click();
    await page.waitForTimeout(600); // Wait for CSS transition (~320ms) + a couple frames
    await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}-2-dark.png`), fullPage: false });

    const after = await page.evaluate(() => ({
      theme:      document.documentElement.dataset.theme,
      bodyBg:     getComputedStyle(document.body).backgroundColor,
      heroBg:     getComputedStyle(document.querySelector('#hero')).backgroundColor,
      h1Color:    getComputedStyle(document.querySelector('#hero h1')).color,
      bodyColor:  getComputedStyle(document.querySelector('#hero p')).color,
      ctaBg:      getComputedStyle(document.querySelector('#hero .tac-btn')).backgroundColor,
      ctaText:    getComputedStyle(document.querySelector('#hero .tac-btn')).color,
    }));
    console.log('AFTER (dark):', JSON.stringify(after, null, 2));
    const darkSample = readPixel(`${vp.name}-2-dark.png`, Math.floor(vp.width/2), Math.floor(vp.height/2));
    console.log(`Center pixel (dark): rgb(${darkSample.r},${darkSample.g},${darkSample.b})`);

    // === Toggle back to light ===
    await themeButton.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}-3-light-again.png`), fullPage: false });
    const backToLight = await page.evaluate(() => ({
      theme:      document.documentElement.dataset.theme,
      heroBg:     getComputedStyle(document.querySelector('#hero')).backgroundColor,
      h1Color:    getComputedStyle(document.querySelector('#hero h1')).color,
    }));
    const lightAgainSample = readPixel(`${vp.name}-3-light-again.png`, Math.floor(vp.width/2), Math.floor(vp.height/2));
    console.log(`Center pixel (light again): rgb(${lightAgainSample.r},${lightAgainSample.g},${lightAgainSample.b})`);

    // === Assertions ===
    const passes = [
      ['theme attribute switches to dark',       after.theme === 'dark'],
      ['theme attribute switches back to light', backToLight.theme === 'light'],
      ['hero H1 color changes on swap',           after.h1Color !== before.h1Color],
      ['hero body color changes on swap',         after.bodyColor !== before.bodyColor],
      ['CTA color set updates on swap',           after.ctaBg !== before.ctaBg || after.ctaText !== before.ctaText],
      ['center pixel darkens in dark mode',       (darkSample.r + darkSample.g + darkSample.b) < (lightSample.r + lightSample.g + lightSample.b) - 100],
      ['center pixel lightens back',              (lightAgainSample.r + lightAgainSample.g + lightAgainSample.b) > (darkSample.r + darkSample.g + darkSample.b) + 100],
    ];
    console.log('\nAssertions:');
    passes.forEach(([n, ok]) => console.log(`  ${ok ? '✅' : '❌'} ${n}`));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const nonFav = errors.filter(e => !e.toLowerCase().includes('favicon') && !e.includes('404 (Not Found)'));
    console.log(`Overflow: ${overflow}px, console errors: ${nonFav.length}`);
    nonFav.forEach(e => console.log('   -', e.substring(0, 160)));

    await ctx.close();
  }
  await browser.close();
})();
