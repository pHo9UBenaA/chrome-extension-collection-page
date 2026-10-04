import { expect, test } from '@playwright/test';

const SITE_URL = 'https://chrome-extension.pho9ubenaa.com/';
const EXPECTED_EXTENSION_COUNT = 6;

test('each extension has matching support links in the same order', async ({
	page,
}) => {
	await page.goto('/');
	const extensionEntries = page.locator('.extension-list > li');
	const supportEntries = page.locator('.support-list > li');
	await expect(extensionEntries).toHaveCount(EXPECTED_EXTENSION_COUNT);
	await expect(supportEntries).toHaveCount(EXPECTED_EXTENSION_COUNT);

	for (
		let extensionIndex = 0;
		extensionIndex < EXPECTED_EXTENSION_COUNT;
		extensionIndex += 1
	) {
		const extensionEntry = extensionEntries.nth(extensionIndex);
		const supportEntry = supportEntries.nth(extensionIndex);
		const extensionName = await extensionEntry.locator('h3').innerText();
		await test.step(extensionName, async () => {
			await expect(supportEntry.locator('strong')).toHaveText(extensionName);
			const webStoreUrl = await extensionEntry
				.getByRole('link', { name: 'View in the Chrome Web Store' })
				.getAttribute('href');
			expect(new URL(webStoreUrl).origin).toBe(
				'https://chromewebstore.google.com',
			);
			await expect(
				supportEntry.getByRole('link', { name: 'Support page' }),
			).toHaveAttribute('href', `${webStoreUrl}/support`);
			const repositoryUrl = await supportEntry
				.getByRole('link', { name: 'GitHub' })
				.getAttribute('href');
			expect(new URL(repositoryUrl).origin).toBe('https://github.com');
		});
	}
});

for (const headingId of ['extensions', 'privacy', 'support']) {
	test(`page navigation scrolls to the ${headingId} heading`, async ({
		page,
	}) => {
		await page.goto('/');
		await page.locator(`.page-nav a[href="#${headingId}"]`).click();
		await expect(page).toHaveURL(new RegExp(`/#${headingId}$`));
		const heading = page.locator(`#${headingId}`);
		await expect(heading).toBeInViewport();
		await expect(heading.locator('a')).toHaveAttribute('href', `#${headingId}`);
	});
}

test('homepage metadata identifies the canonical site URL', async ({
	page,
}) => {
	await page.goto('/');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		SITE_URL,
	);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
		'content',
		SITE_URL,
	);
});

test('homepage contains no browser scripts', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('script')).toHaveCount(0);
});

test('links opening new tabs prevent access to the opener', async ({
	page,
}) => {
	await page.goto('/');
	await expect(
		page.locator('a[target="_blank"]:not([rel="noopener noreferrer"])'),
	).toHaveCount(0);
});

test('missing pages return the visible 404 page', async ({ page }) => {
	const response = await page.goto('/missing-page');
	expect(response.status()).toBe(404);
	expect(response.headers()['content-type']).toBe('text/html; charset=utf-8');
	await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
});

for (const urlPath of ['/', '/missing-page']) {
	test(`HEAD ${urlPath} returns GET headers without a body`, async ({
		request,
	}) => {
		const getResponse = await request.get(urlPath);
		const headResponse = await request.head(urlPath);
		expect(headResponse.status()).toBe(getResponse.status());
		for (const headerName of ['content-type', 'content-length']) {
			expect(headResponse.headers()[headerName], headerName).toBe(
				getResponse.headers()[headerName],
			);
		}
		expect(await headResponse.body()).toHaveLength(0);
	});
}

test('POST requests return 405 and advertise the allowed methods', async ({
	request,
}) => {
	const response = await request.post('/');
	expect(response.status()).toBe(405);
	expect(response.headers().allow).toBe('GET, HEAD');
});

test('preview responses disable caching and content-type sniffing', async ({
	request,
}) => {
	const response = await request.get('/');
	expect(response.headers()['cache-control']).toBe('no-store');
	expect(response.headers()['x-content-type-options']).toBe('nosniff');
});

for (const { assetPath, contentType } of [
	{ assetPath: '/styles/global.css', contentType: 'text/css; charset=utf-8' },
	{ assetPath: '/favicon.svg', contentType: 'image/svg+xml' },
	{ assetPath: '/favicon.png', contentType: 'image/png' },
	{ assetPath: '/fonts/atkinson-regular.woff', contentType: 'font/woff' },
	{ assetPath: '/fonts/atkinson-bold.woff', contentType: 'font/woff' },
	{
		assetPath: '/sitemap-index.xml',
		contentType: 'application/xml; charset=utf-8',
	},
	{
		assetPath: '/sitemap-0.xml',
		contentType: 'application/xml; charset=utf-8',
	},
	{ assetPath: '/robots.txt', contentType: 'text/plain; charset=utf-8' },
	{ assetPath: '/security.txt', contentType: 'text/plain; charset=utf-8' },
]) {
	test(`serves ${assetPath} with its content type`, async ({ request }) => {
		const response = await request.get(assetPath);
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toBe(contentType);
	});
}

for (const { urlPath, expectedStatus } of [
	{ urlPath: '/scripts/build.mjs', expectedStatus: 404 },
	{ urlPath: '/package.json', expectedStatus: 404 },
	{ urlPath: '/%2e%2e%2fpackage.json', expectedStatus: 403 },
	{ urlPath: '/%zz', expectedStatus: 400 },
	{ urlPath: '/fonts', expectedStatus: 403 },
	{ urlPath: '/styles/global.css/child', expectedStatus: 404 },
]) {
	test(`rejects ${urlPath} with status ${expectedStatus}`, async ({
		request,
	}) => {
		const response = await request.get(urlPath);
		expect(response.status()).toBe(expectedStatus);
	});
}
