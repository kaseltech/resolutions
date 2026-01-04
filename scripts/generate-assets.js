const sharp = require('sharp');
const path = require('path');

// YearVow Color Theme - Midnight Blue & Warm Neutral
const COLORS = {
  primary: '#0F1C2E',      // Midnight blue
  secondary: '#1A2B3C',    // Lighter midnight
  accent: '#5B8CB8',       // Accent blue
  glow: '#F6F4EF',         // Warm neutral
  background: '#0F1C2E',
  textMuted: '#94A3B8',
};

// Generate YearVow "YV" monogram app icon SVG
function generateAppIconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.primary}" />
      <stop offset="100%" stop-color="${COLORS.secondary}" />
    </linearGradient>
  </defs>

  <!-- Full square dark background - iOS will round the corners -->
  <rect x="0" y="0" width="100" height="100" fill="url(#bgGrad)" />

  <!-- YV Monogram -->
  <text
    x="50"
    y="62"
    text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
    font-size="42"
    font-weight="700"
    fill="${COLORS.glow}"
    letter-spacing="-2"
  >YV</text>
</svg>`;
}

// Generate splash screen SVG - simple gradient with stars and centered wordmark
function generateSplashSVG(size) {
  // Generate random stars
  const stars = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.5;
    const opacity = Math.random() * 0.5 + 0.2;
    stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${COLORS.glow}" opacity="${opacity}" />`);
  }

  const centerX = size / 2;
  const centerY = size / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.primary}" />
      <stop offset="50%" stop-color="${COLORS.secondary}" />
      <stop offset="100%" stop-color="${COLORS.primary}" />
    </linearGradient>
  </defs>

  <!-- Background gradient -->
  <rect width="${size}" height="${size}" fill="url(#bgGrad)" />

  <!-- Twinkling stars -->
  ${stars.join('\n  ')}

  <!-- YearVow wordmark -->
  <text
    x="${centerX}"
    y="${centerY}"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
    font-size="120"
    letter-spacing="-3"
  >
    <tspan font-weight="300" fill="${COLORS.textMuted}">Year</tspan><tspan font-weight="700" fill="${COLORS.glow}">Vow</tspan>
  </text>

  <!-- Tagline -->
  <text
    x="${centerX}"
    y="${centerY + 80}"
    text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
    font-size="36"
    fill="${COLORS.textMuted}"
    opacity="0.8"
  >Make your resolutions count</text>
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

  console.log('Generating YearVow app icons...');

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
