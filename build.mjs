import fs from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const out = path.join(root, 'dist');
await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.cp(path.join(root, 'public'), out, { recursive: true });
console.log('Customer Segment Studio flagship site built into dist/.');
