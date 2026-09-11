#!/usr/bin/env node
// Static build for the Tool Mart redesign. Usage: node toolmart/_build/build.mjs
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, locations, brands, categories, trades, products, posts } from './data.mjs';
import { placeholderSvg } from './icons.mjs';
import * as P from './pages.mjs';
import { abs } from './components.mjs';

const ROOT = process.env.OUT_DIR || join(dirname(fileURLToPath(import.meta.url)), '..');
const write = (rel, content) => { const f = join(ROOT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); return rel; };

const pages = [
  P.home(), P.collectionsHub(), P.rentalsCollection(),
  ...brands.map((b) => P.brandPage(b)),
  ...categories.map((c) => P.categoryPage(c)),
  ...products.map((p) => P.productPage(p)),
  P.repairPage(), P.rentalPage(), P.tradesHub(),
  ...trades.map((t) => P.tradePage(t)),
  ...locations.map((l) => P.locationPage(l)),
  P.aboutPage(), P.contactPage(), P.promotionsPage(), P.blogIndex(), P.blogPost(posts[0]), P.notFound(),
];
const written = pages.map((pg) => write(pg.path, pg.html));

// Placeholder product artwork
const imgs = new Set(products.map((p) => p.img));
['threader', 'drive', 'dies', 'vise', 'oiler', 'battery', 'saw', 'drill', 'press', 'bender', 'puller', 'punch', 'reel', 'hydraulic', 'camera', 'wrench'].forEach((n) => imgs.add(n));
imgs.forEach((n) => write('assets/img/products/' + n + '.svg', placeholderSvg(n)));

// Favicon / logo marks
const mark = (bg = '#F26A1B', fg = '#0E1116') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24 3l18 10.5v21L24 45 6 34.5v-21L24 3z" fill="${bg}"/><path d="M24 9l12.9 7.5v15L24 39l-12.9-7.5v-15L24 9z" fill="${fg}"/><path d="M17 31l7.5-7.5a4.2 4.2 0 0 1 5.4-5.4l-2.6 2.6 1.9 1.9 2.6-2.6a4.2 4.2 0 0 1-5.4 5.4L19 33z" fill="#fff"/></svg>`;
write('assets/img/favicon.svg', mark());
write('assets/img/logo-mark.svg', mark());

// Search index (client-side quick search)
write('assets/data/search-index.json', JSON.stringify({
  products: products.map((p) => ({ t: p.title, s: p.sku, b: p.brand, c: categories.find((c) => c.id === p.category)?.name, u: p.handle, p: p.price, i: p.img })),
  pages: [
    ...categories.map((c) => ({ t: c.name, u: c.handle, k: 'Category' })),
    ...brands.map((b) => ({ t: b.name + ' tools', u: b.handle, k: 'Brand' })),
    ...trades.map((t) => ({ t: t.name, u: t.handle, k: 'Trade' })),
    { t: 'Tool repair service', u: 'pages/toolmarts-repair', k: 'Service' }, { t: 'Equipment rental', u: 'pages/toolmarts-rental', k: 'Service' },
    { t: 'Rental equipment list', u: 'collections/rentals', k: 'Rentals' }, { t: 'Promotions', u: 'pages/promotion', k: 'Deals' },
    ...locations.map((l) => ({ t: l.name, u: l.handle, k: 'Store' })), { t: 'Contact & quotes', u: 'pages/contact', k: 'Contact' },
  ],
}));

// Web manifest
write('site.webmanifest', JSON.stringify({ name: 'Tool Mart', short_name: 'Tool Mart', start_url: './', display: 'standalone', background_color: '#0E1116', theme_color: '#0E1116', icons: [{ src: 'assets/img/favicon.svg', sizes: 'any', type: 'image/svg+xml' }] }, null, 1));

// robots.txt / sitemap.xml / llms.txt (production URLs)
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /checkout\nDisallow: /account\nDisallow: /search\nDisallow: /*?sku=\nDisallow: /*?type=\n\nSitemap: ${site.domain}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
const prio = (h) => h === '' ? '1.0' : /^(pages\/toolmarts|collections\/(ridgid|milwaukee|greenlee|dewalt|pipe-threading))/.test(h) ? '0.9' : /^products\//.test(h) ? '0.7' : '0.8';
const smUrls = pages.filter((pg) => pg.path !== '404.html').map((pg) => { const h = pg.path.replace(/\/?index\.html$/, ''); return `  <url><loc>${abs(h)}</loc><lastmod>${today}</lastmod><changefreq>${h.startsWith('products/') ? 'weekly' : 'monthly'}</changefreq><priority>${prio(h)}</priority></url>`; });
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${smUrls.join('\n')}\n</urlset>\n`);
write('llms.txt', `# Tool Mart

> Tool Mart, Inc. is a family-owned industrial tool supplier founded in Houston, Texas in 1976. Factory-authorized dealer for RIDGID, Greenlee, Milwaukee and DeWALT; factory-authorized RIDGID and Greenlee repair center; daily/weekly/monthly equipment rental. Two stores: Houston (13721 S. Gessner Rd, Suite 200, Missouri City, TX 77489, +1-713-222-8665) and San Antonio (10568 Sentinel St, San Antonio, TX 78217, +1-210-655-6116). Hours Mon–Fri 7:30 AM–5:00 PM CT. Email info@toolmarthou.com.

## Shop
${categories.map((c) => `- [${c.name}](${abs(c.handle)}): ${c.blurb}`).join('\n')}
- [Rental equipment](${abs('collections/rentals')}): threaders, drain machines, cameras, press tools, benders — rates quoted per job.

## Brands (authorized dealer)
${brands.map((b) => `- [${b.name}](${abs(b.handle)}): ${b.authorized}`).join('\n')}

## Services
- [Tool repair](${abs('pages/toolmarts-repair')}): factory-authorized RIDGID & Greenlee repair with OEM parts; written quote after bench inspection; most repairs in a few business days.
- [Equipment rental](${abs('pages/toolmarts-rental')}): daily, weekly, monthly; refundable deposit.
- [Request a quote](${abs('pages/contact#quote')}): same-day quotes on the full manufacturer lines; contractor accounts with PO ordering.

## Trades
${trades.map((t) => `- [${t.name}](${abs(t.handle)})`).join('\n')}

## Locations
${locations.map((l) => `- [${l.name}](${abs(l.handle)}): ${l.streetAddress}, ${l.addressLocality}, TX ${l.postalCode} · ${l.phone} · ${l.hours}`).join('\n')}

## Policies
- Prices on the site are USD list prices; items over $2,000 and rentals are quoted.
- Rentals never display a $0 price; contact the store for rates.
`);
write('.nojekyll', '');
console.log(`Built ${written.length} pages + assets into ${ROOT}`);
