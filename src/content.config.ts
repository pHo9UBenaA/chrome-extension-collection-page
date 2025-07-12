import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const index = defineCollection({
	loader: glob({ base: './src/content/index', pattern: '**/*.{md,mdx}' }),
});

export const collections = { index };
