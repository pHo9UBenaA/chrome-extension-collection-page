# Repository guide

See [README.md](README.md) for the site's purpose, local setup and deployment instructions.

## Edit the site

All deployable source files live in `public/`:

- Update extension descriptions, store links and support links in `public/index.html`. When adding
  an extension, include both its listing and its support links.
- Edit the error page in `public/404.html` and shared styles in `public/styles/global.css`.
- Keep shared metadata and copyright text consistent across both HTML pages when updating them.

Do not edit `dist/` directly: each build replaces it with the contents of `public/`.

## Verify changes

For code or site changes, run:

```sh
pnpm ci
pnpm format:check
pnpm lint:security
pnpm exec playwright install chromium --with-deps
pnpm test:ci
```

These check code and formatting, dependency security settings, page behavior and screenshots.
Dependency security warnings and errors both fail the check. Use `pnpm format` to fix formatting.
For Markdown-only changes, run `pnpm format:check`.

Screenshot baselines use macOS system fonts. Run screenshot comparisons on macOS to match CI; other
operating systems may render text differently. The browser tests build and serve the site
automatically.

### Dependency and secret checks

- `pnpm check:dependencies` checks all locked packages for known vulnerabilities, including
  development, transitive and other-platform optional dependencies. It requires network access for
  `pnpm audit` and OSV; OSV receives package names and versions, not local paths or lockfile
  contents. Exit codes: `0` means both audits completed without findings, `1` means vulnerabilities
  were found (including pre-existing ones), and `2` means an audit could not complete.
- `pnpm check:secrets` checks Git-tracked files for secrets, including force-added ignored files. It
  does not scan untracked files or Git history. Add new files to Git before using this check to
  verify them.

These commands are separate from `pnpm lint:security`, which checks dependency security settings,
not known vulnerabilities. They are not currently run by CI.

## When changing GitHub Actions

Run `pnpm lint:actions` to audit workflows. First install `ghalint`, `zizmor`, `actionlint` and
`shellcheck`, then authenticate `gh` or set `GH_TOKEN`/`GITHUB_TOKEN`. The audit requires network
access and runs zizmor with pedantic checks and no ignores. This audit is separate from CI.
