import { site, locations, brands, otherBrands, categories, trades, products, rentals, repairFaq, rentalFaq, posts, promotions } from './data.mjs';
import { icon } from './icons.mjs';
import { esc, attr, url, abs, asset, money, ctaFor, brandOf, brandLabel, catOf, layout, sectionHead, breadcrumbs, productCard, categoryCard, tradeCard, locationCard, faq, blogCard, ctaBand, brandStrip, form, texasMap,
  storeSchema, websiteSchema, faqSchema, serviceSchema, productSchema, itemListSchema, articleSchema } from './components.mjs';

const relFor = (handle) => handle ? '../'.repeat(handle.split('/').length) : '';
const featured = ['RID26092', 'MIL48-11-1852', 'GRN555RSC', 'RID93287', 'MIL2874-22HD', 'MIL3697-22', 'GRN1800', 'RID36273'].map((s) => products.find((p) => p.sku === s));
const byBrand = (id) => products.filter((p) => p.brand === id);
const byCat = (id) => products.filter((p) => p.category === id);
const H = (handle) => ({ handle, rel: relFor(handle) });

/* ---------------- HOME ---------------- */
export function home() {
  const { handle, rel } = H('');
  const body = `
<section class="hero" id="hero">
 <div class="hero__bg" aria-hidden="true"><canvas id="hero-canvas" class="hero__canvas"></canvas><div class="hero__glow"></div><div class="hero__grid"></div></div>
 <div class="wrap hero__layout">
  <div class="hero__copy">
   <p class="eyebrow eyebrow--light reveal">${icon('pin', 'ico--sm')}Houston · San Antonio · Factory-authorized since 1976</p>
   <h1 class="reveal">Industrial tools, certified repair &amp; rental for Texas trades</h1>
   <p class="lead reveal">Factory-authorized RIDGID<sup>®</sup>, Greenlee<sup>®</sup>, Milwaukee<sup>®</sup> and DeWALT<sup>®</sup> dealer with a certified repair shop and rental desk — 400+ pro-grade tools in stock for same-day pickup at two Texas stores.</p>
   <div class="hero__cta reveal">
    <a class="btn btn--primary btn--lg" href="${url(rel, 'collections')}">Shop tools ${icon('arrow-right', 'ico--sm')}</a>
    <a class="btn btn--ghost btn--lg" href="${url(rel, 'products/ridgid-1224-pipe-threading-machine-26092')}">${icon('cube', 'ico--sm')}Explore the RIDGID 1224 in 3D</a>
   </div>
   <ul class="hero__trust reveal">
    <li>${icon('shield')}Authorized RIDGID<sup>®</sup> &amp; Greenlee<sup>®</sup> repair center</li>
    <li>${icon('store')}Same-day will-call pickup at both stores</li>
    <li>${icon('account')}Contractor accounts &amp; PO ordering</li>
   </ul>
  </div>
  <div class="hero__stage" aria-hidden="true">
   <div class="hero__chip hero__chip--1"><b>OEM</b>Genuine parts only</div>
   <div class="hero__chip hero__chip--2"><b>1/2"–4"</b>Threading in stock</div>
   <div class="hero__chip hero__chip--3"><b>50 yrs</b>Family-owned</div>
   <p class="hero__hint">${icon('rotate', 'ico--sm')}Drag to rotate</p>
  </div>
 </div>
 <div class="hero__stats"><div class="wrap hero__stats-row">
  <div><b data-count="1976">1976</b><span>Founded in Houston</span></div>
  <div><b><span data-count="400">400</span>+</b><span>Pro tools in stock</span></div>
  <div><b data-count="2">2</b><span>Texas stores</span></div>
  <div><b data-count="4">4</b><span>Factory-authorized brands</span></div>
 </div></div>
</section>

${brandStrip(rel)}

<section class="section section--paper" id="categories">
 <div class="wrap">
  ${sectionHead('Shop by category', 'Built for the way trades actually buy', 'Threading, bending, pressing, drilling — organized the way your crews think about the job, not the way a catalog does.')}
  <div class="ccard-grid">${categories.map((c, i) => categoryCard(rel, c, i)).join('')}</div>
 </div>
</section>

<section class="section" id="featured">
 <div class="wrap">
  <div class="section-head section-head--row">
   <div><p class="eyebrow">Contractor favorites</p><h2>Most-ordered by Texas crews</h2></div>
   <a class="textlink" href="${url(rel, 'collections/all-products')}">View all products ${icon('arrow-right', 'ico--sm')}</a>
  </div>
  <div class="pgrid">${featured.map((p) => productCard(rel, p)).join('')}</div>
  <p class="fineprint">Prices are list prices in USD and may change with manufacturer updates. Contractor account pricing available. Items over $2,000 are quoted to confirm freight and lead time.</p>
 </div>
</section>

<section class="section section--steel" id="services">
 <div class="wrap">
  ${sectionHead('Beyond the sale', 'We keep your tools running', 'Buying the tool is the easy part. Our certified shop and rental desk are why contractors have stayed with Tool Mart for fifty years.', 'section-head--light')}
  <div class="svc-grid">
   <article class="svc" data-tilt>
    <div class="svc__icon">${icon('wrench')}</div>
    <p class="eyebrow eyebrow--accent">Factory-authorized repair</p>
    <h3>RIDGID<sup>®</sup> &amp; Greenlee<sup>®</sup> certified repair center</h3>
    <p>Threading machines, drain machines, SeeSnake<sup>®</sup> cameras, press tools, benders and pullers — repaired to manufacturer spec with genuine OEM parts, so your warranty stays intact.</p>
    <ol class="svc__steps"><li>Call or walk in — no appointment</li><li>Bench inspection &amp; written quote</li><li>Repair with OEM parts</li><li>Pay at pickup or by PO</li></ol>
    <a class="btn btn--primary" href="${url(rel, 'pages/toolmarts-repair')}">Repair services ${icon('arrow-right', 'ico--sm')}</a>
   </article>
   <article class="svc" data-tilt>
    <div class="svc__icon">${icon('calendar')}</div>
    <p class="eyebrow eyebrow--accent">Daily · Weekly · Monthly</p>
    <h3>Professional equipment rental</h3>
    <p>Threaders, drain cleaners, inspection cameras, press tools and conduit benders — well-maintained, ready to run, and matched to your job by people who know the trades.</p>
    <ul class="svc__list">${rentals.slice(0, 4).map((r) => `<li>${icon('check', 'ico--sm')}${esc(r.name)}</li>`).join('')}</ul>
    <a class="btn btn--light" href="${url(rel, 'pages/toolmarts-rental')}">Rental equipment ${icon('arrow-right', 'ico--sm')}</a>
   </article>
  </div>
 </div>
</section>

<section class="section section--paper" id="trades">
 <div class="wrap">
  <div class="section-head section-head--row">
   <div><p class="eyebrow">Shop by trade</p><h2>Your trade, your tool list</h2></div>
   <a class="textlink" href="${url(rel, 'pages/jobs-contractors')}">All trades ${icon('arrow-right', 'ico--sm')}</a>
  </div>
  <div class="tcard-grid">${trades.map((t) => tradeCard(rel, t)).join('')}</div>
 </div>
</section>

<section class="section section--ink" id="why">
 <div class="wrap why__grid">
  <div class="why__copy">
   <p class="eyebrow eyebrow--accent">Why Tool Mart</p>
   <h2>Fifty years of getting contractors the right tool, at the right price</h2>
   <p>Norman Soutar opened Tool Mart in Houston in 1976 with a simple promise: sell the tools the trades really use, service them properly, and treat every contractor like a partner. Two stores and five decades later, that is still how we run the counter.</p>
   <a class="btn btn--ghost" href="${url(rel, 'pages/about-us')}">Our story ${icon('arrow-right', 'ico--sm')}</a>
  </div>
  <ul class="why__list">
   <li>${icon('shield')}<div><h3>Factory-authorized, warranty intact</h3><p>Every tool ships with full manufacturer warranty. We are listed on RIDGID<sup>®</sup>’s official Where-to-Buy distributor search.</p></div></li>
   <li>${icon('account')}<div><h3>People who know the trades</h3><p>Electricians, plumbers, HVAC and mechanical crews get matched to the right tool — not upsold to the wrong one.</p></div></li>
   <li>${icon('store')}<div><h3>Stocked locally, picked up today</h3><p>400+ tools on the shelf in Houston and San Antonio. Will-call pickup, PO ordering and delivery on request.</p></div></li>
   <li>${icon('wrench')}<div><h3>Service after the sale</h3><p>Certified repair shop, genuine OEM parts and a rental desk to cover you while your tool is on the bench.</p></div></li>
  </ul>
 </div>
</section>

<section class="section" id="locations">
 <div class="wrap">
  ${sectionHead('Two Texas stores', 'Real stores. Real people.', 'Walk in, call the counter, or order online for same-day will-call pickup.')}
  <div class="loc-grid">
   ${texasMap(rel)}
   <div class="loc-cards">${locations.map((l) => locationCard(rel, l, { detail: true })).join('')}</div>
  </div>
 </div>
</section>

<section class="section section--paper" id="promos">
 <div class="wrap">
  <div class="section-head section-head--row">
   <div><p class="eyebrow">Promotions</p><h2>Current deals &amp; programs</h2></div>
   <a class="textlink" href="${url(rel, 'pages/promotion')}">All promotions ${icon('arrow-right', 'ico--sm')}</a>
  </div>
  <div class="promo-grid">${promotions.map((pr) => `<article class="promo" data-tilt><span class="promo__tag">${icon('tag', 'ico--sm')}${esc(pr.tag)}</span><h3>${pr.title}</h3><p>${pr.copy}</p><a class="textlink" href="${url(rel, pr.href)}">${esc(pr.cta)} ${icon('arrow-right', 'ico--sm')}</a></article>`).join('')}</div>
 </div>
</section>

<section class="section" id="blog">
 <div class="wrap">
  <div class="section-head section-head--row">
   <div><p class="eyebrow">From the blog</p><h2>Guides for the jobsite</h2></div>
   <a class="textlink" href="${url(rel, 'blogs/news')}">All articles ${icon('arrow-right', 'ico--sm')}</a>
  </div>
  <div class="bgrid">${posts.slice(0, 3).map((p) => blogCard(rel, p)).join('')}</div>
 </div>
</section>

${ctaBand(rel, { title: 'Need a quote, a repair or a rental today?', copy: 'Talk to the counter team in Houston or San Antonio — or send us the SKU and we will reply within one business day.', primary: { label: 'Request a quote', href: 'pages/contact#quote' }, secondary: { label: 'Call (713) 222-8665', href: 'tel:+17132228665', track: 'houston_call_click' } })}`;

  return { path: 'index.html', html: layout({ rel, handle, title: 'Industrial Tools Houston & San Antonio | Tool Mart',
    description: 'Factory-authorized RIDGID®, Greenlee®, Milwaukee® & DeWALT® dealer since 1976. Tool sales, certified repair and rentals in Houston & San Antonio.',
    body, bodyClass: 'page-home', scripts: ['js/hero3d.js'], schema: [websiteSchema(), ...locations.map((l) => storeSchema(l, true))] }) };
}

/* ---------------- COLLECTIONS HUB ---------------- */
export function collectionsHub() {
  const { handle, rel } = H('collections');
  const body = `
${pageHero(rel, { crumbs: [{ name: 'Home', handle: '' }, { name: 'Shop', handle }], eyebrow: 'Shop Tool Mart', h1: 'Industrial &amp; power tools by category', lead: 'Category-first navigation for high-volume searches, trade pages for the long tail — the same structure our SEO roadmap ranks on. Every item is stocked or ordered by an authorized dealer with full manufacturer warranty.' })}
<section class="section"><div class="wrap"><div class="ccard-grid">${categories.map((c, i) => categoryCard(rel, c, i)).join('')}<a class="ccard ccard--accent" href="${url(rel, 'collections/rentals')}" data-tilt><span class="ccard__icon">${icon('calendar')}</span><span class="ccard__body"><h3>Rental equipment</h3><p>Threaders, drain machines, cameras, press tools and benders by the day, week or month.</p></span><span class="ccard__cta">Rent ${icon('arrow-right', 'ico--sm')}</span></a></div></div></section>
<section class="section section--paper" id="brands"><div class="wrap">
 ${sectionHead('Shop by brand', 'Authorized for the brands the trades trust')}
 <div class="brandtile-grid">${brands.map((b) => `<a class="brandtile brandtile--${b.id}" href="${url(rel, b.handle)}" data-tilt><span class="brandtile__name">${esc(b.name)}<sup>${b.mark}</sup></span><span class="brandtile__auth">${icon('shield', 'ico--sm')}${esc(b.authorized)}</span><span class="brandtile__cta">Shop ${esc(b.name)} ${icon('arrow-right', 'ico--sm')}</span></a>`).join('')}</div>
 <p class="brands-more"><strong>Also in stock:</strong> ${otherBrands.map((n) => esc(n) + '<sup>®</sup>').join(' · ')} — <a href="${url(rel, 'pages/contact#quote')}">ask us about any SKU</a>.</p>
</div></section>
<section class="section"><div class="wrap">
 <div class="section-head section-head--row"><div><p class="eyebrow">Shop by trade</p><h2>Curated for your crew</h2></div><a class="textlink" href="${url(rel, 'pages/jobs-contractors')}">All trades ${icon('arrow-right', 'ico--sm')}</a></div>
 <div class="tcard-grid">${trades.map((t) => tradeCard(rel, t)).join('')}</div>
</div></section>
<section class="section section--paper"><div class="wrap">
 <div class="section-head section-head--row"><div><p class="eyebrow">Best sellers</p><h2>Most-ordered right now</h2></div></div>
 <div class="pgrid">${featured.map((p) => productCard(rel, p)).join('')}</div>
</div></section>
${ctaBand(rel, { title: 'Can’t find a catalog number?', copy: 'We stock and order thousands more SKUs than we list online. Send us the part number and we will quote it — usually the same day.', primary: { label: 'Request a quote', href: 'pages/contact#quote' } })}`;
  return { path: 'collections/index.html', html: layout({ rel, handle, title: 'Shop Industrial & Power Tools by Category | Tool Mart',
    description: 'Pipe threading, cordless power tools, benders, press tools, drain cleaning, hydraulics and hand tools — authorized dealer in Houston & San Antonio.',
    body, breadcrumbs: [{ name: 'Home', handle: '' }, { name: 'Shop', handle }], schema: [{ '@type': 'CollectionPage', name: 'Shop by category', url: abs(handle) }] }) };
}

/* ---------------- BRAND COLLECTION ---------------- */
export function brandPage(b) {
  const { handle, rel } = H(b.handle);
  const items = byBrand(b.id);
  const cats = b.categories.map((id) => catOf(id));
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Shop', handle: 'collections' }, { name: b.name, handle }];
  const body = `
${pageHero(rel, { crumbs, eyebrow: `${icon('shield', 'ico--sm')}${esc(b.authorized)}`, h1: b.h1, lead: b.intro, cls: `hero--brand hero--${b.id}`, aside: `<ul class="hero__facts">${b.highlights.map((h) => `<li>${icon('check', 'ico--sm')}${h}</li>`).join('')}</ul>` })}
<section class="section"><div class="wrap">
 <div class="chips" aria-label="Categories in this brand">${cats.map((c) => `<a class="chip" href="${url(rel, c.handle)}">${icon(c.icon, 'ico--sm')}${esc(c.name)}</a>`).join('')}</div>
 <div class="section-head section-head--row"><div><p class="eyebrow">${esc(b.name)} best sellers</p><h2>Top ${esc(b.name)}<sup>${b.mark}</sup> SKUs in Houston &amp; San Antonio</h2></div><span class="count">${items.length} shown · full catalog in store</span></div>
 ${items.length ? `<div class="pgrid">${items.map((p) => productCard(rel, p)).join('')}</div>` : `<p class="empty">${esc(b.name)} inventory is listed in store and quoted daily — <a href="${url(rel, 'pages/contact#quote')}">request a quote</a>.</p>`}
</div></section>
${(b.id === 'ridgid' || b.id === 'greenlee') ? `<section class="section section--steel"><div class="wrap svc-inline">
 <div class="svc__icon">${icon('wrench')}</div>
 <div><p class="eyebrow eyebrow--accent">Authorized service</p><h2>${esc(b.name)}<sup>${b.mark}</sup> repair, done to spec</h2><p>Tool Mart Houston is a factory-authorized ${esc(b.name)} repair center. Genuine OEM parts, certified technicians and a written quote before any work — so your warranty stays intact.</p></div>
 <a class="btn btn--primary" href="${url(rel, 'pages/toolmarts-repair')}">Repair services ${icon('arrow-right', 'ico--sm')}</a>
</div></section>` : ''}
${ctaBand(rel, { title: `Need a ${esc(b.name)} catalog number we don’t list yet?`, copy: 'We order the full line. Send the part number and quantity for same-day pricing, or call the counter.', primary: { label: 'Request a quote', href: 'pages/contact#quote' }, secondary: { label: 'Call Houston', href: 'tel:+17132228665', track: 'houston_call_click' } })}`;
  return { path: b.handle + '/index.html', html: layout({ rel, handle, title: b.title, description: b.description, body, breadcrumbs: crumbs, bodyClass: 'page-brand',
    schema: [{ '@type': 'CollectionPage', name: b.h1.replace(/<[^>]+>/g, ''), url: abs(handle) }, itemListSchema(b.name + ' products', items)] }) };
}

/* ---------------- CATEGORY COLLECTION ---------------- */
const catSeo = {
  'pipe-threading': { title: 'Pipe Threading Machines Houston | RIDGID 1224, 535, 300', h1: 'Pipe threading machines &amp; plumbing tools in Houston', description: 'Buy or rent RIDGID® pipe threading machines in Houston & San Antonio — 1224, 535, 300, 700 power drives, dies and vises from a factory-authorized dealer.',
    intro: 'Tool Mart is the Houston-area source for RIDGID® threading equipment — machines, power drives, die heads, dies, oil and support. Buy new with full warranty, rent by the day, week or month, or bring your machine to our authorized repair shop.',
    faq: [{ q: 'Which RIDGID threading machine do I need?', a: 'For 1/2"–2" production threading choose the 535; for portable field threading the 700 Power Drive with 12-R die heads; for 2-1/2"–4" pipe the 1224. Our counter team will size the machine to your pipe schedule and volume.' }, { q: 'Can I rent a pipe threading machine in Houston?', a: 'Yes. Tool Mart rents RIDGID 300, 535 and 1224 threading machines and 700 power drives by the day, week or month from both stores, with a refundable deposit.' }, { q: 'Do you stock replacement dies and parts?', a: 'Yes — genuine RIDGID high-speed and alloy dies, 811A/815A die heads, cutter wheels, reamers and Nu-Clear thread cutting oil are in stock for same-day pickup.' }] },
  'cordless-power-tools': { title: 'Cordless Power Tools Houston | Milwaukee M18 & DeWALT 20V', h1: 'Cordless power tools in Houston &amp; San Antonio', description: 'Milwaukee® M18 FUEL™ and DeWALT® 20V MAX* cordless drills, band saws, rotary hammers and combo kits from an authorized dealer in Houston & San Antonio.', intro: 'Authorized Milwaukee® and DeWALT® dealer with the cordless platforms Texas crews standardize on — kits, bare tools, batteries and chargers in stock.', faq: [] },
  'benders-pullers-knockouts': { title: 'Conduit Benders & Cable Pullers Houston | Greenlee Dealer', h1: 'Conduit benders, cable pullers &amp; knockout tools', description: 'Greenlee® 555 and 1800 conduit benders, UT10 cable pullers, Slug-Buster® knockout sets and reel stands for Houston & San Antonio electricians.', intro: 'Electrical contractors have bought and serviced Greenlee® at Tool Mart for fifty years. Benders, shoe groups, pullers, punches and reel stands — in stock, with authorized repair behind them.', faq: [] },
  'press-crimp': { title: 'Press Tools & Crimpers Houston | Milwaukee FORCE LOGIC', h1: 'Press, crimp &amp; cutting tools', description: 'Milwaukee® M18 FORCE LOGIC™ press tools, 12-ton crimpers, cable cutters, jaws and die kits for mechanical and utility contractors in Houston & San Antonio.', intro: 'Faster press cycles, documented crimps and jaws for copper, stainless and carbon steel — from authorized Milwaukee® and Greenlee® dealer Tool Mart.', faq: [] },
  'drain-inspection': { title: 'Drain Cleaning Machines & SeeSnake Cameras Houston', h1: 'Drain cleaning &amp; inspection equipment', description: 'RIDGID® drum and sectional drain cleaning machines, SeeSnake® camera reels and locators for Houston & San Antonio plumbers. Buy, rent or repair.', intro: 'Service plumbers rely on RIDGID® drain machines and SeeSnake® inspection systems — Tool Mart stocks, rents and repairs them as an authorized RIDGID center.', faq: [] },
  'hydraulic': { title: 'Enerpac Hydraulic Tools Houston | Cylinders & Pumps', h1: 'Enerpac<sup>®</sup> hydraulic tools', description: 'Enerpac® hydraulic cylinders, hand pumps, punches, hoses and couplers for industrial maintenance in Houston & San Antonio from Tool Mart.', intro: 'High-pressure hydraulics for maintenance, fabrication and rigging — Enerpac® cylinders, pumps, punch sets and accessories with same-day pickup.', faq: [] },
  'hand-tools': { title: 'Hand Tools Houston | Klein, Channellock, Proto, Starrett', h1: 'Hand tools &amp; precision measuring', description: 'Klein Tools®, Channellock®, Proto® and Starrett® hand tools, pliers, wrenches, levels and precision measuring tools in Houston & San Antonio.', intro: 'The hand tools that live in every truck — from lineman’s pliers to precision calipers — stocked by brand and trade.', faq: [] },
  'batteries-accessories': { title: 'Power Tool Batteries, Dies & Accessories | Tool Mart', h1: 'Batteries, dies &amp; accessories', description: 'Milwaukee® REDLITHIUM™ and DeWALT® 20V MAX* batteries, RIDGID® threading dies, blades, bits and OEM parts in Houston & San Antonio.', intro: 'Keep crews running: batteries, chargers, dies, blades, bits and genuine OEM replacement parts for the tools we sell and service.', faq: [] },
};
export function categoryPage(c) {
  const { handle, rel } = H(c.handle);
  const seo = catSeo[c.id];
  const items = byCat(c.id);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Shop', handle: 'collections' }, { name: c.name, handle }];
  const relTrades = trades.filter((t) => t.categories.includes(c.id));
  const body = `
${pageHero(rel, { crumbs, eyebrow: `${icon(c.icon, 'ico--sm')}${esc(c.name)}`, h1: seo.h1, lead: seo.intro })}
<section class="section"><div class="wrap">
 <div class="section-head section-head--row"><div><p class="eyebrow">In stock &amp; quoted daily</p><h2>${esc(c.name)}</h2></div><span class="count">${items.length} featured · <a href="${url(rel, 'pages/contact#quote')}">ask for the full list</a></span></div>
 ${items.length ? `<div class="pgrid">${items.map((p) => productCard(rel, p)).join('')}</div>` : `<p class="empty">This category is stocked in store and quoted daily. <a href="${url(rel, 'pages/contact#quote')}">Request a quote</a> or call the counter.</p>`}
</div></section>
${(c.id === 'pipe-threading' || c.id === 'drain-inspection' || c.id === 'press-crimp' || c.id === 'benders-pullers-knockouts') ? `<section class="section section--steel"><div class="wrap svc-inline"><div class="svc__icon">${icon('calendar')}</div><div><p class="eyebrow eyebrow--accent">Rent it instead</p><h2>Need it for one job?</h2><p>Daily, weekly and monthly rates on professional-grade ${esc(c.name.toLowerCase())} equipment from both Texas stores. Refundable deposit; our team sizes the machine to your job.</p></div><a class="btn btn--primary" href="${url(rel, 'pages/toolmarts-rental')}">Rental equipment ${icon('arrow-right', 'ico--sm')}</a></div></section>` : ''}
${relTrades.length ? `<section class="section section--paper"><div class="wrap">${sectionHead('Shop by trade', 'Built for these crews')}<div class="tcard-grid">${relTrades.map((t) => tradeCard(rel, t)).join('')}</div></div></section>` : ''}
${seo.faq.length ? `<section class="section"><div class="wrap wrap--narrow">${sectionHead('FAQ', esc(c.name) + ' questions')}${faq(seo.faq)}</div></section>` : ''}
${ctaBand(rel, { title: 'Send us the catalog number', copy: 'Same-day quotes on the full manufacturer line, contractor pricing and will-call pickup at both stores.', primary: { label: 'Request a quote', href: 'pages/contact#quote' } })}`;
  const schema = [{ '@type': 'CollectionPage', name: c.name, url: abs(handle) }, itemListSchema(c.name, items)];
  if (seo.faq.length) schema.push(faqSchema(seo.faq));
  return { path: c.handle + '/index.html', html: layout({ rel, handle, title: seo.title, description: seo.description, body, breadcrumbs: crumbs, schema }) };
}
export function rentalsCollection() {
  const handle = 'collections/rentals'; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Shop', handle: 'collections' }, { name: 'Rentals', handle }];
  const body = `
${pageHero(rel, { crumbs, eyebrow: `${icon('calendar', 'ico--sm')}Daily · Weekly · Monthly`, h1: 'Rental equipment', lead: 'Professional-grade threading, drain cleaning, inspection, pressing and bending equipment — rented by the day, week or month from Houston and San Antonio. Rates are quoted per job; no misleading $0 prices here.' })}
<section class="section"><div class="wrap"><div class="rgrid">${rentals.map((r) => rentalCard(rel, r)).join('')}</div></div></section>
${ctaBand(rel, { title: 'Reserve a machine', copy: 'Tell us the pipe size, material and dates. We confirm availability and rates within the hour during business hours.', primary: { label: 'Request rental rates', href: 'pages/contact#quote' }, secondary: { label: 'How rentals work', href: 'pages/toolmarts-rental' } })}`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: 'Tool Rental Houston & San Antonio | Rental Equipment List', description: 'Rent RIDGID® threaders, drain cleaners, SeeSnake® cameras, press tools and Greenlee® benders by the day, week or month in Houston & San Antonio.', body, breadcrumbs: crumbs, schema: [{ '@type': 'CollectionPage', name: 'Rental equipment', url: abs(handle) }] }) };
}
function rentalCard(rel, r) {
  return `<article class="rcard" data-tilt><div class="rcard__media"><img src="${asset(rel, 'img/products/' + r.img + '.svg')}" width="600" height="450" loading="lazy" alt="${attr(r.name)} available for rent at Tool Mart Houston and San Antonio"></div><div class="rcard__body"><h3>${r.name}</h3><p>${esc(r.use)}</p><p class="rcard__rates">${icon('calendar', 'ico--sm')}Daily · Weekly · Monthly rates</p><a class="btn btn--dark btn--sm" href="${url(rel, 'pages/contact#quote')}?type=rental&amp;sku=${encodeURIComponent(r.name.replace(/<[^>]+>/g, ''))}">Request rates</a></div></article>`;
}

/* ---------------- PRODUCT ---------------- */
const specsFor = (p) => {
  const base = [['SKU', p.sku], ['Catalog number', p.sku.replace(/^[A-Z]{3}/, '')], ['Brand', brandLabel(p)], ['Category', catOf(p.category)?.name], ['Condition', 'New — full manufacturer warranty'], ['Availability', p.stock === 'in' ? 'In stock — Houston & San Antonio' : 'Factory order — ask for lead time']];
  if (p.sku === 'RID26092') base.splice(4, 0, ['Pipe capacity', '1/2"–4" NPT (711 & 714 die heads)'], ['Power', '120V, 60 Hz'], ['Spindle speeds', '36 RPM (1/2"–2") · 12 RPM (2-1/2"–4")'], ['Included', 'Machine, 711 & 714 die heads, oil system, cutter, reamer']);
  return base;
};
export function productPage(p) {
  const { handle, rel } = H(p.handle);
  const b = brandOf(p); const bname = brandLabel(p); const c = catOf(p.category);
  const cta = ctaFor(p);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Shop', handle: 'collections' }, { name: c.name, handle: c.handle }, { name: p.title, handle }];
  const has3d = p.sku === 'RID26092';
  const related = products.filter((x) => x.category === p.category && x.sku !== p.sku).slice(0, 4);
  const img = asset(rel, 'img/products/' + p.img + '.svg');
  const alt = `${p.title} — ${bname} ${c.name} at Tool Mart Houston`;
  const body = `
<section class="pdp"><div class="wrap">
 ${breadcrumbs(rel, crumbs)}
 <div class="pdp__grid">
  <div class="pdp__gallery">
   ${has3d ? `<div class="viewer" id="viewer">
     <canvas id="product-canvas" class="viewer__canvas" data-model="" aria-label="Interactive 3D preview of the ${attr(p.title)}" role="img"></canvas>
     <img class="viewer__fallback" src="${img}" width="600" height="450" alt="${attr(alt)}">
     <div class="viewer__ui">
      <div class="viewer__views" role="group" aria-label="Camera views"><button type="button" class="chip chip--active" data-view="hero">Overview</button><button type="button" class="chip" data-view="diehead">Die head</button><button type="button" class="chip" data-view="chuck">Chuck &amp; carriage</button><button type="button" class="chip" data-view="top">Top</button></div>
      <p class="viewer__hint">${icon('rotate', 'ico--sm')}Drag to rotate · pinch or scroll to zoom</p>
      <span class="viewer__badge">${icon('cube', 'ico--sm')}3D preview · stylized model</span>
     </div>
    </div>` : `<figure class="gallery"><img src="${img}" width="600" height="450" alt="${attr(alt)}" fetchpriority="high"><figcaption class="sr-only">${esc(alt)}</figcaption></figure>`}
   <ul class="thumbs" aria-label="Product images">${[0, 1, 2].map((i) => `<li><button type="button" class="thumb${i === 0 ? ' thumb--active' : ''}" aria-label="Image ${i + 1}"><img src="${img}" width="120" height="90" alt="" loading="lazy"></button></li>`).join('')}</ul>
  </div>
  <div class="pdp__buy">
   <p class="pdp__brand">${b ? `<a href="${url(rel, b.handle)}">${esc(b.name)}<sup>${b.mark}</sup></a>` : esc(bname) + '<sup>®</sup>'} ${p.badge ? `<span class="pill">${esc(p.badge)}</span>` : ''}</p>
   <h1>${esc(p.title)}</h1>
   <p class="pdp__sku">SKU <b>${esc(p.sku)}</b> · Catalog No. <b>${esc(p.sku.replace(/^[A-Z]{3}/, ''))}</b></p>
   <div class="pdp__price">${p.price != null ? `<span class="price price--lg">${money(p.price)}</span><span class="pdp__pricenote">List price · contractor account pricing available</span>` : `<span class="price price--lg price--ask">Call for price</span><span class="pdp__pricenote">Quoted same day with current manufacturer pricing</span>`}</div>
   <p class="pdp__stock">${p.stock === 'in' ? `<span class="stock stock--in">${icon('check', 'ico--sm')}In stock</span> Houston &amp; San Antonio — same-day will-call pickup` : `<span class="stock stock--order">${icon('clock', 'ico--sm')}Factory order</span> Typical lead time confirmed on your quote`}</p>
   <div class="pdp__cta">
    ${cta.kind === 'cart' ? `<button class="btn btn--primary btn--lg" type="button" data-add="${attr(p.sku)}">${icon('cart', 'ico--sm')}Add to cart</button>` : `<a class="btn btn--primary btn--lg" href="${url(rel, 'pages/contact#quote')}?sku=${encodeURIComponent(p.sku)}">${icon('quote', 'ico--sm')}${cta.kind === 'quote' ? 'Request a quote' : 'Request pricing & availability'}</a>`}
    <a class="btn btn--outline btn--lg" href="tel:${locations[0].phoneE164}" data-track="houston_call_click">${icon('phone', 'ico--sm')}Call Houston</a>
   </div>
   <ul class="pdp__perks">
    <li>${icon('shield')}<span><b>Authorized dealer</b> — genuine ${esc(bname)} with full manufacturer warranty</span></li>
    <li>${icon('store')}<span><b>Pick up today</b> at Missouri City or San Antonio, or ship to your jobsite</span></li>
    <li>${icon('account')}<span><b>PO ordering</b> for contractor accounts · net terms on approval</span></li>
    ${(p.brand === 'ridgid' || p.brand === 'greenlee') ? `<li>${icon('wrench')}<span><b>Factory-authorized repair</b> in our Houston shop with OEM parts</span></li>` : ''}
   </ul>
  </div>
 </div>
 <div class="pdp__details">
  <div class="tabs" data-tabs>
   <div class="tabs__list" role="tablist"><button role="tab" aria-selected="true" id="tab-overview" aria-controls="panel-overview">Overview</button><button role="tab" aria-selected="false" id="tab-specs" aria-controls="panel-specs">Specifications</button><button role="tab" aria-selected="false" id="tab-support" aria-controls="panel-support">Repair &amp; support</button><button role="tab" aria-selected="false" id="tab-shipping" aria-controls="panel-shipping">Shipping &amp; pickup</button></div>
   <div class="tabs__panel" role="tabpanel" id="panel-overview" aria-labelledby="tab-overview"><h2>About the ${esc(p.title)}</h2><p>${esc(p.blurb)}</p>${b ? `<p>${b.intro}</p>` : ''}</div>
   <div class="tabs__panel" role="tabpanel" id="panel-specs" aria-labelledby="tab-specs" hidden><h2>Specifications</h2><table class="specs"><tbody>${specsFor(p).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table><p class="fineprint">Specifications summarized from the manufacturer; confirm against the current spec sheet before ordering.</p></div>
   <div class="tabs__panel" role="tabpanel" id="panel-support" aria-labelledby="tab-support" hidden><h2>Repair &amp; support</h2><p>Tool Mart Houston is a factory-authorized RIDGID<sup>®</sup> and Greenlee<sup>®</sup> repair center and services most professional power tool brands. Walk in Monday–Friday 7:30 AM–5:00 PM, get a written quote after bench inspection, and pick up when it is done.</p><a class="textlink" href="${url(rel, 'pages/toolmarts-repair')}">Repair services ${icon('arrow-right', 'ico--sm')}</a></div>
   <div class="tabs__panel" role="tabpanel" id="panel-shipping" aria-labelledby="tab-shipping" hidden><h2>Shipping &amp; pickup</h2><p>Free same-day will-call pickup at either store when in stock. Ground shipping across Texas; freight quoted for machines and heavy equipment. Contractor accounts can order by PO.</p></div>
  </div>
 </div>
</div></section>
${related.length ? `<section class="section section--paper"><div class="wrap"><div class="section-head section-head--row"><div><p class="eyebrow">Related</p><h2>Goes with this</h2></div><a class="textlink" href="${url(rel, c.handle)}">All ${esc(c.name.toLowerCase())} ${icon('arrow-right', 'ico--sm')}</a></div><div class="pgrid">${related.map((x) => productCard(rel, x)).join('')}</div></div></section>` : ''}`;
  const cut = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)).replace(/[\s,:–-]+$/, '');
  const title = `${cut(p.title, 46)} | Tool Mart`;
  const desc = cut(`${p.title} (${p.sku}) — ${p.blurb} ${p.price != null ? money(p.price) + ' list.' : 'Call for price.'} In stock at Tool Mart Houston & San Antonio, authorized ${bname} dealer.`, 155);
  return { path: p.handle + '/index.html', html: layout({ rel, handle, title, description: desc, body, breadcrumbs: crumbs, bodyClass: 'page-product', ogType: 'product', scripts: has3d ? ['js/product3d.js'] : [], schema: [productSchema(p)] }) };
}

/* ---------------- REPAIR ---------------- */
export function repairPage() {
  const handle = 'pages/toolmarts-repair'; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Tool repair', handle }];
  const steps = [['Call or walk in', 'No appointment needed. Tell us the make, model and what it is doing — we will confirm it is in scope and what to bring.'], ['Bench inspection', 'A certified technician inspects the tool. We never quote remotely — you get an accurate, written quote.'], ['Written quote &amp; timeline', 'Approve the quote with a committed turnaround. Most standard repairs finish within a few business days.'], ['Repair with OEM parts', 'Repairs are performed to manufacturer specification with genuine parts, preserving your warranty.'], ['Pay &amp; pick up', 'Credit card at pickup, or PO for account customers. Return shipping available on request.']];
  const scope = [['threader', 'Threading machines & power drives', 'RIDGID® 300, 535, 1224, 700 and 12-R'], ['camera', 'Drain machines & SeeSnake®', 'Drum, sectional and inspection systems'], ['press', 'Press & crimp tools', 'Milwaukee® FORCE LOGIC™, Greenlee® crimpers'], ['bender', 'Benders & pullers', 'Greenlee® 555, 1800, UT10 and hydraulic sets'], ['drill', 'Cordless & corded power tools', 'Most major professional brands'], ['hydraulic', 'Hydraulic pumps & cylinders', 'Enerpac® and Greenlee® hydraulics']];
  const body = `
${pageHero(rel, { crumbs, eyebrow: `${icon('shield', 'ico--sm')}Factory-authorized RIDGID<sup>®</sup> &amp; Greenlee<sup>®</sup> repair center`, h1: 'Tool repair service in Houston', lead: 'Certified technicians, genuine OEM parts and a written quote before any work. We repair the pro trade equipment Texas contractors depend on — threading machines, drain machines, SeeSnake<sup>®</sup> cameras, press tools, benders and pullers — plus most major power tool brands.', cls: 'hero--service', aside: `<div class="hero__card"><h2>Drop off today</h2><p><b>Houston (repair shop)</b><br>${esc(locations[0].streetAddress)}<br>${esc(locations[0].addressLocality)}, TX ${locations[0].postalCode}</p><p>${icon('clock', 'ico--sm')}Mon–Fri 7:30 AM – 5:00 PM · walk-ins welcome</p><a class="btn btn--primary" href="tel:${locations[0].phoneE164}" data-track="houston_call_click">${icon('phone', 'ico--sm')}${esc(locations[0].phone)}</a><a class="btn btn--ghost" href="#repair-form">Describe the issue</a><p class="fineprint">San Antonio drop-offs are routed to our Houston shop.</p></div>` })}
<section class="section"><div class="wrap">
 ${sectionHead('How it works', 'Five steps from broken to back on the truck')}
 <ol class="steps">${steps.map(([t, d], i) => `<li class="step" data-tilt><span class="step__n">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
</div></section>
<section class="section section--paper"><div class="wrap">
 ${sectionHead('What we repair', 'Trade equipment first, power tools too')}
 <div class="scope-grid">${scope.map(([ic, t, d]) => `<div class="scope" data-tilt><span class="scope__icon">${icon(ic)}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
</div></section>
<section class="section section--steel"><div class="wrap facts-grid">
 <div class="fact"><b>OEM</b><span>Genuine manufacturer parts on every authorized repair</span></div>
 <div class="fact"><b>0</b><span>Remote guesses — every quote follows a bench inspection</span></div>
 <div class="fact"><b>Days</b><span>Most standard repairs completed within a few business days</span></div>
 <div class="fact"><b>Warranty</b><span>Authorized repairs keep your manufacturer coverage intact</span></div>
</div></section>
<section class="section" id="repair-form"><div class="wrap form-split">
 <div><p class="eyebrow">Start a repair</p><h2>Tell us what it is doing</h2><p>Share the make, model and symptoms and a technician will confirm scope and what to bring in. Or skip the form and call the shop.</p>${faq(repairFaq)}</div>
 <div class="form-card">${form(rel, { id: 'repair-request', type: 'Repair request' })}</div>
</div></section>
${ctaBand(rel, { title: 'Covering the gap while your tool is on the bench?', copy: 'Rent a threader, drain machine or press tool by the day so the job keeps moving.', primary: { label: 'Rental equipment', href: 'pages/toolmarts-rental' } })}`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: 'Tool Repair Service Houston | RIDGID & Greenlee Authorized', description: 'Factory-authorized RIDGID® & Greenlee® repair center in Houston. Certified technicians, OEM parts, written quotes and fast turnaround. Walk-ins welcome.', body, breadcrumbs: crumbs, bodyClass: 'page-service',
    schema: [serviceSchema({ name: 'Power tool and equipment repair', type: 'Tool repair', handle, description: 'Factory-authorized RIDGID and Greenlee repair with OEM parts in Houston, Texas.', brandsServed: ['RIDGID', 'Greenlee', 'Milwaukee', 'DeWALT'] }), faqSchema(repairFaq)] }) };
}

/* ---------------- RENTAL ---------------- */
export function rentalPage() {
  const handle = 'pages/toolmarts-rental'; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Equipment rental', handle }];
  const how = [['Tell us the job', 'Pipe size, material, quantity and dates. We recommend the right machine — not the biggest one.'], ['Reserve &amp; deposit', 'We confirm availability and rates. A refundable deposit is charged at pickup.'], ['Pick up &amp; run', 'Machines are inspected, oiled and ready. Pick up at Houston or San Antonio.'], ['Return', 'Bring it back clean and on time and the deposit is refunded in full.']];
  const body = `
${pageHero(rel, { crumbs, eyebrow: `${icon('calendar', 'ico--sm')}Daily · Weekly · Monthly`, h1: 'Industrial tool &amp; equipment rental in Houston &amp; San Antonio', lead: 'Professional-grade threading, drain cleaning, inspection, pressing and bending equipment at a fraction of the cost of buying — for a few hours, a day, or the length of the project. Well-maintained, trade-ready and matched to your job by people who know the work.', cls: 'hero--service', aside: `<div class="hero__card"><h2>Get rental rates</h2><p>Rates depend on machine and duration. Tell us the dates and we will confirm availability within the hour during business hours.</p><a class="btn btn--primary" href="#rental-form">Request rates ${icon('arrow-right', 'ico--sm')}</a><div class="hero__card-phones">${locations.map((l) => `<a href="tel:${l.phoneE164}" data-track="${l.trackEvent}">${icon('phone', 'ico--sm')}${esc(l.shortName)} ${esc(l.phone)}</a>`).join('')}</div></div>` })}
<section class="section"><div class="wrap">
 <div class="section-head section-head--row"><div><p class="eyebrow">Rental fleet</p><h2>What you can rent</h2></div><a class="textlink" href="${url(rel, 'collections/rentals')}">Full rental list ${icon('arrow-right', 'ico--sm')}</a></div>
 <div class="rgrid">${rentals.map((r) => rentalCard(rel, r)).join('')}</div>
</div></section>
<section class="section section--paper"><div class="wrap">
 ${sectionHead('How it works', 'Four steps, one refundable deposit')}
 <ol class="steps steps--4">${how.map(([t, d], i) => `<li class="step" data-tilt><span class="step__n">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
</div></section>
<section class="section section--steel"><div class="wrap rentbuy">
 <div><p class="eyebrow eyebrow--accent">Rent or buy?</p><h2>A quick rule of thumb</h2><p>If a machine runs fewer than a few weeks a year, rent it and keep capital in the business. If it is on the truck every week, buying with a service plan wins — and we will credit you toward the purchase when you are ready.</p><a class="textlink textlink--light" href="${site.domain}/blogs/news/how-to-choose-between-renting-vs-buying-tools">Read: renting vs. buying ${icon('arrow-right', 'ico--sm')}</a></div>
 <ul class="rentbuy__list"><li>${icon('check')}<b>Rent</b> for one-off jobs, overflow work and trying a platform before you buy</li><li>${icon('check')}<b>Buy</b> when utilization is weekly and downtime costs more than the machine</li><li>${icon('check')}<b>Either way</b>, our authorized shop keeps it running</li></ul>
</div></section>
<section class="section" id="rental-form"><div class="wrap form-split">
 <div><p class="eyebrow">Rental request</p><h2>Reserve equipment</h2><p>Include machine, pipe size and dates. Deposit and rates are confirmed before pickup.</p>${faq(rentalFaq)}</div>
 <div class="form-card">${form(rel, { id: 'rental-request', type: 'Rental request' })}</div>
</div></section>`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: 'Tool & Equipment Rental Houston | Pipe Threaders & More', description: 'Rent threading machines, drain cleaners, SeeSnake® cameras, press tools and conduit benders by the day, week or month in Houston & San Antonio.', body, breadcrumbs: crumbs, bodyClass: 'page-service',
    schema: [serviceSchema({ name: 'Tool and equipment rental', type: 'Equipment rental', handle, description: 'Daily, weekly and monthly rental of professional threading, drain cleaning, inspection, pressing and bending equipment in Houston and San Antonio.', brandsServed: ['RIDGID', 'Greenlee', 'Milwaukee'] }), faqSchema(rentalFaq)] }) };
}

/* ---------------- TRADES ---------------- */
export function tradesHub() {
  const handle = 'pages/jobs-contractors'; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Shop by trade', handle }];
  const body = `
${pageHero(rel, { crumbs, eyebrow: 'Shop by trade', h1: 'Professional tools for contractors in Houston &amp; San Antonio', lead: 'Plumbers, electricians, HVAC and mechanical crews buy differently. These trade pages put the equipment, brands and rentals each crew actually runs in one place — curated by a counter team that has outfitted Texas contractors since 1976.' })}
<section class="section"><div class="wrap"><div class="tcard-grid tcard-grid--lg">${trades.map((t) => tradeCard(rel, t)).join('')}</div></div></section>
<section class="section section--paper"><div class="wrap">${sectionHead('Contractor accounts', 'Set your crews up once')}<div class="perks-grid"><div class="perk">${icon('account')}<h3>PO ordering &amp; net terms</h3><p>Order by purchase order across both stores, with statements your office will actually like.</p></div><div class="perk">${icon('store')}<h3>Will-call at both stores</h3><p>Order online or by phone and pick up the same day in Missouri City or San Antonio.</p></div><div class="perk">${icon('wrench')}<h3>Priority repair scheduling</h3><p>Account customers get their machines on the bench first and rental coverage while they wait.</p></div><div class="perk">${icon('tag')}<h3>Volume &amp; bundle pricing</h3><p>Standardizing a platform across trucks? Ask for bundle pricing on kits, batteries and dies.</p></div></div></div></section>
${ctaBand(rel, { title: 'Open a contractor account', copy: 'Tell us your trade and volume — we will set up terms and a dedicated contact at the counter.', primary: { label: 'Open an account', href: 'pages/contact' } })}`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: 'Tools by Trade | Plumbers, Electricians, HVAC | Tool Mart', description: 'Professional tools curated by trade for Houston & San Antonio contractors — plumbing, electrical, HVAC and mechanical. Authorized dealer since 1976.', body, breadcrumbs: crumbs }) };
}
export function tradePage(t) {
  const { handle, rel } = H(t.handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Shop by trade', handle: 'pages/jobs-contractors' }, { name: t.name, handle }];
  const cats = t.categories.map((id) => catOf(id));
  const items = products.filter((p) => t.categories.includes(p.category) && t.brands.includes(p.brand)).slice(0, 8);
  const tb = t.brands.map((id) => brands.find((b) => b.id === id));
  const body = `
${pageHero(rel, { crumbs, eyebrow: `${icon(t.icon, 'ico--sm')}${esc(t.name)}`, h1: t.h1, lead: t.intro, aside: `<div class="hero__card"><h2>What ${esc(t.short.toLowerCase())} buy here</h2><ul class="hero__facts">${t.needs.map((n) => `<li>${icon('check', 'ico--sm')}${esc(n)}</li>`).join('')}</ul></div>` })}
<section class="section"><div class="wrap">${sectionHead('Categories', `Shop ${esc(t.short.toLowerCase())} categories`)}<div class="ccard-grid">${cats.map((c, i) => categoryCard(rel, c, i)).join('')}</div></div></section>
<section class="section section--paper"><div class="wrap"><div class="section-head section-head--row"><div><p class="eyebrow">Crew favorites</p><h2>Most-ordered by ${esc(t.short.toLowerCase())}</h2></div></div><div class="pgrid">${items.map((p) => productCard(rel, p)).join('')}</div></div></section>
<section class="section section--steel"><div class="wrap svc-inline"><div class="svc__icon">${icon('shield')}</div><div><p class="eyebrow eyebrow--accent">Authorized for</p><h2>${tb.map((b) => esc(b.name) + '<sup>' + b.mark + '</sup>').join(' · ')}</h2><p>Full manufacturer warranty, genuine parts and — for RIDGID<sup>®</sup> and Greenlee<sup>®</sup> — factory-authorized repair in our Houston shop.</p></div><a class="btn btn--primary" href="${url(rel, 'pages/toolmarts-repair')}">Repair services ${icon('arrow-right', 'ico--sm')}</a></div></section>
${ctaBand(rel, { title: `Outfitting a ${esc(t.short.toLowerCase().replace(/s$/, ''))} crew?`, copy: 'Send us your tool list. We quote it as a bundle, hold stock for pickup and set up PO ordering for the office.', primary: { label: 'Request a bundle quote', href: 'pages/contact#quote' }, secondary: { label: 'Rental equipment', href: 'pages/toolmarts-rental' } })}`;
  return { path: t.handle + '/index.html', html: layout({ rel, handle, title: t.title, description: t.description, body, breadcrumbs: crumbs, schema: [itemListSchema(t.name + ' tools', items)] }) };
}

/* ---------------- LOCATIONS ---------------- */
export function locationPage(l) {
  const { handle, rel } = H(l.handle);
  const other = locations.find((x) => x.id !== l.id);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Locations', handle: '#locations' }, { name: l.shortName, handle }];
  const lfaq = [{ q: `What are Tool Mart ${l.shortName}’s hours?`, a: `${l.hours}. Closed Saturday and Sunday. Call ${l.phone} to confirm holiday hours.` }, { q: `Can I pick up an online order at the ${l.shortName} store?`, a: 'Yes. Choose will-call pickup at checkout or call the counter; in-stock items are ready the same day.' }, { q: l.id === 'houston' ? 'Where do I drop off a tool for repair?' : 'Do you repair tools in San Antonio?', a: l.id === 'houston' ? 'Walk in with the tool Monday–Friday, 7:30 AM–5:00 PM. Our factory-authorized RIDGID® and Greenlee® shop is on site — no appointment needed.' : 'Drop the tool at our San Antonio counter and we route it to our factory-authorized shop in Houston; you get a written quote after inspection.' }];
  const body = `
${pageHero(rel, { crumbs, eyebrow: `${icon('pin', 'ico--sm')}${l.id === 'houston' ? 'Flagship store · Factory-authorized repair center' : 'Store · Rental desk · Will-call pickup'}`, h1: `${esc(l.name)} — industrial tool store in ${esc(l.addressLocality)}, TX`, lead: l.blurb, aside: `<div class="hero__card hero__card--store"><address><h2>${esc(l.name)}</h2><p>${esc(l.streetAddress)}<br>${esc(l.addressLocality)}, ${l.addressRegion} ${l.postalCode}</p></address><ul class="lcard__facts"><li>${icon('phone')}<a href="tel:${l.phoneE164}" data-track="${l.trackEvent}">${esc(l.phone)}</a></li><li>${icon('clock')}${esc(l.hours)}</li><li>${icon('mail')}<a href="mailto:${site.email}">${site.email}</a></li></ul><div class="lcard__cta"><a class="btn btn--primary" href="tel:${l.phoneE164}" data-track="${l.trackEvent}">${icon('phone', 'ico--sm')}Call the counter</a><a class="btn btn--ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.mapQuery)}" target="_blank" rel="noopener">Directions ${icon('external', 'ico--sm')}</a></div></div>` })}
<section class="section"><div class="wrap loc-detail">
 <div class="map-embed"><iframe title="Map to ${attr(l.name)}" src="https://www.google.com/maps?q=${encodeURIComponent(l.mapQuery)}&amp;output=embed" width="600" height="420" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
 <div class="loc-detail__copy"><p class="eyebrow">At this store</p><h2>Services in ${esc(l.shortName)}</h2><ul class="checklist">${l.services.map((s) => `<li>${icon('check', 'ico--sm')}${esc(s)}</li>`).join('')}</ul><p class="eyebrow">Nearby</p><p>${l.landmarks.map(esc).join(' · ')}</p><p class="eyebrow">Also serving</p><p>${(l.id === 'houston' ? ['Sugar Land', 'Stafford', 'Pearland', 'Katy', 'Pasadena', 'Baytown', 'The Woodlands'] : ['New Braunfels', 'Schertz', 'Boerne', 'Seguin', 'Austin (by freight)']).join(' · ')}</p></div>
</div></section>
<section class="section section--paper"><div class="wrap"><div class="section-head section-head--row"><div><p class="eyebrow">In stock here</p><h2>Ready for same-day pickup</h2></div><a class="textlink" href="${url(rel, 'collections')}">Shop all ${icon('arrow-right', 'ico--sm')}</a></div><div class="pgrid">${featured.slice(0, 4).map((p) => productCard(rel, p)).join('')}</div></div></section>
<section class="section"><div class="wrap wrap--narrow">${sectionHead('FAQ', `Visiting Tool Mart ${esc(l.shortName)}`)}${faq(lfaq)}</div></section>
<section class="section section--steel"><div class="wrap svc-inline"><div class="svc__icon">${icon('pin')}</div><div><p class="eyebrow eyebrow--accent">Our other store</p><h2>${esc(other.name)}</h2><p>${esc(other.streetAddress)}, ${esc(other.addressLocality)}, TX ${other.postalCode} · ${esc(other.phone)}</p></div><a class="btn btn--primary" href="${url(rel, other.handle)}">Store details ${icon('arrow-right', 'ico--sm')}</a></div></section>`;
  return { path: l.handle + '/index.html', html: layout({ rel, handle, title: l.id === 'houston' ? 'Tool Store Houston (Missouri City, TX) | Tool Mart' : 'Tool Store San Antonio, TX | Tool Mart', description: `${l.name}: ${l.streetAddress}, ${l.addressLocality}, TX ${l.postalCode}. ${l.hours}. Industrial tools, ${l.id === 'houston' ? 'authorized repair' : 'repair drop-off'} and rentals. Call ${l.phone}.`, body, breadcrumbs: crumbs, bodyClass: 'page-location', schema: [storeSchema(l, true), faqSchema(lfaq)] }) };
}

/* ---------------- ABOUT ---------------- */
export function aboutPage() {
  const handle = 'pages/about-us'; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'About', handle }];
  const timeline = [['1976', 'Norman Soutar opens Tool Mart in Houston to sell, service and rent the construction tools the trades actually use.'], ['1980s–2000s', 'Tool Mart becomes a factory-authorized dealer and repair center for RIDGID<sup>®</sup> and Greenlee<sup>®</sup>, adding Milwaukee<sup>®</sup>, DeWALT<sup>®</sup> and more.'], ['San Antonio', 'A second store opens on Sentinel St to serve Central Texas contractors with the same inventory and counter expertise.'], ['2025', 'toolmarthou.com launches online ordering with will-call pickup — real tools, real stores, now online too.'], ['2026', 'Fifty years in business, listed on RIDGID’s official Where-to-Buy distributor search, and still family-owned.']];
  const body = `
${pageHero(rel, { crumbs, eyebrow: 'Since 1976 · Family-owned', h1: 'Fifty years of powering the pros', lead: 'Tool Mart was created with contractors in mind. We do not just sell tools — we support the people who rely on them every day, with authorized products, real expertise and service after the sale.', cls: 'hero--about' })}
<section class="section"><div class="wrap about-grid">
 <div><p class="eyebrow">Our story</p><h2>Built at the counter, not in a boardroom</h2><p>When Norman Soutar founded Tool Mart in Houston in 1976, the idea was simple: stock the electric, hydraulic and pneumatic tools the trades run, service them properly as a manufacturer repair center, and get contractors the right tool at the right price. Five decades later, Tool Mart is still family-owned, still answers the phone at the counter, and still matches electricians, plumbers, HVAC and mechanical crews to the tool that fits the job.</p><p>Today we are a factory-authorized dealer for RIDGID<sup>®</sup>, Greenlee<sup>®</sup>, Milwaukee<sup>®</sup> and DeWALT<sup>®</sup>, an authorized RIDGID and Greenlee repair center, and the rental desk contractors call when a job needs a machine for a week, not a lifetime.</p></div>
 <ul class="values"><li>${icon('shield')}<h3>Authorized, always</h3><p>Genuine products, full manufacturer warranty, OEM parts.</p></li><li>${icon('account')}<h3>Trade expertise</h3><p>Our team knows the trades and speaks the language of the jobsite.</p></li><li>${icon('store')}<h3>Local &amp; in stock</h3><p>Two Texas stores, 400+ tools on the shelf, same-day pickup.</p></li><li>${icon('wrench')}<h3>Service after the sale</h3><p>Certified repair and rental coverage keep your crews moving.</p></li></ul>
</div></section>
<section class="section section--paper"><div class="wrap">${sectionHead('Milestones', 'From one Houston counter to two Texas stores')}<ol class="timeline">${timeline.map(([y, t]) => `<li><span class="timeline__year">${y}</span><p>${t}</p></li>`).join('')}</ol></div></section>
<section class="section section--ink"><div class="wrap facts-grid"><div class="fact"><b>1976</b><span>Founded in Houston</span></div><div class="fact"><b>2</b><span>Texas stores</span></div><div class="fact"><b>400+</b><span>Tools in stock</span></div><div class="fact"><b>4</b><span>Factory-authorized brands</span></div></div></section>
${ctaBand(rel, { title: 'Come see us', copy: 'Houston (Missouri City) and San Antonio, Monday–Friday 7:30 AM–5:00 PM.', primary: { label: 'Store locations', href: '#locations' }, secondary: { label: 'Contact the team', href: 'pages/contact' } })}`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: 'About Tool Mart | Family-Owned Since 1976 in Texas', description: 'Family-owned since 1976, Tool Mart is a factory-authorized RIDGID®, Greenlee®, Milwaukee® & DeWALT® dealer serving Houston and San Antonio contractors.', body, breadcrumbs: crumbs, schema: [{ '@type': 'AboutPage', name: 'About Tool Mart', url: abs(handle) }] }) };
}

/* ---------------- CONTACT ---------------- */
export function contactPage() {
  const handle = 'pages/contact'; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Contact', handle }];
  const body = `
${pageHero(rel, { crumbs, eyebrow: 'Contact Tool Mart', h1: 'Quotes, repairs, rentals &amp; accounts — one form, real people', lead: 'Call either counter Monday–Friday 7:30 AM–5:00 PM, email us, or send the form and we will reply within one business day.' })}
<section class="section" id="quote"><div class="wrap form-split form-split--contact">
 <div class="form-card">${form(rel, { id: 'contact-form', type: 'Request a quote' })}</div>
 <div class="contact-side">
  ${locations.map((l) => locationCard(rel, l, { detail: true })).join('')}
  <div class="contact-email">${icon('mail')}<div><b>Email</b><a href="mailto:${site.email}">${site.email}</a></div></div>
 </div>
</div></section>
<section class="section section--paper"><div class="wrap maps-grid">${locations.map((l) => `<div class="map-embed"><h2>${esc(l.name)}</h2><iframe title="Map to ${attr(l.name)}" src="https://www.google.com/maps?q=${encodeURIComponent(l.mapQuery)}&amp;output=embed" width="600" height="360" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`).join('')}</div></section>`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: 'Contact Tool Mart | Quotes, Repairs & Rentals in Texas', description: 'Contact Tool Mart in Houston (713) 222-8665 or San Antonio (210) 655-6116 for tool quotes, repairs, rentals and contractor accounts. Mon–Fri 7:30 AM–5:00 PM.', body, breadcrumbs: crumbs, bodyClass: 'page-contact', schema: [{ '@type': 'ContactPage', name: 'Contact Tool Mart', url: abs(handle) }] }) };
}

/* ---------------- PROMOTIONS ---------------- */
export function promotionsPage() {
  const handle = 'pages/promotion'; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Promotions', handle }];
  const body = `
${pageHero(rel, { crumbs, eyebrow: `${icon('tag', 'ico--sm')}Deals &amp; programs`, h1: 'Tool deals &amp; promotions', lead: 'Manufacturer promotions on RIDGID<sup>®</sup>, Greenlee<sup>®</sup>, Milwaukee<sup>®</sup> and DeWALT<sup>®</sup>, bundle pricing and contractor programs — updated as promos change. Sign up below to get them first.' })}
<section class="section"><div class="wrap"><div class="promo-grid promo-grid--lg">${promotions.map((pr) => `<article class="promo" data-tilt><span class="promo__tag">${icon('tag', 'ico--sm')}${esc(pr.tag)}</span><h2>${pr.title}</h2><p>${pr.copy}</p><a class="btn btn--dark" href="${url(rel, pr.href)}">${esc(pr.cta)} ${icon('arrow-right', 'ico--sm')}</a></article>`).join('')}</div>
<p class="fineprint">Promotional pricing is set by manufacturers and valid while promo stock lasts; final pricing is confirmed on your quote or at checkout.</p></div></section>
${ctaBand(rel, { title: 'Get promotions before they are public', copy: 'Twice-monthly email with manufacturer deals and new arrivals for Texas contractors.', primary: { label: 'Subscribe below', href: '#nl-email' } })}`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: 'Tool Deals & Promotions | Tool Mart Houston & San Antonio', description: 'Manufacturer promotions on RIDGID®, Greenlee®, Milwaukee® and DeWALT® tools, bundle pricing and contractor programs in Houston & San Antonio.', body, breadcrumbs: crumbs }) };
}

/* ---------------- BLOG ---------------- */
export function blogIndex() {
  const handle = 'blogs/news'; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Blog', handle }];
  const body = `
${pageHero(rel, { crumbs, eyebrow: 'Guides &amp; tool tips', h1: 'The Tool Mart blog', lead: 'Buying guides, maintenance how-tos and rental math written for contractors — no brand-versus-brand takedowns, just what works on Texas jobsites.' })}
<section class="section"><div class="wrap"><div class="bgrid bgrid--3">${posts.map((p) => blogCard(rel, p)).join('')}</div></div></section>`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: 'Tool Mart Blog | Contractor Guides & Tool Tips', description: 'Buying guides, maintenance tips and rental advice for Houston and San Antonio contractors from Tool Mart, an authorized industrial tool dealer.', body, breadcrumbs: crumbs, schema: [{ '@type': 'Blog', name: 'Tool Mart Blog', url: abs(handle) }] }) };
}
export function blogPost(post) {
  const handle = 'blogs/news/' + post.slug; const rel = relFor(handle);
  const crumbs = [{ name: 'Home', handle: '' }, { name: 'Blog', handle: 'blogs/news' }, { name: post.title, handle }];
  const body = `
<article class="article"><div class="wrap wrap--narrow">
 ${breadcrumbs(rel, crumbs)}
 <p class="eyebrow">${esc(post.tag)} · <time datetime="${post.date}">${new Date(post.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time> · ${post.minutes} min read</p>
 <h1>${esc(post.title)}</h1>
 <p class="lead">${esc(post.excerpt)}</p>
 <div class="article__body">
  <h2>Step 1 — Call or walk in</h2><p>Start by calling <a href="tel:+17132228665" data-track="houston_call_click">(713) 222-8665</a> or emailing <a href="mailto:${site.email}">${site.email}</a> with the make, model and a description of the issue. We will tell you whether the repair is in scope and what to bring. No appointment is required at 13721 S. Gessner, Suite 200, Missouri City, Monday–Friday 7:30 AM–5:00 PM.</p>
  <h2>Step 2 — Bench inspection, then a written quote</h2><p>Every quote follows a physical inspection by a certified technician. We do not estimate remotely, because a threading machine that “won’t start” can be a switch, a motor or a stripped gear — and you deserve a number you can plan on.</p>
  <h2>Step 3 — OEM parts, manufacturer spec</h2><p>As a factory-authorized RIDGID<sup>®</sup> and Greenlee<sup>®</sup> repair center, our work is performed to manufacturer specification with genuine parts, which keeps your warranty coverage intact.</p>
  <h2>Step 4 — Turnaround and pickup</h2><p>Most standard repairs finish within a few business days depending on parts availability; your quote carries a committed timeframe. Pay by card at pickup or by PO on your account, and ask about return shipping if the tool needs to go back to a jobsite.</p>
  <div class="callout">${icon('info')}<p><b>Sample article layout.</b> The live article body is published on toolmarthou.com; this template shows heading hierarchy, Article schema and internal linking for the redesign.</p></div>
 </div>
 <aside class="article__cta"><h2>Need a repair now?</h2><p>Walk in Monday–Friday or describe the issue online and we will confirm scope.</p><a class="btn btn--primary" href="${url(rel, 'pages/toolmarts-repair')}">Repair services ${icon('arrow-right', 'ico--sm')}</a></aside>
</div></article>
<section class="section section--paper"><div class="wrap"><div class="section-head section-head--row"><div><p class="eyebrow">Keep reading</p><h2>More guides</h2></div></div><div class="bgrid">${posts.filter((p) => p.slug !== post.slug).slice(0, 3).map((p) => blogCard(rel, p)).join('')}</div></div></section>`;
  return { path: handle + '/index.html', html: layout({ rel, handle, title: (post.title.length > 46 ? post.title.slice(0, post.title.lastIndexOf(' ', 46)).replace(/[\s:,]+$/, '') : post.title) + ' | Tool Mart', description: post.excerpt, body, breadcrumbs: crumbs, ogType: 'article', bodyClass: 'page-article', schema: [articleSchema(post)] }) };
}

/* ---------------- 404 ---------------- */
export function notFound() {
  const rel = ''; const handle = '404';
  const body = `<section class="section section--ink nf"><div class="wrap nf__row"><div><p class="eyebrow eyebrow--accent">404</p><h1>That page walked off the jobsite</h1><p>The link may have changed when we added catalog numbers to product URLs. Try search, or start from the shop.</p><div class="hero__cta"><button class="btn btn--primary btn--lg" type="button" data-search-open>${icon('search', 'ico--sm')}Search products</button><a class="btn btn--ghost btn--lg" href="${url(rel, 'collections')}">Shop by category</a></div></div></div></section>`;
  return { path: '404.html', html: layout({ rel, handle, title: 'Page Not Found | Tool Mart', description: 'The page you requested could not be found. Search Tool Mart products or browse by category.', body, noindex: true }) };
}

/* ---------------- shared page hero ---------------- */
function pageHero(rel, { crumbs, eyebrow, h1, lead, cls = '', aside = '' }) {
  return `<section class="phero ${cls}"><div class="wrap">
 ${breadcrumbs(rel, crumbs)}
 <div class="phero__grid${aside ? ' phero__grid--aside' : ''}">
  <div class="phero__copy">${eyebrow ? `<p class="eyebrow eyebrow--accent">${eyebrow}</p>` : ''}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div>
  ${aside ? `<div class="phero__aside">${aside}</div>` : ''}
 </div>
</div></section>`;
}
