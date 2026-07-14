const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:3002';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const failed = [];
  page.on('response', (res) => {
    if (res.status() >= 400) failed.push({ url: res.url(), status: res.status() });
  });

  await page.goto(TARGET_URL + '/', { waitUntil: 'networkidle', timeout: 20000 });
  console.log('Failed requests on /:');
  failed.forEach((f) => console.log(`  ${f.status}  ${f.url}`));

  await browser.close();
})();
