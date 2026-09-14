import { readFile, realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, process.argv.includes('--dist') ? 'dist' : 'public');
const port = Number(process.env.PORT || 4321);
const types = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.woff': 'font/woff',
};
const server = createServer(async (req, res) => {
	res.setHeader('Cache-Control', 'no-store');
	res.setHeader('X-Content-Type-Options', 'nosniff');
	if (!['GET', 'HEAD'].includes(req.method)) {
		res.writeHead(405, { Allow: 'GET, HEAD' }).end();
		return;
	}
	try {
		const path = decodeURIComponent(
			new URL(req.url, 'http://localhost').pathname,
		);
		const file = resolve(dist, `.${path === '/' ? '/index.html' : path}`);
		if (!file.startsWith(`${dist}${sep}`)) {
			res.writeHead(403).end();
			return;
		}
		let data;
		let type = types[extname(file)] || 'application/octet-stream';
		let status = 200;
		try {
			const actual = await realpath(file);
			if (
				!actual.startsWith(`${dist}${sep}`) ||
				!(await stat(actual)).isFile()
			) {
				res.writeHead(403).end();
				return;
			}
			data = await readFile(actual);
		} catch (error) {
			if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
			data = await readFile(resolve(dist, '404.html'));
			type = types['.html'];
			status = 404;
		}
		res.writeHead(status, {
			'Content-Type': type,
			'Content-Length': data.length,
		});
		res.end(req.method === 'HEAD' ? undefined : data);
	} catch (error) {
		res.writeHead(error instanceof URIError ? 400 : 500).end();
		if (!(error instanceof URIError)) console.error(error);
	}
});
server.listen(port, '127.0.0.1', () =>
	console.log(`Preview: http://127.0.0.1:${port}`),
);
