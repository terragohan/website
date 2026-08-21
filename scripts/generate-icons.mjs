/**
 * Generates the terragohan brand assets from the built site:
 * extracts the wave-pose Gohan SVG from dist/index.html, bakes in the
 * day-palette colors, and writes:
 *   public/logo.svg              — vector logo (cream background)
 *   public/logo-480.png          — raster for avatars (e.g. Buttondown icon)
 *   public/apple-touch-icon.png  — 192px
 *   public/favicon-48.png        — PNG favicon fallback
 *
 * PNGs are rasterized with nearest-neighbor scaling at integer multiples
 * of the 24px source grid so the pixel art stays crisp.
 *
 * Run AFTER `npm run build`:  node scripts/generate-icons.mjs
 * (requires Pillow: python3 -m pip install Pillow)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const html = readFileSync('dist/index.html', 'utf8');
const match = html.match(/<svg[^>]*aria-label="Gohan mascot \(wave\)"[^>]*>([\s\S]*?)<\/svg>/);
if (!match) throw new Error('wave-pose Gohan SVG not found in dist/index.html');

const COLORS = {
  'var(--ink)': '#3e2f23',
  'var(--hair)': '#1b1b26',
  'var(--skin)': '#ffd9b3',
  'var(--gi)': '#f07818',
  'var(--belt)': '#2b50c8',
  'var(--salmon)': '#e2603f',
  'var(--egg)': '#f2b134',
  'var(--nori-light)': '#5ba36f',
};

let inner = match[1];
for (const [token, hex] of Object.entries(COLORS)) {
  inner = inner.split(token).join(hex);
}

// Sprite pixels live on a 20x20 grid; pad with a 2px cream margin → 24x24 logo.
const logo =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" shape-rendering="crispEdges">` +
  `<rect x="-2" y="-2" width="24" height="24" fill="#fff8ea"/>` +
  inner +
  `</svg>`;

writeFileSync('public/logo.svg', logo);

// Rasterize: each <rect> becomes a 1x1 pixel on a 24x24 canvas (offset +2,+2),
// then nearest-neighbor upscale by an integer factor.
const rects = [...inner.matchAll(/<rect x="(-?\d+)" y="(-?\d+)" width="1" height="1" fill="(#[0-9a-f]{6})"\s*\/?>/g)].map(
  (m) => [Number(m[1]) + 2, Number(m[2]) + 2, m[3]]
);

const py = [
  'from PIL import Image',
  'import json, sys',
  'rects = json.load(sys.stdin)',
  'im = Image.new("RGB", (24, 24), "#fff8ea")',
  'for x, y, c in rects:',
  '    im.putpixel((x, y), tuple(int(c[i:i+2], 16) for i in (1, 3, 5)))',
  'for scale, out in [(20, "public/logo-480.png"), (8, "public/apple-touch-icon.png"), (2, "public/favicon-48.png")]:',
  '    im.resize((24 * scale, 24 * scale), Image.NEAREST).save(out)',
  'print("wrote logo-480.png, apple-touch-icon.png (192), favicon-48.png")',
].join('\n');

const out = execFileSync('python3', ['-c', py], { input: JSON.stringify(rects) });
console.log('wrote public/logo.svg');
process.stdout.write(out);
