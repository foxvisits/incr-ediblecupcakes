#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const source = path.join(publicDir, 'favicon-source.png');

if (!fs.existsSync(source)) {
  console.error('Missing public/favicon-source.png - download from production first.');
  process.exit(1);
}

const sizes = [
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-48x48.png', size: 48 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'favicon.png', size: 48 },
];

for (const { file, size } of sizes) {
  await sharp(source)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, file));
  console.log(`Created ${file} (${size}x${size})`);
}

// favicon.ico - use 48px PNG as base (browsers accept single-size ICO via PNG rename workaround)
// sharp doesn't write ICO natively; copy 48px as favicon.ico fallback using png
await sharp(source)
  .resize(48, 48, { fit: 'cover' })
  .png()
  .toFile(path.join(publicDir, 'favicon.ico.png'));

console.log('Favicon set generated. Note: favicon.ico uses PNG format (widely supported).');
