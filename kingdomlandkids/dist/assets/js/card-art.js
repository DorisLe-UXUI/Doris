/* Kingdomland Kids — generative key-art for show cards.
   Paints a stylised "night over the kingdom" scene per series on a <canvas> behind the emblem:
   sky gradient, soft light rays, stars, rolling hills, horizon glow, vignette, grain.
   Replace with real thumbnails when they exist; this only runs where .show__art has no <img>. */
(function () {
  'use strict';
  const P = {
    'art--ml':  { sky: ['#2f5aa8', '#0f2143', '#0a1730'], hill: ['#1d3b6f', '#12264a'], glow: 'rgba(255,214,107,.55)', rays: true, stars: 70 },
    'art--ba':  { sky: ['#8a5a1c', '#3b2510', '#1e1508'], hill: ['#5a3a14', '#2c1c0a'], glow: 'rgba(255,201,102,.5)', rays: true, stars: 40, sand: true },
    'art--bhb': { sky: ['#a8202a', '#5F0001', '#2a0507'], hill: ['#6e0a10', '#3a0509'], glow: 'rgba(255,226,98,.55)', rays: false, stars: 30, waves: true },
    'art--fv':  { sky: ['#4d9a6a', '#1f5a3d', '#0f3322'], hill: ['#2f6b4f', '#17402c'], glow: 'rgba(255,229,98,.5)', rays: true, stars: 40, leaves: true },
    'art--la':  { sky: ['#3a5a9a', '#1b2d55', '#0f1a33'], hill: ['#24396a', '#14224a'], glow: 'rgba(120,200,255,.45)', rays: false, stars: 60, grid: true },
    'art--abc': { sky: ['#f6b523', '#b07a12', '#5a3d05'], hill: ['#c98d15', '#7a520a'], glow: 'rgba(255,255,255,.55)', rays: true, stars: 25, dots: true },
    'art--wm':  { sky: ['#6a3fa0', '#3a2168', '#1c1030'], hill: ['#4a2e6b', '#2a1a40'], glow: 'rgba(255,214,107,.55)', rays: true, stars: 80, waves: true },
  };
  const arts = document.querySelectorAll('.show__art');
  if (!arts.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function paint(el, w, h) {
    const key = [...el.classList].find((c) => P[c]) || 'art--ml';
    const p = P[key];
    let c = el.querySelector('canvas.art');
    if (!c) { c = document.createElement('canvas'); c.className = 'art'; c.setAttribute('aria-hidden', 'true'); el.prepend(c); }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    const x = c.getContext('2d'); x.scale(dpr, dpr);
    let seed = 0; for (const ch of key) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    // sky
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, p.sky[0]); g.addColorStop(.55, p.sky[1]); g.addColorStop(1, p.sky[2]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    // light rays from the top centre
    if (p.rays) {
      x.save(); x.translate(w * .5, -h * .2); x.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 7; i++) {
        const a = (i - 3) * .22 + (rnd() - .5) * .08;
        const rg = x.createLinearGradient(0, 0, 0, h * 1.4); rg.addColorStop(0, 'rgba(255,230,150,.16)'); rg.addColorStop(1, 'rgba(255,230,150,0)');
        x.fillStyle = rg; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.sin(a - .05) * h * 1.6, h * 1.6); x.lineTo(Math.sin(a + .05) * h * 1.6, h * 1.6); x.closePath(); x.fill();
      }
      x.restore();
    }
    // stars
    for (let i = 0; i < p.stars; i++) {
      const sx = rnd() * w, sy = rnd() * h * .7, r = rnd() * 1.4 + .3;
      x.fillStyle = `rgba(255,${230 + Math.floor(rnd() * 25)},${170 + Math.floor(rnd() * 85)},${.35 + rnd() * .6})`;
      x.beginPath(); x.arc(sx, sy, r, 0, Math.PI * 2); x.fill();
    }
    // motif layers
    if (p.waves) { x.strokeStyle = 'rgba(255,255,255,.12)'; x.lineWidth = 1.5; for (let k = 0; k < 5; k++) { x.beginPath(); for (let i = 0; i <= w; i += 6) x.lineTo(i, h * .55 + k * 9 + Math.sin(i / 22 + k) * 6); x.stroke(); } }
    if (p.grid) { x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 1; for (let i = 0; i < w; i += 28) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } for (let j = 0; j < h; j += 28) { x.beginPath(); x.moveTo(0, j); x.lineTo(w, j); x.stroke(); } }
    if (p.dots) { for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(255,255,255,${.08 + rnd() * .14})`; x.beginPath(); x.arc(rnd() * w, rnd() * h, 6 + rnd() * 16, 0, Math.PI * 2); x.fill(); } }
    if (p.leaves) { x.fillStyle = 'rgba(255,255,255,.10)'; for (let i = 0; i < 14; i++) { const lx = rnd() * w, ly = rnd() * h * .8, s = 6 + rnd() * 10; x.beginPath(); x.ellipse(lx, ly, s, s * .45, rnd() * Math.PI, 0, Math.PI * 2); x.fill(); } }
    // horizon glow
    const hg = x.createRadialGradient(w * .5, h * .78, 0, w * .5, h * .78, w * .55); hg.addColorStop(0, p.glow); hg.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = hg; x.fillRect(0, 0, w, h);
    // hills (two layers)
    p.hill.forEach((col, k) => {
      x.fillStyle = col; x.beginPath(); x.moveTo(0, h);
      const base = h * (.78 + k * .09), amp = h * (.07 - k * .02), ph = rnd() * 6;
      for (let i = 0; i <= w; i += 4) x.lineTo(i, base + Math.sin(i / (w * .22) + ph) * amp + Math.sin(i / (w * .07) + ph * 2) * amp * .35);
      x.lineTo(w, h); x.closePath(); x.fill();
    });
    if (p.sand) { x.fillStyle = 'rgba(255,220,150,.08)'; for (let i = 0; i < 40; i++) { x.fillRect(rnd() * w, h * .8 + rnd() * h * .2, 1 + rnd() * 2, 1); } }
    // vignette + grain
    const vg = x.createRadialGradient(w * .5, h * .45, w * .2, w * .5, h * .5, w * .8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,10,25,.55)');
    x.fillStyle = vg; x.fillRect(0, 0, w, h);
    for (let i = 0; i < w * h * .02; i++) { x.fillStyle = `rgba(255,255,255,${rnd() * .05})`; x.fillRect(rnd() * w, rnd() * h, 1, 1); }
  }

  const ro = 'ResizeObserver' in window ? new ResizeObserver((entries) => entries.forEach((e) => { const r = e.contentRect; if (r.width && r.height) paint(e.target, r.width, r.height); })) : null;
  arts.forEach((el) => {
    if (el.querySelector('img')) return;
    const r = el.getBoundingClientRect(); if (r.width && r.height) paint(el, r.width, r.height);
    if (ro) ro.observe(el); else if (!reduce) window.addEventListener('resize', () => { const q = el.getBoundingClientRect(); paint(el, q.width, q.height); });
  });
})();
