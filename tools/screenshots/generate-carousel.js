const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const socialDir = path.join(__dirname, '..', '..', 'social');
if (!fs.existsSync(socialDir)) fs.mkdirSync(socialDir, { recursive: true });

function getBase64Image(filePath) {
  const ext = path.extname(filePath).replace('.', '');
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:image/${ext};base64,${data}`;
}

async function buildCarouselPdf() {
  const logoData = getBase64Image(path.join(__dirname, '..', '..', 'src', 'OxygenMarketing', 'wwwroot', 'images', 'logo-official-dark.png'));
  const heroData = getBase64Image(path.join(__dirname, '..', '..', 'docs', 'screenshots', 'home-ar.png'));
  const studioData = getBase64Image(path.join(__dirname, '..', '..', 'docs', 'screenshots', 'campaign-studio.png'));
  const portfolioData = getBase64Image(path.join(__dirname, '..', '..', 'docs', 'screenshots', 'portfolio.png'));

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    @page {
      size: 1080px 1350px;
      margin: 0;
    }

    body {
      background: #0E0C09;
      color: #FAF6EE;
      font-family: 'Montserrat', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .slide {
      width: 1080px;
      height: 1350px;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 90px 80px;
      background: radial-gradient(circle at 50% 20%, #261D12 0%, #120F0B 60%, #0A0806 100%);
    }

    /* Subtle decorative background ring */
    .slide::before {
      content: '';
      position: absolute;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      border: 1px solid rgba(199, 154, 59, 0.12);
      top: -200px;
      right: -200px;
      pointer-events: none;
    }

    .slide::after {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      border: 1px dashed rgba(251, 217, 101, 0.15);
      bottom: -150px;
      left: -150px;
      pointer-events: none;
    }

    /* Top Bar */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .tag-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 22px;
      border-radius: 50px;
      background: rgba(251, 217, 101, 0.08);
      border: 1px solid rgba(251, 217, 101, 0.35);
      color: #FBD965;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .tag-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #FBD965;
      box-shadow: 0 0 10px #FBD965;
    }

    .slide-num {
      color: #8F8474;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.1em;
    }

    /* Content Area */
    .content-area {
      position: relative;
      z-index: 10;
      margin: auto 0;
    }

    h1.hero-title {
      font-size: 58px;
      font-weight: 900;
      line-height: 1.15;
      color: #FFFFFF;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }

    h2.slide-title {
      font-size: 50px;
      font-weight: 800;
      line-height: 1.2;
      color: #FFFFFF;
      margin-bottom: 24px;
      letter-spacing: -0.01em;
    }

    .gold-gradient {
      background: linear-gradient(135deg, #FBD965 0%, #D4A843 50%, #A67422 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p.slide-body {
      font-size: 26px;
      line-height: 1.5;
      color: #DDD4C4;
      font-weight: 400;
      margin-bottom: 30px;
    }

    /* Card styling */
    .glass-card {
      background: rgba(26, 21, 15, 0.85);
      border: 1.5px solid rgba(199, 154, 59, 0.35);
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      margin-top: 24px;
    }

    .screenshot-frame {
      width: 100%;
      border-radius: 18px;
      border: 1px solid rgba(199, 154, 59, 0.4);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
      margin-top: 20px;
      object-fit: cover;
    }

    /* Grid for tech stack */
    .tech-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-top: 20px;
    }

    .tech-item {
      background: rgba(22, 17, 12, 0.9);
      border: 1px solid rgba(199, 154, 59, 0.3);
      padding: 22px 26px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tech-item-title {
      font-size: 20px;
      font-weight: 700;
      color: #FBD965;
    }

    .tech-item-desc {
      font-size: 15px;
      color: #A89E8D;
      font-weight: 500;
    }

    /* Footer */
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(199, 154, 59, 0.2);
      padding-top: 30px;
      position: relative;
      z-index: 10;
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .author-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FBD965, #A67422);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #14110C;
      font-weight: 800;
      font-size: 18px;
    }

    .author-name {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .author-title {
      font-size: 14px;
      color: #9E9382;
    }

    .swipe-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #FBD965;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: COVER -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> Full-Stack Project</div>
      <div class="slide-num">01 / 07</div>
    </div>
    <div class="content-area">
      <img src="${logoData}" alt="Oxygen Logo" style="height: 68px; width: auto; object-fit: contain; margin-bottom: 40px;" />
      <h1 class="hero-title">
        Engineering a <span class="gold-gradient">Bilingual</span> Agency Web Experience
      </h1>
      <p class="slide-body" style="font-size: 28px; color: #E8DECC;">
        "Let Your Brand Breathe" · Complete web platform engineered with ASP.NET Core 8 MVC, Three.js, and GSAP.
      </p>
      <div class="glass-card" style="padding: 24px 32px; display: inline-flex; align-items: center; gap: 16px;">
        <span style="font-size: 24px;">✦</span>
        <span style="font-size: 18px; color: #FBD965; font-weight: 700;">Hiring Assessment Project · Real Brand Assets</span>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div>
          <div class="author-name">Zaid Hasan</div>
          <div class="author-title">Software Engineer</div>
        </div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- SLIDE 2: THE CHALLENGE -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 02 / The Challenge</div>
      <div class="slide-num">02 / 07</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        Agencies Need More Than <span class="gold-gradient">Static Portfolios</span>
      </h2>
      <p class="slide-body">
        The goal: create an interactive agency platform with live calculation tools, complete bilingual RTL fidelity, and smooth 3D visuals.
      </p>
      <div class="glass-card">
        <div style="font-size: 20px; font-weight: 700; color: #FBD965; margin-bottom: 14px;">Key Objectives:</div>
        <div style="display: flex; flex-direction: column; gap: 14px; font-size: 18px; color: #DDD4C4;">
          <div>✦ Real-time campaign configurator with live estimates</div>
          <div>✦ Arabic (RTL) & English (LTR) with mirrored layouts</div>
          <div>✦ Zero external CDN dependencies & sub-second loads</div>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">ASP.NET Core & WebGL</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- SLIDE 3: THE CONCEPT -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 03 / Creative Concept</div>
      <div class="slide-num">03 / 07</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        "The Brand That <span class="gold-gradient">Breathes</span>"
      </h2>
      <p class="slide-body">
        A procedural 3D golden ring and organic motion cycles bring the agency's breathing identity alive in WebGL.
      </p>
      <img src="${heroData}" class="screenshot-frame" style="height: 480px; object-position: top center;" />
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Three.js Physical Shaders</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- SLIDE 4: THE CAMPAIGN STUDIO -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 04 / Interactive Feature</div>
      <div class="slide-num">04 / 07</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        Build-Your-Campaign <span class="gold-gradient">Studio</span>
      </h2>
      <p class="slide-body">
        Clients configure platforms and services while an orbital engine computes live budget, reach, and inquiry projections.
      </p>
      <img src="${studioData}" class="screenshot-frame" style="height: 480px; object-position: center;" />
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Live C# Estimation Engine</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- SLIDE 5: TECH STACK -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 05 / Architecture</div>
      <div class="slide-num">05 / 07</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        Engineered with a <span class="gold-gradient">Modern Stack</span>
      </h2>
      <p class="slide-body">
        Clean architecture, provider-agnostic database access, and strictly self-hosted vendor libraries.
      </p>
      <div class="tech-grid">
        <div class="tech-item">
          <div class="tech-item-title">ASP.NET Core 8</div>
          <div class="tech-item-desc">High-throughput MVC backend</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">EF Core 8</div>
          <div class="tech-item-desc">Code-first SQLite & SQL Server</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">Three.js (r169)</div>
          <div class="tech-item-desc">Interactive WebGL golden ring</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">GSAP & ScrollTrigger</div>
          <div class="tech-item-desc">Storytelling & orbital physics</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">Bootstrap 5 RTL</div>
          <div class="tech-item-desc">Bi-directional layout parity</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">xUnit & Moq</div>
          <div class="tech-item-desc">11 automated unit tests</div>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Full-Stack Architecture</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- SLIDE 6: LESSONS LEARNED -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 06 / Engineering Lessons</div>
      <div class="slide-num">06 / 07</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        Key <span class="gold-gradient">Technical Takeaways</span>
      </h2>
      <p class="slide-body">
        Real lessons learned from designing for bidirectional typography and mobile WebGL hardware.
      </p>
      <div class="glass-card" style="display: flex; flex-direction: column; gap: 20px;">
        <div>
          <div style="color: #FBD965; font-weight: 700; font-size: 20px; margin-bottom: 4px;">1. RTL Typography Protection</div>
          <div style="color: #DDD4C4; font-size: 17px;">Word-level animation preserves cursive Arabic connections without breaking letter glyphs.</div>
        </div>
        <div>
          <div style="color: #FBD965; font-weight: 700; font-size: 20px; margin-bottom: 4px;">2. Mobile GPU Fallbacks</div>
          <div style="color: #DDD4C4; font-size: 17px;">Pixel ratio clamping and CSS gradients ensure smooth 60fps on lower-end devices.</div>
        </div>
        <div>
          <div style="color: #FBD965; font-weight: 700; font-size: 20px; margin-bottom: 4px;">3. Zero-Secret Configuration</div>
          <div style="color: #DDD4C4; font-size: 17px;">Using .NET user-secrets separates development credentials completely from Git history.</div>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Lessons & Insights</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- SLIDE 7: CALL TO ACTION -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 07 / Source Code</div>
      <div class="slide-num">07 / 07</div>
    </div>
    <div class="content-area" style="text-align: center;">
      <h2 class="slide-title" style="font-size: 54px; margin-bottom: 20px;">
        Explore the <span class="gold-gradient">Codebase</span>
      </h2>
      <p class="slide-body" style="font-size: 24px; max-width: 800px; margin: 0 auto 36px auto;">
        Full source code, deployment guide, and test suite are publicly available on GitHub:
      </p>
      <div class="glass-card" style="display: inline-block; padding: 26px 44px; margin-bottom: 36px; border-color: rgba(251, 217, 101, 0.6);">
        <div style="font-size: 16px; color: #8F8474; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">GitHub Repository</div>
        <div style="font-size: 26px; font-weight: 800; color: #FBD965;">Zaidmaqel/oxygen-consulting-website</div>
      </div>
      <p style="font-size: 19px; color: #A89E8D;">
        Built as a hiring assessment · AI-assisted development reviewed and studied by Zaid Hasan.
      </p>
    </div>
    <div class="bottom-bar" style="justify-content: center;">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Thank you for reviewing!</div><div class="author-title">Connect with Zaid Hasan on LinkedIn</div></div>
      </div>
    </div>
  </div>

</body>
</html>`;

  console.log('Rendering carousel HTML in Playwright...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 }
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const pdfPath = path.join(socialDir, 'carousel.pdf');
  console.log('Generating PDF at 1080x1350 per page...');
  await page.pdf({
    path: pdfPath,
    width: '1080px',
    height: '1350px',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  const pdfSize = Math.round(fs.statSync(pdfPath).size / 1024);
  console.log(`Generated carousel.pdf (${pdfSize} KB) -> ${pdfPath}`);
}

buildCarouselPdf().catch(err => {
  console.error('Failed to generate carousel PDF:', err);
  process.exit(1);
});
