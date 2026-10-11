import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

// llms.txt — a concise, machine-readable summary of the site for LLM-based
// answer engines. See https://llmstxt.org/.
export async function GET(context: APIContext) {
  const site = context.site ?? new URL('https://terragohan.com');

  const releases = (await getCollection('releases'))
    .filter((entry) => entry.data.title && entry.data.title !== '???' && entry.data.url)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const text = [
    '# terragohan',
    '',
    '> The terragohan harvest calendar — a new indie project, tool, or video every two weeks.',
    '',
    '## Pages',
    `- [Harvest calendar](${new URL('/', site).href}): the next drop and an archive of everything released so far.`,
    `- [RSS feed](${new URL('/rss.xml', site).href}): same calendar, syndicated.`,
    `- [Terms & attribution](${new URL('/terms', site).href}): fan-project disclaimer, credits, and privacy notes.`,
    '',
    '## Released projects',
    ...releases.map(
      (entry) => `- [${entry.data.title}](${entry.data.url}): ${entry.data.description ?? 'See the project for details.'}`
    ),
    '',
  ].join('\n');

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
