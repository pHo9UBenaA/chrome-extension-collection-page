import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://chrome-extension.pho9ubenaa.com/',
	integrations: [mdx(), sitemap()],
});
