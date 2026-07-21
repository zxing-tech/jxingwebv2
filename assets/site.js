(() => {
  'use strict';

  const byText = (element) => (element.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();

  function routeStaticButtons() {
    document.querySelectorAll('button:not([type="submit"])').forEach((button) => {
      const text = byText(button);
      if (button.dataset.jxingBound) return;
      let route = null;
      if (/technical audit|start building|get in touch|contact|let.s talk/.test(text)) route = '/contact/#technical-audit-form';
      else if (/ai digital architect|ask ai|system architect|strategy assistant/.test(text)) route = '/contact/#ai-architect-form';
      else if (/view all capabilities|capabilities|services/.test(text)) route = '/services/';
      else if (/case studies|success stories/.test(text)) route = '/case-studies/';
      else if (/download|resource|whitepaper/.test(text)) route = '/contact/?interest=resource#technical-audit-form';
      if (route) {
        button.dataset.jxingBound = 'true';
        button.addEventListener('click', () => { window.location.href = route; });
      }
    });
  }

  function setupTechnicalAuditForm() {
    const form = document.getElementById('technical-audit-form');
    if (!form) return;
    const status = document.getElementById('audit-form-status');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [
        'JXING Technical Audit Request',
        '',
        `Name: ${data.get('name') || ''}`,
        `Company: ${data.get('company') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Phone: ${data.get('phone') || ''}`,
        `Existing URL/Systems: ${data.get('systems') || ''}`,
        `Project Type: ${data.get('projectType') || ''}`,
        `Budget: ${data.get('budget') || ''}`,
        `Timeline: ${data.get('timeline') || ''}`,
        `Support Need: ${data.get('support') || ''}`,
        '',
        `Business Problem: ${data.get('businessProblem') || ''}`,
        '',
        `Users / Workflows: ${data.get('workflows') || ''}`
      ];
      const subject = encodeURIComponent(`Technical Audit Request — ${data.get('company') || data.get('name') || 'Website enquiry'}`);
      const body = encodeURIComponent(lines.join('\n'));
      if (status) status.textContent = 'Opening your email app with the completed project brief. Review it before sending.';
      window.location.href = `mailto:hello@jxingtech.com?subject=${subject}&body=${body}`;
    });
  }

  function setupAiArchitect() {
    const form = document.getElementById('ai-architect-form');
    if (!form) return;
    const button = form.querySelector('button[type="submit"]');
    const result = document.getElementById('ai-result');
    const status = document.getElementById('ai-status');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const payload = {
        goal: data.get('goal'),
        systems: data.get('systems'),
        workflows: data.get('workflows'),
        budget: data.get('budget'),
        timeline: data.get('timeline')
      };

      button.disabled = true;
      button.classList.add('opacity-60', 'cursor-wait');
      status.textContent = 'Mapping your requirements against JXING’s engineering lifecycle…';
      result.textContent = '';
      result.classList.add('hidden');

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      try {
        const response = await fetch('/api/architect/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Unable to generate a recommendation.');
        result.textContent = body.recommendation;
        result.classList.remove('hidden');
        result.focus();
        status.textContent = body.fallback
          ? 'Live model was temporarily unavailable, so a safe JXING fallback path is shown.'
          : `Preliminary path generated with ${body.model}. No contact details were sent to the model.`;
      } catch (error) {
        status.textContent = error.name === 'AbortError'
          ? 'The request took too long. Please try again.'
          : (error.message || 'The AI architect is temporarily unavailable. Please try again.');
      } finally {
        window.clearTimeout(timeout);
        button.disabled = false;
        button.classList.remove('opacity-60', 'cursor-wait');
      }
    });
  }

  routeStaticButtons();
  setupTechnicalAuditForm();
  setupAiArchitect();
})();
