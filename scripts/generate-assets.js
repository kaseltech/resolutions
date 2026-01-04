const sharp = require('sharp');
const path = require('path');

// YearVow Color Theme - Navy & Cream
const COLORS = {
  navy: '#1E3A5F',         // Deep navy blue
  navyLight: '#2A4A6F',    // Lighter navy
  cream: '#F5F1EA',        // Warm cream
  gold: '#C4A35A',         // Gold accent
  textMuted: '#B8C4D0',
};

// Generate YearVow "YV" monogram app icon SVG
function generateAppIconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.navy}" />
      <stop offset="100%" stop-color="${COLORS.navyLight}" />
    </linearGradient>
  </defs>

  <!-- Full square navy background - iOS will round the corners -->
  <rect x="0" y="0" width="100" height="100" fill="url(#bgGrad)" />

  <!-- YV Monogram in serif font -->
  <text
    x="50"
    y="64"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', Times, serif"
    font-size="44"
    font-weight="400"
    fill="${COLORS.cream}"
    letter-spacing="-1"
  >YV</text>
</svg>`;
}

// Generate splash screen SVG - navy gradient with stars and centered wordmark
function generateSplashSVG(size) {
  // Generate random stars
  const stars = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.5;
    const opacity = Math.random() * 0.4 + 0.2;
    stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${COLORS.cream}" opacity="${opacity}" />`);
  }

  const centerX = size / 2;
  const centerY = size / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.navy}" />
      <stop offset="50%" stop-color="${COLORS.navyLight}" />
      <stop offset="100%" stop-color="${COLORS.navy}" />
    </linearGradient>
  </defs>

  <!-- Background gradient -->
  <rect width="${size}" height="${size}" fill="url(#bgGrad)" />

  <!-- Twinkling stars -->
  ${stars.join('\n  ')}

  <!-- YearVow wordmark in serif -->
  <text
    x="${centerX}"
    y="${centerY}"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Georgia, 'Times New Roman', Times, serif"
    font-size="140"
    font-weight="400"
    fill="${COLORS.cream}"
    letter-spacing="-2"
  >YearVow</text>

  <!-- Tagline -->
  <text
    x="${centerX}"
    y="${centerY + 90}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', Times, serif"
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
