import { expect, test } from '@playwright/test';

const SITE_URL = 'https://chrome-extension.pho9ubenaa.com/';

test('extension data, heading navigation and static metadata survive the migration', async ({
	page,
}) => {
	await page.goto('/');
	await expect(page.locator('.extension-list > li')).toHaveCount(6);
	await expect(page.locator('.support-list > li')).toHaveCount(6);
	for (let index = 0; index < 6; index += 1) {
		const item = page.locator('.extension-list > li').nth(index);
		const support = page.locator('.support-list > li').nth(index);
		await expect(support.locator('strong')).toHaveText(
			await item.locator('h3').innerText(),
		);
		const webStore = await item.locator('a').getAttribute('href');
		expect(new URL(webStore).origin).toBe('https://chromewebstore.google.com');
		await expect(support.locator('a').first()).toHaveAttribute(
			'href',
			`${webStore}/support`,
		);
		expect(
			new URL(await support.locator('a').last().getAttribute('href')).origin,
		).toBe('https://github.com');
	}
	for (const id of ['extensions', 'privacy', 'support']) {
		await page.locator(`.page-nav a[href="#${id}"]`).click();
		await expect(page).toHaveURL(new RegExp(`/#${id}$`));
		await expect(page.locator(`#${id}`)).toBeInViewport();
		await expect(page.locator(`#${id} > a`)).toHaveAttribute('href', `#${id}`);
	}
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		SITE_URL,
	);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
		'content',
		SITE_URL,
	);
	await expect(page.locator('script')).toHaveCount(0);
	await expect(
		page.locator('a[target="_blank"]:not([rel="noopener noreferrer"])'),
	).toHaveCount(0);
});

test('404 status, assets and sitemap are served without exposing source files', async ({
	page,
	request,
}) => {
	const response = await page.goto('/missing-page');
	expect(response.status()).toBe(404);
	await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
	for (const path of [
		'/styles/global.css',
		'/favicon.svg',
		'/fonts/atkinson-regular.woff',
		'/sitemap-index.xml',
		'/sitemap-0.xml',
		'/robots.txt',
	]) {
		expect((await request.get(path)).status()).toBe(200);
	}
	expect((await request.get('/scripts/build.mjs')).status()).toBe(404);
	expect((await request.get('/package.json')).status()).toBe(404);
	expect((await request.get('/%2e%2e%2fpackage.json')).status()).toBe(403);
	expect((await request.get('/%zz')).status()).toBe(400);
});
