import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    author: z.string().optional().default('Wood Nursery Team'),
  }),
});

export const collections = {
  blog,
};
