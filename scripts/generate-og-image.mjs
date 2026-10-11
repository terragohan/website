/**
 * Generates public/og-image.png — the 1200x630 social card referenced by the
 * Open Graph / Twitter meta tags, built from the day palette in
 * src/styles/global.css and the committed pixel-art logo.
 *
 * Run: node scripts/generate-og-image.mjs
 * (uses sharp, which Astro already depends on)
 */
import sharp from 'sharp';

const W = 1200;
const H = 630;

const logo = await sharp('public/logo-480.png')
  .resize(360, 360, { kernel: sharp.kernel.nearest })
  .toBuffer();

const text = Buffer.from(`<svg width="${W}" height="${H}">
  <text x="600" y="490" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="64" letter-spacing="10" fill="#3e2f23">TERRAGOHAN</text>
  <text x="600" y="556" text-anchor="middle" font-family="monospace" font-size="30" letter-spacing="4" fill="#e2603f">something new every two weeks</text>
  <rect x="268" y="452" width="16" height="16" fill="#f2b134"/>
  <rect x="916" y="452" width="16" height="16" fill="#f2b134"/>
</svg>`);

await sharp({
  create: { width: W, height: H, channels: 3, background: '#f7edd8' },
})
  .composite([
    { input: logo, left: (W - 360) / 2, top: 40 },
    { input: text, left: 0, top: 0 },
  ])
  .png()
  .toFile('public/og-image.png');

console.log('wrote public/og-image.png (1200x630)');
