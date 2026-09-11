/* Tool Mart — UI behaviour (no framework). Progressive enhancement only. */
document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const rel = (window.TM && window.TM.rel) || '';
const track = (event, params = {}) => { try { window.dataLayer.push({ event, ...params }); } catch (e) { /* noop */ } };

/* Sticky header shadow */
const header = $('#site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
}

/* Mega menu: click-to-toggle for touch + keyboard, hover handled by CSS */
$$('.has-mega > a').forEach((a) => {
  const li = a.parentElement;
  a.addEventListener('click', (e) => {
    if (!finePointer || a.getAttribute('aria-expanded') === 'false' && matchMedia('(max-width:1100px)').matches) return;
    if (!finePointer) { e.preventDefault(); const open = li.classList.toggle('is-open'); a.setAttribute('aria-expanded', String(open)); $$('.has-mega').forEach((o) => { if (o !== li) { o.classList.remove('is-open'); o.querySelector('a').setAttribute('aria-expanded', 'false'); } }); }
  });
  a.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); li.classList.add('is-open'); a.setAttribute('aria-expanded', 'true'); li.querySelector('.mega a')?.focus(); } });
  li.addEventListener('keydown', (e) => { if (e.key === 'Escape') { li.classList.remove('is-open'); a.setAttribute('aria-expanded', 'false'); a.focus(); } });
});
document.addEventListener('click', (e) => { if (!e.target.closest('.has-mega')) $$('.has-mega.is-open').forEach((li) => { li.classList.remove('is-open'); li.querySelector('a').setAttribute('aria-expanded', 'false'); }); });

/* Mobile drawer */
const drawer = $('#mobile-nav');
const openDrawer = () => { drawer.hidden = false; document.body.classList.add('menu-open'); $('[data-menu-open]').setAttribute('aria-expanded', 'true'); $('[data-menu-close]', drawer)?.focus(); };
const closeDrawer = () => { drawer.hidden = true; document.body.classList.remove('menu-open'); $('[data-menu-open]').setAttribute('aria-expanded', 'false'); };
$$('[data-menu-open]').forEach((b) => b.addEventListener('click', openDrawer));
$$('[data-menu-close]').forEach((b) => b.addEventListener('click', closeDrawer));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer && !drawer.hidden) closeDrawer(); });

/* Search overlay with client-side index */
const search = $('#search');
let index = null, lastFocus = null;
const openSearch = async () => {
  lastFocus = document.activeElement; search.hidden = false; document.body.classList.add('menu-open');
  const input = $('[data-search-input]', search); input.focus();
  if (!index) { try { index = await (await fetch(rel + 'assets/data/search-index.json')).json(); } catch (e) { index = { products: [], pages: [] }; } }
  track('search_open');
};
const closeSearch = () => { search.hidden = true; document.body.classList.remove('menu-open'); lastFocus?.focus(); };
$$('[data-search-open]').forEach((b) => b.addEventListener('click', openSearch));
$$('[data-search-close]').forEach((b) => b.addEventListener('click', closeSearch));
search?.addEventListener('click', (e) => { if (e.target === search) closeSearch(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && search && !search.hidden) closeSearch(); if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); } if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); openSearch(); } });
const money = (n) => n == null ? '' : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
const norm = (s) => (s || '').toLowerCase().replace(/[™®"”“]/g, '').replace(/[^a-z0-9 ./-]/g, ' ');
const renderResults = (q) => {
  const out = $('[data-search-results]', search); if (!index) return;
  const nq = norm(q).trim(); const toks = nq.split(/\s+/).filter(Boolean);
  if (!toks.length) { out.innerHTML = ''; return; }
  const score = (fields) => { const hay = norm(fields.join(' ')); let s = 0; for (const t of toks) { if (!hay.includes(t)) return 0; s += hay.startsWith(t) ? 3 : 1; if (hay.includes(' ' + t)) s += 1; } return s; };
  const prods = index.products.map((p) => ({ p, s: score([p.t, p.s, p.b, p.c]) })).filter((x) => x.s).sort((a, b) => b.s - a.s).slice(0, 6);
  const pages = index.pages.map((p) => ({ p, s: score([p.t, p.k]) })).filter((x) => x.s).sort((a, b) => b.s - a.s).slice(0, 4);
  if (!prods.length && !pages.length) { out.innerHTML = `<li class="search__empty">No matches on this preview. Try a catalog number, or <a href="${rel}pages/contact/#quote"><b>request a quote</b></a> — we stock far more than we list.</li>`; return; }
  out.innerHTML = [
    ...pages.map(({ p }) => `<li><a href="${rel}${p.u}/"><span class="k">${p.k}</span><span><b>${p.t}</b><small>${p.k}</small></span><span></span></a></li>`),
    ...prods.map(({ p }) => `<li><a href="${rel}${p.u}/"><img src="${rel}assets/img/products/${p.i}.svg" alt="" width="56" height="42"><span><b>${p.t}</b><small>SKU ${p.s} · ${p.c}</small></span><span class="price">${p.p != null ? money(p.p) : 'Quote'}</span></a></li>`),
  ].join('');
};
$('[data-search-input]', search)?.addEventListener('input', (e) => renderResults(e.target.value));
$$('.search__hint button', search).forEach((b) => b.addEventListener('click', () => { const i = $('[data-search-input]', search); i.value = b.dataset.q; renderResults(i.value); i.focus(); }));
$('.search__form', search)?.addEventListener('submit', (e) => { const q = $('[data-search-input]', search).value.trim(); track('search', { search_term: q }); if (!q) e.preventDefault(); });

/* Reveal on scroll */
const io = 'IntersectionObserver' in window;
$$('.section-head, .ccard, .pcard, .tcard, .svc, .lcard, .promo, .bcard, .step, .scope, .rcard, .why__list li, .values li, .perk').forEach((el) => { if (!el.closest('.hero')) el.classList.add('reveal'); });

/* 3D tilt cards (desktop, fine pointer only) */
if (finePointer && !reduced) {
  $$('[data-tilt]').forEach((card) => {
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5; const y = (e.clientY - r.top) / r.height - .5;
      cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { card.classList.add('is-tilting'); card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`; });
    });
    card.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); card.classList.remove('is-tilting'); card.style.transform = ''; });
  });
}

/* Count-up stats */
if (!reduced) $$('[data-count]').forEach((el) => {
  const target = +el.dataset.count; const isYear = target > 1000; if (isYear) return;
  const run = () => { const t0 = performance.now(), d = 1200; const step = (t) => { const k = Math.min(1, (t - t0) / d); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  if (io) { const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { run(); o.disconnect(); } }); o.observe(el); } else run();
});

/* Tabs (PDP) */
$$('[data-tabs]').forEach((tabs) => {
  const list = $$('[role=tab]', tabs), panels = $$('[role=tabpanel]', tabs);
  const select = (tab) => { list.forEach((t) => t.setAttribute('aria-selected', String(t === tab))); panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute('aria-controls'); }); };
  list.forEach((t, i) => { t.addEventListener('click', () => select(t)); t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { list[(i + 1) % list.length].focus(); select(list[(i + 1) % list.length]); } if (e.key === 'ArrowLeft') { list[(i - 1 + list.length) % list.length].focus(); select(list[(i - 1 + list.length) % list.length]); } }); });
});

/* Thumbs (visual only in the preview) */
$$('.thumbs .thumb').forEach((b, i, all) => b.addEventListener('click', () => { all.forEach((x) => x.classList.toggle('thumb--active', x === b)); }));

/* Add to cart (demo) */
$$('[data-add]').forEach((b) => b.addEventListener('click', () => {
  track('add_to_cart', { items: [{ item_id: b.dataset.add }] });
  const old = b.innerHTML; b.innerHTML = '✓ Added to cart'; b.disabled = true; setTimeout(() => { b.innerHTML = old; b.disabled = false; }, 1800);
}));

/* Lead forms: prefill from URL, validate, submit (Formspree) or demo mode */
$$('[data-lead-form]').forEach((f) => {
  const params = new URLSearchParams(location.search);
  const sku = params.get('sku'); if (sku) { const i = $('[data-sku-field]', f); if (i && !i.value) i.value = sku; }
  const type = params.get('type'); const sel = $('select[name=request_type]', f);
  if (sel) { if (type === 'rental') sel.value = 'Rental request'; else if (type === 'repair') sel.value = 'Repair request'; else if (location.hash === '#quote' && sel.dataset.default === 'General inquiry') sel.value = 'Request a quote'; }
  f.addEventListener('submit', async (e) => {
    e.preventDefault(); const msg = $('.form__msg', f); msg.classList.remove('is-error');
    if (!f.checkValidity()) { f.reportValidity(); msg.textContent = 'Please complete the required fields.'; msg.classList.add('is-error'); return; }
    const btn = $('button[type=submit]', f); btn.disabled = true; btn.textContent = 'Sending…';
    const data = new FormData(f); const kind = data.get('request_type') || 'lead';
    track(kind === 'Request a quote' ? 'quote_request' : 'form_submit', { form_id: f.id, request_type: kind, store: data.get('store') });
    const demo = /FORM_ID/.test(f.action);
    try {
      if (!demo) { const r = await fetch(f.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } }); if (!r.ok) throw new Error('bad status'); }
      f.reset(); msg.textContent = 'Thanks — your request is in. A Tool Mart team member will reply within one business day.' + (demo ? ' (Preview mode: form endpoint not connected yet.)' : '');
    } catch (err) { msg.textContent = 'Something went wrong. Please call (713) 222-8665 or email info@toolmarthou.com.'; msg.classList.add('is-error'); }
    btn.disabled = false; btn.innerHTML = 'Send request';
  });
});

/* Newsletter */
$$('[data-newsletter]').forEach((f) => f.addEventListener('submit', (e) => {
  const email = $('input[type=email]', f); const msg = $('.newsletter__msg', f);
  if (!email.checkValidity()) { e.preventDefault(); msg.textContent = 'Enter a valid email address.'; return; }
  track('newsletter_signup');
  if (/list-manage\.com\/subscribe\/post$/.test(f.action)) { e.preventDefault(); msg.textContent = 'Thanks! (Preview mode: connect the Mailchimp form action to go live.)'; f.reset(); }
}));

/* Call-click tracking (KPI OUT-03) */
$$('a[href^="tel:"]').forEach((a) => a.addEventListener('click', () => track(a.dataset.track || 'call_click', { phone: a.getAttribute('href').slice(4) })));

/* Location card focus from map pins */
$$('.txmap__pin').forEach((pin) => { pin.style.cursor = 'pointer'; pin.addEventListener('click', () => { const t = $('#loc-' + pin.dataset.loc); t?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); t?.classList.add('is-hi'); setTimeout(() => t?.classList.remove('is-hi'), 1200); }); });
