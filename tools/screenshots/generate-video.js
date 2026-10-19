const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const ffmpegPath = require('./node_modules/ffmpeg-static');

const socialDir = path.join(__dirname, '..', '..', 'social');
if (!fs.existsSync(socialDir)) fs.mkdirSync(socialDir, { recursive: true });

const tempVideoDir = path.join(__dirname, 'temp_rec');
if (!fs.existsSync(tempVideoDir)) fs.mkdirSync(tempVideoDir, { recursive: true });

async function setCaption(page, text) {
  await page.evaluate((captionText) => {
    let overlay = document.getElementById('demo-caption-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'demo-caption-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '24px';
      overlay.style.left = '50%';
      overlay.style.transform = 'translateX(-50%)';
      overlay.style.zIndex = '999999';
      overlay.style.background = 'rgba(18, 14, 10, 0.92)';
      overlay.style.border = '1.5px solid rgba(251, 217, 101, 0.6)';
      overlay.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.8), 0 0 20px rgba(251, 217, 101, 0.3)';
      overlay.style.color = '#FBD965';
      overlay.style.fontFamily = "'Montserrat', 'Cairo', system-ui, sans-serif";
      overlay.style.fontSize = '15px';
      overlay.style.fontWeight = '700';
      overlay.style.letterSpacing = '0.08em';
      overlay.style.textTransform = 'uppercase';
      overlay.style.padding = '8px 22px';
      overlay.style.borderRadius = '50px';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.gap = '10px';
      overlay.style.pointerEvents = 'none';
      overlay.style.transition = 'all 0.35s ease';

      const dot = document.createElement('span');
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.background = '#FBD965';
      dot.style.boxShadow = '0 0 10px #FBD965';
      overlay.appendChild(dot);

      const label = document.createElement('span');
      label.id = 'demo-caption-text';
      overlay.appendChild(label);

      document.body.appendChild(overlay);
    }
    const label = document.getElementById('demo-caption-text');
    if (label) label.innerText = captionText;
  }, text);
}

async function smoothScroll(page, targetY, durationMs = 1200) {
  await page.evaluate(async ({ targetY, durationMs }) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();

    return new Promise(resolve => {
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        window.scrollTo(0, startY + diff * ease);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }, { targetY, durationMs });
  await page.waitForTimeout(durationMs + 200);
}

async function record() {
  console.log('Starting Playwright recording in 1920x1080...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: tempVideoDir,
      size: { width: 1920, height: 1080 }
    },
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  console.log('1. Loading site with preloader...');
  await page.goto('http://localhost:5200');
  await setCaption(page, 'Golden Iris Preloader');
  await page.waitForTimeout(1400);

  console.log('2. 3D Hero interactive ring...');
  await setCaption(page, 'Interactive 3D Hero • WebGL & Three.js');
  // Circular mouse movements over hero canvas
  const centerX = 960;
  const centerY = 450;
  for (let angle = 0; angle < Math.PI * 2; angle += 0.7) {
    const mx = centerX + Math.cos(angle) * 220;
    const my = centerY + Math.sin(angle) * 140;
    await page.mouse.move(mx, my, { steps: 3 });
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(600);

  console.log('3. Scroll Storytelling section...');
  await setCaption(page, 'Scroll Storytelling • GSAP ScrollTrigger');
  const storyPos = await page.evaluate(() => {
    const el = document.getElementById('scroll-story-section');
    return el ? el.offsetTop : 1600;
  });
  await smoothScroll(page, storyPos, 900);
  await page.waitForTimeout(1400);

  console.log('4. Campaign Studio configurator...');
  await setCaption(page, 'Campaign Studio • Live Calculation Engine');
  const studioPos = await page.evaluate(() => {
    const el = document.getElementById('campaign-studio');
    return el ? el.offsetTop - 50 : 2500;
  });
  await smoothScroll(page, studioPos, 900);
  await page.waitForTimeout(500);

  // Click TikTok platform pill
  const tiktokBtn = page.locator('button.studio-pill-option[data-value="TikTok"]').first();
  if (await tiktokBtn.count() > 0) {
    await tiktokBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await tiktokBtn.click();
    console.log('Clicked TikTok pill');
    await page.waitForTimeout(800);
  }

  // Click Analytics & Reporting service pill
  const analyticsBtn = page.locator('button.studio-pill-option[data-value="analytics_reporting"]').first();
  if (await analyticsBtn.count() > 0) {
    await analyticsBtn.click();
    console.log('Clicked Analytics pill');
    await page.waitForTimeout(900);
  }

  // Click Awareness Goal pill
  const awarenessBtn = page.locator('button.studio-pill-option[data-value="awareness"]').first();
  if (await awarenessBtn.count() > 0) {
    await awarenessBtn.click();
    console.log('Clicked Awareness pill');
    await page.waitForTimeout(1000);
  }

  console.log('5. Portfolio section...');
  await setCaption(page, 'Filterable Portfolio • KPI Case Studies');
  const portfolioPos = await page.evaluate(() => {
    const el = document.getElementById('portfolio');
    return el ? el.offsetTop - 60 : 3400;
  });
  await smoothScroll(page, portfolioPos, 900);
  await page.waitForTimeout(1500);

  console.log('6. Switching language to English LTR...');
  await setCaption(page, 'Bilingual Architecture • Arabic RTL & English');
  await smoothScroll(page, 0, 700);
  await page.waitForTimeout(300);

  const langBtn = page.locator('form[action*="SetLanguage"] button.lang-switcher-btn').first();
  if (await langBtn.count() > 0) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      langBtn.click()
    ]);
    console.log('Switched language to English!');
    await setCaption(page, 'Mirrored LTR Layout • English & Arabic');
    await page.waitForTimeout(2200);
  }

  console.log('Recording finished, saving video...');
  const videoObj = page.video();
  await context.close();
  await browser.close();

  const rawVideoPath = await videoObj.path();
  console.log('Raw recorded WebM:', rawVideoPath, `(${fs.statSync(rawVideoPath).size} bytes)`);

  // Convert to 16:9 MP4 (1920x1080)
  const mp4_16x9 = path.join(socialDir, 'demo-video-16x9.mp4');
  console.log('Encoding 16:9 MP4 with H.264...');
  execFileSync(ffmpegPath, [
    '-y',
    '-i', rawVideoPath,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-an',
    mp4_16x9
  ], { stdio: 'inherit' });
  console.log('Generated:', mp4_16x9, `(${Math.round(fs.statSync(mp4_16x9).size / 1024 / 1024 * 10) / 10} MB)`);

  // Convert to 4:5 MP4 (1080x1350) for LinkedIn mobile feed
  const mp4_4x5 = path.join(socialDir, 'demo-video-4x5.mp4');
  console.log('Encoding 4:5 MP4 with H.264...');
  // Scale to width 1080, pad height to 1350 with #14110C background
  execFileSync(ffmpegPath, [
    '-y',
    '-i', rawVideoPath,
    '-vf', 'scale=1080:608,pad=1080:1350:(ow-iw)/2:(oh-ih)/2:color=#14110C',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-an',
    mp4_4x5
  ], { stdio: 'inherit' });
  console.log('Generated:', mp4_4x5, `(${Math.round(fs.statSync(mp4_4x5).size / 1024 / 1024 * 10) / 10} MB)`);

  // Cleanup raw temp file
  fs.unlinkSync(rawVideoPath);
  console.log('Video generation complete!');
}

record().catch(err => {
  console.error('Video generation failed:', err);
  process.exit(1);
});
