import { site, locations, brands, otherBrands, categories, trades, products, posts } from './data.mjs';
import { icon, sprite } from './icons.mjs';

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const attr = esc;

// Preview link (folder based) — `rel` is the relative prefix to the site root ("" or "../" ...).
const INDEX = process.env.LINK_INDEX ? 'index.html' : '';
export function url(rel, handle = '') {
  if (!handle) return (rel || './') + INDEX;
  if (/^(https?:|mailto:|tel:)/.test(handle)) return handle;
  const [path, hash] = handle.split('#');
  return rel + (path ? path.replace(/\/$/, '') + '/' : '') + INDEX + (hash ? '#' + hash : '');
}
// Canonical production URL (Shopify paths, no trailing slash)
export function abs(handle = '') {
  const [path, hash] = handle.split('#');
  return site.domain + (path ? '/' + path.replace(/\/$/, '') : '/') + (hash ? '#' + hash : '');
}
export const asset = (rel, p) => rel + 'assets/' + p;

export const money = (n) => n == null ? null : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function ctaFor(p) {
  if (p.price == null) return { label: 'Request Price', kind: 'quote' };
  if (p.ecom && p.price < 500) return { label: 'Add to Cart', kind: 'cart' };
  if (p.price < 2000) return { label: 'View Details', kind: 'details' };
  return { label: 'Request Quote', kind: 'quote' };
}
export const brandOf = (p) => brands.find((b) => b.id === p.brand);
export const brandLabel = (p) => (brandOf(p) ? brandOf(p).name : p.brandLabel || p.brand);
export const catOf = (id) => categories.find((c) => c.id === id);

/* ---------- JSON-LD ---------- */
export const ORG_ID = site.domain + '/#organization';
export function orgSchema() {
  return {
    '@type': 'Organization', '@id': ORG_ID, name: site.name, legalName: site.legalName, url: site.domain + '/',
    logo: site.domain + '/assets/img/logo-mark.svg',
    foundingDate: '1976-06-24', founder: { '@type': 'Person', name: site.founder },
    slogan: site.tagline, email: site.email,
    sameAs: Object.values(site.social),
    contactPoint: locations.map((l) => ({ '@type': 'ContactPoint', telephone: l.phoneE164, contactType: 'sales', areaServed: 'US-TX', availableLanguage: ['en', 'es'], name: l.name })),
    location: locations.map((l) => ({ '@id': storeId(l) })),
  };
}
export const storeId = (l) => abs(l.handle) + '#store';
export function storeSchema(l, full = true) {
  const s = {
    '@type': 'HardwareStore', '@id': storeId(l), name: l.name, url: abs(l.handle), telephone: l.phoneE164, email: site.email,
    image: site.domain + '/assets/img/og-cover.jpg', priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: l.streetAddress, addressLocality: l.addressLocality, addressRegion: l.addressRegion, postalCode: l.postalCode, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: l.geo.lat, longitude: l.geo.lng },
    hasMap: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(l.mapQuery),
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: l.hoursSpec.days, opens: l.hoursSpec.opens, closes: l.hoursSpec.closes }],
    parentOrganization: { '@id': ORG_ID },
  };
  if (full) {
    s.brand = brands.map((b) => ({ '@type': 'Brand', name: b.name }));
    s.areaServed = l.id === 'houston'
      ? ['Houston', 'Missouri City', 'Sugar Land', 'Stafford', 'Pearland', 'Katy', 'Pasadena', 'Baytown'].map((n) => ({ '@type': 'City', name: n }))
      : ['San Antonio', 'New Braunfels', 'Schertz', 'Boerne', 'Seguin'].map((n) => ({ '@type': 'City', name: n }));
    s.makesOffer = [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Power tool repair', url: abs('pages/toolmarts-repair') } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tool and equipment rental', url: abs('pages/toolmarts-rental') } },
    ];
  }
  return s;
}
export function websiteSchema() {
  return { '@type': 'WebSite', '@id': site.domain + '/#website', url: site.domain + '/', name: site.name, publisher: { '@id': ORG_ID },
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: site.domain + '/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } };
}
export function breadcrumbSchema(items) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.handle) })) };
}
export function faqSchema(items) {
  return { '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
}
export function serviceSchema({ name, type, handle, description, brandsServed = [] }) {
  return { '@type': 'Service', '@id': abs(handle) + '#service', name, serviceType: type, url: abs(handle), description,
    provider: { '@id': ORG_ID }, areaServed: [{ '@type': 'State', name: 'Texas' }, { '@type': 'City', name: 'Houston' }, { '@type': 'City', name: 'San Antonio' }],
    availableChannel: locations.map((l) => ({ '@type': 'ServiceChannel', serviceLocation: { '@id': storeId(l) }, servicePhone: { '@type': 'ContactPoint', telephone: l.phoneE164 } })),
    brand: brandsServed.map((b) => ({ '@type': 'Brand', name: b })) };
}
export function productSchema(p) {
  const b = brandLabel(p);
  const s = { '@type': 'Product', '@id': abs(p.handle) + '#product', name: p.title, sku: p.sku, mpn: p.sku.replace(/^[A-Z]{3}/, ''),
    brand: { '@type': 'Brand', name: b }, description: p.blurb, category: catOf(p.category)?.name,
    image: [site.domain + '/assets/img/products/' + p.img + '.svg'], url: abs(p.handle) };
  if (p.price != null) s.offers = { '@type': 'Offer', url: abs(p.handle), priceCurrency: 'USD', price: p.price.toFixed(2),
    availability: p.stock === 'in' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder', itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': ORG_ID }, priceValidUntil: '2026-12-31' };
  return s;
}
export function itemListSchema(name, items) {
  return { '@type': 'ItemList', name, numberOfItems: items.length, itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(p.handle), name: p.title })) };
}
export function articleSchema(post) {
  return { '@type': 'Article', headline: post.title, datePublished: post.date, dateModified: post.date, author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID },
    image: site.domain + '/assets/img/og-cover.jpg', mainEntityOfPage: abs('blogs/news/' + post.slug), description: post.excerpt };
}

/* ---------- Layout ---------- */
export function layout({ rel, title, description, handle, body, schema = [], bodyClass = '', scripts = [], noindex = false, breadcrumbs = null, ogType = 'website' }) {
  const canonical = abs(handle);
  const graph = { '@context': 'https://schema.org', '@graph': [orgSchema(), ...(breadcrumbs ? [breadcrumbSchema(breadcrumbs)] : []), ...schema] };
  return `<!DOCTYPE html>
<html lang="en-US" prefix="og: https://ogp.me/ns#">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">'}
<meta name="theme-color" content="#0E1116">
<meta name="geo.region" content="US-TX"><meta name="geo.placename" content="Houston; San Antonio">
<meta property="og:type" content="${ogType}"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${attr(title)}"><meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.domain}/assets/img/og-cover.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Tool Mart — industrial tools, repair and rental in Houston and San Antonio">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${attr(title)}"><meta name="twitter:description" content="${attr(description)}"><meta name="twitter:image" content="${site.domain}/assets/img/og-cover.jpg">
<link rel="icon" href="${asset(rel, 'img/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset(rel, 'img/apple-touch-icon.png')}">
<link rel="manifest" href="${rel}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700&display=swap">
<link rel="preload" href="${asset(rel, 'css/main.css')}" as="style"><link rel="stylesheet" href="${asset(rel, 'css/main.css')}">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
<script>window.dataLayer=window.dataLayer||[];window.TM={rel:${JSON.stringify(rel)},form:${JSON.stringify(site.formEndpoint)}};</script>
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${sprite()}
${header(rel)}
<main id="main">
${body}
</main>
${footer(rel)}
${searchOverlay(rel)}
<script type="module" src="${asset(rel, 'js/main.js')}"></script>
${scripts.map((s) => `<script type="module" src="${asset(rel, s)}"></script>`).join('\n')}
</body>
</html>`;
}

export function logo(rel, cls = '') {
  return `<a class="logo ${cls}" href="${url(rel)}" aria-label="Tool Mart — home">
  <span class="logo__mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 3l18 10.5v21L24 45 6 34.5v-21L24 3z" fill="#F26A1B"/><path d="M24 9l12.9 7.5v15L24 39l-12.9-7.5v-15L24 9z" fill="#0E1116"/><path d="M17 31l7.5-7.5a4.2 4.2 0 0 1 5.4-5.4l-2.6 2.6 1.9 1.9 2.6-2.6a4.2 4.2 0 0 1-5.4 5.4L19 33z" fill="#fff"/></svg></span>
  <span class="logo__word">TOOL<span>MART</span></span>
  <span class="logo__emblem" aria-label="50 years, since 1976"><b>50</b><small>YEARS</small></span>
</a>`;
}

export function header(rel) {
  const cats = categories.map((c) => `<li><a href="${url(rel, c.handle)}">${icon(c.icon)}<span>${esc(c.name)}</span></a></li>`).join('');
  const brandLinks = brands.map((b) => `<li><a href="${url(rel, b.handle)}" class="brandlink brandlink--${b.id}"><span class="brandlink__dot"></span>${esc(b.name)}<sup>${b.mark}</sup></a></li>`).join('');
  const tradeLinks = trades.map((t) => `<li><a href="${url(rel, t.handle)}">${icon(t.icon)}<span>${esc(t.name)}</span></a></li>`).join('');
  const locs = locations.map((l) => `<span class="topbar__loc"><a href="tel:${l.phoneE164}" data-track="${l.trackEvent}">${icon('phone')}<b>${esc(l.shortName)}</b> ${esc(l.phone)}</a></span>`).join('');
  return `<div class="topbar"><div class="wrap topbar__row">
  <div class="topbar__left">${locs}<span class="topbar__hours">${icon('clock')}Mon–Fri 7:30 AM – 5:00 PM</span></div>
  <div class="topbar__right"><span>${icon('shield')}Factory-authorized RIDGID<sup>®</sup> · Greenlee<sup>®</sup> · Milwaukee<sup>®</sup> · DeWALT<sup>®</sup> dealer</span><a href="${url(rel, 'pages/contact')}">Contractor accounts</a></div>
</div></div>
<header class="site-header" id="site-header">
 <div class="wrap header__row">
  ${logo(rel)}
  <nav class="nav" aria-label="Primary">
   <ul class="nav__list">
    <li class="nav__item has-mega"><a href="${url(rel, 'collections')}" aria-haspopup="true" aria-expanded="false">Shop ${icon('chevron-down', 'ico--sm')}</a>
     <div class="mega" role="region" aria-label="Shop menu"><div class="wrap mega__grid">
      <div class="mega__col mega__col--wide"><h3>Shop by category</h3><ul class="mega__cats">${cats}</ul></div>
      <div class="mega__col"><h3>Shop by brand</h3><ul class="mega__brands">${brandLinks}<li><a href="${url(rel, 'collections')}#brands">All brands ${icon('arrow-right', 'ico--sm')}</a></li></ul></div>
      <div class="mega__col mega__col--promo"><a class="mega__card" href="${url(rel, 'products/ridgid-1224-pipe-threading-machine-26092')}"><span class="mega__card-tag">Best seller</span><strong>RIDGID<sup>®</sup> 1224 Threading Machine</strong><span>Explore it in 3D ${icon('arrow-right', 'ico--sm')}</span></a><a class="mega__link" href="${url(rel, 'collections/rentals')}">${icon('calendar')}Rental equipment</a><a class="mega__link" href="${url(rel, 'pages/promotion')}">${icon('tag')}Current promotions</a></div>
     </div></div></li>
    <li class="nav__item has-mega"><a href="${url(rel, 'collections')}#brands" aria-haspopup="true" aria-expanded="false">Brands ${icon('chevron-down', 'ico--sm')}</a>
     <div class="mega mega--brands"><div class="wrap mega__grid mega__grid--brands">${brands.map((b) => `<a class="brandtile brandtile--${b.id}" href="${url(rel, b.handle)}"><span class="brandtile__name">${esc(b.name)}<sup>${b.mark}</sup></span><span class="brandtile__auth">${esc(b.authorized)}</span><span class="brandtile__cta">Shop ${esc(b.name)} ${icon('arrow-right', 'ico--sm')}</span></a>`).join('')}
      <div class="mega__others"><h3>Also in stock</h3><p>${otherBrands.map((n) => esc(n) + '<sup>®</sup>').join(' · ')}</p></div></div></div></li>
    <li class="nav__item has-mega"><a href="${url(rel, 'pages/jobs-contractors')}" aria-haspopup="true" aria-expanded="false">Trades ${icon('chevron-down', 'ico--sm')}</a>
     <div class="mega mega--small"><div class="wrap"><ul class="mega__cats mega__cats--row">${tradeLinks}</ul></div></div></li>
    <li class="nav__item"><a href="${url(rel, 'pages/toolmarts-repair')}">Repair</a></li>
    <li class="nav__item"><a href="${url(rel, 'pages/toolmarts-rental')}">Rental</a></li>
    <li class="nav__item"><a href="${url(rel, 'pages/promotion')}">Promotions</a></li>
    <li class="nav__item"><a href="${url(rel, 'pages/about-us')}">About</a></li>
   </ul>
  </nav>
  <div class="header__actions">
   <button class="icon-btn" type="button" data-search-open aria-label="Search products">${icon('search')}</button>
   <a class="btn btn--primary header__quote" href="${url(rel, 'pages/contact#quote')}">${icon('quote')}<span>Request a Quote</span></a>
   <a class="icon-btn" href="${site.domain}/cart" aria-label="Cart">${icon('cart')}</a>
   <button class="icon-btn burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav" data-menu-open>${icon('menu')}</button>
  </div>
 </div>
 <div class="mobile-nav" id="mobile-nav" hidden>
  <div class="mobile-nav__head">${logo(rel, 'logo--sm')}<button class="icon-btn" type="button" aria-label="Close menu" data-menu-close>${icon('close')}</button></div>
  <nav aria-label="Mobile">
   <details open><summary>Shop by category</summary><ul>${cats}</ul></details>
   <details><summary>Brands</summary><ul class="mega__brands">${brandLinks}</ul></details>
   <details><summary>Shop by trade</summary><ul>${tradeLinks}</ul></details>
   <ul class="mobile-nav__links">
    <li><a href="${url(rel, 'pages/toolmarts-repair')}">${icon('wrench')}Tool Repair</a></li>
    <li><a href="${url(rel, 'pages/toolmarts-rental')}">${icon('calendar')}Equipment Rental</a></li>
    <li><a href="${url(rel, 'pages/promotion')}">${icon('tag')}Promotions</a></li>
    <li><a href="${url(rel, 'pages/about-us')}">${icon('info')}About Tool Mart</a></li>
    <li><a href="${url(rel, 'pages/contact')}">${icon('mail')}Contact &amp; Quotes</a></li>
   </ul>
   <div class="mobile-nav__stores">${locations.map((l) => `<a href="tel:${l.phoneE164}" data-track="${l.trackEvent}" class="btn btn--dark">${icon('phone')}${esc(l.shortName)} ${esc(l.phone)}</a>`).join('')}</div>
  </nav>
 </div>
</header>`;
}

export function footer(rel) {
  const cols = `
  <div class="footer__col"><h3>Shop</h3><ul>${categories.map((c) => `<li><a href="${url(rel, c.handle)}">${esc(c.name)}</a></li>`).join('')}<li><a href="${url(rel, 'collections/rentals')}">Rental equipment</a></li></ul></div>
  <div class="footer__col"><h3>Brands</h3><ul>${brands.map((b) => `<li><a href="${url(rel, b.handle)}">${esc(b.name)}<sup>${b.mark}</sup> tools</a></li>`).join('')}<li><a href="${url(rel, 'collections')}#brands">All brands</a></li></ul>
   <h3>Trades</h3><ul>${trades.map((t) => `<li><a href="${url(rel, t.handle)}">${esc(t.name)}</a></li>`).join('')}</ul></div>
  <div class="footer__col"><h3>Services</h3><ul>
   <li><a href="${url(rel, 'pages/toolmarts-repair')}">Tool repair (RIDGID<sup>®</sup> &amp; Greenlee<sup>®</sup> authorized)</a></li>
   <li><a href="${url(rel, 'pages/toolmarts-rental')}">Equipment rental</a></li>
   <li><a href="${url(rel, 'pages/contact#quote')}">Request a quote</a></li>
   <li><a href="${url(rel, 'pages/contact')}">Contractor accounts &amp; PO ordering</a></li>
   <li><a href="${url(rel, 'pages/promotion')}">Promotions</a></li></ul>
   <h3>Company</h3><ul>
   <li><a href="${url(rel, 'pages/about-us')}">About Tool Mart</a></li>
   <li><a href="${url(rel, 'blogs/news')}">Blog &amp; guides</a></li>
   <li><a href="${url(rel, 'pages/contact')}">Contact</a></li>
   <li><a href="${site.domain}/policies/privacy-policy" rel="nofollow">Privacy policy</a></li>
   <li><a href="${site.domain}/policies/refund-policy" rel="nofollow">Returns &amp; refunds</a></li>
   <li><a href="${site.domain}/policies/shipping-policy" rel="nofollow">Shipping policy</a></li></ul></div>
  <div class="footer__col footer__col--stores">${locations.map((l) => `<address class="store" itemscope><h3>${esc(l.name)}</h3><p>${esc(l.streetAddress)}<br>${esc(l.addressLocality)}, ${l.addressRegion} ${l.postalCode}</p><p><a href="tel:${l.phoneE164}" data-track="${l.trackEvent}">${icon('phone')}${esc(l.phone)}</a></p><p>${icon('clock')}${esc(l.hours)}</p><a class="store__map" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.mapQuery)}" target="_blank" rel="noopener">Get directions ${icon('external', 'ico--sm')}</a></address>`).join('')}</div>`;
  return `<footer class="site-footer">
 <div class="footer__news"><div class="wrap footer__news-row">
  <div><h2>Promotions, new arrivals and pro tips — twice a month.</h2><p>Join contractors across Texas who get Tool Mart deals first. No spam, unsubscribe anytime.</p></div>
  <form class="newsletter" action="${site.newsletterAction}" method="post" data-newsletter novalidate>
   <label class="sr-only" for="nl-email">Email address</label>
   <input id="nl-email" type="email" name="EMAIL" placeholder="you@company.com" required autocomplete="email">
   <button class="btn btn--primary" type="submit">Subscribe ${icon('arrow-right', 'ico--sm')}</button>
   <p class="newsletter__msg" role="status" aria-live="polite"></p>
  </form>
 </div></div>
 <div class="wrap footer__grid">
  <div class="footer__brand">${logo(rel, 'logo--light')}<p class="footer__tag">${esc(site.tagline)}</p><p>Family-owned industrial tool supplier serving Texas contractors since ${site.founded}. Factory-authorized dealer and repair center.</p>
   <div class="footer__social"><a href="${site.social.facebook}" target="_blank" rel="noopener" aria-label="Tool Mart on Facebook">${icon('facebook')}</a><a href="${site.social.pinterest}" target="_blank" rel="noopener" aria-label="Tool Mart on Pinterest">${icon('pinterest')}</a><a href="mailto:${site.email}" aria-label="Email Tool Mart">${icon('mail')}</a></div></div>
  ${cols}
 </div>
 <div class="wrap footer__legal"><p>© ${new Date().getFullYear()} ${esc(site.legalName)} All rights reserved. RIDGID<sup>®</sup>, Greenlee<sup>®</sup>, Milwaukee<sup>®</sup>, M18 FUEL™, PACKOUT™, DeWALT<sup>®</sup>, FLEXVOLT<sup>®</sup> and other marks are trademarks of their respective owners and are used to identify genuine products sold by an authorized dealer.</p><p><a href="${site.domain}/policies/terms-of-service" rel="nofollow">Terms of service</a> · <a href="${rel}sitemap.xml">Sitemap</a> · <a href="${rel}llms.txt">llms.txt</a></p></div>
</footer>`;
}

export function searchOverlay(rel) {
  return `<div class="search" id="search" hidden role="dialog" aria-modal="true" aria-label="Search Tool Mart">
 <div class="search__panel">
  <form class="search__form" role="search" action="${site.domain}/search" method="get">
   ${icon('search')}<input type="search" name="q" placeholder="Search by SKU, catalog number or product… e.g. 1224, M18 FUEL, 555" autocomplete="off" aria-label="Search" data-search-input>
   <button type="button" class="icon-btn" aria-label="Close search" data-search-close>${icon('close')}</button>
  </form>
  <div class="search__hint">Try: <button type="button" data-q="pipe threader">pipe threader</button><button type="button" data-q="RIDGID 535">RIDGID 535</button><button type="button" data-q="battery">battery</button><button type="button" data-q="bender">bender</button></div>
  <ul class="search__results" data-search-results aria-live="polite"></ul>
 </div>
</div>`;
}

/* ---------- Components ---------- */
export function sectionHead(eyebrow, title, lead = '', cls = '') {
  return `<div class="section-head ${cls}">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
}
export function breadcrumbs(rel, items) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) => i === items.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${url(rel, it.handle)}">${esc(it.name)}</a></li>`).join('')}</ol></nav>`;
}
export function productCard(rel, p, opts = {}) {
  const cta = ctaFor(p);
  const b = brandLabel(p);
  const bid = brandOf(p) ? brandOf(p).id : p.brand;
  const stock = p.stock === 'in' ? '<span class="stock stock--in">In stock · Houston &amp; San Antonio</span>' : '<span class="stock stock--order">Factory order · ask for lead time</span>';
  return `<article class="pcard" data-tilt data-sku="${attr(p.sku)}">
 <a class="pcard__media" href="${url(rel, p.handle)}" aria-label="${attr(p.title)}">
  <img src="${asset(rel, 'img/products/' + p.img + '.svg')}" width="600" height="450" loading="lazy" decoding="async" alt="${attr(p.title)} — ${attr(b)} ${attr(catOf(p.category)?.name || '')} sold by Tool Mart Houston">
  ${p.badge ? `<span class="pcard__badge">${esc(p.badge)}</span>` : ''}
 </a>
 <div class="pcard__body">
  <div class="pcard__meta"><span class="pcard__brand pcard__brand--${bid}">${esc(b)}</span><span class="pcard__sku">SKU ${esc(p.sku)}</span></div>
  <h3 class="pcard__title"><a href="${url(rel, p.handle)}">${esc(p.title)}</a></h3>
  ${opts.blurb ? `<p class="pcard__blurb">${esc(p.blurb)}</p>` : ''}
  <div class="pcard__foot">
   <div class="pcard__price">${p.price != null ? `<span class="price">${money(p.price)}</span>` : '<span class="price price--ask">Call for price</span>'}${stock}</div>
   ${cta.kind === 'cart' ? `<button class="btn btn--primary btn--sm" type="button" data-add="${attr(p.sku)}">${icon('cart', 'ico--sm')}${cta.label}</button>` : `<a class="btn ${cta.kind === 'quote' ? 'btn--dark' : 'btn--outline'} btn--sm" href="${cta.kind === 'quote' ? url(rel, 'pages/contact#quote') + '?sku=' + encodeURIComponent(p.sku) : url(rel, p.handle)}">${cta.label}</a>`}
  </div>
 </div>
</article>`;
}
export function categoryCard(rel, c, i = 0) {
  return `<a class="ccard" href="${url(rel, c.handle)}" data-tilt style="--i:${i}">
 <span class="ccard__icon">${icon(c.icon)}</span>
 <span class="ccard__body"><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p></span>
 <span class="ccard__cta">Shop ${icon('arrow-right', 'ico--sm')}</span>
</a>`;
}
export function tradeCard(rel, t) {
  return `<a class="tcard" href="${url(rel, t.handle)}" data-tilt>
 <span class="tcard__icon">${icon(t.icon)}</span>
 <h3>${esc(t.name)}</h3>
 <ul>${t.needs.slice(0, 3).map((n) => `<li>${icon('check', 'ico--sm')}${esc(n)}</li>`).join('')}</ul>
 <span class="tcard__cta">Tools for ${esc(t.short.toLowerCase())} ${icon('arrow-right', 'ico--sm')}</span>
</a>`;
}
export function locationCard(rel, l, opts = {}) {
  return `<article class="lcard" id="loc-${l.id}">
 <div class="lcard__head"><span class="lcard__pin">${icon('pin')}</span><div><p class="eyebrow">${l.id === 'houston' ? 'Flagship store · Repair center' : 'Store · Rental desk'}</p><h3>${esc(l.name)}</h3></div></div>
 <address><p>${esc(l.streetAddress)}<br>${esc(l.addressLocality)}, ${l.addressRegion} ${l.postalCode}</p></address>
 <ul class="lcard__facts"><li>${icon('phone')}<a href="tel:${l.phoneE164}" data-track="${l.trackEvent}">${esc(l.phone)}</a></li><li>${icon('clock')}${esc(l.hours)}</li><li>${icon('store')}Same-day will-call pickup</li></ul>
 <div class="lcard__cta"><a class="btn btn--primary" href="tel:${l.phoneE164}" data-track="${l.trackEvent}">${icon('phone', 'ico--sm')}Call ${esc(l.shortName)}</a><a class="btn btn--outline" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.mapQuery)}" target="_blank" rel="noopener">Directions ${icon('external', 'ico--sm')}</a>${opts.detail ? `<a class="lcard__more" href="${url(rel, l.handle)}">Store details ${icon('arrow-right', 'ico--sm')}</a>` : ''}</div>
</article>`;
}
export function faq(items, cls = '') {
  return `<div class="faq ${cls}">${items.map((f, i) => `<details class="faq__item"${i === 0 ? ' open' : ''}><summary><span>${esc(f.q)}</span>${icon('chevron-down')}</summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join('')}</div>`;
}
export function blogCard(rel, post) {
  const d = new Date(post.date + 'T00:00:00Z');
  const ds = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  return `<article class="bcard">
 <a class="bcard__media" href="${site.domain}/blogs/news/${post.slug}" aria-hidden="true" tabindex="-1"><span class="bcard__tag">${esc(post.tag)}</span></a>
 <div class="bcard__body"><p class="bcard__meta"><time datetime="${post.date}">${ds}</time> · ${post.minutes} min read</p><h3><a href="${site.domain}/blogs/news/${post.slug}">${esc(post.title)}</a></h3><p>${esc(post.excerpt)}</p><a class="textlink" href="${site.domain}/blogs/news/${post.slug}">Read article ${icon('arrow-right', 'ico--sm')}</a></div>
</article>`;
}
export function ctaBand(rel, { title, copy, primary, secondary }) {
  return `<section class="cta-band"><div class="wrap cta-band__row">
 <div><h2>${title}</h2><p>${copy}</p></div>
 <div class="cta-band__actions"><a class="btn btn--primary btn--lg" href="${url(rel, primary.href)}">${primary.label} ${icon('arrow-right', 'ico--sm')}</a>${secondary ? `<a class="btn btn--ghost btn--lg" href="${secondary.href.startsWith('tel:') ? secondary.href : url(rel, secondary.href)}"${secondary.track ? ` data-track="${secondary.track}"` : ''}>${secondary.label}</a>` : ''}</div>
</div></section>`;
}
export function brandStrip(rel) {
  return `<section class="brands-strip" aria-label="Authorized brands"><div class="wrap brands-strip__row">
 <p class="brands-strip__label">${icon('shield')}Authorized dealer for</p>
 <ul class="brands-strip__list">${brands.map((b) => `<li><a class="brandmark brandmark--${b.id}" href="${url(rel, b.handle)}">${esc(b.name)}<sup>${b.mark}</sup></a></li>`).join('')}${otherBrands.slice(0, 5).map((n) => `<li><span class="brandmark">${esc(n)}<sup>®</sup></span></li>`).join('')}<li><a class="brandmark brandmark--more" href="${url(rel, 'collections')}#brands">+ more</a></li></ul>
</div></section>`;
}
export function form(rel, { id = 'contact-form', type = 'General inquiry', types = ['General inquiry', 'Request a quote', 'Repair request', 'Rental request', 'Open a contractor account'], sku = '' } = {}) {
  return `<form class="form" id="${id}" action="${site.formEndpoint}" method="POST" data-lead-form novalidate>
 <input type="hidden" name="_subject" value="Tool Mart website lead">
 <input type="text" name="_gotcha" class="sr-only" tabindex="-1" autocomplete="off" aria-hidden="true">
 <div class="form__grid">
  <label class="field field--full"><span>What can we help with?</span><select name="request_type" data-default="${attr(type)}">${types.map((t) => `<option${t === type ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></label>
  <label class="field"><span>Full name <em>*</em></span><input type="text" name="name" required autocomplete="name"></label>
  <label class="field"><span>Company</span><input type="text" name="company" autocomplete="organization"></label>
  <label class="field"><span>Phone <em>*</em></span><input type="tel" name="phone" required autocomplete="tel" inputmode="tel"></label>
  <label class="field"><span>Email <em>*</em></span><input type="email" name="email" required autocomplete="email"></label>
  <label class="field"><span>Preferred store</span><select name="store"><option>Houston (Missouri City)</option><option>San Antonio</option><option>Either / ship to me</option></select></label>
  <label class="field"><span>Product / SKU / model</span><input type="text" name="sku" value="${attr(sku)}" placeholder="e.g. RIDGID 1224 (26092)" data-sku-field></label>
  <label class="field field--full"><span>Details <em>*</em></span><textarea name="message" rows="4" required placeholder="Quantity, job details, tool issue, rental dates…"></textarea></label>
 </div>
 <div class="form__foot"><button class="btn btn--primary btn--lg" type="submit">Send request ${icon('arrow-right', 'ico--sm')}</button><p class="form__note">We reply within one business day. Or call <a href="tel:${locations[0].phoneE164}" data-track="houston_call_click">${esc(locations[0].phone)}</a>.</p></div>
 <p class="form__msg" role="status" aria-live="polite"></p>
</form>`;
}
export function texasMap(rel) {
  // Simplified Texas outline (equirectangular approximation) with the two store pins.
  return `<div class="txmap" aria-hidden="true">
<svg viewBox="0 0 380 420" class="txmap__svg">
 <defs><linearGradient id="txg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#2A3340"/><stop offset="1" stop-color="#151A21"/></linearGradient>
 <radialGradient id="pg"><stop offset="0" stop-color="#F26A1B" stop-opacity=".55"/><stop offset="1" stop-color="#F26A1B" stop-opacity="0"/></radialGradient></defs>
 <path class="txmap__shape" d="M114 10 L192 10 L192 80 L283 106 L335 117 L346 120 L346 176 L358 201 L354 238 L351 260 L329 271 L316 290 L283 312 L264 338 L259 378 L259 400 L236 393 L205 341 L179 297 L168 273 L150 256 L129 256 L111 286 L90 275 L77 264 L62 227 L41 205 L20 183 L20 176 L112 176 L114 10 Z" fill="url(#txg)" stroke="#5B6675" stroke-width="1.2" stroke-linejoin="round"/>
 <path d="M233 266 L308 264" stroke="#F26A1B" stroke-width="1.5" stroke-dasharray="4 5" opacity=".7"/>
 <g class="txmap__pin" data-loc="houston" transform="translate(308 264)"><circle r="26" fill="url(#pg)" class="txmap__pulse"/><circle r="6" fill="#F26A1B" stroke="#fff" stroke-width="2"/><text x="10" y="-8" class="txmap__label">Houston</text></g>
 <g class="txmap__pin" data-loc="san-antonio" transform="translate(233 266)"><circle r="26" fill="url(#pg)" class="txmap__pulse"/><circle r="6" fill="#F26A1B" stroke="#fff" stroke-width="2"/><text x="-14" y="24" class="txmap__label">San Antonio</text></g>
</svg></div>`;
}
