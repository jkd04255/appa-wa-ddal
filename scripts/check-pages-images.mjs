import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const prefix = process.env.NEXT_PUBLIC_BASE_PATH;
assert(prefix?.startsWith('/'), 'Pages base path is required');
const html = await readFile('out/daughter/index.html', 'utf8');
const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
assert(images.length > 0, 'Daughter home must include a visual image');
for (const src of images) {
  assert(src.startsWith(`${prefix}/`), `Image is missing the Pages prefix: ${src}`);
  const file = resolve('out', `.${src.slice(prefix.length)}`);
  assert((await stat(file)).isFile(), `Image file missing: ${src}`);
}
console.log(`Pages image paths and files: ${images.length} passed`);
