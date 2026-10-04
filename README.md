# Chrome Extension Page

This is a collection page of my chrome extensions.

## Development

Use Node.js 22 or newer and the pnpm version pinned in `package.json`.

- `pnpm install --frozen-lockfile`
- `pnpm dev` serves `public/` directly at `http://127.0.0.1:4321`. Save your edits and refresh the
  browser; no rebuild is needed.
- `pnpm build` replaces `dist/` with a copy of `public/`, including HTML, CSS, assets and the
  existing sitemap.
- `pnpm preview` builds and serves `dist/` to check the deployable output.
- `pnpm test:ci` checks heading links, page content, HTTP responses, assets and screenshots in
  Chromium.
- `pnpm format` formats project sources; `pnpm ci` checks JavaScript, CSS and configuration with
  Biome, and `pnpm format:check` checks Markdown, HTML and SVG with Prettier. CI runs both checks.
- `pnpm lint:security` runs siro to check dependency security settings; warnings and errors fail the
  check. CI runs this too.
- `pnpm lint:actions` audits all GitHub Actions workflows with ghalint, zizmor (online, pedantic, no
  ignores), and actionlint/ShellCheck. Install `ghalint`, `zizmor`, `actionlint`, and `shellcheck`
  first, then authenticate `gh` or set `GH_TOKEN`/`GITHUB_TOKEN`. The script follows
  [this audit gist](https://gist.github.com/pHo9UBenaA/fe77d657f6f0b2dcef0d0c9cd1546192).
- `pnpm deploy` builds and deploys `dist/` to Cloudflare Pages using Wrangler.

All deployable files live in `public/`. Read or edit `public/index.html` to see the complete
homepage: text, extension descriptions, links and metadata. `public/404.html` contains the error
page, and `public/styles/global.css` contains shared styles. There are no templates, content
fragments or separate content data files. The build only copies `public/` to `dist/` using Node.js
standard modules.

When adding an extension, update both its entry and support links in `public/index.html`. Update
shared metadata and copyright text in both HTML pages when needed. There is no browser JavaScript or
application server in the deployed site.

Cloudflare Pages build settings: `pnpm build`, output directory `dist`.

The default branch is `main`; CI runs for pushes to `main` and pull requests. Actions are pinned to
commit SHAs and kept up to date by Dependabot.

Screenshot baselines and CI use macOS because the layout includes system fonts.

## LICENSE

[MIT](LICENSE)
