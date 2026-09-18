import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const library = new URL('../node_modules/pdfjs-dist/', import.meta.url);
const output = new URL('../public/pdfjs/', import.meta.url);
mkdirSync(output, { recursive: true });
for (const folder of ['cmaps', 'standard_fonts', 'wasm']) {
  cpSync(fileURLToPath(new URL(folder, library)), fileURLToPath(new URL(folder, output)), { recursive: true });
}
cpSync(new URL('LICENSE', library), new URL('LICENSE', output));
