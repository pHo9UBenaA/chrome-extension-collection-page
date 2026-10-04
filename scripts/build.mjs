import { cp, rm } from 'node:fs/promises';

// dist is generated output; all deployable source files live in public.
const sourceDirectory = new URL('../public/', import.meta.url);
const outputDirectory = new URL('../dist/', import.meta.url);
await rm(outputDirectory, { recursive: true, force: true });
await cp(sourceDirectory, outputDirectory, { recursive: true });
console.log('Copied public/ to dist/');
