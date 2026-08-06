import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
