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
		const pageDimensions = await page.evaluate(() => ({
			contentWidth: document.documentElement.scrollWidth,
			viewportWidth: window.innerWidth,
		}));
		expect(pageDimensions.contentWidth).toBeLessThanOrEqual(
			pageDimensions.viewportWidth,
		);
		await expect(page).toHaveScreenshot(`homepage-${viewportName}.png`, {
			fullPage: true,
		});
	});

	test(`extension grid adapts to wrapped headings at the ${viewportName} viewport`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport);
		await page.goto('/');
		const extensionEntry = page.locator('.extension-list > li').first();
		await extensionEntry.locator('h3').evaluate((heading) => {
			heading.textContent =
				'Window Merger with a longer extension name '.repeat(3);
			heading.style.fontSize = '2rem';
		});
		await page.evaluate(() => document.fonts.ready);
		await expect(extensionEntry).toHaveCSS('display', 'grid');
		const layout = await extensionEntry.evaluate((item) => {
			const heading = item.querySelector('h3');
			const description = item.querySelector('p');
			if (!heading || !description) {
				throw new Error('Extension entry must have a heading and description');
			}

			const markerStyle = getComputedStyle(item, '::before');
			const headingBounds = heading.getBoundingClientRect();
			const descriptionBounds = description.getBoundingClientRect();
			return {
				markerPosition: markerStyle.position,
				markerAlignment: markerStyle.alignSelf,
				headingBottom: headingBounds.bottom,
				descriptionTop: descriptionBounds.top,
				headingLeft: headingBounds.left,
				descriptionLeft: descriptionBounds.left,
				contentWidth: document.documentElement.scrollWidth,
				viewportWidth: window.innerWidth,
			};
		});
		expect(layout.markerPosition).toBe('static');
		expect(layout.markerAlignment).toBe('center');
		expect(layout.descriptionTop).toBeGreaterThan(layout.headingBottom);
		expect(layout.descriptionLeft).toBe(layout.headingLeft);
		expect(layout.contentWidth).toBeLessThanOrEqual(layout.viewportWidth);
	});

	test(`navigation underline spacing matches list links at the ${viewportName} viewport`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport);
		await page.goto('/');
		await page.evaluate(() => document.fonts.ready);
		const linkMeasurements = await page
			.locator('.extension-list a, .support-list a, .page-nav a')
			.evaluateAll((links) =>
				links.map((link) => {
					const textRange = document.createRange();
					textRange.selectNodeContents(link);
					return {
						href: link.getAttribute('href'),
						underlineGapPx:
							link.getBoundingClientRect().bottom -
							textRange.getBoundingClientRect().bottom,
					};
				}),
			);
		for (const { href, underlineGapPx } of linkMeasurements) {
			expect(underlineGapPx, `Underline spacing for ${href}`).toBeCloseTo(1, 1);
		}
	});
}
