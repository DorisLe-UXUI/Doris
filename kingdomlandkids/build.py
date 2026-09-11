#!/usr/bin/env python3
"""
Kingdomland Kids static site builder (no dependencies).

  python3 build.py                 → dist/ with absolute clean URLs (production)
  python3 build.py --preview OUT   → OUT/ with relative links + explicit index.html (for offline / artifact preview)

Sources
  src/data/site.json      brand, URLs, nav, pricing, series, FAQ, testimonials
  src/partials/*.html     head / header / footer / sprite shared by every page
  src/pages/**/*.html     one file per page, JSON front-matter in a <!--meta ... --> block
  src/templates/*.html    series + blog-card templates driven by site.json
  static/                 copied verbatim to the output (css, js, vendored three.js, images)
"""
import json, os, re, shutil, sys, html, datetime, posixpath

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
STATIC = os.path.join(ROOT, "static")
PREVIEW = "--preview" in sys.argv
OUT = sys.argv[sys.argv.index("--preview") + 1] if PREVIEW else os.path.join(ROOT, "dist")
TODAY = datetime.date.today().isoformat()

site = json.load(open(os.path.join(SRC, "data", "site.json"), encoding="utf-8"))
BASE = site["domain"].rstrip("/")

# ---------------------------------------------------------------- helpers
def read(rel):
    with open(os.path.join(SRC, rel), encoding="utf-8") as f:
        return f.read()

def esc(s):
    return html.escape(str(s), quote=True)

def lookup(ctx, dotted):
    cur = ctx
    for part in dotted.split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        elif isinstance(cur, list) and part.isdigit():
            cur = cur[int(part)]
        else:
            return None
    return cur

def money(v):
    return f"${v:,.2f}"

# ---------------------------------------------------------------- SVG sprite (inline once per page)
SPRITE = read("partials/sprite.html")

def icon(name, cls=""):
    classes = ("ico " + cls).strip()
    return f'<svg class="{classes}" aria-hidden="true" focusable="false"><use href="#{name}"/></svg>'

# ---------------------------------------------------------------- generated blocks
def block_nav_links(ctx):
    cur = ctx["page"].get("nav")
    out = []
    for item in site["nav"]:
        aria = ' aria-current="page"' if item["key"] == cur else ""
        out.append(f'<li><a href="{item["href"]}"{aria}>{esc(item["label"])}</a></li>')
    return "\n".join(out)

def series_by_slug(slug):
    return next(s for s in site["series"] if s["slug"] == slug)

def show_card(s, tag=None):
    badge = ""
    if s.get("new"):
        badge = '<span class="show__badge show__badge--new">New</span>'
    elif s.get("badge"):
        badge = f'<span class="show__badge">{esc(s["badge"])}</span>'
    meta = " · ".join(filter(None, [f'Ages {s["ages"]}' if s.get("ages") else None, s.get("count"), s.get("category")]))
    return f'''<article class="show reveal" data-cat="{esc(s.get("filter",""))}" data-tilt>
  <div class="show__card">
    <div class="show__art {s["art"]}">{icon(s["icon"])}<span class="show__shine"></span>{badge}</div>
    <div class="show__body">
      <div class="show__meta"><span>{esc(meta)}</span></div>
      <h3>{esc(s["name"])}</h3>
      <p>{esc(s["tagline"])}</p>
      <span class="show__link">Watch the series</span>
    </div>
    <a class="cover" href="/shows/{s["slug"]}/" aria-label="{esc(s["name"])} — watch the series"></a>
  </div>
</article>'''

def block_show_cards(ctx, which):
    items = site["series"]
    if which == "featured":
        items = [s for s in items if s.get("featured")]
    return "\n".join(show_card(s) for s in items)

def block_related(ctx):
    cur = ctx["series"]["slug"]
    items = [s for s in site["series"] if s["slug"] != cur and s.get("featured")][:3]
    return "\n".join(show_card(s) for s in items)

def block_episodes(ctx):
    s = ctx["series"]
    eps = s.get("episodes") or []
    if not eps:
        return ""
    lis = "\n".join(f'<li><span>{esc(e)}</span><span class="ep-len">{esc(s.get("ep_label","Episode"))}</span></li>' for e in eps)
    return f'<ol class="episodes">{lis}</ol>'

def block_plans(ctx):
    p = site["pricing"]
    out = []
    for key in ("free", "monthly", "annual"):
        pl = p[key]
        best = " plan--best" if key == "annual" else ""
        tag = f'<span class="plan__tag">{esc(pl["tag"])}</span>' if pl.get("tag") else ""
        if key == "free":
            price = '<div class="plan__price">$0<small>forever</small></div>'
        elif key == "monthly":
            price = f'<div class="plan__price"><span class="plan__strike">{money(pl["price"])}</span>{money(pl["intro"])}<small>/first month</small></div>'
        else:
            price = f'<div class="plan__price">{money(pl["per_month"])}<small>/mo</small></div>'
        feats = "\n".join(f"<li>{esc(f)}</li>" for f in pl["features"])
        btn_cls = "btn btn--gold" if key == "annual" else ("btn btn--ghost" if key == "free" else "btn btn--maroon")
        out.append(f'''<div class="plan{best} reveal">
  {tag}
  <h3>{esc(pl["name"])}</h3>
  <div>{price}<p class="plan__sub">{esc(pl["sub"])}</p></div>
  <ul class="plan__list">{feats}</ul>
  <a class="{btn_cls}" href="{site["urls"]["signup"]}" rel="noopener">{esc(pl["cta"])}</a>
</div>''')
    return "\n".join(out)

def block_math(ctx):
    p = site["pricing"]
    yearly = p["monthly"]["price"] * 12
    save = yearly - p["annual"]["price"]
    pct = round(save / yearly * 100)
    return f'''<div class="math reveal" aria-label="Annual plan value math">
  <div><b>{money(p["monthly"]["price"])} × 12</b><span>= {money(yearly)} if paid monthly</span></div>
  <div><b>{money(p["annual"]["price"])}</b><span>Annual, billed once</span></div>
  <div class="is-hot"><b>Save {money(save)}</b><span>{pct}% less than monthly</span></div>
  <div><b>+ {money(p["annual"]["book_value"])}</b><span>Free storybook, shipped</span></div>
</div>'''

def block_faq(ctx, which):
    items = site["faq"]
    if which == "home":
        items = [q for q in items if q.get("home")]
    out = []
    for q in items:
        answer = "".join(f"<p>{a}</p>" for a in q["a"])
        out.append(f'<details><summary>{esc(q["q"])}</summary><div class="faq__a">{answer}</div></details>')
    return "\n".join(out)

def block_testimonials(ctx):
    out = []
    for t in site["testimonials"]:
        out.append(f'''<figure class="quote reveal">
  <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
  <blockquote><p>{esc(t["quote"])}</p></blockquote>
  <figcaption><footer><i>{esc(t["initial"])}</i>{esc(t["who"])}</footer></figcaption>
</figure>''')
    return "\n".join(out)

def block_footer_links(ctx):
    cols = []
    for col in site["footer"]:
        lis = "\n".join(
            f'<li><a href="{l["href"]}"{rel}>{esc(l["label"])}</a></li>'
            for l in col["links"] for rel in [' rel="noopener"' if l["href"].startswith("http") else ""])
        cols.append(f'<div><h4>{esc(col["title"])}</h4><ul>{lis}</ul></div>')
    return "\n".join(cols)

def block_marquee(ctx):
    items = "".join(f"<span>{esc(x)}</span>" for x in site["marquee"])
    return items + items  # doubled for a seamless loop

BLOCKS = {
    "nav_links": lambda ctx, arg: block_nav_links(ctx),
    "show_cards": lambda ctx, arg: block_show_cards(ctx, arg or "all"),
    "related": lambda ctx, arg: block_related(ctx),
    "episodes": lambda ctx, arg: block_episodes(ctx),
    "plans": lambda ctx, arg: block_plans(ctx),
    "math": lambda ctx, arg: block_math(ctx),
    "faq": lambda ctx, arg: block_faq(ctx, arg or "all"),
    "testimonials": lambda ctx, arg: block_testimonials(ctx),
    "footer_links": lambda ctx, arg: block_footer_links(ctx),
    "marquee": lambda ctx, arg: block_marquee(ctx),
    "sprite": lambda ctx, arg: SPRITE,
    "year": lambda ctx, arg: str(datetime.date.today().year),
}

# ---------------------------------------------------------------- template rendering
TOKEN = re.compile(r"\{\{\s*([a-zA-Z_][\w.:-]*)\s*(?:\|\s*(\w+))?\s*\}\}")

def render(tpl, ctx, depth=0):
    if depth > 8:
        return tpl
    def repl(m):
        key, flt = m.group(1), m.group(2)
        if key.startswith("include:"):
            return render(read("partials/" + key.split(":", 1)[1] + ".html"), ctx, depth + 1)
        if key.startswith("block:"):
            parts = key.split(":")
            name, arg = parts[1], (parts[2] if len(parts) > 2 else None)
            return render(BLOCKS[name](ctx, arg), ctx, depth + 1)
        if key.startswith("icon:"):
            return icon(key.split(":", 1)[1])
        val = lookup(ctx, key)
        if val is None:
            return m.group(0)  # leave unknown tokens visible so they get noticed
        if flt == "raw":
            return str(val)
        if flt == "json":
            return json.dumps(val, ensure_ascii=False)
        if flt == "money":
            return money(val)
        return esc(val) if not isinstance(val, (dict, list)) else json.dumps(val)
    out = TOKEN.sub(repl, tpl)
    # nested tokens such as {{icon:{{series.icon}}}} resolve on a second pass
    return render(out, ctx, depth + 1) if (out != tpl and TOKEN.search(out)) else out

# ---------------------------------------------------------------- JSON-LD
def org_ld():
    return {
        "@type": "Organization", "@id": BASE + "/#organization",
        "name": site["name"], "url": BASE + "/",
        "logo": {"@type": "ImageObject", "url": BASE + "/assets/img/logo-512.png", "width": 512, "height": 512},
        "email": site["email"],
        "sameAs": [site["urls"]["youtube"], site["urls"]["instagram"], site["urls"]["facebook"]],
        "contactPoint": [{"@type": "ContactPoint", "contactType": "customer support", "email": site["email"], "availableLanguage": ["English"]}],
    }

def website_ld():
    return {"@type": "WebSite", "@id": BASE + "/#website", "url": BASE + "/", "name": site["name"],
            "description": site["description"], "publisher": {"@id": BASE + "/#organization"}, "inLanguage": "en-US"}

def offers_ld():
    p = site["pricing"]
    return [
        {"@type": "Offer", "name": p["free"]["name"], "price": "0", "priceCurrency": "USD", "category": "free", "url": site["urls"]["signup"]},
        {"@type": "Offer", "name": p["monthly"]["name"], "price": f'{p["monthly"]["price"]:.2f}', "priceCurrency": "USD", "url": site["urls"]["signup"],
         "priceSpecification": {"@type": "UnitPriceSpecification", "price": f'{p["monthly"]["price"]:.2f}', "priceCurrency": "USD", "billingDuration": 1, "unitCode": "MON"}},
        {"@type": "Offer", "name": p["annual"]["name"], "price": f'{p["annual"]["price"]:.2f}', "priceCurrency": "USD", "url": site["urls"]["signup"],
         "priceSpecification": {"@type": "UnitPriceSpecification", "price": f'{p["annual"]["price"]:.2f}', "priceCurrency": "USD", "billingDuration": 1, "unitCode": "ANN"}},
    ]

def app_ld():
    return {"@type": ["WebApplication", "SoftwareApplication"], "@id": BASE + "/#app", "name": site["name"], "url": site["urls"]["signup"],
            "applicationCategory": "EntertainmentApplication", "applicationSubCategory": "Kids video streaming", "operatingSystem": "Web browser",
            "browserRequirements": "Requires JavaScript and a modern web browser", "isFamilyFriendly": True, "inLanguage": "en-US",
            "description": site["description"], "offers": offers_ld(), "publisher": {"@id": BASE + "/#organization"},
            "image": BASE + "/assets/og/og-home.png"}

def breadcrumb_ld(trail):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": name, "item": BASE + href} for i, (name, href) in enumerate(trail)]}

def series_ld(s):
    return {"@type": "TVSeries", "@id": BASE + f'/shows/{s["slug"]}/#series', "name": s["name"], "url": BASE + f'/shows/{s["slug"]}/',
            "description": s["seo_description"], "genre": s["genres"], "typicalAgeRange": s.get("ages", "").replace("–", "-"),
            "isFamilyFriendly": True, "inLanguage": "en-US", "numberOfEpisodes": s.get("episode_count"),
            "productionCompany": {"@id": BASE + "/#organization"}, "provider": {"@id": BASE + "/#organization"},
            "image": BASE + "/assets/og/og-home.png"}

def faq_ld(items):
    return {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q["q"], "acceptedAnswer": {"@type": "Answer", "text": " ".join(re.sub(r"<[^>]+>", "", a) for a in q["a"])}} for q in items]}

def article_ld(page):
    return {"@type": "Article", "headline": page["title"].split(" | ")[0], "description": page["description"],
            "datePublished": page.get("date", TODAY), "dateModified": page.get("date", TODAY),
            "author": {"@id": BASE + "/#organization"}, "publisher": {"@id": BASE + "/#organization"},
            "image": BASE + page.get("og_image", "/assets/og/og-home.png"), "mainEntityOfPage": BASE + page["path"], "inLanguage": "en-US"}

def build_schema(page, ctx):
    graph = [org_ld(), website_ld()]
    for kind in page.get("schema", []):
        if kind == "app":
            graph.append(app_ld())
        elif kind == "faq":
            graph.append(faq_ld(site["faq"]))
        elif kind == "series":
            graph.append(series_ld(ctx["series"]))
        elif kind == "article":
            graph.append(article_ld(page))
        elif kind == "contact":
            graph.append({"@type": "ContactPage", "url": BASE + page["path"], "name": page["title"]})
        elif kind == "about":
            graph.append({"@type": "AboutPage", "url": BASE + page["path"], "name": page["title"]})
    if page.get("crumbs"):
        graph.append(breadcrumb_ld([tuple(c) for c in page["crumbs"]]))
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=None)

# ---------------------------------------------------------------- pages
META_RE = re.compile(r"^\s*<!--meta\s*(\{.*?\})\s*-->\s*", re.S)

def parse_page(text):
    m = META_RE.match(text)
    if not m:
        raise SystemExit("page is missing <!--meta {...} --> front-matter")
    return json.loads(m.group(1)), text[m.end():]

def relativize(html_text, page_path):
    """Preview mode: turn root-absolute links into relative ones with explicit index.html."""
    depth = page_path.strip("/").count("/") + (0 if page_path.endswith("/") else 0)
    if page_path == "/":
        depth = 0
    elif page_path.endswith("/"):
        depth = page_path.strip("/").count("/") + 1
    else:  # e.g. /404.html
        depth = page_path.strip("/").count("/")
    prefix = "../" * depth if depth else "./"
    def fix(m):
        attr, url = m.group(1), m.group(2)
        if url == "/":
            return f'{attr}="{prefix}index.html"'
        if url.endswith("/"):
            return f'{attr}="{prefix}{url.lstrip("/")}index.html"'
        return f'{attr}="{prefix}{url.lstrip("/")}"'
    html_text = re.sub(r'\b(href|src|poster|action)="(/[^"]*)"', fix, html_text)
    html_text = re.sub(r"url\((/assets/[^)]*)\)", lambda m: f"url({prefix}{m.group(1).lstrip('/')})", html_text)
    return html_text

def out_path_for(path):
    if path.endswith("/"):
        return os.path.join(OUT, path.strip("/"), "index.html") if path != "/" else os.path.join(OUT, "index.html")
    return os.path.join(OUT, path.lstrip("/"))

pages_for_sitemap = []

def emit(page, body, extra_ctx=None):
    ctx = {"site": site, "page": page, "url": site["urls"], "pricing": site["pricing"], "base": BASE, "today": TODAY}
    if extra_ctx:
        ctx.update(extra_ctx)
    page.setdefault("og_image", "/assets/og/og-home.png")
    page.setdefault("header", "light")
    page["canonical"] = BASE + page["path"]
    page["og_image_abs"] = BASE + page["og_image"]
    page["robots"] = "noindex,follow" if page.get("noindex") else "index,follow,max-image-preview:large"
    page["schema_json"] = build_schema(page, ctx)
    page["header_class"] = "header--dark" if page["header"] == "dark" else "header--light"
    page["body_class"] = page.get("body_class", "")
    layout = read("partials/layout.html")
    doc = render(layout.replace("{{body}}", body), ctx)
    if PREVIEW:
        doc = relativize(doc, page["path"])
    dest = out_path_for(page["path"])
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        f.write(doc)
    if not page.get("noindex") and page["path"] != "/404.html":
        pages_for_sitemap.append((page["path"], page.get("priority", 0.6), page.get("changefreq", "monthly")))
    # leftover tokens are bugs — report them loudly
    left = set(TOKEN.findall(doc))
    if left:
        print(f"  ! unresolved tokens in {page['path']}: {sorted(k for k, _ in left)}")
    return dest

def build():
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    shutil.copytree(STATIC, OUT)
    # regular pages
    for dirpath, _, files in os.walk(os.path.join(SRC, "pages")):
        for fn in sorted(files):
            if not fn.endswith(".html"):
                continue
            meta, body = parse_page(open(os.path.join(dirpath, fn), encoding="utf-8").read())
            emit(meta, body)
            print("  ✓", meta["path"])
    # series pages from data
    tpl = read("templates/series.html")
    for s in site["series"]:
        meta = {"path": f'/shows/{s["slug"]}/', "title": f'{s["name"]} — {s["kicker"]} | {site["name"]}',
                "description": s["seo_description"], "nav": "shows", "header": "light", "schema": ["series"],
                "crumbs": [["Home", "/"], ["Shows", "/shows/"], [s["name"], f'/shows/{s["slug"]}/']], "priority": 0.8, "changefreq": "monthly"}
        emit(meta, tpl, {"series": s})
        print("  ✓", meta["path"])
    # sitemap + robots
    if not PREVIEW:
        urls = "\n".join(
            f"  <url><loc>{BASE}{p}</loc><lastmod>{TODAY}</lastmod><changefreq>{cf}</changefreq><priority>{pr}</priority></url>"
            for p, pr, cf in sorted(pages_for_sitemap, key=lambda x: -x[1]))
        with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8") as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n")
        with open(os.path.join(OUT, "robots.txt"), "w", encoding="utf-8") as f:
            f.write(f"User-agent: *\nAllow: /\nDisallow: /privacy/\nDisallow: /terms/\n\nSitemap: {BASE}/sitemap.xml\n")
    print(f"built {len(pages_for_sitemap)} indexable pages → {OUT}")

if __name__ == "__main__":
    build()
