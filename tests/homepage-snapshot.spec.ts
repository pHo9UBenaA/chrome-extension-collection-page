import { expect, test } from '@playwright/test';

for (const { viewportName, viewport } of [
	{ viewportName: 'desktop', viewport: { width: 1280, height: 800 } },
	{ viewportName: 'mobile', viewport: { width: 375, height: 667 } },
]) {
	test(`homepage screenshot at the ${viewportName} viewport`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport);
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto('/');
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth,
			),
		).toBe(true);
		await expect(page).toHaveScreenshot(`homepage-${viewportName}.png`, {
			fullPage: true,
		});
	});

	test(`extension grid adapts to wrapped headings at the ${viewportName} viewport`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport);
		await page.goto('/');
		const entry = page.locator('.extension-list > li').first();
		await entry.locator('h3').evaluate((heading) => {
			heading.textContent =
				'Window Merger with a longer extension name '.repeat(3);
			heading.style.fontSize = '2rem';
		});
		await page.evaluate(() => document.fonts.ready);
		await expect(entry).toHaveCSS('display', 'grid');
		const layout = await entry.evaluate((item) => {
			const marker = getComputedStyle(item, '::before');
			const heading = item.querySelector('h3').getBoundingClientRect();
			const description = item.querySelector('p').getBoundingClientRect();
			return {
				markerPosition: marker.position,
				markerAlignment: marker.alignSelf,
				headingBottom: heading.bottom,
				descriptionTop: description.top,
				headingLeft: heading.left,
				descriptionLeft: description.left,
				overflows: document.documentElement.scrollWidth > window.innerWidth,
			};
		});
		expect(layout.markerPosition).toBe('static');
		expect(layout.markerAlignment).toBe('center');
		expect(layout.descriptionTop).toBeGreaterThan(layout.headingBottom);
		expect(layout.descriptionLeft).toBe(layout.headingLeft);
		expect(layout.overflows).toBe(false);
	});

	test(`navigation underline spacing matches list links at the ${viewportName} viewport`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport);
		await page.goto('/');
		await page.evaluate(() => document.fonts.ready);
		const gaps = await page
			.locator('.extension-list a, .support-list a, .page-nav a')
			.evaluateAll((links) =>
				links.map((link) => {
					const textRange = document.createRange();
					textRange.selectNodeContents(link);
					return (
						link.getBoundingClientRect().bottom -
						textRange.getBoundingClientRect().bottom
					);
				}),
			);
		for (const gap of gaps) {
			expect(gap).toBeCloseTo(1, 1);
		}
	});
}
