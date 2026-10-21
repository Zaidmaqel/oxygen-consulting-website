const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const socialDir = path.join(__dirname, '..', '..', 'social');
if (!fs.existsSync(socialDir)) fs.mkdirSync(socialDir, { recursive: true });

function getBase64Image(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const ext = path.extname(filePath).replace('.', '');
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:image/${ext};base64,${data}`;
}

async function buildCarouselPdf() {
  console.log('Loading screenshot assets for 9 slides...');
  const logoData = getBase64Image(path.join(__dirname, '..', '..', 'src', 'OxygenMarketing', 'wwwroot', 'images', 'logo-official-dark.png'));
  const heroArData = getBase64Image(path.join(__dirname, '..', '..', 'docs', 'screenshots', 'home-ar.png'));
  const heroEnData = getBase64Image(path.join(__dirname, '..', '..', 'docs', 'screenshots', 'home-en.png'));
  const studioActiveData = getBase64Image(path.join(__dirname, '..', '..', 'docs', 'screenshots', 'campaign-studio-active.png'));
  const adminData = getBase64Image(path.join(__dirname, '..', '..', 'docs', 'screenshots', 'admin-dashboard.png'));
  const mobileData = getBase64Image(path.join(__dirname, '..', '..', 'docs', 'screenshots', 'home-mobile.png'));

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Oxygen Marketing - LinkedIn Carousel</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Montserrat:wght@400;500;600;700;800;900&family=Fira+Code:wght@500;600&display=swap');
    
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
      padding: 85px 80px;
      background: radial-gradient(circle at 50% 15%, #261D12 0%, #120F0B 55%, #0A0806 100%);
    }

    /* Ambient Gold Rings */
    .slide::before {
      content: '';
      position: absolute;
      width: 820px;
      height: 820px;
      border-radius: 50%;
      border: 1px solid rgba(199, 154, 59, 0.12);
      top: -220px;
      right: -220px;
      pointer-events: none;
    }

    .slide::after {
      content: '';
      position: absolute;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      border: 1px dashed rgba(251, 217, 101, 0.12);
      bottom: -160px;
      left: -160px;
      pointer-events: none;
    }

    /* Top Navigation Bar */
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
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.1em;
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
      font-family: 'Fira Code', monospace;
    }

    /* Content Area */
    .content-area {
      position: relative;
      z-index: 10;
      margin: auto 0;
      width: 100%;
    }

    h1.hero-title {
      font-size: 56px;
      font-weight: 900;
      line-height: 1.15;
      color: #FFFFFF;
      margin-bottom: 22px;
      letter-spacing: -0.02em;
    }

    h2.slide-title {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.2;
      color: #FFFFFF;
      margin-bottom: 18px;
      letter-spacing: -0.01em;
    }

    .gold-gradient {
      background: linear-gradient(135deg, #FBD965 0%, #D4A843 50%, #A67422 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p.slide-body {
      font-size: 24px;
      line-height: 1.48;
      color: #DDD4C4;
      font-weight: 400;
      margin-bottom: 24px;
    }

    /* Glass Cards */
    .glass-card {
      background: rgba(26, 21, 15, 0.88);
      border: 1.5px solid rgba(199, 154, 59, 0.35);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(10px);
    }

    .screenshot-frame {
      width: 100%;
      border-radius: 16px;
      border: 1.5px solid rgba(199, 154, 59, 0.4);
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.75);
      object-fit: cover;
      display: block;
    }

    /* Architecture Flow Styling */
    .arch-flow-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 10px;
    }

    .arch-tier {
      display: flex;
      align-items: center;
      background: rgba(26, 21, 15, 0.92);
      border: 1.5px solid rgba(199, 154, 59, 0.35);
      border-radius: 16px;
      padding: 16px 24px;
      position: relative;
    }

    .arch-step-badge {
      font-family: 'Fira Code', monospace;
      font-size: 13px;
      font-weight: 700;
      color: #0E0C09;
      background: #FBD965;
      padding: 4px 10px;
      border-radius: 6px;
      margin-right: 18px;
      letter-spacing: 0.05em;
    }

    .arch-tier-title {
      font-size: 19px;
      font-weight: 800;
      color: #FAF6EE;
      min-width: 275px;
      margin-right: 14px;
    }

    .arch-tier-desc {
      font-size: 15px;
      color: #A89E8D;
      flex-grow: 1;
    }

    .arch-tier-tech {
      font-family: 'Fira Code', monospace;
      font-size: 13px;
      color: #FBD965;
      background: rgba(251, 217, 101, 0.1);
      border: 1px solid rgba(251, 217, 101, 0.25);
      padding: 4px 12px;
      border-radius: 8px;
    }

    .arch-connector {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 12px;
      color: #FBD965;
      font-size: 14px;
      margin: -4px 0;
      opacity: 0.8;
    }

    /* Grid for tech stack */
    .tech-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .tech-item {
      background: rgba(22, 17, 12, 0.92);
      border: 1px solid rgba(199, 154, 59, 0.32);
      padding: 20px 24px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tech-item-title {
      font-size: 19px;
      font-weight: 800;
      color: #FBD965;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tech-item-desc {
      font-size: 14px;
      color: #A89E8D;
      font-weight: 500;
      line-height: 1.4;
    }

    /* Side-by-side Bilingual comparison */
    .bilingual-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 16px;
    }

    .bilingual-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .bilingual-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #FBD965;
      background: rgba(251, 217, 101, 0.1);
      border: 1px solid rgba(251, 217, 101, 0.3);
      padding: 6px 14px;
      border-radius: 30px;
      width: fit-content;
    }

    /* Mobile mockup layout */
    .mobile-showcase {
      display: flex;
      align-items: center;
      gap: 36px;
      margin-top: 16px;
    }

    .mobile-frame {
      width: 340px;
      flex-shrink: 0;
      border-radius: 32px;
      border: 4px solid #2B2318;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(199, 154, 59, 0.4);
      overflow: hidden;
      background: #0E0C09;
    }

    .mobile-img {
      width: 100%;
      height: 520px;
      object-fit: cover;
      object-position: top;
      display: block;
    }

    /* Bottom Navigation / Author Bar */
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(199, 154, 59, 0.2);
      padding-top: 26px;
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
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .author-title {
      font-size: 13px;
      color: #9E9382;
    }

    .swipe-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #FBD965;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>

  <!-- ==========================================
       SLIDE 1: COVER
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> Built for Oxygen Consulting &amp; Marketing</div>
      <div class="slide-num">01 / 09</div>
    </div>
    <div class="content-area">
      <img src="${logoData}" alt="Oxygen Logo" style="height: 64px; width: auto; object-fit: contain; margin-bottom: 36px;" />
      <h1 class="hero-title">
        Engineering a <span class="gold-gradient">Bilingual</span> Agency Web Platform
      </h1>
      <p class="slide-body" style="font-size: 26px; color: #E8DECC;">
        "Let Your Brand Breathe" · Complete web experience engineered with ASP.NET Core 8 MVC, Three.js (r169), and GSAP.
      </p>
      <div class="glass-card" style="padding: 22px 28px; display: inline-flex; align-items: center; gap: 14px; margin-top: 10px;">
        <span style="font-size: 22px; color: #FBD965;">✦</span>
        <span style="font-size: 17px; color: #FBD965; font-weight: 700;">Hiring Assessment Project · Production-Ready Codebase</span>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div>
          <div class="author-name">Zaid Hasan</div>
          <div class="author-title">Software Engineer · Full-Stack &amp; WebGL</div>
        </div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- ==========================================
       SLIDE 2: ARCHITECTURE FLOW DIAGRAM
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 02 / Architecture</div>
      <div class="slide-num">02 / 09</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        End-to-End <span class="gold-gradient">System Flow</span>
      </h2>
      <p class="slide-body">
        Production request pipeline from client interaction through reverse proxy, MVC routing, and data persistence.
      </p>

      <div class="arch-flow-container">
        <!-- 1. Browser -->
        <div class="arch-tier">
          <span class="arch-step-badge">TIER 1</span>
          <div class="arch-tier-title">Client Browser</div>
          <div class="arch-tier-desc">Bidirectional RTL/LTR UI, WebGL Canvas &amp; Studio</div>
          <div class="arch-tier-tech">HTTPS :443</div>
        </div>

        <div class="arch-connector">↓ TLS Termination &amp; Static Pass-through</div>

        <!-- 2. Nginx -->
        <div class="arch-tier">
          <span class="arch-step-badge">TIER 2</span>
          <div class="arch-tier-title">Nginx Reverse Proxy</div>
          <div class="arch-tier-desc">SSL Offloading, Gzip compression, Security Headers</div>
          <div class="arch-tier-tech">Proxy Pass</div>
        </div>

        <div class="arch-connector">↓ Reverse Proxy Loopback</div>

        <!-- 3. Kestrel -->
        <div class="arch-tier">
          <span class="arch-step-badge">TIER 3</span>
          <div class="arch-tier-title">Kestrel Server</div>
          <div class="arch-tier-desc">Cross-platform ASP.NET Core host runtime</div>
          <div class="arch-tier-tech">.NET 8 Host</div>
        </div>

        <div class="arch-connector">↓ Request Pipeline &amp; Routing</div>

        <!-- 4. ASP.NET Core MVC -->
        <div class="arch-tier">
          <span class="arch-step-badge">TIER 4</span>
          <div class="arch-tier-title">ASP.NET Core MVC</div>
          <div class="arch-tier-desc">Controllers, Dependency Injection, Culture Middleware</div>
          <div class="arch-tier-tech">MVC Core</div>
        </div>

        <div class="arch-connector">↓ ORM Context &amp; Repository</div>

        <!-- 5. EF Core -->
        <div class="arch-tier">
          <span class="arch-step-badge">TIER 5</span>
          <div class="arch-tier-title">Entity Framework Core 8</div>
          <div class="arch-tier-desc">Type-safe LINQ queries, automatic seed migrations</div>
          <div class="arch-tier-tech">EF Core</div>
        </div>

        <div class="arch-connector">↓ Storage Provider</div>

        <!-- 6. SQLite / SQL Server -->
        <div class="arch-tier">
          <span class="arch-step-badge">TIER 6</span>
          <div class="arch-tier-title">SQLite / SQL Server</div>
          <div class="arch-tier-desc">Provider-agnostic database storing sample demo data</div>
          <div class="arch-tier-tech">Relational DB</div>
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

  <!-- ==========================================
       SLIDE 3: CREATIVE CONCEPT (3D HERO)
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 03 / Creative Concept</div>
      <div class="slide-num">03 / 09</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        "The Brand That <span class="gold-gradient">Breathes</span>"
      </h2>
      <p class="slide-body">
        A procedural 3D golden ring rendered via Three.js (r169) with physical shaders and subtle breathing cycle oscillations.
      </p>
      <img src="${heroArData}" class="screenshot-frame" style="height: 460px; object-position: top center;" alt="3D Breathing Ring Hero" />
      <div class="glass-card" style="padding: 18px 24px; margin-top: 18px; display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #FBD965; font-size: 15px; font-weight: 700;">✦ Three.js (r169) WebGL</span>
        <span style="color: #A89E8D; font-size: 14px;">Clamped DPR · GPU Adaptive · Pure Client-Side Mesh</span>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Three.js Physical Shaders</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- ==========================================
       SLIDE 4: BUILD-YOUR-CAMPAIGN STUDIO
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 04 / Interactive Tool</div>
      <div class="slide-num">04 / 09</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        Build-Your-Campaign <span class="gold-gradient">Studio</span>
      </h2>
      <p class="slide-body">
        Interactive campaign configurator connecting selected channels &amp; services to an orbital SVG visual with live metrics.
      </p>
      <img src="${studioActiveData}" class="screenshot-frame" style="height: 480px; object-fit: contain; background: rgba(18, 14, 10, 0.95); padding: 8px;" alt="Active Campaign Studio Configurator" />
      <div class="glass-card" style="padding: 18px 24px; margin-top: 16px;">
        <div style="font-size: 15px; font-weight: 800; color: #FBD965; margin-bottom: 4px;">
          ✦ Hybrid Estimation Architecture
        </div>
        <div style="font-size: 14px; color: #DDD4C4; line-height: 1.45;">
          Primary calculations run server-side in C# (<code style="color: #FBD965; font-family: 'Fira Code', monospace;">CampaignStudioService</code>) via async JSON endpoints, with synchronous JavaScript formula fallback in <code style="color: #FBD965; font-family: 'Fira Code', monospace;">studio.js</code> for instant offline continuity.
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Hybrid C# / JS Calculation Engine</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- ==========================================
       SLIDE 5: BILINGUAL PARITY (AR / EN)
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 05 / Bilingual Engineering</div>
      <div class="slide-num">05 / 09</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        1:1 Arabic &amp; English <span class="gold-gradient">Parity</span>
      </h2>
      <p class="slide-body">
        Complete bi-directional layout symmetry with mirrored navigation, Cairo/Montserrat typography, and zero layout drift.
      </p>

      <div class="bilingual-grid">
        <div class="bilingual-col">
          <div class="bilingual-tag">
            <span class="tag-dot"></span> العربية (RTL) · Cairo Font
          </div>
          <img src="${heroArData}" class="screenshot-frame" style="height: 380px; object-position: top center;" alt="Arabic RTL Layout" />
        </div>
        <div class="bilingual-col">
          <div class="bilingual-tag">
            <span class="tag-dot"></span> English (LTR) · Montserrat Font
          </div>
          <img src="${heroEnData}" class="screenshot-frame" style="height: 380px; object-position: top center;" alt="English LTR Layout" />
        </div>
      </div>

      <div class="glass-card" style="padding: 16px 22px; margin-top: 18px;">
        <div style="font-size: 14px; color: #DDD4C4; line-height: 1.4;">
          <strong style="color: #FBD965;">Direction-Aware Architecture:</strong> Culture cookie provider (<code style="color: #FBD965; font-family: 'Fira Code', monospace;">.AspNetCore.Culture</code>) seamlessly switches between LTR and RTL Bootstrap 5 styles without duplicate templates.
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Bi-Directional RTL/LTR Systems</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- ==========================================
       SLIDE 6: STAFF ADMIN PORTAL
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 06 / Operations</div>
      <div class="slide-num">06 / 09</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        Secure <span class="gold-gradient">Admin Dashboard</span>
      </h2>
      <p class="slide-body">
        Dedicated operational area for staff to manage inquiries, case studies, and content with sample seed data.
      </p>
      <img src="${adminData}" class="screenshot-frame" style="height: 440px; object-position: top center;" alt="Admin Dashboard" />
      <div class="glass-card" style="padding: 18px 24px; margin-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 15px; font-weight: 800; color: #FBD965; margin-bottom: 2px;">✦ Sample Seeded Metrics</div>
            <div style="font-size: 13.5px; color: #DDD4C4;">Zero real messages or emails · Automated DB seeder provides realistic demo volume</div>
          </div>
          <div style="font-family: 'Fira Code', monospace; font-size: 13px; color: #FBD965; background: rgba(251, 217, 101, 0.1); padding: 6px 12px; border-radius: 8px;">
            Cookie Auth · Anti-CSRF
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">ASP.NET Core Admin Area</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- ==========================================
       SLIDE 7: MOBILE RESPONSIVE DESIGN
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 07 / Mobile Experience</div>
      <div class="slide-num">07 / 09</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        Adaptive <span class="gold-gradient">Mobile Interface</span>
      </h2>
      <p class="slide-body">
        Touch-first responsive layouts engineered for fluid scrolling and conservative mobile GPU resource usage.
      </p>

      <div class="mobile-showcase">
        <div class="mobile-frame">
          <img src="${mobileData}" class="mobile-img" alt="Mobile View" />
        </div>
        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px;">
          <div class="glass-card" style="padding: 20px;">
            <div style="color: #FBD965; font-weight: 800; font-size: 17px; margin-bottom: 4px;">1. Clamped Device Pixel Ratio</div>
            <div style="color: #DDD4C4; font-size: 14px; line-height: 1.45;">Canvas rendering resolution is capped at 1.5x DPR to prevent thermal throttling on high-density mobile screens.</div>
          </div>
          <div class="glass-card" style="padding: 20px;">
            <div style="color: #FBD965; font-weight: 800; font-size: 17px; margin-bottom: 4px;">2. Touch-Optimized Studio</div>
            <div style="color: #DDD4C4; font-size: 14px; line-height: 1.45;">Interactive pills offer 48px touch targets with instant tactile feedback and keyboard accessibility.</div>
          </div>
          <div class="glass-card" style="padding: 20px;">
            <div style="color: #FBD965; font-weight: 800; font-size: 17px; margin-bottom: 4px;">3. Fluid Bidirectional Menus</div>
            <div style="color: #DDD4C4; font-size: 14px; line-height: 1.45;">Off-canvas navigation smoothly slides from right-to-left in Arabic and left-to-right in English.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Mobile-First UI Architecture</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- ==========================================
       SLIDE 8: TECH STACK & VERIFIED METRICS
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 08 / Verified Engineering</div>
      <div class="slide-num">08 / 09</div>
    </div>
    <div class="content-area">
      <h2 class="slide-title">
        Verified <span class="gold-gradient">Technical Standards</span>
      </h2>
      <p class="slide-body">
        Built with clean architecture, verified unit test suites, and self-hosted vendor libraries.
      </p>
      <div class="tech-grid">
        <div class="tech-item">
          <div class="tech-item-title">
            <span>ASP.NET Core 8</span>
            <span style="font-size: 12px; color: #8F8474;">Backend</span>
          </div>
          <div class="tech-item-desc">Modular MVC architecture with scoped services and DI</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">
            <span>EF Core 8</span>
            <span style="font-size: 12px; color: #8F8474;">Data Tier</span>
          </div>
          <div class="tech-item-desc">Code-first schema with SQLite &amp; SQL Server provider support</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">
            <span>Three.js (r169)</span>
            <span style="font-size: 12px; color: #8F8474;">WebGL</span>
          </div>
          <div class="tech-item-desc">Self-hosted library in wwwroot/lib with physical gold shading</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">
            <span>11 Unit Tests</span>
            <span style="font-size: 12px; color: #FBD965;">100% Pass</span>
          </div>
          <div class="tech-item-desc">Automated tests via xUnit verifying estimates and validations</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">
            <span>Bootstrap 5 RTL</span>
            <span style="font-size: 12px; color: #8F8474;">Layout</span>
          </div>
          <div class="tech-item-desc">Mirrored grid and directional components without drift</div>
        </div>
        <div class="tech-item">
          <div class="tech-item-title">
            <span>Zero-CDN Setup</span>
            <span style="font-size: 12px; color: #8F8474;">Self-Hosted</span>
          </div>
          <div class="tech-item-desc">All fonts, scripts, and stylesheets bundled locally</div>
        </div>
      </div>

      <div class="glass-card" style="margin-top: 18px; padding: 18px 24px;">
        <div style="color: #FBD965; font-size: 14.5px; font-weight: 700; margin-bottom: 4px;">✦ Security &amp; Credentials Isolation</div>
        <div style="color: #DDD4C4; font-size: 13.5px;">Using .NET user-secrets isolates all development keys and admin hashes cleanly from Git version control.</div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div><div class="author-name">Zaid Hasan</div><div class="author-title">Full-Stack Quality &amp; Verification</div></div>
      </div>
      <div class="swipe-hint">Swipe Next <span>→</span></div>
    </div>
  </div>

  <!-- ==========================================
       SLIDE 9: SOURCE CODE & CONTACT
       ========================================== -->
  <div class="slide">
    <div class="top-bar">
      <div class="tag-badge"><span class="tag-dot"></span> 09 / Source Code &amp; Connect</div>
      <div class="slide-num">09 / 09</div>
    </div>
    <div class="content-area" style="text-align: center;">
      <h2 class="slide-title" style="font-size: 50px; margin-bottom: 18px;">
        Explore the <span class="gold-gradient">Codebase</span>
      </h2>
      <p class="slide-body" style="font-size: 23px; max-width: 820px; margin: 0 auto 30px auto;">
        Full source code, automated test suite, and deployment guides are publicly available on GitHub:
      </p>

      <!-- GitHub Repo Card -->
      <div class="glass-card" style="display: inline-block; padding: 22px 36px; margin-bottom: 20px; border-color: rgba(251, 217, 101, 0.6); text-align: center; width: 100%; max-width: 820px;">
        <div style="font-size: 14px; color: #8F8474; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px;">GitHub Repository</div>
        <div style="font-size: 22px; font-weight: 800; color: #FBD965; font-family: 'Fira Code', monospace; letter-spacing: -0.01em;">github.com/Zaidmaqel/oxygen-consulting-website</div>
      </div>

      <!-- LinkedIn Placeholder Card -->
      <div class="glass-card" style="display: inline-block; padding: 22px 36px; margin-bottom: 28px; border-color: rgba(199, 154, 59, 0.4); text-align: center; width: 100%; max-width: 820px;">
        <div style="font-size: 14px; color: #8F8474; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px;">LinkedIn Profile</div>
        <div style="font-size: 22px; font-weight: 700; color: #FAF6EE; font-family: 'Fira Code', monospace; letter-spacing: 0.02em;">linkedin.com/in/YOUR-HANDLE</div>
      </div>

      <!-- AI-Assistance Disclosure -->
      <div class="glass-card" style="padding: 18px 28px; max-width: 840px; margin: 0 auto; text-align: center; background: rgba(18, 14, 10, 0.95); border: 1px dashed rgba(251, 217, 101, 0.3);">
        <p style="font-size: 15px; color: #A89E8D; line-height: 1.5; margin: 0;">
          ✦ <strong style="color: #FBD965;">Disclosure:</strong> Built as a hiring assessment project using AI-assisted development tools. Every line of C# backend logic, Three.js shaders, bilingual middleware, and test suites was reviewed, verified, and studied by Zaid Hasan.
        </p>
      </div>
    </div>
    <div class="bottom-bar" style="justify-content: center;">
      <div class="author-info">
        <div class="author-avatar">ZH</div>
        <div>
          <div class="author-name">Thank you for reviewing!</div>
          <div class="author-title">Zaid Hasan · Software Engineer</div>
        </div>
      </div>
    </div>
  </div>

</body>
</html>`;

  console.log('Rendering 9-slide carousel HTML in Playwright with channel: msedge...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 }
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take screenshot of each slide for visual verification
  const previewDir = path.join(socialDir, 'preview');
  if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

  const slideHandles = await page.$$('.slide');
  console.log(`Found ${slideHandles.length} slides. Capturing preview images...`);
  for (let i = 0; i < slideHandles.length; i++) {
    const slideImgPath = path.join(previewDir, `slide-${i + 1}.png`);
    await slideHandles[i].screenshot({ path: slideImgPath });
  }

  const pdfPath = path.join(socialDir, 'carousel.pdf');
  console.log('Generating 9-slide PDF at 1080x1350 per page...');
  await page.pdf({
    path: pdfPath,
    width: '1080px',
    height: '1350px',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  const pdfSize = Math.round(fs.statSync(pdfPath).size / 1024);
  console.log(`Successfully generated carousel.pdf (${pdfSize} KB, 9 slides) -> ${pdfPath}`);
}

buildCarouselPdf().catch(err => {
  console.error('Failed to generate carousel PDF:', err);
  process.exit(1);
});
