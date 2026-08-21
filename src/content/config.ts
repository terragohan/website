import { defineCollection, z } from 'astro:content';

const releases = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().default('???'),
    description: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

export const collections = { releases };
