import { expect, test } from '@playwright/test';

for (const { viewportName, viewport } of [
	{ viewportName: 'desktop', viewport: { width: 1280, height: 800 } },
	{ viewportName: 'mobile', viewport: { width: 375, height: 667 } },
]) {
	test(`homepage screenshot at the ${viewportName} viewport`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport);
		await page.goto('/');
		await expect(page).toHaveScreenshot(`homepage-${viewportName}.png`, {
			fullPage: true,
		});
	});
}
