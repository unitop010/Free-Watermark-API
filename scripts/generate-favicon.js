const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Create a simple watermark icon
const svg = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#3B82F6"/>
  <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8ZM16 22C12.6863 22 10 19.3137 10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16C22 19.3137 19.3137 22 16 22Z" fill="white"/>
  <path d="M16 12C14.3431 12 13 13.3431 13 15C13 16.6569 14.3431 18 16 18C17.6569 18 19 16.6569 19 15C19 13.3431 17.6569 12 16 12Z" fill="white"/>
</svg>
`;

// Generate favicon.ico
sharp(Buffer.from(svg))
  .resize(32, 32)
  .toFile(path.join(publicDir, 'favicon.ico'))
  .then(() => console.log('Generated favicon.ico'));

// Generate icon.png
sharp(Buffer.from(svg))
  .resize(192, 192)
  .toFile(path.join(publicDir, 'icon.png'))
  .then(() => console.log('Generated icon.png'));

// Generate apple-icon.png
sharp(Buffer.from(svg))
  .resize(180, 180)
  .toFile(path.join(publicDir, 'apple-icon.png'))
  .then(() => console.log('Generated apple-icon.png'));

// Create site.webmanifest
const manifest = {
  name: 'Image Watermark Generator',
  short_name: 'Watermark',
  description: 'Add professional watermarks to your images',
  icons: [
    {
      src: '/icon.png',
      sizes: '192x192',
      type: 'image/png',
    },
  ],
  theme_color: '#3B82F6',
  background_color: '#ffffff',
  display: 'standalone',
};

fs.writeFileSync(
  path.join(publicDir, 'site.webmanifest'),
  JSON.stringify(manifest, null, 2)
);
console.log('Generated site.webmanifest'); 