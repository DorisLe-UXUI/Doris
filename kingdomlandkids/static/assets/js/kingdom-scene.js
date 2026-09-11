/*
 * KingdomLand Kids — hero scene
 * A floating island kingdom lit by a warm "marvelous light", built procedurally
 * (no textures / models to download). Vendored Three.js, no CDN dependency.
 *
 * Perf/UX rules:
 *  - DPR capped (1.5 desktop, 1.0 small screens); particle counts scale with width
 *  - Rendering pauses when the hero is scrolled out of view or the tab is hidden
 *  - prefers-reduced-motion → one static frame, no animation, no parallax
 *  - No WebGL → the CSS gradient + SVG stars behind the canvas remain visible
 */
import * as THREE from '../vendor/three.module.min.js';

const host = document.querySelector('[data-kingdom-scene]');
if (host) boot(host);

function boot(host) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 720px)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    host.classList.add('is-fallback');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  host.classList.add('is-3d');

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0f2143, 0.028);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
  const camBase = new THREE.Vector3(0, 2.2, 15.5);
  camera.position.copy(camBase);

  /* ---------- palette (brand DNA) ---------- */
  const C = {
    navy: 0x0f2143, navyDeep: 0x0a1730, cream: 0xf8f5ef, white: 0xffffff,
    goldHi: 0xffe562, gold: 0xf6b523, goldShadow: 0xcb9302, maroon: 0x5f0001,
    rock: 0x1c3260, rockDark: 0x142549, grass: 0x2f6b4f, grassLight: 0x4d9a6a,
    wall: 0xf1e9d8, wallShade: 0xd9cdb4, roof: 0x7a1414, wood: 0x6b4a2b, page: 0xfff6dc
  };

  /* ---------- lights ---------- */
  scene.add(new THREE.HemisphereLight(0x8fa6d6, 0x1a2c52, 0.9));
  const key = new THREE.DirectionalLight(0xffe9b3, 2.2);
  key.position.set(4, 9, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7d9cff, 0.8);
  rim.position.set(-6, 3, -5);
  scene.add(rim);
  const beam = new THREE.SpotLight(0xffd66b, 40, 40, Math.PI / 7, 0.65, 1.4);
  beam.position.set(0.6, 14, 1.5);
  beam.target.position.set(0, 1.2, 0);
  scene.add(beam, beam.target);

  /* ---------- helpers ---------- */
  const mat = (color, opts = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.85, metalness: 0.02, flatShading: true }, opts));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const world = new THREE.Group();
  world.position.set(small ? 0 : 3.6, small ? 1.4 : 0, 0);
  scene.add(world);

  /* ---------- the island ---------- */
  function makeIsland(radius, height, detail) {
    const g = new THREE.Group();
    // rock underside: a cone with displaced vertices
    const rockGeo = new THREE.ConeGeometry(radius, height, detail, 4, false);
    rockGeo.rotateX(Math.PI);
    const pos = rockGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const r = Math.hypot(x, z);
      if (r > 0.05 && y > -height + 0.1) {
        const n = 1 + (Math.sin(x * 3.1 + z * 2.3) * 0.5 + Math.cos(z * 4.7 - x * 1.7) * 0.5) * 0.14;
        pos.setX(i, x * n); pos.setZ(i, z * n);
        pos.setY(i, y + Math.sin(x * 2.2 + z * 3.9) * 0.08);
      }
    }
    rockGeo.computeVertexNormals();
    const rock = new THREE.Mesh(rockGeo, mat(C.rock, { roughness: 0.95 }));
    rock.position.y = -height / 2;
    g.add(rock);
    // grass cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 0.92, 0.42, detail), mat(C.grass));
    cap.position.y = 0.21;
    g.add(cap);
    const cap2 = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius * 0.9, 0.22, detail), mat(C.grassLight));
    cap2.position.y = 0.52;
    g.add(cap2);
    return g;
  }

  function tower(x, z, r, h, roofH, roofColor) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.08, h, 10), mat(C.wall, { flatShading: false }));
    body.position.y = h / 2;
    g.add(body);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.22, r * 1.22, 0.18, 10), mat(C.wallShade));
    ring.position.y = h;
    g.add(ring);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(r * 1.32, roofH, 10), mat(roofColor, { roughness: 0.6, metalness: 0.15 }));
    roof.position.y = h + roofH / 2 + 0.05;
    g.add(roof);
    // glowing windows
    const win = new THREE.MeshBasicMaterial({ color: C.goldHi });
    for (let i = 0; i < 3; i++) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.2), win);
      const a = i * 2.1 + 0.4;
      w.position.set(Math.sin(a) * (r + 0.01), h * (0.35 + i * 0.22), Math.cos(a) * (r + 0.01));
      w.lookAt(w.position.clone().multiplyScalar(2).setY(w.position.y));
      g.add(w);
    }
    // flag
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 5), mat(C.wallShade));
    pole.position.y = h + roofH + 0.35;
    g.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.2), new THREE.MeshBasicMaterial({ color: C.gold, side: THREE.DoubleSide }));
    flag.position.set(0.17, h + roofH + 0.55, 0);
    flag.userData.flag = true;
    g.add(flag);
    g.position.set(x, 0.6, z);
    return g;
  }

  function castle() {
    const g = new THREE.Group();
    const keep = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.7, 1.6), mat(C.wall, { flatShading: false }));
    keep.position.y = 0.6 + 0.85;
    g.add(keep);
    const keepRoof = new THREE.Mesh(new THREE.ConeGeometry(1.55, 1.1, 4), mat(C.roof, { roughness: 0.6, metalness: 0.15 }));
    keepRoof.rotation.y = Math.PI / 4;
    keepRoof.position.y = 0.6 + 1.7 + 0.55;
    g.add(keepRoof);
    // gold door
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.7), new THREE.MeshBasicMaterial({ color: C.goldHi }));
    door.position.set(0, 0.6 + 0.35, 0.81);
    g.add(door);
    const arch = new THREE.Mesh(new THREE.CircleGeometry(0.21, 16, 0, Math.PI), new THREE.MeshBasicMaterial({ color: C.goldHi }));
    arch.position.set(0, 0.6 + 0.7, 0.81);
    g.add(arch);
    // windows on the keep
    const win = new THREE.MeshBasicMaterial({ color: C.goldHi });
    [-0.65, 0.65].forEach((x) => {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.28), win);
      w.position.set(x, 0.6 + 1.1, 0.81);
      g.add(w);
    });
    g.add(tower(-1.35, 0.55, 0.36, 2.3, 0.95, C.roof));
    g.add(tower(1.35, 0.55, 0.36, 2.3, 0.95, C.roof));
    g.add(tower(-1.2, -0.75, 0.3, 2.9, 0.85, C.gold));
    g.add(tower(1.2, -0.75, 0.3, 2.9, 0.85, C.gold));
    g.add(tower(0, -0.4, 0.42, 3.6, 1.3, C.gold));
    // cross of light on the tallest tower
    const crossMat = new THREE.MeshBasicMaterial({ color: C.goldHi });
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), crossMat);
    const hbar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.06), crossMat);
    v.position.set(0, 0.6 + 3.6 + 1.3 + 0.5, -0.4);
    hbar.position.set(0, 0.6 + 3.6 + 1.3 + 0.62, -0.4);
    g.add(v, hbar);
    // trees
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.3;
      const rr = 2.65 + (i % 2) * 0.25;
      const t = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.35, 5), mat(C.wood));
      trunk.position.y = 0.17;
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.75, 6), mat(i % 3 ? C.grassLight : C.grass));
      crown.position.y = 0.7;
      t.add(trunk, crown);
      t.position.set(Math.sin(a) * rr, 0.6, Math.cos(a) * rr);
      t.scale.setScalar(rnd(0.8, 1.15));
      g.add(t);
    }
    return g;
  }

  const main = new THREE.Group();
  main.add(makeIsland(3.4, 3.2, 14));
  main.add(castle());
  main.position.set(0, -0.6, 0);
  world.add(main);

  // companion islands
  const isles = [];
  [[-6.2, -1.6, -3.5, 1.1], [5.6, 0.6, -5, 0.9], [-3.8, 3.2, -8, 0.6], [4.2, -3.1, 2.5, 0.55]].forEach(([x, y, z, s], i) => {
    const g = makeIsland(1.4, 1.5, 9);
    if (i < 2) {
      const t = tower(0, 0, 0.22, 1.1 + i * 0.4, 0.55, i ? C.gold : C.roof);
      t.position.set(0, 0.6, 0);
      g.add(t);
    }
    g.position.set(x, y, z);
    g.scale.setScalar(s);
    g.userData.base = y;
    g.userData.phase = i * 1.7;
    world.add(g);
    isles.push(g);
  });

  /* ---------- the family Bible ---------- */
  const book = new THREE.Group();
  const coverMat = mat(C.maroon, { roughness: 0.55, flatShading: false });
  const pageMat = new THREE.MeshStandardMaterial({ color: C.page, emissive: 0xffd77a, emissiveIntensity: 0.35, roughness: 0.9 });
  [-1, 1].forEach((s) => {
    const cover = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.5), coverMat);
    cover.position.set(s * 0.58, 0, 0);
    cover.rotation.z = -s * 0.22;
    book.add(cover);
    const pages = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.16, 1.38), pageMat);
    pages.position.set(s * 0.55, 0.1, 0);
    pages.rotation.z = -s * 0.2;
    book.add(pages);
  });
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 1.5), coverMat);
  book.add(spine);
  // gold page glow sprite
  const glowTex = makeGlowTexture();
  const bookGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: C.gold, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  bookGlow.scale.set(3.2, 3.2, 1);
  bookGlow.position.y = 0.3;
  book.add(bookGlow);
  book.position.set(small ? 3.2 : 4.2, 1.9, 2.2);
  book.rotation.set(0.35, -0.6, 0.1);
  world.add(book);

  /* ---------- the marvelous light beam ---------- */
  const beamMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 3.6, 12, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffd66b, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  beamMesh.position.set(0.3, 6, 0.4);
  world.add(beamMesh);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffe08a, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.scale.set(9, 9, 1);
  halo.position.set(0.3, 3.2, -0.5);
  world.add(halo);

  /* ---------- clouds ---------- */
  const clouds = [];
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xf8f5ef, roughness: 1, transparent: true, opacity: 0.86, flatShading: true });
  for (let i = 0; i < (small ? 6 : 10); i++) {
    const g = new THREE.Group();
    const n = 3 + Math.floor(Math.random() * 3);
    for (let k = 0; k < n; k++) {
      const s = rnd(0.45, 0.95);
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), cloudMat);
      m.position.set(k * 0.7 - (n * 0.35), rnd(-0.15, 0.2), rnd(-0.3, 0.3));
      m.scale.y = 0.62;
      g.add(m);
    }
    g.position.set(rnd(-11, 11), rnd(-4.5, 4.5), rnd(-12, -1));
    g.userData.speed = rnd(0.08, 0.22);
    g.scale.setScalar(rnd(0.6, 1.3));
    world.add(g);
    clouds.push(g);
  }

  /* ---------- stars + golden motes ---------- */
  const starCount = small ? 350 : 800;
  const starGeo = new THREE.BufferGeometry();
  const sp = new Float32Array(starCount * 3);
  const ss = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    const r = rnd(22, 60), th = rnd(0, Math.PI * 2), ph = rnd(0.15, Math.PI * 0.75);
    sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
    sp[i * 3 + 1] = r * Math.cos(ph) - 4;
    sp[i * 3 + 2] = -Math.abs(r * Math.sin(ph) * Math.sin(th)) - 4;
    ss[i] = rnd(0.5, 1.6);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  starGeo.setAttribute('aScale', new THREE.BufferAttribute(ss, 1));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixel: { value: renderer.getPixelRatio() } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aScale; uniform float uPixel; varying float vTw;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
      gl_PointSize = aScale * 2.4 * uPixel; vTw = aScale; }`,
    fragmentShader: `uniform float uTime; varying float vTw;
      void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
      float tw = 0.65 + 0.35 * sin(uTime * (0.8 + vTw) + vTw * 17.0);
      float a = smoothstep(0.5, 0.05, d) * tw; gl_FragColor = vec4(1.0, 0.96, 0.85, a); }`
  });
  scene.add(new THREE.Points(starGeo, starMat));

  const moteCount = small ? 90 : 220;
  const moteGeo = new THREE.BufferGeometry();
  const mp = new Float32Array(moteCount * 3);
  const mseed = new Float32Array(moteCount);
  for (let i = 0; i < moteCount; i++) {
    mp[i * 3] = rnd(-7, 7); mp[i * 3 + 1] = rnd(-4, 6); mp[i * 3 + 2] = rnd(-6, 4);
    mseed[i] = Math.random();
  }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(mp, 3));
  moteGeo.setAttribute('aSeed', new THREE.BufferAttribute(mseed, 1));
  const moteMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixel: { value: renderer.getPixelRatio() } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSeed; uniform float uTime; uniform float uPixel; varying float vA;
      void main(){ vec3 p = position; float t = uTime * (0.12 + aSeed * 0.18);
      p.y = mod(p.y + t, 10.0) - 4.0; p.x += sin(uTime * 0.6 + aSeed * 40.0) * 0.35;
      vec4 mv = modelViewMatrix * vec4(p,1.0); gl_Position = projectionMatrix * mv;
      gl_PointSize = (3.0 + aSeed * 5.0) * uPixel * (10.0 / max(1.0, -mv.z));
      vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.3 + aSeed * 60.0)); }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
      float a = smoothstep(0.5, 0.0, d) * vA; gl_FragColor = vec4(1.0, 0.85, 0.42, a); }`
  });
  world.add(new THREE.Points(moteGeo, moteMat));

  /* ---------- interaction ---------- */
  const mouse = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);
  if (!reduce && !small) {
    window.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }
  let scrollP = 0; // 0 at top → 1 when hero has scrolled away
  const onScroll = () => {
    const h = host.getBoundingClientRect().height || 1;
    scrollP = Math.min(1, Math.max(0, window.scrollY / h));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- sizing ---------- */
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 720 ? 52 : 38;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---------- render loop ---------- */
  let visible = true, hidden = false, raf = 0;
  const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible && !reduce) loop(); }, { threshold: 0.01 });
  io.observe(host);
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; if (!hidden && visible && !reduce) loop(); });

  const clock = new THREE.Clock();
  function frame() {
    const t = clock.getElapsedTime();
    mouse.lerp(target, 0.045);
    // camera: slow drift, mouse parallax, scroll pull-back
    camera.position.x = camBase.x + Math.sin(t * 0.18) * 0.6 + mouse.x * 1.1;
    camera.position.y = camBase.y + Math.cos(t * 0.14) * 0.3 - mouse.y * 0.6 + scrollP * 5.5;
    camera.position.z = camBase.z + scrollP * 6;
    camera.lookAt(small ? 0 : 1.6, 1.2 - scrollP * 1.5, 0);
    main.position.y = -0.6 + Math.sin(t * 0.55) * 0.18;
    main.rotation.y = Math.sin(t * 0.09) * 0.12;
    isles.forEach((g) => { g.position.y = g.userData.base + Math.sin(t * 0.5 + g.userData.phase) * 0.28; g.rotation.y = Math.sin(t * 0.07 + g.userData.phase) * 0.2; });
    book.position.y = 1.9 + Math.sin(t * 0.7 + 1) * 0.22;
    book.position.x = (small ? 3.2 : 4.2) + Math.sin(t * 0.3) * 0.15;
    book.rotation.y = -0.6 + Math.sin(t * 0.25) * 0.25;
    clouds.forEach((c) => { c.position.x += c.userData.speed * 0.016; if (c.position.x > 13) c.position.x = -13; });
    world.traverse((o) => { if (o.userData.flag) o.rotation.y = Math.sin(t * 6 + o.position.x) * 0.25; });
    beamMesh.material.opacity = 0.075 + Math.sin(t * 0.8) * 0.02;
    halo.material.opacity = 0.42 + Math.sin(t * 0.8) * 0.08;
    starMat.uniforms.uTime.value = t;
    moteMat.uniforms.uTime.value = t;
    renderer.render(scene, camera);
  }
  function loop() {
    cancelAnimationFrame(raf);
    if (!visible || hidden) return;
    frame();
    raf = requestAnimationFrame(loop);
  }
  if (reduce) { camera.lookAt(0, 1.2, 0); frame(); } else { loop(); }

  function makeGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,230,150,0.55)');
    g.addColorStop(1, 'rgba(255,200,80,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
}
