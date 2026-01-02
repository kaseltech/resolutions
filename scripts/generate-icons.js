// Icon Generator for iOS App
// Run this after installing: npm install sharp

const fs = require('fs');
const path = require('path');

// SVG icon matching the app's Logo component
const svgIcon = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0c1222" />
      <stop offset="50%" stop-color="#0a0f1a" />
      <stop offset="100%" stop-color="#050810" />
    </linearGradient>
    <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fafaf9" />
      <stop offset="50%" stop-color="#f5f5f4" />
      <stop offset="100%" stop-color="#e7e5e4" />
    </linearGradient>
    <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="512" cy="512" r="512" fill="url(#skyGradient)" />

  <!-- Stars -->
  <circle cx="200" cy="250" r="8" fill="#cbd5e1" opacity="0.9" />
  <circle cx="780" cy="180" r="10" fill="#cbd5e1" opacity="0.8" />
  <circle cx="150" cy="450" r="6" fill="#cbd5e1" opacity="0.7" />
  <circle cx="850" cy="350" r="7" fill="#cbd5e1" opacity="0.6" />
  <circle cx="250" cy="550" r="5" fill="#cbd5e1" opacity="0.5" />
  <circle cx="720" cy="500" r="6" fill="#cbd5e1" opacity="0.7" />
  <circle cx="350" cy="150" r="7" fill="#cbd5e1" opacity="0.8" />
  <circle cx="650" cy="220" r="5" fill="#cbd5e1" opacity="0.6" />

  <!-- Mountain range -->
  <path
    d="M 20 870 L 180 600 L 280 700 L 420 520 L 500 620 L 580 480 L 720 650 L 820 550 L 1004 870 Z"
    fill="url(#mountainGradient)"
  />

  <!-- Front mountain -->
  <path
    d="M 20 870 L 250 650 L 380 750 L 500 580 L 620 720 L 750 620 L 1004 870 Z"
    fill="#1e293b"
    opacity="0.7"
  />

  <!-- North Star - vertical beam -->
  <polygon
    points="512,80 527,420 512,500 497,420"
    fill="url(#starGradient)"
  />
  <polygon
    points="512,500 527,580 512,700 497,580"
    fill="url(#starGradient)"
    opacity="0.6"
  />

  <!-- North Star - horizontal beam -->
  <polygon
    points="80,380 420,365 512,380 420,395"
    fill="url(#starGradient)"
  />
  <polygon
    points="512,380 604,365 944,380 604,395"
    fill="url(#starGradient)"
  />

  <!-- Star center -->
  <circle cx="512" cy="380" r="40" fill="#f5f5f4" />
  <circle cx="512" cy="380" r="20" fill="#ffffff" />
</svg>
`;

async function generateIcons() {
  try {
    const sharp = require('sharp');

    const sizes = [
      { size: 1024, name: 'icon-1024.png' },
      { size: 512, name: 'icon-512.png' },
      { size: 192, name: 'icon-192.png' },
      { size: 180, name: 'icon-180.png' },
      { size: 167, name: 'icon-167.png' },
      { size: 152, name: 'icon-152.png' },
      { size: 120, name: 'icon-120.png' },
    ];

    const publicDir = path.join(__dirname, '..', 'public', 'icons');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    for (const { size, name } of sizes) {
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));
      console.log(`Generated ${name}`);
    }

    // Also generate for iOS App/Assets
    const iosAssetsDir = path.join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
    if (fs.existsSync(iosAssetsDir)) {
      const iosSizes = [
        { size: 1024, name: 'AppIcon-1024.png' },
        { size: 180, name: 'AppIcon-60@3x.png' },
        { size: 120, name: 'AppIcon-60@2x.png' },
        { size: 167, name: 'AppIcon-83.5@2x.png' },
        { size: 152, name: 'AppIcon-76@2x.png' },
        { size: 76, name: 'AppIcon-76.png' },
        { size: 40, name: 'AppIcon-40.png' },
        { size: 80, name: 'AppIcon-40@2x.png' },
        { size: 120, name: 'AppIcon-40@3x.png' },
        { size: 58, name: 'AppIcon-29@2x.png' },
        { size: 87, name: 'AppIcon-29@3x.png' },
        { size: 20, name: 'AppIcon-20.png' },
        { size: 40, name: 'AppIcon-20@2x.png' },
        { size: 60, name: 'AppIcon-20@3x.png' },
      ];

      for (const { size, name } of iosSizes) {
        await sharp(Buffer.from(svgIcon))
          .resize(size, size)
          .png()
          .toFile(path.join(iosAssetsDir, name));
        console.log(`Generated iOS ${name}`);
      }
    }

    console.log('\\nIcon generation complete!');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('sharp not installed. Run: npm install sharp');
      console.log('Then run this script again: node scripts/generate-icons.js');

      // Save SVG for manual conversion
      const svgPath = path.join(__dirname, '..', 'public', 'icons', 'icon.svg');
      fs.writeFileSync(svgPath, svgIcon);
      console.log('\\nSaved SVG to public/icons/icon.svg');
      console.log('You can convert it to PNG manually at https://cloudconvert.com/svg-to-png');
    } else {
      throw error;
    }
  }
}

generateIcons();
