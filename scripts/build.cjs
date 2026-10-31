'use strict';
// Publish an explicit allowlist, never the repository or developer tooling.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '_site');
const base = process.env.PAGES_BASE_PATH || '';
if (base && !/^\/[a-zA-Z0-9._-]+$/.test(base)) throw Error('Invalid Pages base path');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const name of fs.readdirSync(root)) {
  if (name.endsWith('.html') || ['robots.txt', 'sitemap.xml', 'CNAME', '.nojekyll'].includes(name)) {
    let content = fs.readFileSync(path.join(root, name));
    if (name === '404.html' && base) content = Buffer.from(content.toString().replace(/(href|src)="\/(?!\/)/g, '$1="' + base + '/'));
    fs.writeFileSync(path.join(out, name), content);
  }
}
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
console.log('Built _site: public pages and assets only.');
