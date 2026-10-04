import { readFile, realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryDirectory = fileURLToPath(new URL('../', import.meta.url));
const servedDirectory = resolve(
	repositoryDirectory,
	process.argv.includes('--dist') ? 'dist' : 'public',
);
const port = Number(process.env.PORT || 4321);
const contentTypesByExtension = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.woff': 'font/woff',
};

async function readSiteFile(urlPath) {
	const filePath = resolve(
		servedDirectory,
		`.${urlPath === '/' ? '/index.html' : urlPath}`,
	);
	if (!filePath.startsWith(`${servedDirectory}${sep}`)) {
		return { statusCode: 403 };
	}

	try {
		// Check symlink targets as well as the requested path to keep source private.
		const resolvedFilePath = await realpath(filePath);
		if (
			!resolvedFilePath.startsWith(`${servedDirectory}${sep}`) ||
			!(await stat(resolvedFilePath)).isFile()
		) {
			return { statusCode: 403 };
		}
		return {
			statusCode: 200,
			contentType:
				contentTypesByExtension[extname(filePath)] ||
				'application/octet-stream',
			body: await readFile(resolvedFilePath),
		};
	} catch (error) {
		if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
		return {
			statusCode: 404,
			contentType: contentTypesByExtension['.html'],
			body: await readFile(resolve(servedDirectory, '404.html')),
		};
	}
}

const server = createServer(async (request, response) => {
	response.setHeader('Cache-Control', 'no-store');
	response.setHeader('X-Content-Type-Options', 'nosniff');
	if (!['GET', 'HEAD'].includes(request.method)) {
		response.writeHead(405, { Allow: 'GET, HEAD' }).end();
		return;
	}

	try {
		const urlPath = decodeURIComponent(
			new URL(request.url, 'http://localhost').pathname,
		);
		const { statusCode, contentType, body } = await readSiteFile(urlPath);
		if (body === undefined) {
			response.writeHead(statusCode).end();
			return;
		}
		response.writeHead(statusCode, {
			'Content-Type': contentType,
			'Content-Length': body.length,
		});
		response.end(request.method === 'HEAD' ? undefined : body);
	} catch (error) {
		if (error instanceof URIError) {
			response.writeHead(400).end();
			return;
		}
		response.writeHead(500).end();
		console.error(error);
	}
});

server.listen(port, '127.0.0.1', () =>
	console.log(`Preview: http://127.0.0.1:${port}`),
);
