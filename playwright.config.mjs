import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4321';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	workers: isCI ? 1 : undefined,
	reporter: 'html',
	use: { baseURL, trace: 'on-first-retry' },
	expect: { toHaveScreenshot: { maxDiffPixels: 100 } },
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: process.env.BASE_URL
		? undefined
		: {
				command: 'pnpm run preview',
				url: baseURL,
				reuseExistingServer: !isCI,
			},
});
