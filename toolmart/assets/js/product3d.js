/* Tool Mart PDP — interactive 3D product viewer.
   Loads a manufacturer GLB when <canvas data-model="path.glb"> is set; otherwise renders a
   stylized procedural threading machine so the experience works before assets arrive. */
import * as THREE from '../vendor/three/three-bundle.min.js';

const canvas = document.getElementById('product-canvas');
const viewer = document.getElementById('viewer');
if (!canvas || !viewer) throw new Error('viewer missing');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
function webglOK() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
if (!webglOK()) { viewer.classList.add('no-webgl'); throw new Error('no webgl'); }

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new THREE.RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.06; controls.enablePan = false; controls.minDistance = 5; controls.maxDistance = 12; controls.maxPolarAngle = Math.PI * 0.52; controls.minPolarAngle = 0.35;
controls.autoRotate = !reduced; controls.autoRotateSpeed = 0.9; controls.target.set(0, 0.6, 0);

const paint = new THREE.MeshStandardMaterial({ color: 0x232b36, metalness: 0.6, roughness: 0.5 });
const chrome = new THREE.MeshStandardMaterial({ color: 0xd7dce3, metalness: 1, roughness: 0.22 });
const steel = new THREE.MeshStandardMaterial({ color: 0x8b95a3, metalness: 0.95, roughness: 0.4 });
const orange = new THREE.MeshPhysicalMaterial({ color: 0xf26a1b, metalness: 0.2, roughness: 0.4, clearcoat: 0.6 });
const rubber = new THREE.MeshStandardMaterial({ color: 0x111418, metalness: 0.1, roughness: 0.9 });
const M = (geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) => { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.rotation.set(...rot); m.castShadow = m.receiveShadow = true; return m; };
function threaded(r, len, pitch, depth) { const pts = []; const n = Math.floor(len / pitch); for (let i = 0; i <= n; i++) { const y = -len / 2 + i * pitch; pts.push(new THREE.Vector2(r, y), new THREE.Vector2(r + depth, y + pitch / 2)); } pts.push(new THREE.Vector2(r, len / 2)); pts.unshift(new THREE.Vector2(r * 0.8, -len / 2)); pts.push(new THREE.Vector2(r * 0.8, len / 2)); return new THREE.LatheGeometry(pts, 64); }

/* Stylized threading machine (proportions inspired by a floor-standing 1/2"–4" threader) */
function buildMachine() {
  const g = new THREE.Group();
  const base = M(new THREE.BoxGeometry(5.2, 0.5, 2.2), paint, [0, 0, 0]); g.add(base);
  const tray = M(new THREE.BoxGeometry(5.0, 0.12, 2.0), steel, [0, 0.31, 0]); g.add(tray);
  // motor / gearbox housing on the left
  const gearbox = M(new THREE.BoxGeometry(1.5, 1.7, 1.9), paint, [-1.7, 1.1, 0]); g.add(gearbox);
  const motor = M(new THREE.CylinderGeometry(0.62, 0.62, 1.3, 40), paint, [-2.85, 1.0, 0], [0, 0, Math.PI / 2]); g.add(motor);
  const motorCap = M(new THREE.CylinderGeometry(0.4, 0.4, 0.25, 32), rubber, [-3.6, 1.0, 0], [0, 0, Math.PI / 2]); g.add(motorCap);
  const stripe = M(new THREE.BoxGeometry(1.52, 0.18, 1.92), orange, [-1.7, 1.55, 0]); g.add(stripe);
  // chuck with jaws
  const chuck = M(new THREE.CylinderGeometry(0.85, 0.85, 0.5, 48), chrome, [-0.75, 1.1, 0], [0, 0, Math.PI / 2]); g.add(chuck);
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; const jaw = M(new THREE.BoxGeometry(0.28, 0.5, 0.22), rubber, [-0.75, 1.1 + Math.cos(a) * 0.5, Math.sin(a) * 0.5], [a, 0, 0]); g.add(jaw); }
  // pipe through the chuck
  const pipe = M(threaded(0.3, 3.4, 0.08, 0.03), steel, [0.9, 1.1, 0], [0, 0, Math.PI / 2]); g.add(pipe);
  // carriage rails
  [0.55, -0.55].forEach((z) => g.add(M(new THREE.CylinderGeometry(0.06, 0.06, 3.6, 16), chrome, [0.9, 0.62, z], [0, 0, Math.PI / 2])));
  // carriage + die head
  const carriage = M(new THREE.BoxGeometry(0.7, 0.5, 1.5), paint, [1.4, 0.75, 0]); g.add(carriage);
  const dieHead = M(new THREE.TorusGeometry(0.62, 0.17, 20, 48), chrome, [1.4, 1.1, 0], [0, Math.PI / 2, 0]); g.add(dieHead);
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; g.add(M(new THREE.BoxGeometry(0.22, 0.32, 0.28), orange, [1.4, 1.1 + Math.cos(a) * 0.62, Math.sin(a) * 0.62], [a, 0, 0])); }
  const handwheel = M(new THREE.TorusGeometry(0.42, 0.045, 12, 40), chrome, [1.4, 0.75, 1.05], [0, 0, 0]); g.add(handwheel);
  [0, Math.PI / 3, 2 * Math.PI / 3].forEach((a) => g.add(M(new THREE.CylinderGeometry(0.03, 0.03, 0.84, 8), chrome, [1.4, 0.75, 1.05], [0, 0, a])));
  const knob = M(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16), rubber, [1.4, 0.75, 1.12], [Math.PI / 2, 0, 0]); g.add(knob);
  // cutter + reamer arms
  const cutter = M(new THREE.BoxGeometry(0.16, 0.9, 0.16), steel, [2.1, 1.35, -0.45], [0, 0, -0.35]); g.add(cutter);
  const reamer = M(new THREE.ConeGeometry(0.18, 0.7, 24), chrome, [2.35, 1.1, 0.5], [0, 0, -Math.PI / 2]); g.add(reamer);
  // legs
  [[-2.2, 0.85], [-2.2, -0.85], [2.2, 0.85], [2.2, -0.85]].forEach(([x, z]) => { g.add(M(new THREE.CylinderGeometry(0.07, 0.07, 1.9, 12), steel, [x, -1.2, z])); g.add(M(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 12), rubber, [x, -2.14, z])); });
  g.add(M(new THREE.BoxGeometry(4.4, 0.08, 0.08), steel, [0, -1.6, 0.85])); g.add(M(new THREE.BoxGeometry(4.4, 0.08, 0.08), steel, [0, -1.6, -0.85]));
  // oil tray / label plate
  g.add(M(new THREE.BoxGeometry(1.3, 0.08, 0.7), orange, [0.6, 0.42, -0.6]));
  g.add(M(new THREE.BoxGeometry(0.9, 0.5, 0.04), chrome, [-1.7, 1.1, 0.97]));
  return g;
}
const root = new THREE.Group(); scene.add(root);
const modelPath = canvas.dataset.model;
let machine = buildMachine(); root.add(machine);
if (modelPath) new THREE.GLTFLoader().load(modelPath, (gltf) => { root.remove(machine); const m = gltf.scene; const box = new THREE.Box3().setFromObject(m); const size = box.getSize(new THREE.Vector3()); const s = 5 / Math.max(size.x, size.y, size.z); m.scale.setScalar(s); box.setFromObject(m); const c = box.getCenter(new THREE.Vector3()); m.position.sub(c); m.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); root.add(m); machine = m; }, undefined, () => { /* keep procedural */ });

const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.ShadowMaterial({ opacity: 0.5 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.18; floor.receiveShadow = true; scene.add(floor);
const ring = new THREE.Mesh(new THREE.RingGeometry(3.4, 3.48, 96), new THREE.MeshBasicMaterial({ color: 0xf26a1b, transparent: true, opacity: 0.35, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = -2.17; scene.add(ring);
scene.add(new THREE.HemisphereLight(0xb8c4d4, 0x0b0d10, 0.6));
const key = new THREE.DirectionalLight(0xfff1e0, 2.4); key.position.set(4, 7, 5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = key.shadow.camera.bottom = -6; key.shadow.camera.right = key.shadow.camera.top = 6; key.shadow.bias = -0.0004; scene.add(key);
const rim = new THREE.DirectionalLight(0xff7a2a, 1.8); rim.position.set(-6, 3, -5); scene.add(rim);

/* Camera presets */
const views = { hero: [7.2, 3.2, 7.6], diehead: [4.2, 2.2, 4.6], chuck: [-1.5, 2.6, 5.8], top: [0.5, 8.5, 2.5] };
let goal = null;
function flyTo(name) { const v = views[name] || views.hero; goal = new THREE.Vector3(...v); controls.autoRotate = false; clearTimeout(flyTo.t); flyTo.t = setTimeout(() => { if (!reduced) controls.autoRotate = true; }, 6000); }
camera.position.set(...views.hero);
viewer.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => { viewer.querySelectorAll('[data-view]').forEach((x) => x.classList.toggle('chip--active', x === b)); flyTo(b.dataset.view); }));
controls.addEventListener('start', () => { goal = null; controls.autoRotate = false; clearTimeout(flyTo.t); flyTo.t = setTimeout(() => { if (!reduced) controls.autoRotate = true; }, 5000); });

function resize() { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(viewer); resize();
let visible = true; new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(viewer);
function loop() { requestAnimationFrame(loop); if (!visible) return; if (goal) { camera.position.lerp(goal, 0.06); if (camera.position.distanceTo(goal) < 0.02) goal = null; } controls.update(); renderer.render(scene, camera); }
loop();
