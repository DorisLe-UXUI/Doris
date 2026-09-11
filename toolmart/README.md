# Tool Mart — website redesign (3D · SEO · UX)

Static front-end for the toolmarthou.com redesign. 54 generated pages, self-hosted Three.js (no CDN dependency), structured data on every page, and a content model that mirrors the live Shopify URL structure so nothing has to be redirected at launch.

## Preview locally

```bash
node toolmart/_build/build.mjs          # regenerates every page + sitemap/robots/llms.txt
npx http-server -p 8088 . && open http://127.0.0.1:8088/toolmart/
```

## What is in here

| Path | Purpose |
|---|---|
| `_build/data.mjs` | All content: stores, brands, categories, trades, products (real SKUs + list prices from the Sept 2026 price crawl), rentals, FAQs, posts, promos |
| `_build/pages.mjs` / `components.mjs` | Page templates, header/footer, cards, JSON-LD builders |
| `_build/build.mjs` | Generator (pages, placeholder art, search index, sitemap.xml, robots.txt, llms.txt, manifest) |
| `assets/css/main.css` | Design system (tokens first — swap brand colors in `:root`) |
| `assets/js/main.js` | Nav, mega menu, search overlay, tilt cards, tabs, forms, GA4 event hooks |
| `assets/js/hero3d.js` | Homepage 3D hero (procedural chrome hardware, reflections via RoomEnvironment) |
| `assets/js/product3d.js` | PDP 3D viewer — loads a manufacturer GLB via `data-model`, falls back to a stylized threading machine |
| `assets/vendor/three/three-bundle.min.js` | Three.js r186 + OrbitControls + RoomEnvironment + GLTFLoader, bundled with esbuild |
| `SEO-STRATEGY.md` | Keyword map, page map, schema plan, technical checklist, Shopify hand-off |

## URL map (preview → production)

Preview paths are folders (`collections/ridgid/`) and canonical/OG/sitemap URLs point to the matching Shopify path (`/collections/ridgid`). Existing handles were kept: `pages/toolmarts-repair`, `pages/toolmarts-rental`, `pages/about-us`, `pages/contact`, `pages/promotion`, `pages/jobs-contractors`, `collections/{ridgid,milwaukee,greenlee,dewalt,rentals,power-tools,utility-electricians-tools,general-purpose-hand-tools,enerpac}`, `blogs/news`. New proposed handles: `pages/houston`, `pages/san-antonio`, `pages/plumbers`, `pages/electricians`, `pages/hvac-mechanical`, `collections/{pipe-threading-tools,press-crimp-tools,drain-cleaning-inspection,parts-accessories}`.

## Hand-off to Shopify (Dawn 15.x)

1. Theme: port `main.css` tokens into `base.css` / settings; header, mega menu and footer map 1:1 to Dawn sections (`header.liquid`, `footer.liquid`).
2. Home sections → custom sections: `hero-3d`, `brand-strip`, `category-grid`, `featured-products`, `services-split`, `trade-grid`, `why`, `locations`, `promo-grid`, `blog-teaser`.
3. Product template: add `product-3d-viewer` block (canvas + `data-model` metafield for GLB) and the CTA tiering (Add to Cart under $500 & e-commerce enabled, View Details, Request Quote over $2,000).
4. JSON-LD: the builders in `components.mjs` are the spec for the Liquid `application/ld+json` snippets (Organization, HardwareStore ×2, Service, FAQPage, Product, ItemList, BreadcrumbList, Article).
5. Forms: point `site.formEndpoint` (Formspree) and the Mailchimp `newsletterAction` at the live endpoints; GA4 events already fire to `dataLayer` (`quote_request`, `form_submit`, `houston_call_click`, `san_antonio_call_click`, `newsletter_signup`, `add_to_cart`).

## Needs from Tool Mart / SentryX before go-live

- Logo files (Tool Man mark + wordmark + 50th emblem) as SVG — the hex mark in the header is a placeholder.
- Brand colors if any exist beyond the logo (site uses safety orange `#F26A1B` on graphite as tokens).
- Product photos (Shopify CDN URLs) — placeholders live in `assets/img/products/*.svg`; alt text is already written.
- GLB models for hero SKUs (RIDGID 1224, 535, Greenlee 555) if 3D on PDP should show the real machine; otherwise the stylized model stays.
- Confirm San Antonio pin coordinates, LinkedIn/YouTube URLs, Formspree form ID, Mailchimp form action, GBP review count.
