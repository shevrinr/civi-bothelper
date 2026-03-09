/**
 * radio_button.js — delegated version (matches the working console test)
 * - No per-radio binding
 * - Works with accordions and AJAX replacements
 * - Toggles the existing Civi .crm-clear-link in the same <td> scope
 */

(function () {
  'use strict';

  const log = () => {}; // set to console.log if you want noise
  const CLEAR_CLASS = 'bot-radio-clear-link';

  const getScope = (el) =>
    el.closest('td') ||
    el.closest('.search-field') ||
    el.closest('.crm-section') ||
    el.closest('.crm-form-block') ||
    el.closest('details') ||
    el.parentElement;

  const getClearLink = (scope) => {
    if (!scope) return null;
    const links = scope.querySelectorAll('a.crm-clear-link');
    return links.length ? links[links.length - 1] : null;
  };

  const ensureText = (a) => {
    if (!a) return;
    a.classList.add(CLEAR_CLASS);
    if (!a.querySelector('.crm-clear-text')) {
      const span = document.createElement('span');
      span.className = 'crm-clear-text';
      span.textContent = ' Clear';
      a.appendChild(span);
    }
    a.style.display = 'inline-flex';
    a.style.alignItems = 'center';
    a.style.gap = '4px';
    a.style.whiteSpace = 'nowrap';
    if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', 'Clear selection');
  };

  function toggleForRadio(radio) {
    if (!radio || radio.tagName !== 'INPUT' || radio.type !== 'radio' || !radio.name) return;

    const scope = getScope(radio);
    if (!scope) return;

    const name = radio.name;

    // Use CSS.escape where available
    const esc = (window.CSS && CSS.escape) ? CSS.escape(name) : name.replace(/"/g, '\\"');
    const radios = Array.from(scope.querySelectorAll(`input[type="radio"][name="${esc}"]`));
    if (!radios.length) return;

    const anyChecked = radios.some(r => r.checked);
    const a = getClearLink(scope);
    if (!a) return;

    ensureText(a);
    a.style.visibility = anyChecked ? 'visible' : 'hidden';

    log('[radio-clear] toggle', { name, anyChecked, scope, a });
  }

  function initVisibility(context) {
    const root = context && context.nodeType === 1 ? context : document;

    // For every existing clear link, ensure it has text and correct initial visibility
    root.querySelectorAll('input[type="radio"][name]').forEach(r => {
      // Only do a light init pass (the change handler will handle everything after)
      toggleForRadio(r);
    });
  }

  // 1) Delegated change: works for late-rendered / replaced radios
  document.addEventListener('change', function (e) {
    const t = e.target;
    if (t && t.tagName === 'INPUT' && t.type === 'radio') {
      toggleForRadio(t);
    }
  }, true);

  // 2) Delegated click for clear link
  document.addEventListener('click', function (e) {
    const a = e.target && e.target.closest ? e.target.closest('a.crm-clear-link') : null;
    if (!a || !a.classList.contains(CLEAR_CLASS)) return;

    const scope = getScope(a);
    if (!scope) return;

    // choose the radio group in this scope (prefer checked)
    const checked = scope.querySelector('input[type="radio"][name]:checked');
    const any = scope.querySelector('input[type="radio"][name]');
    const name = (checked && checked.name) || (any && any.name);
    if (!name) return;

    e.preventDefault();

    const esc = (window.CSS && CSS.escape) ? CSS.escape(name) : name.replace(/"/g, '\\"');
    const radios = Array.from(scope.querySelectorAll(`input[type="radio"][name="${esc}"]`));
    radios.forEach(r => r.checked = false);
    if (radios[0]) radios[0].dispatchEvent(new Event('change', { bubbles: true }));

    a.style.visibility = 'hidden';
  }, true);

  // 3) Initial pass
  initVisibility(document);

  // 4) <details> accordions (Civi)
  document.addEventListener('toggle', function (e) {
    const details = e.target;
    if (!details || details.tagName !== 'DETAILS') return;
    if (!String(details.className || '').includes('crm-ajax-accordion')) return;

    if (details.open) {
      setTimeout(() => initVisibility(details), 150);
    }
  }, true);

  // 5) Civi AJAX hook (if available)
  try {
    if (window.CRM && CRM.$) {
      CRM.$(document).on('crmLoad', function (e, data) {
        initVisibility(data && data.element ? data.element : document);
      });
    }
  } catch (err) {}

  // 6) MutationObserver: catch injected blocks
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;
          if (n.querySelector && n.querySelector('input[type="radio"][name]')) {
            initVisibility(n);
          }
        }
      }
    }
  });
  if (document.body) mo.observe(document.body, { childList: true, subtree: true });

})();
