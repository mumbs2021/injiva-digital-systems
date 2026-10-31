'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const origin = 'https://injivadigitalsytems.com';
const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const docs = new Map(files.map(f => [f, new JSDOM(fs.readFileSync(path.join(root, f), 'utf8'), { url: origin + '/' + f }).window.document]));

test('all pages have unique metadata, one H1, landmarks and valid IDs', () => {
  const titles = new Set(), descriptions = new Set();
  assert.equal(files.length, 33);
  for (const [file, d] of docs) {
    assert.equal(d.documentElement.lang, 'en', file);
    assert.equal(d.querySelectorAll('h1').length, 1, file);
    assert.equal(d.querySelectorAll('main').length, 1, file);
    assert.ok(d.querySelector('.skip[href="#main"]'), file);
    const title = d.title, desc = d.querySelector('meta[name="description"]')?.content;
    assert.ok(title && desc, file);
    assert.ok(!titles.has(title) && !descriptions.has(desc), file);
    titles.add(title); descriptions.add(desc);
    const ids = [...d.querySelectorAll('[id]')].map(e => e.id);
    assert.equal(new Set(ids).size, ids.length, file);
    for (const e of d.querySelectorAll('[aria-controls],[aria-describedby],[aria-labelledby]')) {
      for (const name of ['aria-controls','aria-describedby','aria-labelledby']) {
        for (const id of (e.getAttribute(name) || '').split(/\s+/).filter(Boolean)) assert.ok(d.getElementById(id), file + ': ' + id);
      }
    }
  }
});
test('all internal links, images, scripts, styles and fragments resolve', () => {
  for (const [file, d] of docs) {
    for (const el of d.querySelectorAll('[href],[src]')) {
      const value = el.getAttribute('href') || el.getAttribute('src');
      const url = new URL(value, origin + '/' + file);
      if (url.origin !== origin) continue;
      const target = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
      assert.ok(fs.existsSync(path.join(root, target)), file + ': ' + value);
      if (url.hash && docs.has(target)) assert.ok(docs.get(target).getElementById(decodeURIComponent(url.hash.slice(1))), file + ': ' + value);
    }
  }
});
test('canonical URLs, index rules and XML sitemap agree', () => {
  const xml = new JSDOM(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'), { contentType:'application/xml' }).window.document;
  const locations = [...xml.querySelectorAll('loc')].map(e => e.textContent);
  assert.equal(locations.length, files.length - 1);
  for (const [file, d] of docs) {
    const expected = origin + (file === 'index.html' ? '/' : '/' + file);
    assert.equal(d.querySelector('link[rel="canonical"]').href, expected);
    assert.equal(d.querySelector('meta[property="og:url"]').content, expected);
    const robots = d.querySelector('meta[name="robots"]').content;
    if (file === '404.html') { assert.match(robots,/noindex/); assert.ok(!locations.includes(expected)); }
    else { assert.doesNotMatch(robots,/noindex/); assert.ok(locations.includes(expected), file); }
  }
  assert.match(fs.readFileSync(path.join(root,'robots.txt'),'utf8'), /Sitemap: https:\/\/injivadigitalsytems.com\/sitemap.xml/);
  assert.equal(fs.readFileSync(path.join(root,'CNAME'),'utf8').trim(), new URL(origin).hostname);
});
test('CSP allows exact JSON-LD hashes and blocks inline executable code and network submission', () => {
  for (const [file,d] of docs) {
    const csp = d.querySelector('meta[http-equiv="Content-Security-Policy"]').content;
    for (const rule of ["object-src 'none'", "base-uri 'none'", "connect-src 'none'", "form-action 'none'"]) assert.ok(csp.includes(rule), file);
    assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
    for (const script of d.querySelectorAll('script:not([src])')) {
      assert.equal(script.type, 'application/ld+json');
      JSON.parse(script.textContent);
      const hash = crypto.createHash('sha256').update(script.textContent).digest('base64');
      assert.ok(csp.includes("'sha256-" + hash + "'"), file);
    }
    for (const el of d.querySelectorAll('*')) for (const attr of el.attributes) {
      assert.ok(!/^on/i.test(attr.name), file + ': inline handler');
      if (['href','src'].includes(attr.name)) assert.doesNotMatch(attr.value,/^javascript:/i);
    }
    for (const script of d.querySelectorAll('script[src]')) assert.equal(new URL(script.src).origin, origin);
  }
});
test('images have alt and dimensions; all form controls have accessible labels', () => {
  for (const [file,d] of docs) {
    for (const img of d.images) { assert.ok(img.hasAttribute('alt'),file); assert.ok(img.width > 0 && img.height > 0,file); }
    for (const el of d.querySelectorAll('input:not([type="hidden"]),textarea,select')) {
      assert.ok(el.labels?.length || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'),file + ': ' + el.id);
    }
    for (const el of d.querySelectorAll('a[target="_blank"]')) assert.match(el.rel, /noopener/);
  }
});
test('404 resources work from nested missing URLs', () => {
  const d = new JSDOM(fs.readFileSync(path.join(root,'404.html'),'utf8'), {url:origin+'/missing/nested/page'}).window.document;
  for (const el of d.querySelectorAll('[href],[src]')) {
    const value = el.getAttribute('href') || el.getAttribute('src');
    if (value.startsWith('#')) continue;
    const u = new URL(value, d.URL);
    if (u.origin === origin) assert.ok(fs.existsSync(path.join(root,u.pathname)),value);
  }
});
test('release build excludes tooling and supports project-path 404 assets', () => {
  execFileSync(process.execPath,['scripts/build.cjs'],{cwd:root,env:{...process.env,PAGES_BASE_PATH:'/demo'}});
  const out = path.join(root,'_site');
  for (const f of ['package.json','package-lock.json','tests','documentation','node_modules','_headers','.github']) assert.ok(!fs.existsSync(path.join(out,f)),f);
  assert.equal(fs.readdirSync(out).filter(f=>f.endsWith('.html')).length,33);
  assert.match(fs.readFileSync(path.join(out,'404.html'),'utf8'), /src="\/demo\/assets\/js\/main.js"/);
  execFileSync(process.execPath,['scripts/build.cjs'],{cwd:root,env:{...process.env,PAGES_BASE_PATH:''}});
});
test('active contact navigation button retains readable text contrast', () => {
  const dom=new JSDOM(fs.readFileSync(path.join(root,'contact.html'),'utf8'));
  const d=dom.window.document, style=d.createElement('style');
  style.textContent=fs.readFileSync(path.join(root,'assets/css/style.css'),'utf8');d.head.append(style);
  const button=d.querySelector('.site-header a.button[aria-current]');assert.ok(button);
  const css=dom.window.getComputedStyle(button);
  const luminance=color=>{
    const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
    return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  };
  const a=luminance(css.color),b=luminance(css.backgroundColor);
  assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'Active CTA needs at least 4.5:1 text contrast');
  dom.window.close();
});
