import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const config = readFileSync(new URL('../config.js', import.meta.url), 'utf8');
const inventory = readFileSync(new URL('./legacy-inventory.mjs', import.meta.url), 'utf8');
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
const references = [...app.matchAll(/\$\('([^']+)'\)/g)].map(m => m[1]);
const missing = [...new Set(references.filter(id => !ids.has(id)))];
assert.deepEqual(missing, [], 'Missing HTML IDs');
assert.match(html, /src="\.\/config\.js"/);
assert.match(app, /config\.projectId==='asem-algel'/);
assert.match(config, /ALGEL_V4_FIREBASE\s*=\s*null/);
assert.doesNotMatch(inventory, /\.(?:set|update|delete|add|commit)\s*\(/);
assert.match(app, /getIdToken\(true\)/);
console.log('AlGel v4 static checks passed. Firebase emulator tests are still required.');
