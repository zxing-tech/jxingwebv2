'use strict';

const fs = require('node:fs');
const path = require('node:path');

const pages = [
  {
    slug: 'custom-web-apps',
    title: 'Custom Web Application Development Malaysia',
    eyebrow: 'Primary Engineering Service',
    heading: 'Custom web applications built around your business workflows.',
    description: 'JXING designs and develops secure portals, dashboards, internal systems, SaaS MVPs, and integration-led web applications for Malaysian businesses.',
    intro: 'When packaged software forces your team into workarounds, a purpose-built web application can connect users, data, approvals, and reporting in one maintainable system.',
    deliverables: ['Discovery and technical audit', 'User roles, workflow and data blueprint', 'UX/UI and responsive application engineering', 'APIs and third-party integrations', 'Staging, acceptance testing and deployment', 'Maintenance and improvement roadmap'],
    useCases: ['Customer and partner portals', 'Operations and approval systems', 'Admin dashboards and reporting', 'SaaS MVPs and product platforms', 'Booking, registration and intake systems', 'Integration layers for existing business tools'],
    faqs: [
      ['What is a custom web application?', 'A browser-based system designed around your specific users, data and workflows rather than a generic template.'],
      ['How does JXING scope a web application?', 'We begin with a technical audit to map users, workflows, integrations, security needs, acceptance criteria and an MVP boundary.'],
      ['Can JXING improve an existing system?', 'Yes. The audit determines whether targeted modernization, integration or a phased rebuild is the safer path.']
    ]
  },
  {
    slug: 'cloud-operations',
    title: 'Cloud Operations and Application Maintenance Malaysia',
    eyebrow: 'Operate',
    heading: 'Keep business-critical web systems secure, observable, and maintainable.',
    description: 'JXING provides cloud operations, application maintenance, monitoring, release support, backups, and improvement planning for web platforms.',
    intro: 'A launch is the start of the operating lifecycle. JXING helps teams define responsibilities, monitoring, backups, support targets, release practices, and ongoing technical improvements.',
    deliverables: ['Application and infrastructure health review', 'Monitoring and alerting plan', 'Backup and recovery validation', 'Security and dependency maintenance', 'Managed release and staging workflow', 'Prioritized improvement backlog'],
    useCases: ['Managed web application operations', 'Legacy application stabilization', 'Cloud migration planning', 'Release and deployment support', 'Performance and availability reviews', 'Maintenance retainers with defined service targets'],
    faqs: [
      ['Does JXING own the client’s cloud account?', 'No. The client owns its cloud environment; JXING can configure and manage it under an agreed operating scope.'],
      ['Is maintenance included with every build?', 'A suitable post-launch support and maintenance plan is proposed based on the application’s risk and operating needs.'],
      ['Can JXING take over an existing application?', 'Yes, after a technical audit, access review, documentation handover, and stabilization plan.']
    ]
  },
  {
    slug: 'seo-aio-growth',
    title: 'Technical SEO, AIO and GEO Infrastructure Malaysia',
    eyebrow: 'Grow',
    heading: 'Make your web system understandable to search engines and AI answer engines.',
    description: 'JXING combines technical SEO, structured data, entity clarity, content architecture, analytics, and conversion journeys for human and AI discovery.',
    intro: 'Visibility depends on more than keywords. A clear information architecture, crawlable pages, consistent entities, structured data, evidence-led content, and measurable conversion paths help both people and machines understand what your company does.',
    deliverables: ['Technical crawl and indexation audit', 'Canonical, sitemap and robots controls', 'Organization, Service and FAQ structured data', 'Service and entity information architecture', 'AI-readable answer blocks and evidence standards', 'Analytics and search performance measurement'],
    useCases: ['Website migration SEO continuity', 'Service architecture and internal linking', 'Local and regional discoverability', 'AIO/GEO-ready knowledge content', 'Schema validation and entity cleanup', 'Conversion and search measurement'],
    faqs: [
      ['What is AIO/GEO?', 'It is the practice of making verified information clear, structured and attributable so AI-assisted search and answer systems can understand and cite it.'],
      ['Does schema guarantee rankings or AI citations?', 'No. Structured data improves machine understanding but does not guarantee rankings, summaries or citations.'],
      ['How does this relate to web development?', 'SEO/AIO requirements are built into architecture, performance, content models, routing, metadata, schema and analytics rather than added only after launch.']
    ]
  },
  {
    slug: 'strategy-audits',
    title: 'Technical Audits and Digital Systems Strategy Malaysia',
    eyebrow: 'Diagnose and Blueprint',
    heading: 'Reduce delivery risk before committing to a build.',
    description: 'JXING technical audits clarify business workflows, architecture, integrations, security, scope, delivery priorities, and post-launch ownership.',
    intro: 'A technical audit converts an idea or problem into evidence, decisions, and a phased delivery path. It is especially useful when requirements span several teams, systems, vendors, or data sources.',
    deliverables: ['Business goal and workflow mapping', 'Current-system and integration inventory', 'Risk, security and data considerations', 'Architecture options and trade-offs', 'MVP scope and acceptance criteria', 'Delivery and operating roadmap'],
    useCases: ['New web application discovery', 'Existing platform modernization', 'Vendor or architecture review', 'Automation opportunity assessment', 'Migration and integration planning', 'Fractional technical leadership support'],
    faqs: [
      ['What comes out of a technical audit?', 'A concise decision pack covering current state, target workflows, key risks, recommended architecture, MVP priorities and next actions.'],
      ['Is an audit required before development?', 'Complex or integration-heavy projects generally benefit from one; smaller, well-defined projects may use a lighter discovery process.'],
      ['Will the audit include a final fixed quote?', 'It provides the evidence needed to choose an appropriate commercial and delivery model; exact terms depend on validated scope.']
    ]
  },
  {
    slug: 'ai-workflow-automation',
    title: 'AI and Workflow Automation Development Malaysia',
    eyebrow: 'Automate',
    heading: 'Automate repetitive work without losing control of the process.',
    description: 'JXING designs workflow automation and AI-assisted systems that connect business rules, documents, approvals, communications, and existing tools.',
    intro: 'Useful automation begins with a stable workflow, clear decision boundaries, secure data handling, and human review where it matters. JXING maps the process before selecting tools or introducing an AI component.',
    deliverables: ['Workflow and exception mapping', 'Data, access and privacy review', 'Automation architecture and integration plan', 'Controlled pilot with human checkpoints', 'Audit logs, monitoring and failure handling', 'Handover and improvement roadmap'],
    useCases: ['Document intake and classification', 'Lead routing and follow-up workflows', 'Customer service assistance', 'Back-office approvals and notifications', 'CRM, accounting and workspace integrations', 'Internal knowledge and retrieval systems'],
    faqs: [
      ['Does every automation need AI?', 'No. Deterministic rules and integrations are often safer and more reliable; AI is used only where it adds measurable value.'],
      ['How does JXING reduce AI risk?', 'We define allowed data, decision boundaries, human approvals, logging, fallback behavior, and acceptance tests before production use.'],
      ['Can automation connect existing tools?', 'Yes, where supported APIs and permissions are available. Integration feasibility is confirmed during the technical audit.']
    ]
  }
];

function escapeJson(value) { return JSON.stringify(value).replace(/</g, '\\u003c'); }

function render(page) {
  const canonical = `https://www.jxingtech.com/services/${page.slug}`;
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: page.title.replace(' Malaysia', ''), description: page.description, provider: { '@type': 'Organization', name: 'JXING Tech', url: 'https://www.jxingtech.com' }, areaServed: { '@type': 'Country', name: 'Malaysia' }, url: canonical };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${page.title} | JXING Tech</title><meta name="description" content="${page.description}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${page.title} | JXING Tech"><meta property="og:description" content="${page.description}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{ghost:'#F0F3F9',oxford:'#0A1640',marian:'#003F88',azure:'#007DEB',robin:'#59C3C3',xanthous:'#F99C00'},fontFamily:{sans:['Inter','sans-serif']}}}}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"><script type="application/ld+json">${escapeJson(serviceSchema)}</script><script type="application/ld+json">${escapeJson(faqSchema)}</script><script type="application/ld+json">${escapeJson({ '@context':'https://schema.org','@type':'Organization',name:'JXING Tech',url:'https://www.jxingtech.com',email:'hello@jxingtech.com',telephone:'+60 10-288 2827',address:{'@type':'PostalAddress',addressRegion:'Kuala Lumpur',addressCountry:'MY'} })}</script></head><body class="bg-ghost text-oxford font-sans"><header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200"><nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"><a href="/" class="text-2xl font-extrabold tracking-tight">JXING<span class="text-azure">.</span></a><div class="hidden md:flex gap-8 text-sm font-semibold"><a href="/services/">Services</a><a href="/case-studies/">Case Studies</a><a href="/pricing/">Pricing</a><a href="/company/">Company</a></div><a href="/contact/#technical-audit-form" class="bg-azure text-white px-5 py-2.5 rounded-xl font-bold text-sm">Start Technical Audit</a></nav></header><main><section class="bg-oxford text-white"><div class="max-w-7xl mx-auto px-6 py-24 md:py-32"><p class="text-azure font-bold uppercase tracking-[.25em] text-xs mb-6">${page.eyebrow}</p><h1 class="text-4xl md:text-6xl font-extrabold max-w-5xl leading-tight">${page.heading}</h1><p class="mt-8 text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed">${page.description}</p><div class="mt-10 flex flex-wrap gap-4"><a href="/contact/#technical-audit-form" class="bg-azure text-white px-7 py-4 rounded-xl font-bold">Discuss Your Project</a><a href="/contact/#ai-architect-form" class="border border-white/25 px-7 py-4 rounded-xl font-bold">Ask the AI Digital Architect</a></div></div></section><section class="max-w-7xl mx-auto px-6 py-20"><div class="grid lg:grid-cols-3 gap-12"><div class="lg:col-span-2"><h2 class="text-3xl font-extrabold mb-6">What this service solves</h2><p class="text-lg text-oxford/70 leading-relaxed">${page.intro}</p></div><aside class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"><p class="font-bold text-marian mb-3">Engineering lifecycle</p><p class="text-sm leading-7 text-oxford/65">Diagnose → Blueprint → Build → Automate → Grow → Operate</p></aside></div></section><section class="bg-white py-20"><div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16"><div><h2 class="text-3xl font-extrabold mb-8">Typical deliverables</h2><ul class="space-y-4">${page.deliverables.map((x) => `<li class="flex gap-3"><span class="text-azure font-bold">✓</span><span>${x}</span></li>`).join('')}</ul></div><div><h2 class="text-3xl font-extrabold mb-8">Common use cases</h2><ul class="space-y-4">${page.useCases.map((x) => `<li class="flex gap-3"><span class="text-robin font-bold">→</span><span>${x}</span></li>`).join('')}</ul></div></div></section><section class="max-w-5xl mx-auto px-6 py-20"><h2 class="text-3xl font-extrabold text-center mb-12">Frequently asked questions</h2><div class="space-y-5">${page.faqs.map(([q,a]) => `<details class="bg-white rounded-2xl p-6 border border-slate-200"><summary class="font-bold cursor-pointer">${q}</summary><p class="mt-4 text-oxford/70 leading-relaxed">${a}</p></details>`).join('')}</div></section><section class="bg-marian text-white"><div class="max-w-5xl mx-auto px-6 py-20 text-center"><h2 class="text-3xl md:text-5xl font-extrabold">Start with evidence, then build the right system.</h2><p class="mt-6 text-white/70">Share the business problem, current systems, users, and desired outcome. JXING will help map the appropriate next step.</p><a href="/contact/#technical-audit-form" class="inline-block mt-8 bg-azure px-8 py-4 rounded-xl font-bold">Start Technical Audit</a></div></section></main><footer class="bg-oxford text-white"><div class="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-6 justify-between"><div><p class="font-bold text-xl">JXING Tech</p><p class="text-white/55 text-sm mt-2">Custom web applications and full-stack digital systems.</p></div><div class="text-sm text-white/60"><a href="mailto:hello@jxingtech.com">hello@jxingtech.com</a><p>Kuala Lumpur, Malaysia</p></div><p class="text-sm text-white/40">© 2026 JXING Tech</p></div></footer><script src="/assets/site.js" defer></script></body></html>`;
}

for (const page of pages) {
  const dir = path.join(__dirname, '..', 'services', page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(page));
}
console.log(`Generated ${pages.length} service pages.`);
