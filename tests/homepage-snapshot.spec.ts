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
}
