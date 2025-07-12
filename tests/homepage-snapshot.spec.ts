import { expect, test } from '@playwright/test';

test.describe('Homepage Screenshot Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the homepage before each test
		await page.goto('/');

		// Wait for page to be fully loaded
		await page.waitForLoadState('networkidle');

		// Scroll to top to ensure we capture from the beginning
		await page.evaluate(() => window.scrollTo(0, 0));
	});

	test('homepage screenshot', async ({ page }) => {
		// Desktop viewport test
		await page.setViewportSize({ width: 1280, height: 800 });
		await expect(page).toHaveScreenshot('homepage-desktop.png', {
			fullPage: true,
		});

		// Mobile viewport test
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page).toHaveScreenshot('homepage-mobile.png', {
			fullPage: true,
		});
	});
});
