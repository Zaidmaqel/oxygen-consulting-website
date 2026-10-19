const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const casesDir = path.join(__dirname, 'wwwroot', 'images', 'cases');
if (!fs.existsSync(casesDir)) fs.mkdirSync(casesDir, { recursive: true });

function getCaseSvg(titleEn, titleAr, industry, metric1, metric2, iconPath) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A1612" />
      <stop offset="60%" stop-color="#14110C" />
      <stop offset="100%" stop-color="#0D0B08" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A67422" />
      <stop offset="50%" stop-color="#FBD965" />
      <stop offset="100%" stop-color="#C79A3B" />
    </linearGradient>
    <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FBD965" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#A67422" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bgGrad)" />
  <circle cx="650" cy="250" r="280" fill="url(#ringGlow)" />
  <circle cx="650" cy="250" r="180" fill="none" stroke="#C79A3B" stroke-width="2" opacity="0.4" />
  <circle cx="650" cy="250" r="220" fill="none" stroke="#FBD965" stroke-width="1.5" stroke-dasharray="8 12" opacity="0.3" />
  
  <!-- Subtle sector grid -->
  <line x1="50" y1="80" x2="750" y2="80" stroke="#332B20" stroke-width="1" />
  
  <!-- Badge -->
  <rect x="50" y="40" width="160" height="28" rx="14" fill="#262018" stroke="#A67422" stroke-width="1" />
  <text x="130" y="59" font-family="'Montserrat', sans-serif" font-weight="600" font-size="12" fill="#FBD965" text-anchor="middle" letter-spacing="1">${industry.toUpperCase()}</text>
  
  <!-- Title -->
  <text x="50" y="160" font-family="'Montserrat', sans-serif" font-weight="800" font-size="34" fill="#F5EFE3">${titleEn}</text>
  <text x="50" y="210" font-family="'Cairo', sans-serif" font-weight="700" font-size="28" fill="#C79A3B">${titleAr}</text>
  
  <!-- KPI Metrics Banner -->
  <rect x="50" y="320" width="220" height="110" rx="12" fill="#201B14" stroke="#4D3B1C" stroke-width="1" />
  <text x="75" y="360" font-family="'Montserrat', sans-serif" font-weight="500" font-size="13" fill="#8F877B">${metric1.label}</text>
  <text x="75" y="405" font-family="'Montserrat', sans-serif" font-weight="800" font-size="32" fill="url(#goldGrad)">${metric1.value}</text>

  <rect x="290" y="320" width="220" height="110" rx="12" fill="#201B14" stroke="#4D3B1C" stroke-width="1" />
  <text x="315" y="360" font-family="'Montserrat', sans-serif" font-weight="500" font-size="13" fill="#8F877B">${metric2.label}</text>
  <text x="315" y="405" font-family="'Montserrat', sans-serif" font-weight="800" font-size="32" fill="url(#goldGrad)">${metric2.value}</text>
</svg>`;
}

async function buildCaseImages() {
  const cases = [
    {
      file: 'case-clothing.jpg',
      titleEn: 'Fashion &amp; Apparel',
      titleAr: 'دراسة حالة — قطاع ملابس',
      industry: 'Fashion / E-Comm',
      m1: { label: 'TOTAL REACH', value: '100K+' },
      m2: { label: 'CONVERSATIONS', value: '3,500' }
    },
    {
      file: 'case-beauty.jpg',
      titleEn: 'Aesthetic Clinics',
      titleAr: 'دراسة حالة — عيادات التجميل',
      industry: 'Healthcare / Beauty',
      m1: { label: 'TARGET REACH', value: '85,000' },
      m2: { label: 'CREATIVE SCORE', value: '75 / 100' }
    },
    {
      file: 'case-realestate.jpg',
      titleEn: 'Real Estate Projects',
      titleAr: 'دراسة حالة — قطاع إسكانات',
      industry: 'Real Estate / Housing',
      m1: { label: 'QUALIFIED REACH', value: '170,000' },
      m2: { label: 'INQUIRIES', value: '3,000+' }
    },
    {
      file: 'case-education.jpg',
      titleEn: 'Educational Academy',
      titleAr: 'دراسة حالة — مركز تعليمي',
      industry: 'Education / Academy',
      m1: { label: 'OPTIMIZED CPC', value: '$0.70' },
      m2: { label: 'EFFICIENCY', value: '+65%' }
    }
  ];

  for (const c of cases) {
    const svg = getCaseSvg(c.titleEn, c.titleAr, c.industry, c.m1, c.m2);
    const dest = path.join(casesDir, c.file);
    await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(dest);
    console.log(`Generated ${c.file}`);
  }
}

buildCaseImages().catch(console.error);
