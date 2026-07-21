const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
function htmlFiles(dir = root) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === '.vercel' || entry.name === 'node_modules') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(full) : (entry.name.endsWith('.html') ? [full] : []);
  });
}

test('all HTML pages are free of placeholder links, mojibake, stale year and wrong office location', () => {
  const errors = [];
  for (const file of htmlFiles()) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    if (/href=["']#["']/.test(html)) errors.push(`${rel}: placeholder href`);
    if (/[ÂÃ]|â|â¢| â /.test(html)) errors.push(`${rel}: mojibake`);
    if (/San Francisco, CA/i.test(html)) errors.push(`${rel}: wrong office location`);
    if (/© 2024|Â© 2024/.test(html)) errors.push(`${rel}: stale copyright`);
    if (!html.includes('/assets/site.js')) errors.push(`${rel}: missing shared site script`);
  }
  assert.deepEqual(errors, []);
});

test('unverified generated performance claims are not published as facts', () => {
  const combined = htmlFiles().map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(combined, /200% faster growth|zero downtime|90% improvement|3x monthly lead|Rank #1 for target keywords/i);
});

test('contact page has functional AI discovery and local contact handoff', () => {
  const html = fs.readFileSync(path.join(root, 'contact/index.html'), 'utf8');
  assert.match(html, /id="ai-architect-form"/);
  assert.match(html, /name="goal"/);
  assert.match(html, /name="systems"/);
  assert.match(html, /name="workflows"/);
  assert.match(html, /name="budget"/);
  assert.match(html, /name="timeline"/);
  assert.match(html, /id="ai-result"/);
  assert.match(html, /id="technical-audit-form"/);
  assert.match(html, /for="audit-name"/);
  assert.match(html, /id="audit-name"/);
  assert.match(html, /id="audit-consent"[^>]+name="consent"/);
  assert.match(html, /<label for="audit-consent"/);
  assert.match(html, /id="ai-result"[^>]+aria-live="polite"/);
  assert.match(html, /hello@jxingtech\.com/);
  assert.match(html, /RM 22k/);
  assert.doesNotMatch(html, /\$10k/);
});

test('core pages expose canonical and Organization structured data', () => {
  for (const rel of ['index.html', 'services/index.html', 'pricing/index.html', 'case-studies/index.html', 'contact/index.html']) {
    const html = fs.readFileSync(path.join(root, rel), 'utf8');
    assert.match(html, /rel="canonical"/i, rel);
    assert.match(html, /application\/ld\+json/i, rel);
    assert.match(html, /"@type":"Organization"/i, rel);
  }
});
