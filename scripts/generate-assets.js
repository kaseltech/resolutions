const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// YearVow Color Theme
const COLORS = {
  navy: '#1F3A5A',         // Deep navy blue (background)
  cream: '#F5F4EF',        // Off-white (letter)
  gold: '#C9A75A',         // Gold accent
  textMuted: '#B8C4D0',
};

// Current year for the icon
const CURRENT_YEAR = '2026';

// Generate YearVow "V + Year" app icon SVG
// - Year above (very subtle, 70% opacity, smaller)
// - V is the hero - eye goes there first
// - Balanced vertical spacing
function generateAppIconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid navy background -->
  <rect x="0" y="0" width="100" height="100" fill="${COLORS.navy}" />

  <!-- Year above - smaller, more subtle -->
  <text
    x="50"
    y="22"
    text-anchor="middle"
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
    font-size="11"
    font-weight="400"
    fill="${COLORS.gold}"
    opacity="0.7"
    letter-spacing="3"
  >${CURRENT_YEAR}</text>

  <!-- Large serif V - the hero, nudged down -->
  <text
    x="50"
    y="76"
    text-anchor="middle"
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
    font-size="50"
    font-weight="400"
    fill="${COLORS.gold}"
  >V</text>
</svg>`;
}

// Generate V-only favicon SVG (no year, just the V mark)
function generateFaviconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid navy background -->
  <rect x="0" y="0" width="100" height="100" fill="${COLORS.navy}" />

  <!-- Serif V centered -->
  <text
    x="50"
    y="68"
    text-anchor="middle"
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
    font-size="65"
    font-weight="400"
    fill="${COLORS.gold}"
  >V</text>
</svg>`;
}

// Generate splash screen SVG - matches app icon style (year above, V below)
function generateSplashSVG(size) {
  // Generate subtle stars
  const stars = [];
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.5 + 0.5;
    const opacity = Math.random() * 0.3 + 0.1;
    stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${COLORS.cream}" opacity="${opacity}" />`);
  }

  const centerX = size / 2;
  const centerY = size / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid navy background -->
  <rect width="${size}" height="${size}" fill="${COLORS.navy}" />

  <!-- Subtle stars -->
  ${stars.join('\n  ')}

  <!-- Year above - subtle, matching icon style -->
  <text
    x="${centerX}"
    y="${centerY - 120}"
    text-anchor="middle"
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
    font-size="50"
    font-weight="400"
    fill="${COLORS.gold}"
    opacity="0.7"
    letter-spacing="12"
  >${CURRENT_YEAR}</text>

  <!-- Large V mark - the hero -->
  <text
    x="${centerX}"
    y="${centerY + 80}"
    text-anchor="middle"
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
    font-size="280"
    font-weight="400"
    fill="${COLORS.gold}"
  >V</text>

  <!-- Tagline -->
  <text
    x="${centerX}"
    y="${centerY + 220}"
    text-anchor="middle"
    font-family="'Libre Baskerville', Georgia, 'Times New Roman', Times, serif"
    font-size="36"
    fill="${COLORS.gold}"
    opacity="0.5"
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

  // Web icon sizes (use V + year for larger, V only for small)
  const webIconSizes = [192, 512];
  const faviconSizes = [16, 32, 48, 64, 180];

  console.log('Generating YearVow V + 2026 app icons...');

  const appIconSvg = Buffer.from(generateAppIconSVG(1024));

  // Generate iOS icons (V + Year)
  for (const { size, scales } of iosIconSizes) {
    for (const scale of scales) {
      const pixelSize = Math.round(size * scale);
      const filename = scale === 1
        ? `AppIcon-${size}.png`
        : `AppIcon-${size}@${scale}x.png`;

      const outputPath = path.join(iosAssetsPath, 'AppIcon.appiconset', filename);

      await sharp(appIconSvg)
        .resize(pixelSize, pixelSize)
        .png()
        .toFile(outputPath);

      console.log(`  Created ${filename} (${pixelSize}x${pixelSize})`);
    }
  }

  console.log('\nGenerating web icons (V + 2026)...');

  // Generate larger web icons (V + year)
  for (const size of webIconSizes) {
    const filename = `icon-${size}.png`;
    const outputPath = path.join(iconsPath, filename);

    await sharp(appIconSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`  Created ${filename}`);
  }

  console.log('\nGenerating favicons (V only)...');

  const faviconSvg = Buffer.from(generateFaviconSVG(512));

  // Generate favicon sizes (V only - cleaner at small sizes)
  for (const size of faviconSizes) {
    const filename = `icon-${size}.png`;
    const outputPath = path.join(iconsPath, filename);

    await sharp(faviconSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`  Created ${filename}`);
  }

  // Generate SVG favicon (V only)
  const svgFavicon = generateFaviconSVG(32);
  fs.writeFileSync(path.join(publicPath, 'favicon.svg'), svgFavicon);
  console.log('  Created favicon.svg');

  // Generate apple-touch-icon (180x180) - V only for clarity
  await sharp(faviconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicPath, 'apple-touch-icon.png'));
  console.log('  Created apple-touch-icon.png');

  // Generate favicon.png (32x32) - V only
  await sharp(faviconSvg)
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

  console.log('\n✓ Done! New V + 2026 icons generated.');
  console.log('  Run `npx cap sync` to update the iOS project.');
}

generateAssets().catch(console.error);
