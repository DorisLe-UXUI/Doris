# Kingdomland Kids — website redesign (3D hero · SEO · UI/UX)

Static, dependency-free rebuild of **kingdomlandkids.com**: a WebGL "floating kingdom" hero (vendored Three.js, procedural — no models or textures to download), a navy/gold/cream editorial design system from the KDL Visual DNA brief, 20 SEO-ready pages, structured data, sitemap and robots.

```
kingdomlandkids/
├── build.py                 # python3 build.py → dist/   |  python3 build.py --preview OUT (relative links)
├── src/
│   ├── data/site.json       # ONE place for brand, URLs, nav, pricing, series, FAQ, testimonials, footer
│   ├── partials/            # layout, head (SEO tags), header, footer, SVG sprite, analytics placeholder
│   ├── pages/               # one folder per URL; JSON front-matter in <!--meta … --> at the top
│   └── templates/series.html# every show page is generated from site.json → /shows/<slug>/
├── static/                  # copied as-is into dist/: css, js, vendored three.js, icons, OG image
├── tools/                   # og.html + icon.html + render-assets.mjs (regenerates PNGs with Playwright)
├── dist/                    # BUILD OUTPUT — deploy this folder (root-absolute URLs for kingdomlandkids.com)
├── preview/                 # same site with relative links — works from any sub-folder, e.g. a Netlify deploy preview
└── KDL_SEO_Plan.xlsx        # keyword map, page meta, technical checklist, schema map, content calendar
```

## Build & preview

```bash
python3 build.py                      # → dist/ (absolute clean URLs, sitemap.xml, robots.txt)
npx serve dist                        # or: python3 -m http.server -d dist 8080
```

`preview/` is the same build with relative links (`python3 build.py --preview preview`), so it renders correctly when the repo is deployed as a whole — e.g. `<deploy-preview>/kingdomlandkids/preview/`.

`dist/` is plain HTML/CSS/JS. Deploy to Netlify, Vercel, Cloudflare Pages or GitHub Pages. Every page lives at `folder/index.html`, so clean URLs (`/pricing/`) work on every static host with no config. Point `404.html` as the custom not-found page (Netlify/GitHub Pages pick it up automatically).

## Editing content

* **Prices, plan copy, CTAs** → `src/data/site.json › pricing`. The pricing cards, value-math strip, comparison table and the `Offer` schema all read from it.
* **Shows** → `site.json › series`. Add an object and a `/shows/<slug>/` page, card and `TVSeries` schema appear on the next build. `featured: true` puts it on the home page.
* **FAQ / testimonials / nav / footer** → `site.json`.
* **Page copy & meta** → `src/pages/**/index.html`. The `<!--meta {...} -->` block sets `title`, `description`, `path`, `schema`, `crumbs`, `og_image`, `priority`.
* **Shared header/footer/head** → `src/partials/`.

## The 3D hero

`static/assets/js/kingdom-scene.js` (ES module) + `static/assets/vendor/three.module.min.js` (Three.js r169, MIT).
Everything is generated in code: floating islands, castle with lit windows, drifting clouds, twinkling stars, rising gold "light motes", the open family Bible, the marvelous-light beam. Camera drifts slowly, follows the pointer, and pulls back as you scroll.

* DPR capped at 1.5 (1.0 on phones); particle counts scale with viewport.
* Rendering pauses when the hero is off-screen or the tab is hidden.
* `prefers-reduced-motion` → one static frame. No WebGL → CSS gradient + star field remain.

## SEO layer (what is already in the build)

* One `<h1>` per page with the primary keyword; semantic sections, breadcrumbs, descriptive alt/aria.
* Per-page `<title>`, meta description, canonical, `hreflang`, Open Graph + Twitter cards, `theme-color`, manifest, favicons.
* JSON-LD `@graph` on every page: `Organization`, `WebSite`, plus `WebApplication` + `Offer`s (home, pricing), `TVSeries` (show pages), `FAQPage` (/faq/), `Article` (blog), `BreadcrumbList`, `AboutPage`, `ContactPage`.
* `sitemap.xml` (auto), `robots.txt` (legal placeholders excluded), `404.html`.
* Performance: no images to download above the fold (the hero is code), one CSS file, deferred JS, font preconnect + `display=swap`, WebGL only on the home page.
* `src/partials/analytics.html` — where GA4 / Meta Pixel go, with the conversion events the app must fire.

See `KDL_SEO_Plan.xlsx` for the keyword map, launch checklist and 12-week content calendar.

## Before launch — replace the stand-ins

| Item | Where | Notes |
|---|---|---|
| Wordmark | `src/partials/header.html`, `footer.html`, `tools/og.html` | CSS/Lilita One approximation of the hand-lettered Kingdomland logo. Swap in the real SVG. |
| Show key art | `src/data/site.json › series[].art/icon` | Cards use gradient + line-art emblems. Replace with real thumbnails (16:10) and update `show_card()` in `build.py` to output `<img>`. |
| OG image | `static/assets/og/og-home.png` | Regenerate with real art: `NODE_PATH=$(npm root -g) node tools/render-assets.mjs`. |
| Login / signup URLs | `site.json › urls` | Both point to go.kingdomlandkids.com. |
| Social URLs | `site.json › urls` | YouTube confirmed; Instagram/Facebook handles to confirm. |
| Pricing | `site.json › pricing` | Built to the Q3 plan ($9.99 → $7.99 first month · $69.99/yr). Live site was $7.99/mo in June — confirm which is current. |
| Testimonials | `site.json › testimonials` | Two quotes carried over from the current site, attribution to confirm. |
| Privacy / Terms | `src/pages/privacy`, `terms` | Placeholders, `noindex`. Need real legal text. |
| Analytics | `src/partials/analytics.html` | Add GA4 + Meta Pixel IDs; app must fire Subscribe/Purchase events. |
