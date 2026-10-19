const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const sharp = require('../../src/OxygenMarketing/node_modules/sharp');

const outDir = path.join(__dirname, '..', '..', 'docs', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function saveOptimizedPng(buffer, filename) {
  const targetPath = path.join(outDir, filename);
  // Optimize PNG using sharp quantization / palette
  const optimized = await sharp(buffer)
    .png({
      quality: 85,
      compressionLevel: 9,
      palette: true
    })
    .toBuffer();

  fs.writeFileSync(targetPath, optimized);
  const sizeKb = Math.round(optimized.length / 1024);
  console.log(`[Captured] ${filename} (${sizeKb} KB) -> ${targetPath}`);
}

async function run() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  console.log('Browser launched successfully.');

  // 1. Home AR (Desktop 1440x900)
  {
    console.log('Capturing home-ar.png...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    await context.addCookies([
      { name: '.AspNetCore.Culture', value: 'c=ar|uic=ar', domain: 'localhost', path: '/' }
    ]);
    const page = await context.newPage();
    await page.goto('http://localhost:5200', { waitUntil: 'networkidle' });
    // Wait for preloader dismissal (takes ~2.2s failsafe or 1.4s load)
    await page.waitForTimeout(3000);
    const buf = await page.screenshot();
    await saveOptimizedPng(buf, 'home-ar.png');
    await context.close();
  }

  // 2. Home EN (Desktop 1440x900)
  {
    console.log('Capturing home-en.png...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    await context.addCookies([
      { name: '.AspNetCore.Culture', value: 'c=en|uic=en', domain: 'localhost', path: '/' }
    ]);
    const page = await context.newPage();
    await page.goto('http://localhost:5200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const buf = await page.screenshot();
    await saveOptimizedPng(buf, 'home-en.png');
    await context.close();
  }

  // 3. Campaign Studio (Desktop 1440x900)
  {
    console.log('Capturing campaign-studio.png...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    await context.addCookies([
      { name: '.AspNetCore.Culture', value: 'c=en|uic=en', domain: 'localhost', path: '/' }
    ]);
    const page = await context.newPage();
    await page.goto('http://localhost:5200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const studioEl = await page.$('#studio');
    if (studioEl) {
      await studioEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
    }
    const buf = await page.screenshot();
    await saveOptimizedPng(buf, 'campaign-studio.png');
    await context.close();
  }

  // 4. Portfolio (Desktop 1440x900)
  {
    console.log('Capturing portfolio.png...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    await context.addCookies([
      { name: '.AspNetCore.Culture', value: 'c=en|uic=en', domain: 'localhost', path: '/' }
    ]);
    const page = await context.newPage();
    await page.goto('http://localhost:5200/Home/Portfolio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const buf = await page.screenshot();
    await saveOptimizedPng(buf, 'portfolio.png');
    await context.close();
  }

  // 5. Services (Desktop 1440x900)
  {
    console.log('Capturing services.png...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    await context.addCookies([
      { name: '.AspNetCore.Culture', value: 'c=en|uic=en', domain: 'localhost', path: '/' }
    ]);
    const page = await context.newPage();
    await page.goto('http://localhost:5200/Home/Services', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const buf = await page.screenshot();
    await saveOptimizedPng(buf, 'services.png');
    await context.close();
  }

  // 6. Contact (Desktop 1440x900)
  {
    console.log('Capturing contact.png...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    await context.addCookies([
      { name: '.AspNetCore.Culture', value: 'c=en|uic=en', domain: 'localhost', path: '/' }
    ]);
    const page = await context.newPage();
    await page.goto('http://localhost:5200/Home/Contact', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const buf = await page.screenshot();
    await saveOptimizedPng(buf, 'contact.png');
    await context.close();
  }

  // 7. Admin Dashboard (Desktop 1440x900)
  {
    console.log('Capturing admin-dashboard.png...');
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
      });
      const page = await context.newPage();
      await page.goto('http://localhost:5200/admin/login', { waitUntil: 'networkidle' });
      await page.fill('#Email', process.env.ADMIN_EMAIL || 'admin@oxygen.jo');
      await page.fill('#Password', adminPassword);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.click('button[type="submit"]')
      ]);
      await page.waitForTimeout(2000);
      console.log('Logged in, URL is:', page.url());
      const buf = await page.screenshot();
      await saveOptimizedPng(buf, 'admin-dashboard.png');
      await context.close();
    } else {
      console.log('ADMIN_PASSWORD not set; skipping live admin dashboard re-capture.');
    }
  }

  // 8. Home Mobile (Mobile 390x844)
  {
    console.log('Capturing home-mobile.png...');
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });
    await context.addCookies([
      { name: '.AspNetCore.Culture', value: 'c=ar|uic=ar', domain: 'localhost', path: '/' }
    ]);
    const page = await context.newPage();
    await page.goto('http://localhost:5200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const buf = await page.screenshot();
    await saveOptimizedPng(buf, 'home-mobile.png');
    await context.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
