/* Tool Mart hero — procedural 3D "precision hardware" scene (Three.js, self-hosted bundle).
   Design intent: chrome hex nut + threaded pipe + orange machined gear, floating fasteners,
   drifting sparks. Reflections via RoomEnvironment (no texture downloads). */
import * as THREE from '../vendor/three/three-bundle.min.js';

const canvas = document.getElementById('hero-canvas');
const hero = document.getElementById('hero');
if (!canvas || !hero) throw new Error('hero canvas missing');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglOK() { try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; } }
if (!webglOK()) { hero.classList.add('no-webgl'); throw new Error('no webgl'); }

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = innerWidth > 760; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0.6, 12.5);

/* Materials */
const chrome = new THREE.MeshStandardMaterial({ color: 0xd9dee5, metalness: 1, roughness: 0.22, envMapIntensity: 1.3 });
const steel = new THREE.MeshStandardMaterial({ color: 0x8b95a3, metalness: 0.95, roughness: 0.38, envMapIntensity: 1.0 });
const dark = new THREE.MeshStandardMaterial({ color: 0x2a3340, metalness: 0.8, roughness: 0.45 });
const orange = new THREE.MeshPhysicalMaterial({ color: 0xf26a1b, metalness: 0.25, roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.25, envMapIntensity: 0.9 });

/* Geometry helpers */
function hexShape(r) { const s = new THREE.Shape(); for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? s.lineTo(x, y) : s.moveTo(x, y); } s.closePath(); return s; }
function hexNut(rOuter, rHole, depth, mat) {
  const s = hexShape(rOuter); const hole = new THREE.Path(); hole.absarc(0, 0, rHole, 0, Math.PI * 2, true); s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: depth * 0.09, bevelSize: depth * 0.09, bevelSegments: 4, curveSegments: 32 });
  g.center(); const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; return m;
}
function threadedPipe(r, len, pitch, depth) {
  const pts = []; const n = Math.floor(len / pitch);
  for (let i = 0; i <= n; i++) { const y = -len / 2 + i * pitch; pts.push(new THREE.Vector2(r, y)); pts.push(new THREE.Vector2(r + depth, y + pitch * 0.5)); }
  pts.push(new THREE.Vector2(r, len / 2)); pts.unshift(new THREE.Vector2(r * 0.82, -len / 2)); pts.push(new THREE.Vector2(r * 0.82, len / 2));
  const g = new THREE.LatheGeometry(pts, 72); const m = new THREE.Mesh(g, steel); m.castShadow = m.receiveShadow = true; return m;
}
function gear(rOut, rIn, teeth, depth, mat) {
  const s = new THREE.Shape(); const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step, a1 = a0 + step * 0.32, a2 = a0 + step * 0.5, a3 = a0 + step * 0.82;
    const pts = [[rIn, a0], [rOut, a1], [rOut, a2], [rIn, a3]];
    pts.forEach(([r, a], k) => { const x = Math.cos(a) * r, y = Math.sin(a) * r; (i === 0 && k === 0) ? s.moveTo(x, y) : s.lineTo(x, y); });
  }
  s.closePath(); const hole = new THREE.Path(); hole.absarc(0, 0, rIn * 0.36, 0, Math.PI * 2, true); s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 2, curveSegments: 12 }); g.center();
  const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true;
  // spokes / hub for machined look
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(rIn * 0.5, rIn * 0.5, depth * 1.3, 32), chrome); hub.rotation.x = Math.PI / 2; m.add(hub);
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, depth * 1.4, 12), dark); b.rotation.x = Math.PI / 2; const a = (i / 5) * Math.PI * 2; b.position.set(Math.cos(a) * rIn * 0.7, Math.sin(a) * rIn * 0.7, 0); m.add(b); }
  return m;
}
function bolt(len) {
  const g = new THREE.Group(); const head = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 6), chrome); head.position.y = len / 2; g.add(head);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, len, 16), steel); g.add(shaft);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g;
}

/* Assembly */
const rig = new THREE.Group(); scene.add(rig);
const assembly = new THREE.Group(); rig.add(assembly);
const pipe = threadedPipe(0.78, 7.5, 0.11, 0.045); pipe.rotation.z = Math.PI / 2; assembly.add(pipe);
const nut = hexNut(1.75, 0.83, 0.85, chrome); nut.rotation.y = Math.PI / 2; nut.position.x = -0.4; assembly.add(nut);
const nut2 = hexNut(1.35, 0.83, 0.55, dark); nut2.rotation.y = Math.PI / 2; nut2.position.x = 2.3; assembly.add(nut2);
const g1 = gear(1.5, 1.22, 18, 0.34, orange); g1.position.set(2.75, 1.85, -0.9); assembly.add(g1);
const g2 = gear(0.82, 0.64, 11, 0.3, chrome); g2.position.set(4.1, 0.55, -0.7); assembly.add(g2);
const bolts = []; for (let i = 0; i < 6; i++) { const b = bolt(0.9 + Math.random() * 0.5); b.position.set(-3.2 + Math.random() * 7, -2.2 + Math.random() * 4.4, -2.5 + Math.random() * 2); b.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); b.userData = { s: 0.4 + Math.random() * 0.6, o: Math.random() * 6 }; assembly.add(b); bolts.push(b); }
// small floating nuts (instanced)
const smallNutGeo = hexNut(0.3, 0.14, 0.18, chrome).geometry; const inst = new THREE.InstancedMesh(smallNutGeo, chrome, 22); inst.castShadow = true;
const seeds = []; const dummy = new THREE.Object3D();
for (let i = 0; i < 22; i++) { const s = { p: new THREE.Vector3(-4.5 + Math.random() * 9.5, -2.8 + Math.random() * 5.6, -4 + Math.random() * 3.5), r: new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3), sp: 0.3 + Math.random() * 0.7, o: Math.random() * 6 }; seeds.push(s); }
assembly.add(inst);
// ground catch for shadows
const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.45 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -3.1; ground.receiveShadow = true; rig.add(ground);
// sparks
const N = 220; const pos = new Float32Array(N * 3); const vel = new Float32Array(N);
for (let i = 0; i < N; i++) { pos[i * 3] = -7 + Math.random() * 14; pos[i * 3 + 1] = -3 + Math.random() * 7; pos[i * 3 + 2] = -6 + Math.random() * 6; vel[i] = 0.15 + Math.random() * 0.45; }
const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const spriteCanvas = document.createElement('canvas'); spriteCanvas.width = spriteCanvas.height = 32; const cx = spriteCanvas.getContext('2d'); const grd = cx.createRadialGradient(16, 16, 0, 16, 16, 16); grd.addColorStop(0, 'rgba(255,190,120,1)'); grd.addColorStop(0.4, 'rgba(242,106,27,.6)'); grd.addColorStop(1, 'rgba(242,106,27,0)'); cx.fillStyle = grd; cx.fillRect(0, 0, 32, 32);
const sparks = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.09, map: new THREE.CanvasTexture(spriteCanvas), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 })); rig.add(sparks);

/* Lights */
scene.add(new THREE.HemisphereLight(0xaebccf, 0x0b0d10, 0.55));
const key = new THREE.DirectionalLight(0xfff2e6, 2.2); key.position.set(5, 7, 5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.near = 1; key.shadow.camera.far = 30; key.shadow.camera.left = key.shadow.camera.bottom = -9; key.shadow.camera.right = key.shadow.camera.top = 9; key.shadow.bias = -0.0005; scene.add(key);
const rim = new THREE.DirectionalLight(0xff7a2a, 2.6); rim.position.set(-7, 2, -5); scene.add(rim);
const fill = new THREE.PointLight(0x4f7bff, 1.2, 30); fill.position.set(-4, -2, 6); scene.add(fill);

/* Layout: object right of copy on wide screens */
let W = 1, Hh = 1;
function layout() {
  W = canvas.clientWidth || hero.clientWidth; Hh = canvas.clientHeight || hero.clientHeight;
  renderer.setSize(W, Hh, false); camera.aspect = W / Hh; camera.updateProjectionMatrix();
  const wide = W > 980;
  rig.position.x = wide ? 3.9 : 0; rig.position.y = wide ? 0.15 : 2.6;
  const s = wide ? Math.min(0.8, W / 1900) : Math.min(0.5, W / 1000); rig.scale.setScalar(s);
}
layout();
new ResizeObserver(layout).observe(hero);

/* Interaction */
const pointer = { x: 0, y: 0, tx: 0, ty: 0 }; let dragging = false, dragX = 0, dragVel = 0, spin = 0;
hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2; if (dragging) { dragVel = (e.clientX - dragX) * 0.004; spin += dragVel; dragX = e.clientX; } });
const stage = hero.querySelector('.hero__stage') || canvas; stage.style.pointerEvents = 'auto'; stage.style.cursor = 'grab';
stage.addEventListener('pointerdown', (e) => { dragging = true; dragX = e.clientX; stage.style.cursor = 'grabbing'; });
addEventListener('pointerup', () => { dragging = false; stage.style.cursor = 'grab'; });
let scrollP = 0; addEventListener('scroll', () => { scrollP = Math.min(1, scrollY / Math.max(1, hero.offsetHeight)); }, { passive: true });

/* Loop */
let running = true, visible = true; const clock = new THREE.Clock();
new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(hero);
document.addEventListener('visibilitychange', () => { running = document.visibilityState === 'visible'; });
function frame() {
  requestAnimationFrame(frame); if (!running || !visible) return;
  const dt = Math.min(clock.getDelta(), 0.05); const t = clock.elapsedTime;
  pointer.x += (pointer.tx - pointer.x) * 0.06; pointer.y += (pointer.ty - pointer.y) * 0.06;
  if (!dragging) { dragVel *= 0.94; spin += dragVel; }
  assembly.rotation.y = -0.35 + Math.sin(t * 0.18) * 0.18 + pointer.x * 0.22 + spin;
  assembly.rotation.x = 0.12 + pointer.y * 0.1 + scrollP * 0.5;
  assembly.position.y = Math.sin(t * 0.6) * 0.08 - scrollP * 1.2;
  nut.rotation.x += dt * 0.35; nut2.rotation.x -= dt * 0.5; pipe.rotation.x += dt * 0.2;
  g1.rotation.z -= dt * 0.45; g2.rotation.z += dt * 0.45 * (18 / 11);
  bolts.forEach((b) => { b.position.y += Math.sin(t * b.userData.s + b.userData.o) * 0.0025; b.rotation.x += dt * 0.25 * b.userData.s; b.rotation.z += dt * 0.15; });
  seeds.forEach((s, i) => { dummy.position.set(s.p.x, s.p.y + Math.sin(t * s.sp + s.o) * 0.25, s.p.z); dummy.rotation.set(s.r.x + t * 0.3 * s.sp, s.r.y + t * 0.2, s.r.z); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix); }); inst.instanceMatrix.needsUpdate = true;
  const p = pGeo.attributes.position.array; for (let i = 0; i < N; i++) { p[i * 3 + 1] += vel[i] * dt; p[i * 3] += Math.sin(t + i) * 0.002; if (p[i * 3 + 1] > 4.5) p[i * 3 + 1] = -3.2; } pGeo.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
if (reduced) { assembly.rotation.y = -0.35; renderer.render(scene, camera); } else frame();
