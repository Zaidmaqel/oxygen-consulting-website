const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureCleanAssets() {
  console.log('Launching msedge for clean captures...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Capture Admin Dashboard with sanitized sample data only
  {
    console.log('Capturing admin dashboard with sample data...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 920 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    await page.goto('http://localhost:5200/admin/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.fill('#Email', 'admin@oxygen.jo');
    await page.fill('#Password', 'DevPass2026!Local');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    await page.waitForTimeout(1000);
    console.log('Logged into Admin, URL:', page.url());

    const adminScreenshotPath = path.join(__dirname, '..', '..', 'docs', 'screenshots', 'admin-dashboard.png');
    await page.screenshot({ path: adminScreenshotPath });
    console.log('Saved clean admin dashboard to:', adminScreenshotPath);
    await context.close();
  }

  // 2. Capture Campaign Studio with full metrics visible
  {
    console.log('Capturing campaign studio with active options...');
    const context = await browser.newContext({
      viewport: { width: 1400, height: 1050 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    await page.goto('http://localhost:5200/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const studioSection = page.locator('#campaign-studio');
    await studioSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Click platforms: TikTok, LinkedIn (Instagram & Facebook active by default)
    await page.locator('button[data-category="platform"][data-value="TikTok"]').click();
    await page.waitForTimeout(150);
    await page.locator('button[data-category="platform"][data-value="LinkedIn"]').click();
    await page.waitForTimeout(150);

    // Click services: account_management, analytics_reporting
    await page.locator('button[data-category="service"][data-value="account_management"]').click();
    await page.waitForTimeout(150);
    await page.locator('button[data-category="service"][data-value="analytics_reporting"]').click();
    await page.waitForTimeout(150);

    // Click goal: sales
    await page.locator('button[data-category="goal"][data-value="sales"]').click();

    // Wait for async fetch to finish and numbers to animate
    await page.waitForTimeout(1500);

    const budget = await page.locator('#studio-budget-display').innerText();
    const reach = await page.locator('#studio-reach-display').innerText();
    const conv = await page.locator('#studio-conv-display').innerText();
    console.log('Studio metrics captured:', { budget, reach, conv });

    const studioContainer = page.locator('#campaign-studio .studio-container');
    const studioScreenshotPath = path.join(__dirname, '..', '..', 'docs', 'screenshots', 'campaign-studio-active.png');
    await studioContainer.screenshot({ path: studioScreenshotPath });
    console.log('Saved clean campaign studio container to:', studioScreenshotPath);

    await context.close();
  }

  await browser.close();
  console.log('Clean asset captures completed successfully!');
}

captureCleanAssets().catch(err => {
  console.error('Error during asset capture:', err);
  process.exit(1);
});
