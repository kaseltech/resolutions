const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 2026 Color Theme - Teal/Emerald for navigation/journey
const COLORS = {
  primary: '#0d9488',
  secondary: '#14b8a6',
  accent: '#2dd4bf',
  glow: '#5eead4',
  background: '#0f172a',
  ring: 'rgba(45, 212, 191, 0.25)',
  cardinalMarks: '#334155',
};

// Generate compass logo SVG
function generateLogoSVG(size, includeBg = true) {
  const bgCircle = includeBg ? `
    <!-- Background circle -->
    <circle cx="50" cy="50" r="50" fill="${COLORS.background}"/>
  ` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Compass needle gradient - North -->
    <linearGradient id="needleNorth" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.glow}" />
      <stop offset="100%" stop-color="${COLORS.primary}" />
    </linearGradient>

    <!-- Compass needle gradient - South -->
    <linearGradient id="needleSouth" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>

    <!-- Glow filter -->
    <filter id="compassGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  ${bgCircle}

  <!-- Outer ring -->
  <circle cx="50" cy="50" r="46" fill="none" stroke="${COLORS.ring}" stroke-width="2.5" />

  <!-- Background circle -->
  <circle cx="50" cy="50" r="43" fill="${COLORS.background}" />

  <!-- Cardinal direction marks -->
  <g stroke="${COLORS.cardinalMarks}" stroke-width="2" stroke-linecap="round">
    <line x1="50" y1="12" x2="50" y2="18" />
    <line x1="88" y1="50" x2="82" y2="50" />
    <line x1="50" y1="88" x2="50" y2="82" />
    <line x1="12" y1="50" x2="18" y2="50" />
  </g>

  <!-- Minor tick marks -->
  <g stroke="${COLORS.cardinalMarks}" stroke-width="1" stroke-linecap="round" opacity="0.5">
    <line x1="76.5" y1="23.5" x2="72.5" y2="27.5" />
    <line x1="76.5" y1="76.5" x2="72.5" y2="72.5" />
    <line x1="23.5" y1="76.5" x2="27.5" y2="72.5" />
    <line x1="23.5" y1="23.5" x2="27.5" y2="27.5" />
  </g>

  <!-- Compass needle -->
  <g filter="url(#compassGlow)">
    <!-- North needle (colored) -->
    <path d="M50 18 L55 50 L50 54 L45 50 Z" fill="url(#needleNorth)" />

    <!-- South needle (muted) -->
    <path d="M50 82 L55 50 L50 46 L45 50 Z" fill="url(#needleSouth)" />
  </g>

  <!-- Center pivot -->
  <circle cx="50" cy="50" r="6" fill="${COLORS.background}" stroke="${COLORS.primary}" stroke-width="2" />
  <circle cx="50" cy="50" r="3" fill="${COLORS.accent}" />
  <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
</svg>`;
}

// Generate splash screen SVG with journey theme
function generateSplashSVG(size) {
  const logoSize = Math.round(size * 0.22);
  const logoOffset = (size - logoSize) / 2;
  const gridSize = Math.round(size / 20);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1a" />
      <stop offset="40%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>

    <!-- Path gradient -->
    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLORS.primary}" stop-opacity="0.1" />
      <stop offset="50%" stop-color="${COLORS.accent}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${COLORS.glow}" stop-opacity="0.5" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bgGrad)" />

  <!-- Subtle grid pattern -->
  <g stroke="rgba(45, 212, 191, 0.03)" stroke-width="1">
    ${Array.from({ length: 21 }, (_, i) => `
      <line x1="0" y1="${i * gridSize}" x2="${size}" y2="${i * gridSize}" />
      <line x1="${i * gridSize}" y1="0" x2="${i * gridSize}" y2="${size}" />
    `).join('')}
  </g>

  <!-- Journey path -->
  <path
    d="M ${size * 0.15} ${size * 0.75} Q ${size * 0.3} ${size * 0.6} ${size * 0.4} ${size * 0.55} T ${size * 0.5} ${size * 0.5}"
    stroke="url(#pathGrad)"
    stroke-width="${size * 0.003}"
    fill="none"
    stroke-linecap="round"
  />

  <!-- Waypoint dots -->
  <circle cx="${size * 0.2}" cy="${size * 0.72}" r="${size * 0.006}" fill="${COLORS.accent}" opacity="0.5" />
  <circle cx="${size * 0.32}" cy="${size * 0.6}" r="${size * 0.006}" fill="${COLORS.accent}" opacity="0.5" />
  <circle cx="${size * 0.42}" cy="${size * 0.53}" r="${size * 0.006}" fill="${COLORS.accent}" opacity="0.5" />

  <!-- Centered logo -->
  <g transform="translate(${logoOffset}, ${logoOffset})">
    ${generateLogoSVG(logoSize, true).replace(/<\?xml[^?]*\?>\s*/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
  </g>
</svg>`;
}

async function generateAssets() {
  const iosAssetsPath = path.join(__dirname, '../ios/App/App/Assets.xcassets');

  // App Icon sizes for iOS
  const iconSizes = [
    { size: 20, scales: [1, 2, 3] },
    { size: 29, scales: [2, 3] },
    { size: 40, scales: [1, 2, 3] },
    { size: 60, scales: [2, 3] },
    { size: 76, scales: [1, 2] },
    { size: 83.5, scales: [2] },
    { size: 512, scales: [2] },
    { size: 1024, scales: [1] },
  ];

  console.log('Generating app icons...');

  // Generate logo SVG for icons (with background)
  const iconSvg = Buffer.from(generateLogoSVG(1024, true));

  for (const { size, scales } of iconSizes) {
    for (const scale of scales) {
      const pixelSize = Math.round(size * scale);
      const filename = scale === 1
        ? `AppIcon-${size}.png`
        : `AppIcon-${size}@${scale}x.png`;

      const outputPath = path.join(iosAssetsPath, 'AppIcon.appiconset', filename);

      await sharp(iconSvg)
        .resize(pixelSize, pixelSize)
        .png()
        .toFile(outputPath);

      console.log(`  Created ${filename} (${pixelSize}x${pixelSize})`);
    }
  }

  console.log('\nGenerating splash screens...');

  // Generate splash screen
  const splashSize = 2732; // Largest iPad size
  const splashSvg = Buffer.from(generateSplashSVG(splashSize));

  const splashFiles = [
    'splash-2732x2732.png',
    'splash-2732x2732-1.png',
    'splash-2732x2732-2.png',
  ];

  for (const filename of splashFiles) {
    const outputPath = path.join(iosAssetsPath, 'Splash.imageset', filename);

    await sharp(splashSvg)
      .resize(splashSize, splashSize)
      .png()
      .toFile(outputPath);

    console.log(`  Created ${filename}`);
  }

  console.log('\nDone! Run `npx cap sync` to update the iOS project.');
}

generateAssets().catch(console.error);
