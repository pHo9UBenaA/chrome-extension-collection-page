# Chrome Extension Page

Browse [Komiya's Chrome Extensions](https://chrome-extension.pho9ubenaa.com/) for extension
descriptions, Chrome Web Store links, privacy information and support contacts.

This repository contains the collection website, not the extensions themselves. For help with an
extension, use its links in the site's
[Support section](https://chrome-extension.pho9ubenaa.com/#support).

## Run locally

Use Node.js 22 or newer and the pnpm version pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:4321`. Save your edits and refresh the browser to see changes; no rebuild is
needed.

To inspect the deployable site, run `pnpm preview` and open the same URL.

## Contribute

See [AGENTS.md](AGENTS.md) for editing guidance, required checks and workflow audit prerequisites.

## Deploy

The site is hosted on Cloudflare Pages. Use these build settings:

- Build command: `pnpm build`
- Output directory: `dist`

To deploy from your machine, authenticate Wrangler with an account that has access to the Cloudflare
Pages project, then run `pnpm deploy`. This builds the site before uploading it.

## License

[MIT](LICENSE)
