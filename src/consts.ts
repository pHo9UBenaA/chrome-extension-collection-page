// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_AUTHOR = 'Komiya';
export const SITE_AUTHOR_ID = 'pHo9UBenaA';
export const SITE_TITLE = `${SITE_AUTHOR}'s Chrome Extensions`;
export const SITE_DESCRIPTION = `Chrome extensions by ${SITE_AUTHOR}, with privacy and support information.`;

const rawExtensions = [
	{
		id: 'window-merger',
		name: 'Window Merger',
		description:
			'Put all windows into one window with a shortcut. Tab groups and pinned tabs stay in place.',
		webStore:
			'https://chromewebstore.google.com/detail/window-merger/fijodggmkbkjcmlpkpahjpepngppdppb',
		github: 'https://github.com/pho9ubenaa/window-merger',
	},
	{
		id: 'pin-switcher',
		name: 'Pin Switcher',
		description: 'Pin or unpin the current tab with a shortcut.',
		webStore:
			'https://chromewebstore.google.com/detail/pin-switcher/egegfclbklldhldifonojknjpbobgjjh',
		github: 'https://github.com/pho9ubenaa/pin-switcher',
	},
	{
		id: 'tab-cloner',
		name: 'Tab Cloner',
		description: 'Open a copy of the current tab with a shortcut.',
		webStore:
			'https://chromewebstore.google.com/detail/tab-cloner/iiflnjgfpgipofepijkimmeapfdphcpg',
		github: 'https://github.com/pho9ubenaa/tab-cloner',
	},
	{
		id: 'reading-list-register',
		name: 'Reading List Register',
		description: 'Add the current tab to your Reading List with a shortcut.',
		webStore:
			'https://chromewebstore.google.com/detail/amjohpekcdmdmlghoeannbceemhkfhng',
		github: 'https://github.com/pho9ubenaa/reading-list-register',
	},
	{
		id: 'domain-tab-organizer',
		name: 'Domain Tab Organizer',
		description: 'Put tabs from the same website into groups with a shortcut.',
		webStore:
			'https://chromewebstore.google.com/detail/domain-tab-organizer/cjclpdejlpldjlghjcllcadhjkoepkob',
		github: 'https://github.com/pho9ubenaa/domain-tab-organizer',
	},
	{
		id: 'tab-cleaner-extension',
		name: 'Tab Cleaner Extension',
		description: 'Close tabs from websites on your saved list.',
		webStore:
			'https://chromewebstore.google.com/detail/tab-cleaner-extension/lbechddallmndemekdkfkmfjcbloehco',
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
