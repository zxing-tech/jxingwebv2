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

function routeForFile(file) {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  return rel === 'index.html' ? '/' : `/${rel.replace(/\/index\.html$/, '')}/`;
}

function linkTarget(label) {
  const text = label.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  if (/privacy/.test(text)) return '/privacy-policy/';
  if (/terms/.test(text)) return '/terms-of-service/';
  if (/company|about jxing/.test(text)) return '/company/';
  if (/case stud|success stor/.test(text)) return '/case-studies/';
  if (/pricing/.test(text)) return '/pricing/';
  if (/service|capabilit|application engineering|web app|e-commerce|automation|cloud operations|market research|performance marketing|seo\/aio/.test(text)) return '/services/';
  if (/resource|whitepaper|news/.test(text)) return '/news/';
  if (/linkedin|group/.test(text)) return 'https://www.linkedin.com/company/jxingtech';
  if (/github|terminal/.test(text)) return 'https://github.com/zxing-tech';
  if (/instagram/.test(text)) return 'https://www.instagram.com/jxingtech/';
  if (/facebook/.test(text)) return 'https://www.facebook.com/jxingtech/';
  if (/public|home|world/.test(text)) return '/';
  return '/contact/';
}

function organizationSchema(canonical) {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JXING Tech',
    url: 'https://www.jxingtech.com',
    email: 'hello@jxingtech.com',
    telephone: '+60 10-288 2827',
    address: { '@type': 'PostalAddress', addressRegion: 'Kuala Lumpur', addressCountry: 'MY' },
    sameAs: [
      'https://www.linkedin.com/company/jxingtech',
      'https://www.facebook.com/jxingtech/',
      'https://www.instagram.com/jxingtech/',
      'https://github.com/zxing-tech'
    ],
    mainEntityOfPage: canonical
  })}</script>`;
}

function updateContact(html) {
  html = html.replace('<form class="grid grid-cols-1 md:grid-cols-2 gap-6">', '<form id="technical-audit-form" class="grid grid-cols-1 md:grid-cols-2 gap-6">');
  const fields = [
    ['placeholder="John Doe" type="text"', 'name="name" autocomplete="name" required placeholder="Your name" type="text"'],
    ['placeholder="john@company.com" type="email"', 'name="email" autocomplete="email" required placeholder="you@company.com" type="email"'],
    ['placeholder="+1 (555) 000-0000" type="tel"', 'name="phone" autocomplete="tel" placeholder="+60 10-288 2827" type="tel"'],
    ['placeholder="Acme Corp" type="text"', 'name="company" autocomplete="organization" placeholder="Company name" type="text"'],
    ['placeholder="https://example.com or current stack description" type="text"', 'name="systems" placeholder="Website URL or current systems" type="text"']
  ];
  for (const [from, to] of fields) html = html.replace(from, to);
  html = html.replace('<select class="w-full bg-white/50 border border-timberwolf/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-azure/20 focus:border-azure outline-none transition-all appearance-none">\n<option>Select Type</option>', '<select name="projectType" required class="w-full bg-white/50 border border-timberwolf/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-azure/20 focus:border-azure outline-none transition-all appearance-none">\n<option value="">Select Type</option>');
  html = html.replace('<option>$10k - $25k</option>\n<option>$25k - $50k</option>\n<option>$50k - $100k</option>\n<option>$100k+</option>', '<option>RM 5k–15k</option>\n<option>RM 15k–22k</option>\n<option>RM 22k–65k</option>\n<option>RM 65k–150k</option>\n<option>RM 150k+</option>\n<option>Need technical audit first</option>');
  const selects = [...html.matchAll(/<select class="w-full bg-white\/50[^>]+>/g)];
  const names = ['budget', 'timeline', 'support'];
  for (let i = 0; i < Math.min(selects.length, names.length); i++) {
    html = html.replace(selects[i][0], selects[i][0].replace('<select ', `<select name="${names[i]}" `));
  }
  html = html.replace('placeholder="What core challenge are we solving?" rows="3"', 'name="businessProblem" required placeholder="What business problem should the system solve?" rows="3"');
  html = html.replace('placeholder="Define the scale and scope of the technical architecture..." rows="3"', 'name="workflows" required placeholder="Who uses it, and which workflows matter most?" rows="3"');
  html = html.replace('</button>\n</div>\n</form>', '</button>\n<p id="audit-form-status" aria-live="polite" class="mt-3 text-xs text-marian-blue/70"></p>\n</div>\n</form>');

  const widgetStart = html.indexOf('<!-- AI Architect Widget -->');
  const widgetEnd = html.indexOf('<!-- Cal.com Card -->');
  if (widgetStart !== -1 && widgetEnd !== -1) {
    const widget = `<!-- AI Architect Widget -->
<div class="bg-oxford-blue text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
<div class="relative z-10">
<div class="flex items-center gap-2 mb-5"><div class="w-8 h-8 bg-azure rounded-lg flex items-center justify-center"><span class="material-symbols-outlined text-sm">smart_toy</span></div><h3 class="font-bold text-xl">AI Digital Architect</h3></div>
<p class="text-sm text-white/65 mb-6">Get a preliminary engineering path. Do not enter names, email addresses, phone numbers, passwords, or confidential data.</p>
<form id="ai-architect-form" class="space-y-4">
<label class="block text-xs font-bold uppercase tracking-wider text-azure">1. Goal<textarea name="goal" required minlength="10" maxlength="1200" rows="3" class="mt-2 w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 p-3 text-sm" placeholder="What do you want to build, automate, or improve?"></textarea></label>
<label class="block text-xs font-bold uppercase tracking-wider text-white/70">2. Existing systems<input name="systems" maxlength="1000" class="mt-2 w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 p-3 text-sm" placeholder="Website, CRM, spreadsheets, accounting…"></label>
<label class="block text-xs font-bold uppercase tracking-wider text-white/70">3. Users and workflows<textarea name="workflows" maxlength="1200" rows="2" class="mt-2 w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 p-3 text-sm" placeholder="Who uses it and what should happen?"></textarea></label>
<div class="grid grid-cols-2 gap-3"><label class="block text-xs font-bold uppercase tracking-wider text-white/70">4. Budget<select name="budget" class="mt-2 w-full rounded-xl bg-oxford-blue border border-white/15 text-white p-3 text-sm"><option>RM 5k–15k</option><option>RM 15k–22k</option><option selected>RM 22k–65k</option><option>RM 65k–150k</option><option>RM 150k+</option><option>Need an audit first</option></select></label><label class="block text-xs font-bold uppercase tracking-wider text-white/70">5. Timeline<select name="timeline" class="mt-2 w-full rounded-xl bg-oxford-blue border border-white/15 text-white p-3 text-sm"><option>1–3 months</option><option selected>3–6 months</option><option>6+ months</option><option>Exploring</option></select></label></div>
<button type="submit" class="w-full bg-azure text-white py-3 rounded-xl font-bold hover:bg-marian-blue transition-colors">6. Generate Recommended Path</button>
</form>
<p id="ai-status" aria-live="polite" class="mt-4 text-xs text-white/55">Project details only; contact information is never sent to the model.</p>
<pre id="ai-result" class="hidden mt-4 whitespace-pre-wrap font-body text-sm leading-relaxed bg-white/5 border border-white/10 rounded-xl p-4 max-h-96 overflow-auto"></pre>
</div></div>
`;
    html = html.slice(0, widgetStart) + widget + html.slice(widgetEnd);
  }

  html = html.replace(/<button class="w-full py-4 bg-white border-2 border-azure[\s\S]*?<\/button>/, '<a class="w-full py-4 bg-white border-2 border-azure text-azure rounded-xl font-bold hover:bg-azure hover:text-white transition-all flex items-center justify-center gap-2" href="mailto:hello@jxingtech.com?subject=Technical%20Audit%20Call%20Request">Request an Audit Call <span class="material-symbols-outlined">arrow_outward</span></a>');
  html = html.replace('Stack Vulnerability Assessment', 'Existing-system and risk review');
  html = html.replace('Market Opportunity Gap Analysis', 'Architecture and delivery roadmap');
  html = html.replace('Limited technical audit slots this week', 'Plan the right next step');
  html = html.replace('Ready for dominance?', 'Ready to map your next digital system?');
  html = html.replace('Singapore (HQ)', 'Kuala Lumpur');
  html = html.replace('Global Presences', 'Malaysia Presence');
  html = html.replace('Level 42, Marina Bay Financial Centre, Tower 3', 'Level 37, Q Sentral, Jalan Stesen Sentral 2, 50470 Kuala Lumpur, Malaysia');
  html = html.replace(/<div class="flex items-start gap-3">\s*<span[^>]+data-icon="location_on"[^>]*>location_on<\/span>\s*<div>\s*<p[^>]*>London<\/p>[\s\S]*?<\/div>\s*<\/div>/, '');
  html = html.replace(/<div class="flex items-start gap-3">\s*<span[^>]+data-icon="location_on"[^>]*>location_on<\/span>\s*<div>\s*<p[^>]*>New York<\/p>[\s\S]*?<\/div>\s*<\/div>/, '');
  html = html.replace(/<a([^>]+)href="\/contact\/"([^>]*)>\s*<span([^>]*)data-icon="chat"([^>]*)>chat<\/span>\s*WhatsApp Corporate Support\s*<\/a>/, '<a$1href="https://wa.me/60102882827" rel="noopener"$2><span$3data-icon="chat"$4>chat</span> WhatsApp Corporate Support</a>');
  html = html.replace(/Response time:\s*<br\/>\s*<span class="font-bold">Mon - Fri: &lt; 12 Hours<\/span>\s*<br\/>\s*<span class="font-bold">Weekend: &lt; 24 Hours<\/span>/, 'We respond during Malaysian business hours.');
  html = html.replace('All communications are encrypted. JXING Tech adheres to strict NDAs by default for all enterprise-tier inquiries. We do not sell or share your data with third-party marketers.', 'Share only the information needed for your enquiry. Confidential project details should be exchanged after an appropriate NDA and access process are agreed.');
  html = html.replace('30-min deep dive with a senior strategist.', 'Scoping conversation with a senior strategist.');
  html = html.replace('Strategic technology partner for full-stack engineering and AI growth.', 'Custom web application and full-stack digital systems partner.');
  html = html.replace('>Market Research<', '>Custom Web Applications<');
  html = html.replace('>Performance Marketing<', '>Case Studies<');

  const auditFields = [
    ['name', 'Full Name'], ['email', 'Work Email'], ['phone', 'Phone Number'], ['company', 'Company Name'],
    ['systems', 'Existing URL/Systems'], ['projectType', 'Project Type'], ['budget', 'Budget Range'],
    ['businessProblem', 'Business Problem'], ['workflows', 'Required Users or Workflows'],
    ['timeline', 'Project Timeline'], ['support', 'Maintenance/Support Need']
  ];
  for (const [name, label] of auditFields) {
    const id = `audit-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    html = html.replace(new RegExp(`<label([^>]*)>${label.replace('/', '\\/')}<\\/label>\\s*<(input|select|textarea)([^>]*\\bname="${name}"[^>]*)>`, 'i'),
      (_match, labelAttrs, tag, fieldAttrs) => `<label${labelAttrs}${/\bfor=/.test(labelAttrs) ? '' : ` for="${id}"`}>${label}</label>\n<${tag}${/\bid=/.test(fieldAttrs) ? fieldAttrs : ` id="${id}"${fieldAttrs}`}>`);
  }
  html = html.replace(/<input[^>]*type="checkbox"[^>]*\/>/, '<input id="audit-consent" name="consent" required class="mt-1 rounded border-timberwolf text-azure focus:ring-azure" type="checkbox"/>');
  html = html.replace('<span class="text-xs text-marian-blue/60 leading-relaxed">I consent to JXING Tech processing my data to contact me regarding my inquiry. We value your privacy and never spam.</span>', '<label for="audit-consent" class="text-xs text-marian-blue/60 leading-relaxed">I consent to JXING Tech processing my data to contact me regarding my inquiry. We value your privacy and never spam.</label>');
  html = html.replace('Book a Technical Audit', 'Prepare Audit Request Email');
  html = html.replace(/<pre id="ai-result"(?![^>]*aria-live)/, '<pre id="ai-result" role="status" aria-live="polite" tabindex="-1"');
  html = html.replace('<span class="material-symbols-outlined text-marian-blue cursor-pointer" data-icon="language">language</span>', '<a class="md:hidden text-sm font-bold text-marian-blue" href="/services/">Services</a>');
  html = html.replace(/<button class="bg-azure text-white px-6 py-2\.5[^"]*">Get In Touch<\/button>/, '<a class="bg-azure text-white px-6 py-2.5 rounded-full font-medium transition-transform hover:shadow-lg hover:shadow-azure/20" href="/contact/#technical-audit-form">Get In Touch</a>');
  html = html.replace(/<button class="bg-azure text-white px-10 py-4([^"]*)">Start Building Now<\/button>/, '<a class="bg-azure text-white px-10 py-4$1" href="/contact/#technical-audit-form">Start Building Now</a>');
  html = html.replace(/<button class="bg-white\/10 text-white border border-white\/20 px-10 py-4([^"]*)">Explore Case Studies<\/button>/, '<a class="bg-white/10 text-white border border-white/20 px-10 py-4$1" href="/case-studies/">Explore Case Studies</a>');
  return html;
}

for (const file of htmlFiles()) {
  let html = fs.readFileSync(file, 'utf8');
  const route = routeForFile(file);
  const canonical = `https://www.jxingtech.com${route === '/' ? '' : route.replace(/\/$/, '')}`;

  const mojibake = new Map([
    ['\u00c2\u00a9', '©'], ['\u00e2\u0080\u00a2', '•'], ['\u00e2\u0080\u0094', '—'],
    ['\u00e2\u0080\u0093', '–'], ['\u00e2\u0080\u0099', '’'], ['\u00e8\u0081\u009a\u00e6\u0098\u009f', '聚星']
  ]);
  for (const [bad, good] of mojibake) html = html.replaceAll(bad, good);

  html = html.replaceAll('© 2024', '© 2026');
  html = html.replaceAll('San Francisco, CA', 'Kuala Lumpur, Malaysia');
  html = html.replaceAll('RM 688/year', 'RM 788/year');
  html = html.replaceAll('99.9% uptime guarantees', 'monitoring and support targets defined by the agreed service level');
  html = html.replaceAll('Only 2 onboarding slots left for Enterprise Managed Services this month.', 'Start with a technical audit to confirm scope, architecture, and the right delivery path.');
  html = html.replaceAll('Result: Rank #1 for target keywords', 'Outcome: consolidated authority platform and search foundation');
  html = html.replaceAll('Result: 200% faster growth, zero downtime', 'Outcome: centralized event registration and digital operations');
  html = html.replaceAll('Result: 3x monthly lead generation increase', 'Outcome: streamlined discovery and appointment journey');
  html = html.replaceAll('Result: 90% improvement in efficiency', 'Outcome: simplified client intake and digital workflows');
  html = html.replaceAll('Rank #1 for target keywords', 'Improved search foundation');
  html = html.replaceAll('200% faster growth, zero downtime', 'Centralized event operations');
  html = html.replaceAll('3x monthly lead generation increase', 'Streamlined appointment journey');
  html = html.replaceAll('90% improvement in efficiency', 'Simplified digital intake');
  html = html.replaceAll('trained on modern engineering frameworks and market data', 'configured around JXING’s published engineering capabilities');
  html = html.replaceAll('Free Tech-Stack Vulnerability Scan', 'Preliminary system and risk checklist');
  html = html.replaceAll('Infrastructure Cost Analysis', 'Infrastructure scoping questions');
  html = html.replaceAll('Automation Opportunity Report', 'Automation opportunity outline');
  html = html.replaceAll('Only 2 onboarding slots left', 'Technical audit availability');

  html = html.replace(/href="https:\/\/www\.jxingtech\.com"/g, 'href="/"');
  html = html.replace(/href="https:\/\/www\.jxingtech\.com([^"#]*)"/g, 'href="$1"');
  html = html.replace(/<a([^>]*?)href="#"([^>]*)>([\s\S]*?)<\/a>/g, (_m, before, after, label) => `<a${before}href="${linkTarget(label)}"${after}>${label}</a>`);

  if (file.endsWith(path.join('contact', 'index.html'))) html = updateContact(html);

  const canonicalTag = `<link rel="canonical" href="${canonical}">`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) html = html.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag);
  else html = html.replace(/<head>/i, `<head>\n${canonicalTag}`);

  if (!/<meta[^>]+name=["']description["']/i.test(html)) {
    const title = (html.match(/<title>([^<]+)<\/title>/i)?.[1] || 'JXING Tech').replace(/\s*[|—-]\s*JXING Tech.*$/i, '');
    const description = `Explore ${title} from JXING Tech, a Kuala Lumpur partner for custom web applications, automation, cloud operations, and search-ready digital systems.`;
    html = html.replace(/<\/title>/i, `</title><meta name="description" content="${description}">`);
  }

  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, (script) =>
    /"@type":"Organization"/i.test(script) ? '' : script
  );
  html = html.replace(/\s*<\/head>/i, `\n${organizationSchema(canonical)}\n</head>`);
  if (!html.includes('/assets/site.js')) html = html.replace(/<\/body>/i, '<script src="/assets/site.js" defer></script>\n</body>');

  fs.writeFileSync(file, html);
}

console.log(`Updated ${htmlFiles().length} HTML files.`);
