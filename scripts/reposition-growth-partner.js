'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

function replace(html, from, to) {
  if (html.includes(to)) return html;
  if (!html.includes(from)) throw new Error(`Missing expected content: ${from.slice(0, 90)}`);
  return html.replace(from, to);
}

function replaceBetween(html, start, end, content) {
  const first = html.indexOf(start);
  const last = html.indexOf(end, first + start.length);
  const replacementMarker = content.match(/<!--[^>]+-->/)?.[0];
  if (first === -1 && replacementMarker && html.includes(replacementMarker)) return html;
  if (first === -1 || last === -1) throw new Error(`Missing section markers: ${start} / ${end}`);
  return `${html.slice(0, first)}${content}\n${html.slice(last)}`;
}

function updateHomepage(html, isCompany = false) {
  if (isCompany && html.includes('<!-- Company Positioning -->')) {
    html = html.replace('<button class="cta-expand group relative flex items-center gap-2 bg-oxford dark:bg-white text-white dark:text-oxford px-6 py-2.5 rounded-full font-semibold text-sm">\n<span class="z-10 group-hover:text-white transition-colors">Get In Touch</span>\n<div class="icon-box absolute right-1 w-8 h-8 rounded-full flex items-center justify-center">\n<span class="material-symbols-outlined text-white text-sm">arrow_forward</span>\n</div>\n</button>', '<a class="cta-expand group relative flex items-center gap-2 bg-oxford dark:bg-white text-white dark:text-oxford px-6 py-2.5 rounded-full font-semibold text-sm" href="/contact/#technical-audit-form">\n<span class="z-10 group-hover:text-white transition-colors">Get In Touch</span>\n<div class="icon-box absolute right-1 w-8 h-8 rounded-full flex items-center justify-center">\n<span class="material-symbols-outlined text-white text-sm">arrow_forward</span>\n</div>\n</a>');
    if (!html.includes('href="/services/performance-marketing/">Performance Marketing</a></li>')) {
      html = html.replace('<li><a class="hover:text-primary" href="/services/ai-workflow-automation/">AI &amp; Predictive Analytics</a></li>', '<li><a class="hover:text-primary" href="/services/ai-workflow-automation/">AI &amp; Predictive Analytics</a></li>\n<li><a class="hover:text-primary" href="/services/performance-marketing/">Performance Marketing</a></li>');
    }
    return html;
  }
  if (!isCompany) {
    html = html.replace(/<title>[^<]+<\/title><meta name="description" content="[^"]*">/, '<title>JXING Tech | Full-Stack Growth Partner</title><meta name="description" content="JXING Tech is an engineering-led full-stack growth partner in Kuala Lumpur. We build custom web applications and commerce platforms, then grow them with AI, predictive analytics, performance marketing and organic search.">');
  } else {
    html = html.replace(/<title>[^<]+<\/title><meta name="description" content="[^"]*">/, '<title>About JXING Tech | Engineering-Led Full-Stack Growth Partner</title><meta name="description" content="JXING Tech combines full-stack web development, AI and predictive analytics, performance marketing, organic growth and managed operations under one engineering-led partnership.">');
  }

  html = replace(html,
`<a class="text-primary font-semibold" href="/company/">Company</a>
<a class="hover:text-primary transition-colors" href="/services/">Services</a>
<a class="hover:text-primary transition-colors" href="/contact/">Pillars</a>
<a class="hover:text-primary transition-colors" href="/pricing/">Pricing</a>
<a class="hover:text-primary transition-colors" href="/case-studies/">Case Studies</a>
<a class="hover:text-primary transition-colors" href="/news/">Resources</a>
<a class="hover:text-primary transition-colors" href="/contact/">Tech Stack</a>`,
`<a class="hover:text-primary transition-colors" href="/services/custom-web-apps/">Web Development</a>
<a class="hover:text-primary transition-colors" href="/services/ai-workflow-automation/">AI &amp; Analytics</a>
<a class="hover:text-primary transition-colors" href="/services/#growth-capabilities">Growth Services</a>
<a class="hover:text-primary transition-colors" href="/pricing/">Pricing</a>
<a class="hover:text-primary transition-colors" href="/case-studies/">Case Studies</a>
<a class="hover:text-primary transition-colors" href="/company/">Company</a>`);

  html = replace(html, 'Outpace Your Competition. Built for Digital Dominance', 'Engineering-led growth, from product build to market performance');
  html = replace(html, 'Custom Web Applications &amp; Digital Systems Built to <span class="text-primary italic">Scale</span>', 'Your Full-Stack Growth Partner for <span class="text-primary">Web, AI &amp; Measurable Growth</span>');
  html = replace(html, 'JXING Tech designs, builds, automates, and operates web-based platforms for businesses that need reliable software, workflows, and growth infrastructure — not just a website.', 'We lead with Full-Stack Web Development — custom applications, platforms, websites and commerce — then strengthen the system with AI, predictive analytics, Performance Marketing and Organic Growth.');
  html = replace(html,
`<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">Custom Web Applications</span>
<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">E-Commerce Systems</span>
<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">AI Workflow Automation</span>
<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">Cloud Operations</span>
<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">SEO / AIO / GEO Growth</span>`,
`<span class="px-5 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm font-semibold">Full-Stack Web Development</span>
<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">AI &amp; Predictive Analytics</span>
<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">Performance Marketing</span>
<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">Organic Growth</span>
<span class="px-5 py-2 rounded-full border border-timberwolf dark:border-slate-700 text-sm font-medium">Cloud &amp; Lifecycle Support</span>`);
  html = replace(html,
`<button class="cta-expand group relative flex items-center justify-between gap-8 bg-marian text-white pl-8 pr-1 py-4 rounded-full font-bold text-lg min-w-[240px] shadow-xl shadow-marian/20">
<span class="z-10">Start Technical Audit</span>
<div class="icon-box w-12 h-12 rounded-full flex items-center justify-center bg-primary">
<span class="material-symbols-outlined text-white">bolt</span>
</div>
</button>
<button class="px-8 py-4 rounded-full border border-oxford/20 dark:border-white/20 font-bold hover:bg-oxford/5 dark:hover:bg-white/5 transition-all text-lg">
                Explore Capabilities
            </button>`,
`<a class="cta-expand group relative flex items-center justify-between gap-8 bg-marian text-white pl-8 pr-1 py-4 rounded-full font-bold text-lg min-w-[240px] shadow-xl shadow-marian/20" href="/contact/#technical-audit-form">
<span class="z-10">Plan Your Web Solution</span>
<div class="icon-box w-12 h-12 rounded-full flex items-center justify-center bg-primary">
<span class="material-symbols-outlined text-white">bolt</span>
</div>
</a>
<a class="px-8 py-4 rounded-full border border-oxford/20 dark:border-white/20 font-bold hover:bg-oxford/5 dark:hover:bg-white/5 transition-all text-lg" href="/services/">Explore Services</a>`);
  html = replace(html, 'System Architect</p>', 'AI + Predictive Analytics</p>');
  html = replace(html, 'Infrastructure check complete. Database latency optimized. System ready for peak traffic...', 'Connect product, customer and campaign data to surface forecasts, lead-quality signals and next-best actions.');
  html = html.replace(/<img alt="JXING Strategic Tech Dashboard"([^>]+)src="[^"]+"\/>/, '<img alt="Diagram of JXING’s connected web platform, analytics, AI, performance marketing, organic growth and cloud operations"$1src="/assets/full-stack-growth-system.svg"/>');

  html = replaceBetween(html, '<!-- Partners Carousel -->', '<!-- Service Continuity (The Lifecycle) -->', `<!-- Integrated Partnership -->
<section class="py-16 bg-white dark:bg-oxford/30 border-y border-timberwolf/20 dark:border-white/5">
<div class="max-w-7xl mx-auto px-6">
<div class="text-center mb-10"><div class="text-primary font-bold text-xs uppercase tracking-[0.25em] mb-3">One connected partner</div><h2 class="text-3xl font-bold">Build the product. Read the data. Grow demand.</h2></div>
<div class="grid md:grid-cols-3 gap-6">
<div class="p-7 rounded-2xl bg-ghost dark:bg-white/5"><span class="material-symbols-outlined text-primary mb-4">code</span><h3 class="font-bold text-lg mb-2">Build</h3><p class="text-sm text-oxford/60 dark:text-ghost/60">Full-stack web applications, websites, commerce platforms, portals and integration-ready data foundations.</p></div>
<div class="p-7 rounded-2xl bg-ghost dark:bg-white/5"><span class="material-symbols-outlined text-robin mb-4">insights</span><h3 class="font-bold text-lg mb-2">Intelligence</h3><p class="text-sm text-oxford/60 dark:text-ghost/60">Product analytics, predictive models and AI-assisted workflows that turn governed data into decisions.</p></div>
<div class="p-7 rounded-2xl bg-ghost dark:bg-white/5"><span class="material-symbols-outlined text-xanthous mb-4">trending_up</span><h3 class="font-bold text-lg mb-2">Grow</h3><p class="text-sm text-oxford/60 dark:text-ghost/60">Performance Marketing, Organic Growth, SEO/AIO/GEO and conversion experiments connected to measurable outcomes.</p></div>
</div>
</div>
</section>`);

  html = replace(html, 'System Lifecycle', 'Product-to-Growth Lifecycle');
  html = replace(html, 'Our Engineering Methodology', 'One lifecycle from first blueprint to continuous growth');
  html = replace(html, 'Custom Web Application &amp; Digital Systems Partner', 'Engineering-Led Full-Stack Growth Partner');
  html = replace(html, 'High-performance engineering for the modern enterprise.', 'Web development is the foundation. Growth is designed in.');
  html = replace(html, 'We provide a unified layer of software, automation, and infrastructure to eliminate friction and maximize growth.', 'JXING brings product engineering, intelligence, acquisition and organic visibility into one accountable operating model.');

  const cardCopy = [
    ['1. Custom Web App Development', '1. Full-Stack Web Development'],
    ['Building complex SaaS platforms, portals, and internal tools with modern stacks like Next.js, Node, and Python.', 'Custom web applications, portals, dashboards, SaaS products and internal systems engineered around real users and workflows.'],
    ['Enterprise Apps', 'Custom Applications'], ['SaaS Architecture', 'Platforms &amp; Portals'],
    ['2. Website &amp; E-Commerce Systems', '2. Web, Commerce &amp; Conversion Systems'],
    ['Scalable e-commerce engines and conversion-optimized web systems that handle heavy transactional volume.', 'Corporate websites, landing experiences and commerce systems built with content control, analytics and conversion journeys from day one.'],
    ['Headless Commerce', 'Web &amp; Commerce'], ['Conversion Focus', 'Conversion Analytics'],
    ['3. AI &amp; Workflow Automation', '3. AI &amp; Predictive Analytics'],
    ['Deploying custom AI agents and autonomous LLM workflows that integrate deeply with your existing business logic.', 'AI-assisted workflows and predictive analytics for demand signals, lead quality, customer behaviour and operational decisions — with validation and human review.'],
    ['Agentic AI', 'Predictive Models'], ['Process Automation', 'Decision Support'],
    ['4. Cloud Ops &amp; Maintenance', '4. Performance Marketing'],
    ['Fully managed hosting, security monitoring, and monitoring and support targets defined by the agreed service level for your critical digital infrastructure.', 'Paid search, paid social, audience strategy, landing-page experiments and attribution connected to the web systems we build.'],
    ['Managed Cloud', 'Paid Acquisition'], ['Security Ops', 'Measurement &amp; Testing'],
    ['5. SEO, AIO/GEO &amp; Growth Infra', '5. Organic Growth &amp; AIO/GEO'],
    ['Building technical foundations for search visibility, AI-Overviews (AIO), and Generative Engine Optimization (GEO).', 'Technical SEO, content architecture, entity clarity and answer-engine visibility that compound discoverability over time.'],
    ['Entity SEO', 'Organic Search'], ['Search Intent', 'Content &amp; AIO/GEO'],
    ['6. Technical Audits &amp; Strategy', '6. Cloud Operations &amp; Lifecycle Support'],
    ['Fractional CTO services and deep-dive technical audits to identify security leaks and performance bottlenecks.', 'Technical audits, managed cloud operations, monitoring, maintenance and improvement planning across the system lifecycle.'],
    ['Fractional CTO', 'Technical Audits'], ['System Audit', 'Cloud &amp; Maintenance']
  ];
  for (const [from, to] of cardCopy) html = replace(html, from, to);

  html = replaceBetween(html, '<!-- Supporting Growth Services (Secondary Marketing) -->', '<!-- Strategic Pillars -->', `<!-- Integrated Growth Model -->
<div class="mt-20 p-10 rounded-3xl border border-primary/20 bg-primary/5 scroll-reveal" id="growth-capabilities">
<div class="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center"><div><div class="text-primary font-bold text-xs uppercase tracking-widest mb-3">Integrated growth model</div><h3 class="text-2xl font-bold mb-4">Marketing is connected to the product, not bolted on afterward.</h3><p class="text-sm text-oxford/65 dark:text-ghost/65 leading-relaxed">Performance Marketing and Organic Growth use the same analytics, conversion events and customer journeys designed into the web platform. That creates a clearer feedback loop between what we build, what users do and where growth investment should go next.</p></div><div class="grid grid-cols-2 gap-4"><div class="bg-white/70 dark:bg-white/5 rounded-2xl p-5"><div class="font-bold mb-1">Performance</div><div class="text-xs text-oxford/55 dark:text-ghost/55">Paid acquisition, attribution and experiments</div></div><div class="bg-white/70 dark:bg-white/5 rounded-2xl p-5"><div class="font-bold mb-1">Organic</div><div class="text-xs text-oxford/55 dark:text-ghost/55">SEO, AIO/GEO, content and authority</div></div></div></div>
</div>
</section>`);

  html = replace(html, 'The Five Pillars of <span class="text-primary">JXING Tech</span>', 'The Five Strengths Behind the <span class="text-primary">Partnership</span>');
  html = replace(html, 'Our methodology for transforming business requirements into market-dominating digital systems.', 'A connected team across product engineering, data, intelligence, acquisition and long-term operations.');
  html = replace(html, 'Architecture &amp; Launch Strategy', 'Architecture, UX &amp; Measurement');
  html = replace(html, 'We design systems with the end in mind. Every project begins with an architectural blueprint aligned with your business roadmap.', 'We align user journeys, technical architecture, data capture and success measures before build decisions are locked in.');
  html = replace(html, 'Full-Stack Application Engineering', 'Full-Stack Web Engineering');
  html = replace(html, 'Battle-tested code that prioritizes speed, security, and the flexibility to pivot as your business evolves.', 'Custom applications and web platforms designed for maintainability, security, integration and future product growth.');
  html = replace(html, 'Enterprise AI &amp; Agentic Automation', 'AI &amp; Predictive Intelligence');
  html = replace(html, 'Deploying custom LLMs and autonomous agents that learn your business logic to replace human-intensive friction with efficiency.', 'AI-assisted automation and predictive models built around defined data, decision boundaries, monitoring and human accountability.');
  html = replace(html, 'SEO/AIO Growth Infrastructure', 'Performance &amp; Organic Growth');
  html = replace(html, 'Bridging the gap between engineering and visibility. We build the growth engines that funnel high-intent users into your systems.', 'Paid acquisition, conversion experiments, technical SEO and AIO/GEO work together against shared analytics and business outcomes.');
  html = replace(html,
`<div class="flex gap-4">
<div class="text-center">
<div class="text-2xl font-bold text-primary">#1</div>
<div class="text-[10px] uppercase text-ghost/40">Rank Goal</div>
</div>
<div class="text-center">
<div class="text-2xl font-bold text-primary">99%</div>
<div class="text-[10px] uppercase text-ghost/40">Search Coverage</div>
</div>
</div>`,
`<div class="flex flex-wrap gap-2"><span class="px-3 py-1 rounded-full bg-white/10 text-[10px] uppercase">Paid acquisition</span><span class="px-3 py-1 rounded-full bg-white/10 text-[10px] uppercase">SEO / AIO / GEO</span></div>`);
  html = replace(html, 'Cloud Operations &amp; Maintenance', 'Cloud Operations &amp; Lifecycle Support');
  html = replace(html, 'Proactive monitoring and constant optimization. Your system grows with you, managed by experts who built it.', 'Managed releases, monitoring, maintenance and improvement planning keep the product dependable as usage and growth requirements evolve.');

  html = replace(html, 'Consult with our AI System Architect.', 'AI and predictive analytics built into the growth system.');
  html = replace(html, 'Describe your technical requirements, and our AI model (configured around JXING’s published engineering capabilities) will draft a preliminary technology roadmap and system architecture for you instantly.', 'We connect governed operational, product and campaign data to AI-assisted workflows and predictive models. Use cases can include demand forecasting, lead prioritisation, churn signals and next-best actions — always subject to data quality, validation and human review.');
  html = replace(html, 'Preliminary system and risk checklist', 'Data readiness and use-case assessment');
  html = replace(html, 'Infrastructure scoping questions', 'Predictive analytics opportunity map');
  html = replace(html, 'Automation opportunity outline', 'Human review, monitoring and fallback design');
  html = html.replaceAll('<button class="px-4 py-2 border border-primary/30 rounded-full text-xs hover:bg-primary hover:text-white transition-all">Build Custom SaaS</button>', '<a class="px-4 py-2 border border-primary/30 rounded-full text-xs hover:bg-primary hover:text-white transition-all" href="/contact/#ai-architect-form">Build Custom SaaS</a>');
  html = html.replaceAll('<button class="px-4 py-2 border border-primary/30 rounded-full text-xs hover:bg-primary hover:text-white transition-all">Automate Ops</button>', '<a class="px-4 py-2 border border-primary/30 rounded-full text-xs hover:bg-primary hover:text-white transition-all" href="/contact/#ai-architect-form">Automate Operations</a>');
  html = html.replaceAll('<button class="px-4 py-2 border border-primary/30 rounded-full text-xs hover:bg-primary hover:text-white transition-all">Migrate to Cloud</button>', '<a class="px-4 py-2 border border-primary/30 rounded-full text-xs hover:bg-primary hover:text-white transition-all" href="/contact/#ai-architect-form">Add Predictive Analytics</a>');
  html = html.replace(/<div class="relative">\s*<input[^>]+placeholder="Describe your project goal\.\.\."[^>]*\/>\s*<button[^>]*>[\s\S]*?<\/button>\s*<\/div>/, '<a class="w-full px-6 py-4 rounded-2xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2" href="/contact/#ai-architect-form">Open AI Digital Architect <span class="material-symbols-outlined text-sm">arrow_forward</span></a>');

  html = replaceBetween(html, '<!-- Resources -->', '<!-- Final CTA -->', `<!-- Capability Paths -->
<section class="py-24 max-w-7xl mx-auto px-6">
<div class="text-center mb-16 scroll-reveal"><h2 class="text-3xl md:text-5xl font-bold mb-6 text-oxford dark:text-white">Choose the capability closest to your next growth constraint.</h2><p class="text-oxford/50 dark:text-ghost/50 max-w-2xl mx-auto">Start with the web system, the intelligence layer or the growth channel. JXING connects the rest when the evidence supports it.</p></div>
<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
<a href="/services/custom-web-apps/" class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-timberwolf/30 dark:border-white/5 hover:border-primary transition-colors"><div class="text-xs font-bold text-primary mb-4">BUILD</div><h3 class="text-lg font-bold mb-3">Custom Web Platforms</h3><p class="text-xs text-oxford/60 dark:text-ghost/60">Portals, dashboards, SaaS, websites and commerce systems.</p></a>
<a href="/services/ai-workflow-automation/" class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-timberwolf/30 dark:border-white/5 hover:border-primary transition-colors"><div class="text-xs font-bold text-robin mb-4">INTELLIGENCE</div><h3 class="text-lg font-bold mb-3">AI &amp; Predictive Systems</h3><p class="text-xs text-oxford/60 dark:text-ghost/60">Automation, forecasts, decision support and governed data workflows.</p></a>
<a href="/services/performance-marketing/" class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-timberwolf/30 dark:border-white/5 hover:border-primary transition-colors"><div class="text-xs font-bold text-xanthous mb-4">ACQUIRE</div><h3 class="text-lg font-bold mb-3">Performance Marketing</h3><p class="text-xs text-oxford/60 dark:text-ghost/60">Paid media, landing experiments, attribution and optimisation.</p></a>
<a href="/services/seo-aio-growth/" class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-timberwolf/30 dark:border-white/5 hover:border-primary transition-colors"><div class="text-xs font-bold text-primary mb-4">COMPOUND</div><h3 class="text-lg font-bold mb-3">Organic Growth</h3><p class="text-xs text-oxford/60 dark:text-ghost/60">SEO, content architecture, authority and AIO/GEO visibility.</p></a>
</div>
</section>`);

  html = html.replace('Don\'t just keep up. Own the future of your market.', 'Build the system your next stage of growth needs.');
  html = html.replace('JXING Tech (Lucky Star) is a custom web application and digital systems partner focused on engineering outstanding prosperity.', 'JXING Tech is an engineering-led Full-Stack Growth Partner, with web development as the foundation and AI, analytics, paid acquisition and organic visibility as connected growth capabilities.');
  html = html.replace('<button class="cta-expand group relative flex items-center justify-between gap-12 bg-white text-oxford pl-8 pr-1 py-4 rounded-full font-bold text-lg min-w-[280px]">', '<a class="cta-expand group relative flex items-center justify-between gap-12 bg-white text-oxford pl-8 pr-1 py-4 rounded-full font-bold text-lg min-w-[280px]" href="/contact/#technical-audit-form">');
  html = html.replace('</div>\n</button>\n<button class="px-8 py-4 rounded-full border border-white/20 font-bold hover:bg-white/10 transition-all">View All Capabilities</button>', '</div>\n</a>\n<a class="px-8 py-4 rounded-full border border-white/20 font-bold hover:bg-white/10 transition-all" href="/services/">View All Capabilities</a>');
  html = html.replace('<li><a class="hover:text-primary" href="/services/">Web App Development</a></li>', '<li><a class="hover:text-primary" href="/services/custom-web-apps/">Web App Development</a></li>');
  if (!html.includes('href="/services/performance-marketing/">Performance Marketing</a></li>')) {
    html = html.replace('<li><a class="hover:text-primary" href="/services/ai-workflow-automation/">AI &amp; Predictive Analytics</a></li>', '<li><a class="hover:text-primary" href="/services/ai-workflow-automation/">AI &amp; Predictive Analytics</a></li>\n<li><a class="hover:text-primary" href="/services/performance-marketing/">Performance Marketing</a></li>');
  }
  html = html.replace('<li><a class="hover:text-primary" href="/services/">Cloud Operations</a></li>', '<li><a class="hover:text-primary" href="/services/cloud-operations/">Cloud Operations</a></li>');
  html = html.replace('<li><a class="hover:text-primary" href="/services/">SEO/AIO Infrastructure</a></li>', '<li><a class="hover:text-primary" href="/services/seo-aio-growth/">Organic Growth &amp; SEO/AIO</a></li>');
  if (isCompany) {
    html = replaceBetween(html, '<!-- Hero Section -->', '<!-- Footer -->', `<!-- Company Positioning -->
<main>
<section class="relative pt-44 pb-24 overflow-hidden"><div class="absolute inset-0 -z-10"><div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"></div></div><div class="max-w-6xl mx-auto px-6 text-center"><div class="inline-flex px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-8">About JXING Tech</div><h1 class="text-4xl md:text-6xl font-bold leading-tight mb-8">Engineering the web systems behind <span class="text-primary">measurable growth.</span></h1><p class="text-lg md:text-xl text-oxford/65 dark:text-ghost/65 max-w-3xl mx-auto mb-10">JXING is an engineering-led Full-Stack Growth Partner. We build the web product first, connect reliable data and intelligence, then support acquisition, organic visibility and long-term operations.</p><div class="flex flex-wrap justify-center gap-3"><span class="px-5 py-2 rounded-full border border-primary/30 bg-primary/5 font-semibold text-sm">Web Development First</span><span class="px-5 py-2 rounded-full border border-timberwolf text-sm">AI &amp; Predictive Analytics</span><span class="px-5 py-2 rounded-full border border-timberwolf text-sm">Integrated Growth</span></div></div></section>
<section class="py-20 bg-white dark:bg-oxford/30"><div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14"><div><div class="text-primary text-xs font-bold uppercase tracking-widest mb-4">What full-stack growth means</div><h2 class="text-3xl md:text-5xl font-bold mb-6">One partner across product, intelligence and market growth.</h2><p class="text-oxford/60 dark:text-ghost/60 leading-relaxed">Full-stack growth is not a list of disconnected services. The web platform, customer journey, analytics, AI use cases, paid acquisition and organic visibility are planned as one system with shared measures and an accountable improvement backlog.</p></div><div class="grid gap-5"><div class="bg-ghost dark:bg-white/5 rounded-2xl p-6"><h3 class="font-bold text-lg mb-2">1. Product</h3><p class="text-sm text-oxford/60 dark:text-ghost/60">Custom web applications, websites, commerce systems, portals and integrations.</p></div><div class="bg-ghost dark:bg-white/5 rounded-2xl p-6"><h3 class="font-bold text-lg mb-2">2. Intelligence</h3><p class="text-sm text-oxford/60 dark:text-ghost/60">Product analytics, governed AI workflows and predictive decision support.</p></div><div class="bg-ghost dark:bg-white/5 rounded-2xl p-6"><h3 class="font-bold text-lg mb-2">3. Growth</h3><p class="text-sm text-oxford/60 dark:text-ghost/60">Performance Marketing, Organic Growth, SEO/AIO/GEO and conversion experiments.</p></div></div></div></section>
<section class="py-24 max-w-7xl mx-auto px-6"><div class="grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center"><div><div class="text-primary text-xs font-bold uppercase tracking-widest mb-4">Primary discipline</div><h2 class="text-3xl md:text-5xl font-bold mb-6">Full-Stack Web Development is the service spine.</h2><p class="text-oxford/60 dark:text-ghost/60 leading-relaxed mb-8">JXING designs and develops browser-based systems around real users, workflows, data and integrations. Growth capabilities connect to what we build; they do not replace the engineering foundation.</p><a class="inline-flex bg-primary text-white px-7 py-3 rounded-xl font-bold" href="/services/custom-web-apps/">Explore Web Development</a></div><div class="grid grid-cols-2 gap-4"><div class="glass rounded-2xl p-6"><b>Custom Apps</b><p class="text-xs mt-2 text-oxford/55 dark:text-ghost/55">Portals, dashboards and internal systems</p></div><div class="glass rounded-2xl p-6"><b>Web Platforms</b><p class="text-xs mt-2 text-oxford/55 dark:text-ghost/55">Corporate, content and customer experiences</p></div><div class="glass rounded-2xl p-6"><b>Commerce</b><p class="text-xs mt-2 text-oxford/55 dark:text-ghost/55">Transactions, catalogues and conversion journeys</p></div><div class="glass rounded-2xl p-6"><b>Integrations</b><p class="text-xs mt-2 text-oxford/55 dark:text-ghost/55">APIs, workflows and governed data movement</p></div></div></div></section>
<section class="py-24 bg-oxford text-white"><div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14"><div><div class="text-robin text-xs font-bold uppercase tracking-widest mb-4">Position of strength</div><h2 class="text-3xl md:text-5xl font-bold mb-6">AI and predictive analytics with operational context.</h2><p class="text-white/60 leading-relaxed">We focus on decisions that can be defined and evaluated: demand forecasts, lead quality, churn signals, anomalies, document workflows and next-best actions. Every use case depends on data readiness, validation, monitoring and human accountability.</p></div><div class="space-y-4"><div class="border border-white/10 rounded-2xl p-6"><h3 class="font-bold mb-2">Data before models</h3><p class="text-sm text-white/55">Confirm history, quality, access and the decision being improved.</p></div><div class="border border-white/10 rounded-2xl p-6"><h3 class="font-bold mb-2">Evidence before scale</h3><p class="text-sm text-white/55">Pilot against evaluation criteria and compare with a practical baseline.</p></div><div class="border border-white/10 rounded-2xl p-6"><h3 class="font-bold mb-2">Human accountability</h3><p class="text-sm text-white/55">Define review, override, logging and fallback paths before production use.</p></div></div></div></section>
<section class="py-24 max-w-7xl mx-auto px-6"><div class="text-center max-w-3xl mx-auto mb-14"><div class="text-primary text-xs font-bold uppercase tracking-widest mb-4">Connected growth</div><h2 class="text-3xl md:text-5xl font-bold mb-6">Performance and organic growth share one measurement loop.</h2><p class="text-oxford/60 dark:text-ghost/60">Paid acquisition, landing-page experiments, technical SEO, content architecture and AIO/GEO visibility connect to product analytics and agreed business outcomes.</p></div><div class="grid md:grid-cols-3 gap-6"><a class="glass rounded-2xl p-7" href="/services/performance-marketing/"><h3 class="font-bold text-lg mb-2">Performance Marketing</h3><p class="text-sm text-oxford/55 dark:text-ghost/55">Paid search, paid social, attribution and conversion experiments.</p></a><a class="glass rounded-2xl p-7" href="/services/seo-aio-growth/"><h3 class="font-bold text-lg mb-2">Organic Growth</h3><p class="text-sm text-oxford/55 dark:text-ghost/55">SEO, content, authority and AI-answer visibility.</p></a><a class="glass rounded-2xl p-7" href="/services/cloud-operations/"><h3 class="font-bold text-lg mb-2">Lifecycle Operations</h3><p class="text-sm text-oxford/55 dark:text-ghost/55">Monitoring, maintenance, releases and improvement planning.</p></a></div></section>
<section class="py-24 bg-marian text-white"><div class="max-w-5xl mx-auto px-6 text-center"><h2 class="text-4xl md:text-6xl font-bold mb-8">Start with the system your business needs next.</h2><p class="text-white/65 max-w-2xl mx-auto mb-10">A technical audit maps the users, workflows, data, growth constraints and operating responsibilities before delivery begins.</p><div class="flex flex-wrap justify-center gap-4"><a class="bg-white text-oxford px-8 py-4 rounded-full font-bold" href="/contact/#technical-audit-form">Start Technical Audit</a><a class="border border-white/25 px-8 py-4 rounded-full font-bold" href="/services/">Explore Services</a></div></div></section>
</main>`);
  }
  return html;
}

function updateServices(html) {
  html = html.replace(/<title>[^<]+<\/title>/, '<title>Full-Stack Web Development, AI &amp; Growth Services | JXING Tech</title>');
  html = html.replace(/<meta content="[^"]*" name="description"\/>/, '<meta content="JXING combines full-stack web development, AI and predictive analytics, performance marketing, organic growth and managed operations under one engineering-led partnership." name="description"/>');
  html = html.replace('<link href="/services" rel="canonical"/>\n', '');
  html = html.replace(`<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/company/">Company</a>
<a class="text-azure font-semibold border-b-2 border-azure pb-1 font-body text-sm" href="/services/">Services</a>
<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/contact/">Pillars</a>
<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/pricing/">Pricing</a>
<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/case-studies/">Case Studies</a>
<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/news/">Resources</a>`, `<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/services/custom-web-apps/">Web Development</a>
<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/services/ai-workflow-automation/">AI &amp; Analytics</a>
<a class="text-azure font-semibold border-b-2 border-azure pb-1 font-body text-sm" href="#growth-capabilities">Growth Services</a>
<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/pricing/">Pricing</a>
<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/case-studies/">Case Studies</a>
<a class="text-marian-blue hover:text-azure transition-colors font-body text-sm font-medium" href="/company/">Company</a>`);
  html = replace(html, '<button class="bg-azure text-white px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-80 transition-all duration-300 active:scale-95">\n                Get In Touch\n            </button>', '<a class="bg-azure text-white px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-80 transition-all duration-300" href="/contact/#technical-audit-form">Get In Touch</a>');
  html = replace(html, 'FULL-STACK SYSTEMS PARTNER', 'ENGINEERING-LED FULL-STACK GROWTH PARTNER');
  html = replace(html, 'Digital systems that <span class="text-azure">build, automate,</span> launch, and scale.', 'Web products first. <span class="text-azure">Intelligence and growth</span> connected.');
  html = replace(html, 'From custom web apps and e-commerce platforms to AI workflows, cloud operations, and SEO/AIO growth, JXING connects the full lifecycle under one technical partner.', 'We build the web platform, instrument the data, apply AI and predictive analytics, then connect Performance Marketing and Organic Growth to the same measurable customer journey.');
  html = replace(html, '<button class="bg-marian-blue text-white px-8 py-4 rounded-full font-semibold flex items-center gap-3 hover:bg-oxford-blue transition-all active:scale-95 group">\n                    Explore Our Capabilities\n                    <span class="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>\n</button>', '<a class="bg-marian-blue text-white px-8 py-4 rounded-full font-semibold flex items-center gap-3 hover:bg-oxford-blue transition-all" href="#grid">Explore Our Capabilities <span class="material-symbols-outlined">expand_more</span></a>');
  html = replace(html, 'The Engineering Lifecycle', 'The Product-to-Growth Lifecycle');
  html = replace(html, '<div class="lifecycle-step flex items-center">Automate</div>\n<div class="lifecycle-step flex items-center">Grow via SEO/AIO/GEO</div>\n<div class="lifecycle-step flex items-center">Operate/Maintain</div>', '<div class="lifecycle-step flex items-center">Instrument &amp; Automate</div>\n<div class="lifecycle-step flex items-center">Predict &amp; Acquire</div>\n<div class="lifecycle-step flex items-center">Grow &amp; Operate</div>');
  html = replace(html, 'Core Engineering Capabilities', 'Integrated Full-Stack Growth Capabilities');
  html = replace(html, 'Comprehensive technical architecture for modern enterprise growth.', 'Web development remains the foundation. Intelligence, acquisition and organic growth connect to the product and its data.');

  const copy = [
    ['Custom Web Application Development', 'Full-Stack Web Development'],
    ['Scalable portals, dashboards, admin systems, SaaS MVPs, and internal business applications built on robust stacks.', 'Custom applications, portals, dashboards, SaaS products and internal systems engineered around real users, workflows and integrations.'],
    ['Website &amp; E-Commerce Systems', 'Web, Commerce &amp; Conversion Systems'],
    ['High-converting landing pages, e-commerce stores, and CMS consoles integrated with advanced conversion tracking.', 'Corporate websites, landing experiences and commerce systems with content control, analytics and measurable conversion journeys.'],
    ['High ROAS', 'Conversion-ready'],
    ['AI &amp; Workflow Automation', 'AI &amp; Predictive Analytics'],
    ['Deploying AI agents, document parsing, and WhatsApp/CRM routing to replace manual business processes.', 'AI-assisted workflows and predictive analytics for forecasting, lead quality, customer behaviour and operational decisions — with human review.'],
    ['Knowledge Assistants', 'Predictive Models'], ['LLM Ops', 'Decision Support'], ['View Automations', 'Explore AI &amp; Analytics'],
    ['Cloud Operations &amp; Maintenance', 'Performance Marketing'],
    ['Proactive hosting, monitoring, security updates, and incident response to ensure 99.9% system uptime.', 'Paid search, paid social, audience strategy, landing-page experiments and attribution tied to defined conversion events.'],
    ['Stability', 'Acquisition'], ['AWS/GCP', 'Paid Search &amp; Social'], ['24/7 Monitoring', 'Attribution &amp; Testing'],
    ['/services/cloud-operations', '/services/performance-marketing/'], ['View Ops', 'Explore Performance'],
    ['SEO, AIO/GEO &amp; Growth Infrastructure', 'Organic Growth, SEO &amp; AIO/GEO'],
    ['Engineered visibility via technical SEO, schema, and AI-answer optimization for Gen-AI search engines.', 'Technical SEO, content architecture, entity clarity and answer-engine visibility designed to compound discoverability.'],
    ['View Strategy', 'Explore Organic Growth'],
    ['Strategy &amp; Technical Audits', 'Cloud Operations &amp; Lifecycle Support'],
    ['High-level discovery, competitor analysis, feasibility studies, and detailed system architecture roadmaps.', 'Technical audits, managed releases, monitoring, maintenance and improvement planning for business-critical web systems.'],
    ['Blueprint Phase', 'Technical Audits'], ['Debt Review', 'Cloud &amp; Maintenance'],
    ['/services/strategy-audits', '/services/cloud-operations/'], ['Book Discovery', 'Explore Operations']
  ];
  for (const [from, to] of copy) {
    if (html.includes(from)) html = html.replace(from, to);
  }
  html = html.replace('SaaS Operate', 'SaaS Architecture');
  html = html.replace('<span class="px-3 py-1 bg-azure/5 text-[10px] font-bold text-azure rounded-full border border-azure/10 uppercase">Architecture</span>', '<span class="px-3 py-1 bg-azure/5 text-[10px] font-bold text-azure rounded-full border border-azure/10 uppercase">Operate</span>');
  html = html.replaceAll('/services/performance-marketing//', '/services/performance-marketing/');
  html = html.replaceAll('/services/cloud-operations//', '/services/cloud-operations/');
  html = html.replace('<section class="max-w-7xl mx-auto px-6 mb-24" id="grid">', '<section class="max-w-7xl mx-auto px-6 mb-24" id="grid">');
  html = replace(html, '"JXING Tech is a Kuala Lumpur-based custom web application development and digital systems company. JXING builds web platforms, e-commerce systems, internal portals, AI workflow automations, SEO/AIO growth infrastructure, and managed cloud operations for SMEs and growing enterprises."', '"JXING Tech is a Kuala Lumpur engineering-led Full-Stack Growth Partner. Web development is the primary service: custom applications, portals, websites and commerce systems. JXING connects those platforms to AI and predictive analytics, Performance Marketing, Organic Growth, SEO/AIO/GEO and managed operations."');
  html = replaceBetween(html, '<!-- Supporting Growth Services (Subtler Section) -->', '<!-- Final CTA Section -->', `<!-- How the capabilities connect -->
<section class="max-w-7xl mx-auto px-6 mb-32" id="growth-capabilities">
<div class="py-16 border-t border-timberwolf/30"><div class="max-w-3xl mb-10"><div class="text-azure text-xs font-bold uppercase tracking-widest mb-3">One measurement loop</div><h3 class="text-3xl font-bold text-marian-blue mb-4">The web product and the growth programme share the same customer journey.</h3><p class="text-marian-blue/60">Product events, conversion tracking, campaign attribution and organic search insights feed one improvement backlog. Predictive analytics is introduced only where the available data and decision use case support it.</p></div><div class="grid md:grid-cols-3 gap-5"><div class="bg-white p-6 rounded-xl"><b>Build</b><p class="text-xs text-marian-blue/55 mt-2">Web product, integrations and analytics foundation</p></div><div class="bg-white p-6 rounded-xl"><b>Learn</b><p class="text-xs text-marian-blue/55 mt-2">Behaviour, attribution and predictive signals</p></div><div class="bg-white p-6 rounded-xl"><b>Grow</b><p class="text-xs text-marian-blue/55 mt-2">Performance Marketing and Organic Growth experiments</p></div></div></div>
</section>`);
  html = replace(html, 'Not sure which track is right for your business? Consult our AI Digital Architect for a custom recommendation tailored to your growth goals.', 'Start with the business problem and the web system behind it. The AI Digital Architect can outline a preliminary path before a technical audit.');
  html = replace(html, '<button class="w-full md:w-auto bg-azure text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-azure/20 hover:scale-105 transition-all flex items-center justify-center gap-2">\n<span class="material-symbols-outlined">psychology</span>\n                            Ask AI Digital Architect\n                        </button>', '<a class="w-full md:w-auto bg-azure text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-azure/20 hover:scale-105 transition-all flex items-center justify-center gap-2" href="/contact/#ai-architect-form"><span class="material-symbols-outlined">psychology</span>Ask AI Digital Architect</a>');
  html = replace(html, '<button class="w-full md:w-auto bg-white text-marian-blue px-10 py-4 rounded-full font-bold hover:bg-timberwolf transition-all flex items-center justify-center gap-2">\n<span class="material-symbols-outlined">calendar_month</span>\n                            Book Cal.com Audit\n                        </button>', '<a class="w-full md:w-auto bg-white text-marian-blue px-10 py-4 rounded-full font-bold hover:bg-timberwolf transition-all flex items-center justify-center gap-2" href="/contact/#technical-audit-form"><span class="material-symbols-outlined">calendar_month</span>Start Technical Audit</a>');
  html = replace(html, 'Limited technical audit slots this week', 'Scope, architecture and next steps are validated before delivery');
  html = replace(html, 'A global digital powerhouse specializing in strategic software, AI automation, and performance-led market expansion.', 'Engineering-led Full-Stack Growth Partner for web platforms, AI and predictive analytics, Performance Marketing and Organic Growth.');
  html = html.replace(/<div>\n<h5 class="text-white font-medium mb-6">Newsletter<\/h5>[\s\S]*?<\/form>\n<\/div>/, '<div>\n<h5 class="text-white font-medium mb-6">Contact</h5>\n<p class="text-timberwolf text-xs mb-4">Tell us what you need to build or grow.</p>\n<a class="text-white hover:text-azure text-sm" href="mailto:hello@jxingtech.com">hello@jxingtech.com</a>\n</div>');
  if (!html.includes('href="/services/performance-marketing/">Performance Marketing</a>')) {
    html = html.replace('<li><a class="text-timberwolf hover:text-azure transition-colors text-sm" href="/services/ai-workflow-automation/">AI Automation</a></li>', '<li><a class="text-timberwolf hover:text-azure transition-colors text-sm" href="/services/ai-workflow-automation/">AI &amp; Predictive Analytics</a></li>\n<li><a class="text-timberwolf hover:text-azure transition-colors text-sm" href="/services/performance-marketing/">Performance Marketing</a></li>');
  }
  return html;
}

for (const [rel, type] of [['index.html', 'home'], ['company/index.html', 'company'], ['services/index.html', 'services']]) {
  const file = path.join(root, rel);
  let html = fs.readFileSync(file, 'utf8');
  html = type === 'services' ? updateServices(html) : updateHomepage(html, type === 'company');
  fs.writeFileSync(file, html);
}

console.log('Repositioned homepage, company page, and services hub.');
