const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// YearVow Color Theme
const COLORS = {
  navy: '#1F3A5A',         // Deep navy blue (background)
  cream: '#F5F4EF',        // Off-white (letter)
  gold: '#C9A75A',         // Gold accent (optional)
  textMuted: '#B8C4D0',
};

// Generate YearVow "Y" favicon/icon SVG
// - Centered Y with optical vertical centering (slightly above true center)
// - Letter height ~65-70% of canvas
// - Solid navy background, no gradient/shadow/border
function generateAppIconSVG(size) {
  // Optical centering: y position slightly above center
  // For a 100-unit viewBox, center would be y=50, we go ~48 for optical
  // Font size ~68% of canvas height for letter height 65-70%
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid navy background -->
  <rect x="0" y="0" width="100" height="100" fill="${COLORS.navy}" />

  <!-- Y in serif font, optically centered -->
  <text
    x="50"
    y="67"
    text-anchor="middle"
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
    font-size="68"
    font-weight="500"
    fill="${COLORS.cream}"
  >Y</text>
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
      <stop offset="50%" stop-color="#2A4A6F" />
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
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
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
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
    font-size="36"
    fill="${COLORS.textMuted}"
    opacity="0.8"
  >Make your resolutions count</text>
</svg>`;
}

async function generateAssets() {
  const iosAssetsPath = path.join(__dirname, '../ios/App/App/Assets.xcassets');
  const publicPath = path.join(__dirname, '../public');
  const iconsPath = path.join(publicPath, 'icons');

  // Ensure icons directory exists
  if (!fs.existsSync(iconsPath)) {
    fs.mkdirSync(iconsPath, { recursive: true });
  }

  // App Icon sizes for iOS
  const iosIconSizes = [
    { size: 20, scales: [1, 2, 3] },
    { size: 29, scales: [2, 3] },
    { size: 40, scales: [1, 2, 3] },
    { size: 60, scales: [2, 3] },
    { size: 76, scales: [1, 2] },
    { size: 83.5, scales: [2] },
    { size: 512, scales: [2] },
    { size: 1024, scales: [1] },
  ];

  // Web favicon sizes
  const webIconSizes = [16, 32, 48, 64, 180, 192, 512];

  console.log('Generating YearVow app icons...');

  const iconSvg = Buffer.from(generateAppIconSVG(1024));

  // Generate iOS icons
  for (const { size, scales } of iosIconSizes) {
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

  console.log('\nGenerating web favicons...');

  // Generate web favicons (PNG)
  for (const size of webIconSizes) {
    const filename = `icon-${size}.png`;
    const outputPath = path.join(iconsPath, filename);

    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`  Created ${filename}`);
  }

  // Generate SVG favicon
  const svgFavicon = generateAppIconSVG(32);
  fs.writeFileSync(path.join(publicPath, 'favicon.svg'), svgFavicon);
  console.log('  Created favicon.svg');

  // Generate apple-touch-icon (180x180)
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicPath, 'apple-touch-icon.png'));
  console.log('  Created apple-touch-icon.png');

  // Generate favicon.ico (multi-size)
  // For simplicity, we'll use the 32x32 as the main .ico
  await sharp(iconSvg)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicPath, 'favicon.png'));
  console.log('  Created favicon.png');

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
