import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const index = defineCollection({
	loader: glob({ base: './src/content/index', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

export const collections = { index };
