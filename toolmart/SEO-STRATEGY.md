# Tool Mart — SEO strategy for the redesign

Goal (matches the live KPI scorecard): more organic clicks to product + collection pages (DRV-01, RED at 45 vs 60 target), more non-brand impressions (DRV-03), more qualified digital leads (OUT-03), and hygiene KPIs to green (HYG-06/07 no-H1 and no-meta pages, HYG-13 llms.txt/agents.md).

## 1. Positioning & keyword map

Tool Mart already ranks #1 for brand + city queries ("Toolmart Houston" CTR 43%, "Tool Mart San Antonio" position 1.0). The upside is non-brand, local, transactional intent. Every page owns one primary intent:

| Page | Primary keyword (US, TX intent) | Secondary |
|---|---|---|
| Home | industrial tool supply Houston | tool supplier near me, authorized RIDGID dealer Houston |
| /pages/toolmarts-repair | tool repair service Houston | RIDGID repair Houston, Greenlee authorized repair, power tool repair near me |
| /pages/toolmarts-rental | tool rental Houston | pipe threading machine rental Houston, cost to rent a pipe threader |
| /collections/pipe-threading-tools | pipe threading machine Houston | RIDGID 1224, RIDGID 535, threading equipment Houston |
| /collections/ridgid | RIDGID tools Houston | RIDGID dealer Houston, RIDGID 93287 |
| /collections/milwaukee | Milwaukee tools Houston | M18 FUEL pipe threader, Milwaukee dealer near me |
| /collections/greenlee | Greenlee tools Houston | Greenlee 555 bender, conduit bender Houston |
| /collections/dewalt | DeWALT tools Houston | DeWALT dealer Houston |
| /pages/plumbers · electricians · hvac-mechanical | plumbing contractor tools Houston (etc.) | long-tail trade + tool combinations |
| /pages/houston · /pages/san-antonio | tool store Houston / San Antonio | tool store near me, industrial tools Missouri City |
| /products/* | brand + model + catalog number ("RIDGID 1224 26092") | "for sale", "price", "Houston" |

Structure follows Janny's recommendation (Apr 2026): category-first navigation as the SEO foundation, trade landing pages for long-tail conversion, brand pages for manufacturer listing requirements (RIDGID Where-to-Buy done; Greenlee/Milwaukee next).

## 2. On-page rules implemented in the build

- One H1 per page containing the primary keyword + location; H2/H3 as an outline.
- Unique `<title>` ≤ 60 chars and meta description ≤ 155 chars on all 54 pages (no more blank homepage description).
- `<html lang="en-US">`, canonical on every page, OG + Twitter cards, `theme-color`, geo meta.
- Breadcrumbs (visible + BreadcrumbList) on every inner page.
- Descriptive alt text on every product image (brand + product + category + "Tool Mart Houston"); HYG-02 alt coverage becomes a template guarantee, not a manual task.
- Product titles in Title Case (HYG-04 ALL-CAPS titles → 0 on new templates).
- Trademark hygiene: ®/™ on first mention (RIDGID®, Greenlee®, Milwaukee®, M18 FUEL™, PACKOUT™, DeWALT®, FLEXVOLT®) — matches the email QA standard.
- Internal linking: trade → category → brand → product → repair/rental, plus footer NAP for both stores on every page.
- Rentals never show $0 — rental cards show "Daily · Weekly · Monthly rates" + Request rates (fixes the Sept 9 issue).
- Client feedback from March applied: nav says **Promotions** (not News); blog only near the footer of the homepage; no brand-vs-brand comparison content.

## 3. Structured data (JSON-LD on every page)

Organization (+founder, foundingDate, sameAs, contactPoint) · HardwareStore ×2 with geo, openingHoursSpecification, areaServed, hasMap · WebSite + SearchAction (sitelinks search box) · BreadcrumbList · CollectionPage + ItemList · Product + Offer (price, availability, seller, mpn) · Service (repair, rental) with availableChannel per store · FAQPage on repair, rental, location and pipe-threading pages · Article on blog posts · ContactPage / AboutPage.

Next: Review/AggregateRating once GBP reviews are synced; `hasMerchantReturnPolicy` + `shippingDetails` on Offers once policies are final (needed for Merchant Center free listings).

## 4. Technical checklist

| Item | Status in build | Shopify action |
|---|---|---|
| sitemap.xml (production URLs, priorities) | ✅ generated | Shopify auto-sitemap covers products; keep junk collections out (HYG-10) |
| robots.txt (blocks cart/checkout/search params) | ✅ | Edit `robots.txt.liquid` |
| llms.txt | ✅ business + key pages | Serve at `/llms.txt` (HYG-13 → 1) |
| 404 with search + category links | ✅ | `404.liquid` |
| Core Web Vitals | CSS 54 KB, JS 12 KB, Three.js 797 KB **deferred**, fonts preconnected, images lazy | Keep 3D bundle `type=module` deferred; serve WebP product images; target Lighthouse mobile ≥ 65 (HYG-09) |
| Redirects | none needed — existing handles kept | Add 301s only for the new category handles if old merch collections are retired |
| GA4 events | `quote_request`, `form_submit`, `houston_call_click`, `san_antonio_call_click`, `newsletter_signup`, `add_to_cart`, `search` pushed to `dataLayer` | Map in GTM → GA4 key events (OUT-03) |

## 5. Local SEO

- Dedicated location pages with NAP, hours, map, services, areas served, FAQ and HardwareStore schema (previously only on Contact).
- Both stores in the footer on every page; click-to-call tracked per store.
- Google Business Profile: link GBP to the new location pages, sync hours, add 15–20 photos, post promotions monthly (from the Tool Mart SEO Plan checklist).

## 6. AI-search readiness

llms.txt + agents.md customised (HYG-13), FAQ blocks written as direct answers, consistent entity data (Organization + HardwareStore IDs), product pages with sku/mpn/price in HTML — feeds DRV-08 (AI referral sessions) and DRV-09 (AI citation rate).

## 7. Content roadmap (blog stays near the footer)

Keep publishing the guides that already index (repair explained, rent vs buy, battery guide, concrete tools, jobsite productivity). Add: "Pipe threading machine rental Houston: rates and how to choose", "RIDGID 535 vs 1224: which threader for your shop", "Greenlee 555 bender setup guide", one page per service area (Sugar Land, Katy, Pasadena, New Braunfels) only if GSC shows demand.
