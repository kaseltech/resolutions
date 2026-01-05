const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// YearVow Color Theme
const COLORS = {
  navy: '#1F3A5A',
  navyLight: '#2A4A6F',
  navyDark: '#152840',
  gold: '#C9A75A',
  goldMuted: '#B8965A',
  goldBright: '#D4B366',
  cream: '#F5F4EF',
};

const YEAR = '2026';

// Generate 12 different mockup variations
const mockups = [
  {
    name: '1. V large, year small below',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <text x="50" y="60" text-anchor="middle" font-family="Georgia, serif" font-size="55" fill="${COLORS.gold}">V</text>
      <text x="50" y="82" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="${COLORS.goldMuted}" letter-spacing="2">${YEAR}</text>
    </svg>`
  },
  {
    name: '2. Year above, V below (spaced)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <text x="50" y="22" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="${COLORS.goldMuted}" letter-spacing="3">${YEAR}</text>
      <text x="50" y="70" text-anchor="middle" font-family="Georgia, serif" font-size="50" fill="${COLORS.gold}">V</text>
    </svg>`
  },
  {
    name: '3. Gradient bg, V prominent',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${COLORS.navyLight}"/>
          <stop offset="100%" stop-color="${COLORS.navyDark}"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#g3)"/>
      <text x="50" y="62" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="${COLORS.gold}">V</text>
      <text x="50" y="84" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="${COLORS.goldMuted}" letter-spacing="2">${YEAR}</text>
    </svg>`
  },
  {
    name: '4. V only (no year)',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <text x="50" y="68" text-anchor="middle" font-family="Georgia, serif" font-size="65" fill="${COLORS.gold}">V</text>
    </svg>`
  },
  {
    name: '5. Year as subscript',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <text x="42" y="62" text-anchor="middle" font-family="Georgia, serif" font-size="55" fill="${COLORS.gold}">V</text>
      <text x="72" y="75" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="${COLORS.goldMuted}">${YEAR}</text>
    </svg>`
  },
  {
    name: '6. Radial gradient, centered',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g6" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="${COLORS.navyLight}"/>
          <stop offset="100%" stop-color="${COLORS.navy}"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#g6)"/>
      <text x="50" y="58" text-anchor="middle" font-family="Georgia, serif" font-size="50" fill="${COLORS.gold}">V</text>
      <text x="50" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="${COLORS.goldMuted}" letter-spacing="2">${YEAR}</text>
    </svg>`
  },
  {
    name: '7. Year inline right',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <text x="35" y="62" text-anchor="middle" font-family="Georgia, serif" font-size="50" fill="${COLORS.gold}">V</text>
      <text x="72" y="62" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="${COLORS.goldMuted}">${YEAR}</text>
    </svg>`
  },
  {
    name: '8. Compact stack, tight',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <text x="50" y="50" text-anchor="middle" font-family="Georgia, serif" font-size="45" fill="${COLORS.gold}">V</text>
      <text x="50" y="72" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="${COLORS.goldMuted}" letter-spacing="1">${YEAR}</text>
    </svg>`
  },
  {
    name: '9. Year top bar style',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <rect x="20" y="18" width="60" height="1" fill="${COLORS.goldMuted}" opacity="0.5"/>
      <text x="50" y="14" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="${COLORS.goldMuted}" letter-spacing="4">${YEAR}</text>
      <text x="50" y="68" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="${COLORS.gold}">V</text>
    </svg>`
  },
  {
    name: '10. Bright gold V, cream year',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <text x="50" y="60" text-anchor="middle" font-family="Georgia, serif" font-size="55" fill="${COLORS.goldBright}">V</text>
      <text x="50" y="82" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="${COLORS.cream}" opacity="0.7" letter-spacing="2">${YEAR}</text>
    </svg>`
  },
  {
    name: '11. Minimal, year bottom right',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <text x="50" y="60" text-anchor="middle" font-family="Georgia, serif" font-size="60" fill="${COLORS.gold}">V</text>
      <text x="80" y="92" text-anchor="end" font-family="Georgia, serif" font-size="12" fill="${COLORS.goldMuted}">'26</text>
    </svg>`
  },
  {
    name: '12. Badge style with border',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${COLORS.navy}"/>
      <rect x="15" y="15" width="70" height="70" rx="8" fill="none" stroke="${COLORS.goldMuted}" stroke-width="1" opacity="0.4"/>
      <text x="50" y="58" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="${COLORS.gold}">V</text>
      <text x="50" y="78" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="${COLORS.goldMuted}" letter-spacing="2">${YEAR}</text>
    </svg>`
  },
];

async function generateMockups() {
  const outputPath = path.join(__dirname, '..', 'logo_mockups.png');

  // Create a 4x3 grid of mockups
  const cellSize = 200;
  const padding = 20;
  const labelHeight = 30;
  const cols = 4;
  const rows = 3;

  const totalWidth = cols * (cellSize + padding) + padding;
  const totalHeight = rows * (cellSize + padding + labelHeight) + padding;

  // Create composites
  const composites = [];

  for (let i = 0; i < mockups.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (cellSize + padding);
    const y = padding + row * (cellSize + padding + labelHeight);

    // Render SVG to buffer
    const svgBuffer = Buffer.from(mockups[i].svg);
    const pngBuffer = await sharp(svgBuffer)
      .resize(cellSize, cellSize)
      .png()
      .toBuffer();

    composites.push({
      input: pngBuffer,
      left: x,
      top: y + labelHeight,
    });
  }

  // Create base image with labels
  let labelsSvg = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${totalWidth}" height="${totalHeight}" fill="#1a1a2e"/>`;

  for (let i = 0; i < mockups.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (cellSize + padding);
    const y = padding + row * (cellSize + padding + labelHeight);

    labelsSvg += `<text x="${x + cellSize/2}" y="${y + 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#ffffff">${mockups[i].name}</text>`;
  }

  labelsSvg += '</svg>';

  // Create final image
  await sharp(Buffer.from(labelsSvg))
    .composite(composites)
    .png()
    .toFile(outputPath);

  console.log(`✓ Created ${outputPath}`);
  console.log('  Open this file to view all 12 mockup options');
}

generateMockups().catch(console.error);
