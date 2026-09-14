import { cp, rm } from 'node:fs/promises';

// dist is generated output; all deployable source files live in public.
const source = new URL('../public/', import.meta.url);
const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
console.log('Copied public/ to dist/');
