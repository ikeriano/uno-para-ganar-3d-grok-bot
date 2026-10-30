// Plató 3D de «Uno para ganar» (low-poly, sin sombras, pensado para Redmi A2)
import * as THREE from './three.module.min.js';
export { THREE };
const TAU = Math.PI * 2;
export const E = { cams: {}, people: {}, beams: [], anim: [], tema: 'normal', camHook: null, slow: false };
function txt(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.userData.c = c; return t; }
function logoTex(seg) {
  return txt(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = '#0b2a8a'; g.beginPath(); g.arc(128, 128, 124, 0, TAU); g.fill();
    g.lineWidth = 14; g.strokeStyle = '#e8262d'; g.beginPath(); g.arc(128, 128, 112, 0, TAU); g.stroke();
    if (seg != null) { g.lineWidth = 14; g.strokeStyle = seg <= 10 ? '#ff4d3a' : '#ffd23a'; g.beginPath(); g.arc(128, 128, 112, -Math.PI / 2, -Math.PI / 2 + TAU * seg / 60); g.stroke();
      g.fillStyle = '#fff'; g.font = 'bold 120px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(Math.ceil(seg)), 128, 136); return; }
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = 'bold 40px Arial'; g.fillText('UNO', 128, 92); g.font = 'bold 30px Arial'; g.fillText('PARA', 128, 128);
    g.font = 'bold 44px Arial'; g.fillStyle = '#ffcf33'; g.fillText('GANAR', 128, 172); g.font = 'bold 22px Arial'; g.fillStyle = '#9fd0ff'; g.fillText('1 MINUTO', 128, 205);
  });
}
function pantallaTex(t1, t2) {
  return txt(512, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#062a9e'); gr.addColorStop(1, '#0a1240'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(120,180,255,${Math.random() * .5})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); }
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = 'bold 64px Arial'; g.fillText(t1, w / 2, 120); g.fillStyle = '#ffcf33'; g.font = 'bold 40px Arial'; g.fillText(t2, w / 2, 180);
  });
}
export function setPantallas(t1, t2) { for (const m of E.pantallas || []) { const old = m.material.map; m.material.map = pantallaTex(t1, t2); m.material.needsUpdate = true; old && old.dispose(); } }
let relojSeg = -1;
export function setReloj(seg) { // null = logo
  const k = seg == null ? -1 : Math.ceil(seg); if (k === relojSeg) return; relojSeg = k;
  const old = E.logo.material.map; E.logo.material.map = logoTex(seg == null ? null : Math.max(0, seg)); E.logo.material.needsUpdate = true; old.dispose();
}
function persona(o) {
  const g = new THREE.Group(), M = c => new THREE.MeshLambertMaterial({ color: c });
  const piel = M(o.piel || 0xf0c19a), traje = M(o.traje), camisa = M(o.camisa || 0xffffff), pant = M(o.pant || 0x1b1e2a);
  const leg = new THREE.CylinderGeometry(.13, .12, .9, 6);
  for (const s of [-1, 1]) { const l = new THREE.Mesh(leg, pant); l.position.set(s * .16, .45, 0); g.add(l); }
  const tor = new THREE.Mesh(new THREE.BoxGeometry(.62, .78, .32), traje); tor.position.y = 1.3; g.add(tor);
  const pec = new THREE.Mesh(new THREE.BoxGeometry(.2, .6, .02), camisa); pec.position.set(0, 1.35, .17); g.add(pec);
  if (o.corbata) { const cb = new THREE.Mesh(new THREE.BoxGeometry(.07, .4, .02), M(o.corbata)); cb.position.set(0, 1.38, .185); g.add(cb); }
  const head = new THREE.Group(); head.position.y = 1.93; g.add(head);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(.24, 10, 8), piel));
  const pelo = new THREE.Mesh(new THREE.SphereGeometry(.255, 10, 6, 0, TAU, 0, 1.4), M(o.pelo || 0x2a1a10)); pelo.rotation.x = -.35; head.add(pelo);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.035, 5, 4), M(0x111111)); e.position.set(s * .09, .03, .215); head.add(e); }
  const boca = new THREE.Mesh(new THREE.BoxGeometry(.12, .025, .02), M(0x8a2b2b)); boca.position.set(0, -.09, .22); head.add(boca);
  const arms = [];
  for (const s of [-1, 1]) { const p = new THREE.Group(); p.position.set(s * .4, 1.62, 0); const a = new THREE.Mesh(new THREE.CylinderGeometry(.09, .08, .72, 6), traje); a.position.y = -.36; p.add(a);
    const hd = new THREE.Mesh(new THREE.SphereGeometry(.085, 6, 5), piel); hd.position.y = -.74; p.add(hd); g.add(p); arms.push(p); }
  g.userData = { head, arms, boca, gesto: 'quieto', t: Math.random() * 9, habla: 0 };
  if (o.micro) { const mc = new THREE.Mesh(new THREE.CylinderGeometry(.03, .02, .22, 5), M(0x222222)); mc.position.set(0, -.8, .05); mc.rotation.x = .3; arms[1].add(mc); }
  return g;
}
function animaPersona(p, dt) {
  const u = p.userData; u.t += dt; const t = u.t, [L, R] = u.arms;
  let lx = 0, rx = 0, lz = .08, rz = -.08;
  switch (u.gesto) {
    case 'saluda': rz = -2.6 + Math.sin(t * 8) * .35; break;
    case 'aplaude': lx = rx = -1.2; lz = .7 + Math.sin(t * 18) * .25; rz = -lz; break;
    case 'celebra': lz = 2.7 + Math.sin(t * 6) * .2; rz = -lz; break;
    case 'señala': rx = -1.5; break;
    case 'piensa': rx = -2.2; rz = .5; break;
    case 'explica': lx = -.9 + Math.sin(t * 3) * .3; rx = -.9 + Math.cos(t * 2.6) * .3; break;
    case 'risa': lz = .4; rz = -.4; p.position.y = Math.abs(Math.sin(t * 10)) * .05; break;
    case 'triste': u.head.rotation.x = .35; break;
    case 'baila': lz = 1.5 + Math.sin(t * 6) * .8; rz = -1.5 + Math.sin(t * 6) * .8; p.rotation.y += Math.sin(t * 3) * .01; break;
  }
  if (u.gesto !== 'triste') u.head.rotation.x = Math.sin(t * 1.3) * .05 + (u.habla > 0 ? Math.sin(t * 9) * .06 : 0);
  if (u.gesto !== 'risa') p.position.y = 0;
  L.rotation.x += (lx - L.rotation.x) * .15; R.rotation.x += (rx - R.rotation.x) * .15; L.rotation.z += (lz - L.rotation.z) * .15; R.rotation.z += (rz - R.rotation.z) * .15;
  u.boca.scale.y = u.habla > 0 ? 1 + Math.abs(Math.sin(t * 14)) * 3 : 1; if (u.habla > 0) u.habla -= dt;
}
export function init(canvas, calidad) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  E.r = r; setCalidad(calidad);
  const sc = E.scene = new THREE.Scene(); sc.background = new THREE.Color(0x03040b); sc.fog = new THREE.Fog(0x03040b, 22, 48);
  const cam = E.camera = new THREE.PerspectiveCamera(55, 1, .1, 120); cam.position.set(0, 4, 14);
  sc.add(new THREE.HemisphereLight(0x9fb8ff, 0x201008, .9));
  const dl = new THREE.DirectionalLight(0xffffff, 1.6); dl.position.set(3, 10, 8); sc.add(dl);
  E.pl1 = new THREE.PointLight(0x3a7bff, 30, 30); E.pl1.position.set(-7, 6, -2); sc.add(E.pl1);
  E.pl2 = new THREE.PointLight(0xff7a1a, 30, 30); E.pl2.position.set(7, 6, -2); sc.add(E.pl2);
  const set = E.set = new THREE.Group(); sc.add(set);
  // suelo negro brillante + anillo de luz
  const floor = new THREE.Mesh(new THREE.CircleGeometry(30, 40), new THREE.MeshPhongMaterial({ color: 0x05060d, shininess: 90, specular: 0x334466 })); floor.rotation.x = -Math.PI / 2; set.add(floor);
  const esc = new THREE.Mesh(new THREE.CylinderGeometry(7, 7.3, .25, 40), new THREE.MeshPhongMaterial({ color: 0x0a0c18, shininess: 120, specular: 0x5566aa })); esc.position.y = .12; set.add(esc);
  E.tiles = new THREE.MeshBasicMaterial({ color: 0xeaf2ff });
  const tg = new THREE.BoxGeometry(1.05, .05, .5);
  for (let i = 0; i < 32; i++) { const a = i / 32 * TAU, m = new THREE.Mesh(tg, E.tiles); m.position.set(Math.sin(a) * 6.5, .26, Math.cos(a) * 6.5); m.rotation.y = a; set.add(m); }
  E.ringMat = new THREE.MeshBasicMaterial({ color: 0xff7a1a });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(7.15, .06, 4, 64), E.ringMat); ring.rotation.x = Math.PI / 2; ring.position.y = .25; set.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3, .05, 4, 48), new THREE.MeshBasicMaterial({ color: 0x3a8bff })); ring2.rotation.x = Math.PI / 2; ring2.position.y = .26; set.add(ring2); E.ring2 = ring2;
  // torre central con el logo/reloj
  const tw = new THREE.Mesh(new THREE.BoxGeometry(5, 10, 1.2), new THREE.MeshPhongMaterial({ color: 0x0b0e1c })); tw.position.set(0, 5, -12); set.add(tw);
  E.logo = new THREE.Mesh(new THREE.CircleGeometry(2.2, 40), new THREE.MeshBasicMaterial({ map: logoTex(null), transparent: true })); E.logo.position.set(0, 7, -11.35); set.add(E.logo);
  E.escMats = [new THREE.MeshBasicMaterial({ color: 0xff7a1a }), new THREE.MeshBasicMaterial({ color: 0xe8262d })];
  for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(4.6 - i * .2, .08, .08), E.escMats[i % 2]); s.position.set(0, .4 + i * .55, -11.3); set.add(s); }
  // pantallas LED laterales
  E.pantallas = [];
  for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.5), new THREE.MeshBasicMaterial({ map: pantallaTex('UNO PARA GANAR', '1 MINUTO') }));
    m.position.set(s * 9.5, 4.6, -9); m.rotation.y = -s * .55; set.add(m); E.pantallas.push(m);
    const fr = new THREE.Mesh(new THREE.BoxGeometry(9.4, 4.9, .2), new THREE.MeshPhongMaterial({ color: 0x111522 })); fr.position.copy(m.position); fr.rotation.copy(m.rotation); fr.translateZ(-.12); set.add(fr); }
  // gradas con público (instanciado)
  const seatG = new THREE.BoxGeometry(.6, .5, .55), bodyG = new THREE.BoxGeometry(.48, .6, .3), headG = new THREE.SphereGeometry(.17, 6, 5);
  const pos = []; for (let f = 0; f < 4; f++) for (let i = 0; i < 14; i++) for (const sg of [-1, 1]) { const th = sg * (.55 + i / 13 * 1.0), rad = 12 + f * 1.3; pos.push([Math.sin(th) * rad, f * .7, Math.cos(th) * rad, th, f]); }
  const seats = new THREE.InstancedMesh(seatG, new THREE.MeshLambertMaterial({ color: 0x111111 }), pos.length);
  const bodies = new THREE.InstancedMesh(bodyG, new THREE.MeshLambertMaterial({ color: 0xffffff }), pos.length);
  const heads = new THREE.InstancedMesh(headG, new THREE.MeshLambertMaterial({ color: 0xe8b48c }), pos.length);
  const o = new THREE.Object3D(), cols = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0xecf0f1, 0xe67e22, 0x34495e];
  E.publico = { bodies, heads, pos, o };
  pos.forEach((p, i) => { const [x, y, z, a] = p; o.position.set(x, y + .45, z); o.rotation.set(0, Math.PI + a, 0); o.position.y = y + .25; o.updateMatrix(); seats.setMatrixAt(i, o.matrix);
    bodies.setColorAt(i, new THREE.Color(cols[i % 8])); });
  set.add(seats, bodies, heads); posPublico(0, 0);
  for (let f = 0; f < 4; f++) for (const th of [.02, 2.12]) { const st = new THREE.Mesh(new THREE.TorusGeometry(11.5 + f * 1.3, .04, 3, 20, 1.0), E.escMats[0]); st.rotation.set(Math.PI / 2, 0, th); st.position.y = f * .7 + .03; set.add(st); }
  // truss de luces y haces falsos
  const truss = new THREE.Mesh(new THREE.TorusGeometry(9, .12, 4, 40), new THREE.MeshLambertMaterial({ color: 0x777788 })); truss.rotation.x = Math.PI / 2; truss.position.y = 10; set.add(truss);
  const beamG = new THREE.ConeGeometry(1.6, 10, 12, 1, true); beamG.translate(0, -5, 0);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, c = i % 2 ? 0x66aaff : 0xffaa55;
    const b = new THREE.Mesh(beamG, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .09, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    b.position.set(Math.sin(a) * 9, 10, Math.cos(a) * 9); set.add(b); E.beams.push({ m: b, a, ph: i });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.22, 6, 5), new THREE.MeshBasicMaterial({ color: c })); bulb.position.copy(b.position); set.add(bulb); }
  // mesa de pruebas
  const mesa = E.mesa = new THREE.Group(); const top = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, .1, 24), new THREE.MeshPhongMaterial({ color: 0x1d58d8, shininess: 60 }));
  top.position.y = 1; mesa.add(top); const leg = new THREE.Mesh(new THREE.CylinderGeometry(.25, .5, 1, 12), new THREE.MeshPhongMaterial({ color: 0xdddddd })); leg.position.y = .5; mesa.add(leg);
  mesa.position.set(0, .25, 0); set.add(mesa);
  E.util = new THREE.Group(); E.util.position.set(0, 1.3, 0); mesa.add(E.util);
  // personas
  E.people.host = persona({ traje: 0x15182a, corbata: 0x1d58d8, pelo: 0x3a2a1a, micro: true });
  E.people.conc = persona({ traje: 0xe8262d, camisa: 0xe8262d, pelo: 0x1a1a1a, pant: 0x2a3a6a });
  E.people.marta = persona({ traje: 0x7a2a8a, pelo: 0x5a2a10, pant: 0x7a2a8a });
  E.people.dani = persona({ traje: 0x2f6f3f, pelo: 0x101010 });
  E.people.lucia = persona({ traje: 0xd88a1a, pelo: 0xc8a050, pant: 0x333333 });
  E.people.sergio = persona({ traje: 0x444a55, pelo: 0x777777 });
  E.people.guia = persona({ traje: 0x6a4a2a, pelo: 0xdddddd, pant: 0x6a4a2a });
  for (const k in E.people) { sc.add(E.people[k]); E.people[k].visible = false; }
  E.people.host.position.set(-2.2, .25, 1.6); E.people.host.rotation.y = .5; E.people.host.visible = true;
  E.people.conc.position.set(2.2, .25, 1.6); E.people.conc.rotation.y = -.5; E.people.conc.visible = true;
  // cámaras con nombre
  const C = E.cams;
  C.general = [[0, 5.5, 16], [0, 2.5, -2]]; C.presentador = [[-1.2, 2.3, 5.5], [-2.2, 1.9, 1.6]]; C.concursante = [[1.2, 2.3, 5.5], [2.2, 1.9, 1.6]];
  C.dos = [[0, 2.4, 7.5], [0, 1.8, 1.6]]; C.mesa = [[0, 3.4, 4.2], [0, 1.2, 0]]; C.reloj = [[0, 5.5, -3], [0, 7, -11]]; C.publico = [[0, 3, 2], [0, 1.5, 13]];
  C.alta = [[0, 13, 10], [0, 0, 0]]; C.lateral = [[10, 3, 6], [0, 1.5, 0]]; C.cerca = [[-1.6, 2, 3.4], [-2.2, 1.9, 1.6]];
  E.camT = { p: new THREE.Vector3(...C.general[0]), l: new THREE.Vector3(...C.general[1]) }; E.camL = E.camT.l.clone(); E.orbit = 0;
  addEventListener('resize', resize); resize(); return E;
}
function posPublico(t, intens) { const { bodies, heads, pos, o } = E.publico;
  pos.forEach((p, i) => { const [x, y, z, a] = p, j = intens ? Math.abs(Math.sin(t * 9 + i)) * .12 * intens : 0;
    o.position.set(x, y + 1.05 + j, z); o.rotation.set(0, Math.PI + a, 0); o.updateMatrix(); bodies.setMatrixAt(i, o.matrix);
    o.position.y = y + 1.55 + j; o.updateMatrix(); heads.setMatrixAt(i, o.matrix); });
  bodies.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true; }
export function setCalidad(q) { E.q = q; E.r && E.r.setPixelRatio(q === 'alta' ? Math.min(devicePixelRatio, 1.5) : q === 'media' ? 1 : .7); resize(); }
function resize() { if (!E.r || !E.camera) return; E.r.setSize(innerWidth, innerHeight, false); E.camera.aspect = innerWidth / innerHeight; E.camera.updateProjectionMatrix(); }
export function cam(name, instant) { const c = E.cams[name] || name; E.orbit = 0; E.camT.p.set(...c[0]); E.camT.l.set(...c[1]); if (instant) { E.camera.position.copy(E.camT.p); E.camL.copy(E.camT.l); } }
export function orbita(on) { E.orbit = on ? 1 : 0; }
export function gesto(who, g) { const p = E.people[who]; if (p) p.userData.gesto = g || 'quieto'; }
export function habla(who, s) { const p = E.people[who]; if (p) p.userData.habla = s; }
export function aplausos(s) { E.aplT = s; }
export function tema(t) { E.tema = t; const T = { normal: [0x3a7bff, 0xff7a1a, 0xeaf2ff], halloween: [0x8a2be2, 0xff6a00, 0xffb060], navidad: [0xe8262d, 0x1faa4a, 0xfff4e0], verano: [0x00c8ff, 0xffd23a, 0xfffbe0], entreno: [0xffffff, 0xffffff, 0xffffff], brasil: [0x1faa4a, 0xffd23a, 0xeaf2ff] }[t] || [0x3a7bff, 0xff7a1a, 0xeaf2ff];
  E.pl1.color.setHex(T[0]); E.pl2.color.setHex(T[1]); E.tiles.color.setHex(T[2]); E.ringMat.color.setHex(T[1]); E.escMats[0].color.setHex(T[1]); E.ring2.material.color.setHex(T[0]);
  E.beams.forEach((b, i) => b.m.material.color.setHex(i % 2 ? T[0] : T[1])); }
let last = performance.now(), fr = 0, tt = 0;
export function loop(extra) {
  const f = now => { requestAnimationFrame(f); const dt = Math.min(.05, (now - last) / 1000); last = now; tt += dt; extra && extra(dt, tt);
    if (E.slow && (fr++ % 3)) return; if (E.hidden) return;
    const c = E.camera;
    if (E.camHook) E.camHook(dt); else if (!E.manual) {
      if (E.orbit) { const a = tt * .12, R = 15; E.camT.p.set(Math.sin(a) * R, 5, Math.cos(a) * R); E.camT.l.set(0, 2, 0); }
      const k = 1 - Math.pow(.04, dt); c.position.lerp(E.camT.p, k); E.camL.lerp(E.camT.l, k); c.lookAt(E.camL); }
    for (const k in E.people) if (E.people[k].visible) animaPersona(E.people[k], dt * (E.slow ? 3 : 1));
    E.beams.forEach(b => { b.m.rotation.x = Math.sin(tt * .7 + b.ph) * .35; b.m.rotation.z = Math.cos(tt * .5 + b.ph) * .35; });
    E.aplT > 0 ? (E.aplT -= dt * (E.slow ? 3 : 1), posPublico(tt, 1)) : E.aplT > -1 && (E.aplT = -2, posPublico(0, 0));
    E.anim.forEach(a => a(dt, tt)); E.r.render(E.scene, c);
  }; requestAnimationFrame(f);
}
E.persona = persona; E.logoTex = logoTex; E.txt = txt;
