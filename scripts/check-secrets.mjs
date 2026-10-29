// Adapted from window-merger at c9291ac9f77161e48288533e3901e7baebb9f22b:
// https://github.com/pHo9UBenaA/window-merger/blob/c9291ac9f77161e48288533e3901e7baebb9f22b/scripts/check-secrets.ts
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

// Explicit tracked paths include force-added ignored files, but exclude local notes and dependencies.
const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
	encoding: 'utf8',
}).trim();
const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
	cwd: repositoryRoot,
	encoding: 'utf8',
})
	.split('\0')
	.filter(Boolean);
if (trackedFiles.length > 0) {
	execFileSync(
		join(repositoryRoot, 'node_modules/.bin/secretlint'),
		['--no-gitignore', '--no-glob', '--', ...trackedFiles],
		{ cwd: repositoryRoot, stdio: 'inherit' },
	);
}
