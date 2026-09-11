/* Kingdomland Kids — site behaviour (no dependencies) */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* sticky header state */
  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* mobile nav */
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.classList.toggle('is-open', !open);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle.click();
    });
  }

  /* reveal on scroll */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`; io.observe(el); });
    // safety net: whatever has not scrolled into view yet becomes visible anyway (thumbnails, prerender, odd viewports)
    setTimeout(() => reveals.forEach((el) => el.classList.add('is-in')), 2500);
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* 3D tilt on show cards (pointer devices only) */
  if (!reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((wrap) => {
      const card = wrap.querySelector('.show__card');
      const shine = wrap.querySelector('.show__shine');
      if (!card) return;
      let raf = 0;
      wrap.addEventListener('pointermove', (e) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg) translateZ(6px)`;
          if (shine) { shine.style.setProperty('--mx', `${px * 100}%`); shine.style.setProperty('--my', `${py * 100}%`); }
        });
      });
      wrap.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); card.style.transform = ''; });
    });
  }

  /* shows index filters */
  const filters = document.querySelector('[data-filters]');
  if (filters) {
    const cards = document.querySelectorAll('[data-cat]');
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const f = btn.dataset.filter;
      cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.cat === f); });
    });
  }

  /* newsletter → pass the email to the signup page */
  document.querySelectorAll('[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type=email]').value.trim();
      const url = new URL(form.getAttribute('action'), location.href);
      if (email) url.searchParams.set('email', email);
      url.searchParams.set('utm_source', 'site'); url.searchParams.set('utm_medium', 'footer');
      window.location.href = url.toString();
    });
  });

  /* contact form → opens the visitor's mail app with everything pre-filled (no backend needed) */
  const contact = document.querySelector('[data-contact]');
  if (contact) {
    contact.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(contact);
      const subject = encodeURIComponent(`[${d.get('topic') || 'Hello'}] ${d.get('name') || ''}`.trim());
      const body = encodeURIComponent(`${d.get('message') || ''}\n\n— ${d.get('name') || ''}${d.get('org') ? ' · ' + d.get('org') : ''}\n${d.get('email') || ''}`);
      window.location.href = `mailto:${contact.dataset.contact}?subject=${subject}&body=${body}`;
      const ok = contact.querySelector('[data-sent]');
      if (ok) ok.hidden = false;
    });
  }

  /* current year fallback (build already prints it) */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
