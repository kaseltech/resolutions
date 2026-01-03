const sharp = require('sharp');
const path = require('path');

// 2026 Color Theme - Teal/Emerald
const COLORS = {
  primary: '#0d9488',
  secondary: '#14b8a6',
  accent: '#2dd4bf',
  glow: '#5eead4',
  background: '#0f172a',
  ring: 'rgba(45, 212, 191, 0.25)',
  cardinalMarks: '#334155',
};

// Generate compass logo SVG for app icon (fills entire square, no white border)
function generateAppIconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="needleNorth" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.glow}" />
      <stop offset="100%" stop-color="${COLORS.primary}" />
    </linearGradient>
    <linearGradient id="needleSouth" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <filter id="compassGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Full square dark background - iOS will round the corners -->
  <rect x="0" y="0" width="100" height="100" fill="${COLORS.background}" />

  <!-- Outer ring -->
  <circle cx="50" cy="50" r="44" fill="none" stroke="${COLORS.ring}" stroke-width="2" />

  <!-- Cardinal direction marks -->
  <g stroke="${COLORS.cardinalMarks}" stroke-width="2" stroke-linecap="round">
    <line x1="50" y1="10" x2="50" y2="16" />
    <line x1="90" y1="50" x2="84" y2="50" />
    <line x1="50" y1="90" x2="50" y2="84" />
    <line x1="10" y1="50" x2="16" y2="50" />
  </g>

  <!-- Minor tick marks -->
  <g stroke="${COLORS.cardinalMarks}" stroke-width="1" stroke-linecap="round" opacity="0.5">
    <line x1="78" y1="22" x2="74" y2="26" />
    <line x1="78" y1="78" x2="74" y2="74" />
    <line x1="22" y1="78" x2="26" y2="74" />
    <line x1="22" y1="22" x2="26" y2="26" />
  </g>

  <!-- Compass needle -->
  <g filter="url(#compassGlow)">
    <path d="M50 16 L56 50 L50 55 L44 50 Z" fill="url(#needleNorth)" />
    <path d="M50 84 L56 50 L50 45 L44 50 Z" fill="url(#needleSouth)" />
  </g>

  <!-- Center pivot -->
  <circle cx="50" cy="50" r="6" fill="${COLORS.background}" stroke="${COLORS.primary}" stroke-width="2" />
  <circle cx="50" cy="50" r="3" fill="${COLORS.accent}" />
  <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
</svg>`;
}

// Generate splash screen SVG - simple gradient with stars and centered logo
function generateSplashSVG(size) {
  // Generate random stars
  const stars = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.5;
    const opacity = Math.random() * 0.6 + 0.2;
    stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${opacity}" />`);
  }

  const logoSize = Math.round(size * 0.25);
  const logoOffset = (size - logoSize) / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1a" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="needleNorthSplash" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.glow}" />
      <stop offset="100%" stop-color="${COLORS.primary}" />
    </linearGradient>
    <linearGradient id="needleSouthSplash" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
  </defs>

  <!-- Background gradient -->
  <rect width="${size}" height="${size}" fill="url(#bgGrad)" />

  <!-- Twinkling stars -->
  ${stars.join('\n  ')}

  <!-- Centered compass logo -->
  <g transform="translate(${logoOffset}, ${logoOffset})">
    <svg width="${logoSize}" height="${logoSize}" viewBox="0 0 100 100">
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
      <path d="M50 18 L55 50 L50 54 L45 50 Z" fill="url(#needleNorthSplash)" />
      <path d="M50 82 L55 50 L50 46 L45 50 Z" fill="url(#needleSouthSplash)" />

      <!-- Center pivot -->
      <circle cx="50" cy="50" r="6" fill="${COLORS.background}" stroke="${COLORS.primary}" stroke-width="2" />
      <circle cx="50" cy="50" r="3" fill="${COLORS.accent}" />
      <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
    </svg>
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

  const iconSvg = Buffer.from(generateAppIconSVG(1024));

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

  const splashSize = 2732;
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
