// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_AUTHOR = 'Komiya';
export const SITE_AUTHOR_ID = 'pHo9UBenaA';
export const SITE_TITLE = `${SITE_AUTHOR}'s Chrome Extensions`;
export const SITE_DESCRIPTION = `Explore a list of ${SITE_AUTHOR}'s Chrome extensions, along with details on our privacy policies and support contact information.`;

const rawExtensions = [
	{
		id: 'window-merger',
		name: 'Window Merger',
		description:
			'Merge windows into one with shortcuts, preserving tab groups and pinned tabs.',
		webStore:
			'https://chromewebstore.google.com/detail/window-merger/fijodggmkbkjcmlpkpahjpepngppdppb',
		github: 'https://github.com/pho9ubenaa/window-merger',
	},
	{
		id: 'pin-switcher',
		name: 'Pin Switcher',
		description: 'Toggle active tab pinning/unpinning with shortcuts.',
		webStore:
			'https://chromewebstore.google.com/detail/pin-switcher/egegfclbklldhldifonojknjpbobgjjh',
		github: 'https://github.com/pho9ubenaa/pin-switcher',
	},
	{
		id: 'tab-cloner',
		name: 'Tab Cloner',
		description: 'Duplicate active tabs with shortcuts.',
		webStore:
			'https://chromewebstore.google.com/detail/tab-cloner/iiflnjgfpgipofepijkimmeapfdphcpg',
		github: 'https://github.com/pho9ubenaa/tab-cloner',
	},
	{
		id: 'reading-list-register',
		name: 'Reading List Register',
		description: 'Add active tab to the Reading List with shortcuts.',
		webStore:
			'https://chromewebstore.google.com/detail/amjohpekcdmdmlghoeannbceemhkfhng',
		github: 'https://github.com/pho9ubenaa/reading-list-register',
	},
	{
		id: 'domain-tab-organizer',
		name: 'Domain Tab Organizer',
		description: 'Groups tabs by domain automatically with shortcuts',
		webStore:
			'https://chromewebstore.google.com/detail/domain-tab-organizer/cjclpdejlpldjlghjcllcadhjkoepkob',
		github: 'https://github.com/pho9ubenaa/domain-tab-organizer',
	},
	{
		id: 'tab-cleaner-extension',
		name: 'Tab Cleaner Extension',
		description: 'Clean up tabs with registered domains.',
		webStore:
			'https://chrome.google.com/webstore/detail/tab-cleaner-extension/lbechddallmndemekdkfkmfjcbloehco',
		github: 'https://github.com/pho9ubenaa/tab-cleaner-extension',
	},
] as const;

type Extension = (typeof rawExtensions)[number] & { support: string };

export const EXTENSIONS: ReadonlyArray<Extension> = rawExtensions.map(
	(ext) => ({
		...ext,
		support: `${ext.webStore}/support`,
	}),
);
