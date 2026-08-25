import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const releases = (await getCollection('releases'))
    .filter((entry) => entry.data.title && entry.data.title !== '???' && entry.data.url)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'terragohan — harvest',
    description: 'New projects from terragohan, something new every two weeks.',
    site: context.site ?? 'https://terragohan.com',
    items: releases.map((entry) => ({
      title: entry.data.title!,
      description: entry.data.description,
      link: entry.data.url!,
      pubDate: entry.data.date,
    })),
    customData: `<language>en-us</language>`,
  });
}
