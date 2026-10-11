import type { APIContext } from 'astro';

const PAGES: Array<{ path: string; priority: string }> = [
  { path: '/', priority: '1.0' },
  { path: '/terms', priority: '0.2' },
];

export function GET(context: APIContext) {
  const site = context.site ?? new URL('https://terragohan.com');
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = PAGES.map(
    ({ path, priority }) => `  <url>
    <loc>${new URL(path, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
