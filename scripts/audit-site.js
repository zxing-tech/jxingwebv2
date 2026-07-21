'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

function htmlFiles(dir = root) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (['.git', '.vercel', 'node_modules'].includes(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(full) : (entry.name.endsWith('.html') ? [full] : []);
  });
}

const files = htmlFiles();
const errors = [];
const warnings = [];
const knownRoutes = new Set(files.map((file) => {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  return rel === 'index.html' ? '/' : `/${rel.replace(/\/index\.html$/, '')}/`;
}));
knownRoutes.add('/sitemap.xml');
knownRoutes.add('/robots.txt');

for (const file of files) {
  const rel = path.relative(root, file);
  const html = fs.readFileSync(file, 'utf8');
  const links = [...html.matchAll(/href=["']([^"']+)["']/g)].map((m) => m[1]);
  for (const href of links) {
    if (/^(https?:|mailto:|tel:|#|javascript:)/.test(href)) continue;
    const clean = href.split(/[?#]/)[0];
    if (!clean || clean.startsWith('/assets/')) continue;
    const normalized = clean === '/' ? '/' : `${clean.replace(/\/$/, '')}/`;
    if (!knownRoutes.has(normalized)) errors.push(`${rel}: missing internal target ${href}`);
  }

  if (!/<title>[^<]{10,}<\/title>/i.test(html)) errors.push(`${rel}: missing/short title`);
  const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => /name=["']description["']/i.test(tag));
  const description = descriptionTag?.match(/content=(["'])(.*?)\1/i)?.[2] || '';
  if (description.length < 40) {
    warnings.push(`${rel}: missing/short meta description`);
  }
  if (!/rel=["']canonical["']/i.test(html)) errors.push(`${rel}: missing canonical`);
  if (!/application\/ld\+json/i.test(html)) errors.push(`${rel}: missing structured data`);
  if (/jxingtech\.my/i.test(html)) errors.push(`${rel}: legacy .my domain reference`);
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
if (/jxingtech\.my/i.test(sitemap)) errors.push('sitemap.xml: legacy .my domain reference');
if (!sitemap.includes('https://www.jxingtech.com')) errors.push('sitemap.xml: canonical domain missing');

console.log(JSON.stringify({
  htmlFiles: files.length,
  internalRoutes: knownRoutes.size - 2,
  errors: errors.length,
  warnings: warnings.length,
  warningDetails: warnings.slice(0, 20),
  errorDetails: errors.slice(0, 50)
}, null, 2));

if (errors.length) process.exit(1);
