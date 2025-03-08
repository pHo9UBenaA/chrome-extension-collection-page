import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import remarkBreaks from 'remark-breaks';
import remarkCustomHeaderId from 'remark-custom-header-id';
import remarkGfm from 'remark-gfm';

// https://astro.build/config
export default defineConfig({
	site: 'https://chrome-extension.pho9ubenaa.com/',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkBreaks, remarkCustomHeaderId, remarkGfm],
	},
});
