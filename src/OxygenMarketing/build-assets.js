const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, 'wwwroot', 'images');
const rootDir = path.join(__dirname, 'wwwroot');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

function getLogoSvg(taglineColor = '#231F20', transparent = true) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 180" width="680" height="180">
  <defs>
    <linearGradient id="oxygenGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A67422" />
      <stop offset="22%" stop-color="#C79A3B" />
      <stop offset="50%" stop-color="#FBD965" />
      <stop offset="78%" stop-color="#C79A3B" />
      <stop offset="100%" stop-color="#A67422" />
    </linearGradient>
    <linearGradient id="pureGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FBD965" />
      <stop offset="100%" stop-color="#A67422" />
    </linearGradient>
  </defs>
  <g id="logo-mark">
    <!-- OXYGEN Wordmark -->
    <text x="30" y="102" font-family="'Montserrat', 'Arial Black', 'Helvetica Neue', sans-serif" font-weight="900" font-size="94" fill="url(#oxygenGold)" letter-spacing="2">OXYGEN</text>
    
    <!-- Small vertical gold rectangle with 'pure' in white -->
    <rect x="520" y="32" width="22" height="70" rx="3" fill="url(#pureGold)" />
    <text x="531" y="67" font-family="'Montserrat', sans-serif" font-weight="600" font-size="16" fill="#FFFFFF" text-anchor="middle" transform="rotate(-90 531 67)" letter-spacing="2">pure</text>
    
    <!-- Tagline: Consulting & Marketing -->
    <text x="33" y="146" font-family="'Montserrat', 'Segoe UI', sans-serif" font-weight="500" font-size="23.5" fill="${taglineColor}" letter-spacing="10">Consulting &amp; Marketing</text>
  </g>
</svg>`;
}

function getSquareOriginalSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <linearGradient id="creamBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF6EE" />
      <stop offset="35%" stop-color="#F5EFE3" />
      <stop offset="70%" stop-color="#EFE6D4" />
      <stop offset="100%" stop-color="#E9DFC9" />
    </linearGradient>
    <linearGradient id="diagonalStreak" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0" />
      <stop offset="100%" stop-color="#D9C7A5" stop-opacity="0.25" />
    </linearGradient>
    <linearGradient id="oxygenGold2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A67422" />
      <stop offset="22%" stop-color="#C79A3B" />
      <stop offset="50%" stop-color="#FBD965" />
      <stop offset="78%" stop-color="#C79A3B" />
      <stop offset="100%" stop-color="#A67422" />
    </linearGradient>
    <linearGradient id="pureGold2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FBD965" />
      <stop offset="100%" stop-color="#A67422" />
    </linearGradient>
  </defs>
  <!-- Background with warm cream and soft diagonal streaks -->
  <rect width="1000" height="1000" fill="url(#creamBg)" />
  <rect width="1000" height="1000" fill="url(#diagonalStreak)" />
  
  <!-- Subtle ambient decorative rings -->
  <circle cx="850" cy="200" r="300" stroke="#E5D6BA" stroke-width="1.5" fill="none" opacity="0.4" />
  <circle cx="850" cy="200" r="450" stroke="#E5D6BA" stroke-width="1" fill="none" opacity="0.25" />
  
  <!-- Centered Logo Content -->
  <g transform="translate(160, 410)">
    <text x="30" y="102" font-family="'Montserrat', 'Arial Black', sans-serif" font-weight="900" font-size="94" fill="url(#oxygenGold2)" letter-spacing="2">OXYGEN</text>
    <rect x="520" y="32" width="22" height="70" rx="3" fill="url(#pureGold2)" />
    <text x="531" y="67" font-family="'Montserrat', sans-serif" font-weight="600" font-size="16" fill="#FFFFFF" text-anchor="middle" transform="rotate(-90 531 67)" letter-spacing="2">pure</text>
    <text x="33" y="146" font-family="'Montserrat', 'Segoe UI', sans-serif" font-weight="500" font-size="23.5" fill="#231F20" letter-spacing="10">Consulting &amp; Marketing</text>
  </g>
</svg>`;
}

function getFaviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="favGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A67422" />
      <stop offset="25%" stop-color="#C79A3B" />
      <stop offset="50%" stop-color="#FBD965" />
      <stop offset="75%" stop-color="#C79A3B" />
      <stop offset="100%" stop-color="#A67422" />
    </linearGradient>
    <radialGradient id="favInnerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FBD965" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#A67422" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="#14110C" />
  <circle cx="256" cy="256" r="160" fill="url(#favInnerGlow)" />
  <!-- Stylized Iconic O Ring -->
  <circle cx="256" cy="256" r="140" fill="none" stroke="url(#favGold)" stroke-width="48" stroke-linecap="round" />
  <!-- Small Pure Gold Accent -->
  <circle cx="355" cy="157" r="14" fill="#FBD965" />
</svg>`;
}

function getOgSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF6EE" />
      <stop offset="40%" stop-color="#F5EFE3" />
      <stop offset="100%" stop-color="#EADFC8" />
    </linearGradient>
    <linearGradient id="ogGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A67422" />
      <stop offset="25%" stop-color="#C79A3B" />
      <stop offset="50%" stop-color="#FBD965" />
      <stop offset="75%" stop-color="#C79A3B" />
      <stop offset="100%" stop-color="#A67422" />
    </linearGradient>
    <linearGradient id="ogPure" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FBD965" />
      <stop offset="100%" stop-color="#A67422" />
    </linearGradient>
    <radialGradient id="ogGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FBD965" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#C79A3B" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogBg)" />
  <circle cx="600" cy="315" r="320" fill="url(#ogGlow)" />
  
  <!-- Translucent Breathing Golden Ring motif from profile -->
  <circle cx="600" cy="270" r="190" fill="none" stroke="#C79A3B" stroke-width="2.5" opacity="0.35" />
  <circle cx="600" cy="270" r="230" fill="none" stroke="#FBD965" stroke-width="1.5" stroke-dasharray="10 15" opacity="0.4" />
  
  <!-- Centered Logo -->
  <g transform="translate(260, 180)">
    <text x="30" y="102" font-family="'Montserrat', 'Arial Black', sans-serif" font-weight="900" font-size="94" fill="url(#ogGold)" letter-spacing="2">OXYGEN</text>
    <rect x="520" y="32" width="22" height="70" rx="3" fill="url(#ogPure)" />
    <text x="531" y="67" font-family="'Montserrat', sans-serif" font-weight="600" font-size="16" fill="#FFFFFF" text-anchor="middle" transform="rotate(-90 531 67)" letter-spacing="2">pure</text>
    <text x="33" y="146" font-family="'Montserrat', 'Segoe UI', sans-serif" font-weight="500" font-size="23.5" fill="#231F20" letter-spacing="10">Consulting &amp; Marketing</text>
  </g>
  
  <!-- Slogan & Arabic Name -->
  <text x="600" y="440" font-family="'Montserrat', sans-serif" font-weight="700" font-size="34" fill="#A67422" text-anchor="middle" letter-spacing="3">LET YOUR BRAND BREATHE</text>
  <text x="600" y="490" font-family="'Cairo', sans-serif" font-weight="700" font-size="28" fill="#4A453E" text-anchor="middle">مؤسسة أكسجين للاستشارات والتسويق • عمان، الأردن</text>
</svg>`;
}

async function buildAll() {
  console.log('Generating SVG files...');
  const lightSvg = getLogoSvg('#231F20');
  const darkSvg = getLogoSvg('#F5EFE3');
  const origSvg = getSquareOriginalSvg();
  const favSvg = getFaviconSvg();
  const ogSvg = getOgSvg();

  fs.writeFileSync(path.join(imgDir, 'logo.svg'), lightSvg);
  fs.writeFileSync(path.join(imgDir, 'logo-dark.svg'), darkSvg);
  fs.writeFileSync(path.join(imgDir, 'favicon.svg'), favSvg);

  console.log('Generating logo-original.jpg...');
  await sharp(Buffer.from(origSvg)).jpeg({ quality: 95 }).toFile(path.join(imgDir, 'logo-original.jpg'));

  console.log('Generating transparent logo.png and logo-dark.png...');
  await sharp(Buffer.from(lightSvg)).png().toFile(path.join(imgDir, 'logo.png'));
  await sharp(Buffer.from(darkSvg)).png().toFile(path.join(imgDir, 'logo-dark.png'));

  console.log('Generating Open Graph og-image.jpg...');
  await sharp(Buffer.from(ogSvg)).jpeg({ quality: 90 }).toFile(path.join(imgDir, 'og-image.jpg'));

  console.log('Generating favicons (32, 180, 512, ico)...');
  await sharp(Buffer.from(favSvg)).resize(32, 32).png().toFile(path.join(imgDir, 'favicon-32x32.png'));
  await sharp(Buffer.from(favSvg)).resize(180, 180).png().toFile(path.join(imgDir, 'favicon-180x180.png'));
  await sharp(Buffer.from(favSvg)).resize(512, 512).png().toFile(path.join(imgDir, 'favicon-512x512.png'));
  
  // Copy to root as standard web icons
  await sharp(Buffer.from(favSvg)).resize(32, 32).png().toFile(path.join(rootDir, 'favicon-32x32.png'));
  await sharp(Buffer.from(favSvg)).resize(180, 180).png().toFile(path.join(rootDir, 'apple-touch-icon.png'));
  await sharp(Buffer.from(favSvg)).resize(512, 512).png().toFile(path.join(rootDir, 'android-chrome-512x512.png'));

  // Simple ICO file wrapping a 32x32 PNG
  const png32 = await sharp(Buffer.from(favSvg)).resize(32, 32).png().toBuffer();
  // Simple ICO header for 1 PNG icon
  const icoHeader = Buffer.alloc(6 + 16);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // ICO type
  icoHeader.writeUInt16LE(1, 4); // 1 image
  icoHeader.writeUInt8(32, 6);  // width
  icoHeader.writeUInt8(32, 7);  // height
  icoHeader.writeUInt8(0, 8);   // color count
  icoHeader.writeUInt8(0, 9);   // reserved
  icoHeader.writeUInt16LE(1, 10); // color planes
  icoHeader.writeUInt16LE(32, 12); // bpp
  icoHeader.writeUInt32LE(png32.length, 14); // image size
  icoHeader.writeUInt32LE(22, 18); // offset
  const icoBuffer = Buffer.concat([icoHeader, png32]);
  fs.writeFileSync(path.join(rootDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(imgDir, 'favicon.ico'), icoBuffer);

  console.log('All brand assets and logo variants generated successfully!');
}

buildAll().catch(err => {
  console.error(err);
  process.exit(1);
});
