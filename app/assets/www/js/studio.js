/* Studio · editor 3D estilo Roblox Studio para móvil y tableta (módulo reutilizable, three.js).
   Uso: const ed = Studio.create({ THREE, getScene, getCamera, getCanvas, roots, setCameraHook, storageKey, onPlay, onExit });
   roots: () => [{ prefix:'s', root:Object3D, kind:(obj,i)=>'Decorado'|null }]   (null = no seleccionable)
   Datos por plató: { mods:{id:{p,r,s,c,m,a,del}}, add:[{id,t,p,r,s,c,m,a}] } en localStorage[storageKey]. */
(function () {
  'use strict';
  const CSS = `
.sto{position:fixed;inset:0;z-index:60;font:600 12px Arial,Roboto,sans-serif;color:#e8ecf4;pointer-events:none}
.sto *{box-sizing:border-box}.sto button,.sto select,.sto input{font:inherit;color:inherit;touch-action:manipulation}
.sto-touch{position:absolute;inset:0;pointer-events:auto;touch-action:none}
.sto-rib{position:absolute;left:0;right:0;top:0;height:42px;display:flex;gap:3px;align-items:center;padding:3px 4px;background:#1f2229f2;border-bottom:1px solid #3a3f4b;overflow-x:auto;pointer-events:auto;scrollbar-width:none}
.sto-rib::-webkit-scrollbar{display:none}
.sto-b{flex:none;min-width:36px;height:34px;padding:0 8px;border:1px solid #3a3f4b;border-radius:6px;background:#2b2f38;display:flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap}
.sto-b:active{background:#3b4250}.sto-b.on{background:#0b6ee0;border-color:#5aa6ff}.sto-b.play{background:#1a9a3c;border-color:#5fdc7f}
.sto-b[disabled]{opacity:.35}.sto-sep{flex:none;width:1px;height:26px;background:#454b58;margin:0 2px}
.sto-t{font-weight:900;color:#7fb6ff;padding:0 4px;flex:none}
.sto select{height:34px;background:#2b2f38;border:1px solid #3a3f4b;border-radius:6px;max-width:110px;flex:none}
.sto-pan{position:absolute;background:#1f2229f0;border:1px solid #3a3f4b;border-radius:8px;pointer-events:auto;display:flex;flex-direction:column;overflow:hidden}
.sto-h{display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#2b2f38;font-weight:900;min-height:30px}
.sto-h::after{content:'▾'}.sto-pan.col .sto-h::after{content:'▸'}.sto-pan.col .sto-c{display:none}
.sto-c{min-height:0;overflow-y:auto;padding:5px;flex:1;-webkit-overflow-scrolling:touch;touch-action:pan-y}
.sto-box{left:4px;top:46px;width:150px;max-height:calc(100% - 140px)}
.sto-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.sto-it{height:48px;border:1px solid #3a3f4b;border-radius:6px;background:#2b2f38;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:10px}
.sto-it i{font-style:normal;font-size:18px}
.sto-rt{right:4px;top:46px;width:190px;bottom:4px;background:none;border:0;gap:4px}
.sto-rt>.sto-pan{position:static;flex:1;min-height:30px}.sto-rt>.sto-pan.col{flex:none}
.sto-ex div{padding:5px 6px;border-radius:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sto-ex div.on{background:#0b6ee0}.sto-ex .g{color:#8a93a6;font-size:10px;padding:6px 2px 2px}
.sto-pr label{display:flex;align-items:center;justify-content:space-between;gap:4px;margin:4px 0}
.sto-pr input[type=number]{width:46px;height:26px;background:#2b2f38;border:1px solid #3a3f4b;border-radius:4px;padding:0 3px}
.sto-pr .xyz{display:flex;gap:2px}.sto-sw{display:flex;flex-wrap:wrap;gap:3px;margin:4px 0}.sto-sw b{width:22px;height:22px;border-radius:4px;border:2px solid #0006}
.sto-pr input[type=color]{width:34px;height:26px;border:0;padding:0;background:none}
.sto-cam{position:absolute;left:4px;bottom:4px;display:grid;grid-template-columns:repeat(4,38px);gap:3px;pointer-events:auto}
.sto-cam .sto-b{height:38px;font-size:16px;background:#1f2229e0}
.sto-fr{position:absolute;border:2px solid #39a0ff;box-shadow:0 0 0 1px #0008;pointer-events:none;display:none}
.sto-fr button{position:absolute;right:-36px;top:-36px;width:34px;height:34px;border-radius:50%;background:#e23b3b;border:2px solid #fff;color:#fff;font-size:16px;font-weight:900;pointer-events:auto}
.sto-toast{position:absolute;left:50%;bottom:48px;transform:translateX(-50%);background:#000c;padding:6px 12px;border-radius:14px;display:none}
.sto-mode{position:absolute;left:160px;top:48px;background:#000a;padding:3px 8px;border-radius:10px;font-size:11px}
@media (max-width:700px){.sto-rt{width:160px}.sto-box{width:128px}}`;
  const SW = [0xffffff, 0x1b1b1b, 0xe23b3b, 0xff8a00, 0xffd400, 0x2ecc40, 0x00c2ff, 0x1f5bff, 0x9b30ff, 0xff4fb6, 0x8b5a2b, 0xc0c0c0];
  const MATS = { plastico: 'Plástico', neon: 'Neón', metal: 'Metal', cristal: 'Cristal' };
  const AX = ['x', 'y', 'z'], AXC = [0xff3b3b, 0x3bdc4a, 0x3b7bff];
  const r3 = v => [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)];
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };

  function create(o) {
    const T = o.THREE, KEY = o.storageKey || 'studio_sets';
    const PLUG = o.plugins || [];
    const PAL = Object.assign({}, o.palette || defaultPalette(T), ...PLUG.map(p => p.palette || {}));
    let db; try { db = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { db = null; }
    if (!db || !db.sets) db = { sets: { 'Mi plató': { mods: {}, add: [] } }, cur: 'Mi plató', activo: null };
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('No se pudo guardar'); } };
    const S = () => db.sets[db.cur] || (db.sets[db.cur] = { mods: {}, add: [] });
    const ctx = { T, getScene: () => o.getScene(), getCamera: () => o.getCamera(), follow: () => o.followTarget ? o.followTarget() : null };
    const orig = new Map();   // obj -> {p,r,s,v,mats:[[mesh,mat]]}
    let reg = [], byId = new Map(), idOf = new Map(), added = null, rootsSig = '';
    let applied = null;       // set aplicado actualmente
    /* ---------- registro de piezas ---------- */
    function refresh() {
      const sc = o.getScene(); reg = []; byId.clear(); idOf.clear();
      if (!added) { added = new T.Group(); added.name = 'studio-added'; }
      if (added.parent !== sc) sc.add(added);
      for (const R of o.roots()) {
        if (!R.root) continue; const cnt = {};
        R.root.children.forEach((c, i) => { const k = R.kind(c, i); if (!k) return; cnt[k] = (cnt[k] || 0) + 1; const id = R.prefix + i; const p = { id, obj: c, kind: k, name: k + ' ' + cnt[k] }; reg.push(p); byId.set(id, p); idOf.set(c, p); });
      }
      const cnt = {};
      for (const c of added.children) { const d = c.userData.st; const k = PAL[d.t] ? PAL[d.t].n : d.t; cnt[k] = (cnt[k] || 0) + 1; const p = { id: d.id, obj: c, kind: k, name: k + ' ' + cnt[k], nuevo: true }; reg.push(p); byId.set(d.id, p); idOf.set(c, p); }
    }
    function sig() { return o.roots().map(R => R.root ? R.root.uuid : '-').join('|'); }
    function remember(obj) {
      if (orig.has(obj)) return; const mats = [];
      obj.traverse(m => { if (m.isMesh || m.isSprite) mats.push([m, m.material]); });
      orig.set(obj, { p: obj.position.clone(), r: obj.rotation.clone(), s: obj.scale.clone(), v: obj.visible, mats });
    }
    function restoreAll() {
      for (const [obj, b] of orig) { obj.position.copy(b.p); obj.rotation.copy(b.r); obj.scale.copy(b.s); obj.visible = b.v; for (const [m, mt] of b.mats) { if (m.material !== mt && m.material && m.material.dispose) m.material.dispose(); m.material = mt; } }
      orig.clear();
    }
    function matFor(kind, color, base) {
      let m;
      if (kind === 'neon') m = new T.MeshBasicMaterial({ color });
      else if (kind === 'metal') m = new T.MeshPhongMaterial({ color, shininess: 90, specular: 0xffffff });
      else if (kind === 'cristal') m = new T.MeshLambertMaterial({ color, transparent: true, opacity: .45, depthWrite: false });
      else m = new T.MeshLambertMaterial({ color });
      if (base && base.map) m.map = base.map; return m;
    }
    function paint(obj, c, mk) {
      obj.traverse(m => {
        if (!(m.isMesh || m.isSprite) || !m.material || Array.isArray(m.material)) return;
        const base = (orig.get(obj) && (orig.get(obj).mats.find(x => x[0] === m) || [])[1]) || m.material;
        const col = c != null ? c : (base.color ? base.color.getHex() : 0xffffff);
        let nm;
        if (m.isSprite || (!mk && base.clone)) { nm = base.clone(); if (nm.color) nm.color.setHex(col); }
        else nm = matFor(mk, col, base);
        if (m.material !== base && m.material.dispose) m.material.dispose(); m.material = nm;
      });
    }
    function applyMod(obj, d) {
      if (d.p) obj.position.fromArray(d.p); if (d.r) obj.rotation.set(d.r[0], d.r[1], d.r[2]); if (d.s) obj.scale.fromArray(d.s);
      if (d.c != null || d.m) paint(obj, d.c, d.m); obj.visible = !d.del;
    }
    function buildAdded(set) {
      while (added.children.length) { const c = added.children.pop(); c.traverse(m => { if (m.geometry) m.geometry.dispose(); if (m.material && m.material.dispose) m.material.dispose(); }); }
      for (const d of set.add) { const P = PAL[d.t]; if (!P) continue; if (P.L && !d.L) d.L = Object.assign({}, P.L); let g; try { g = P.make(T, matFor(d.m || P.m || 'plastico', d.c != null ? d.c : P.c), d); } catch (e) { console.warn('studio', d.t, e); continue; } g.userData.st = d; applyMod(g, { p: d.p, r: d.r, s: d.s }); added.add(g); }
      for (const pl of PLUG) if (pl.built) pl.built(added.children, ctx);
    }
    function apply(set) {
      rootsSig = sig(); restoreAll(); refresh();
      if (set) { for (const id in set.mods) { const p = byId.get(id); if (!p) continue; remember(p.obj); applyMod(p.obj, set.mods[id]); } buildAdded(set); }
      else buildAdded({ add: [] });
      refresh(); applied = set;
    }
    // vigilancia barata: si el juego reconstruye el plató, se vuelve a aplicar
    function guard() {
      if (!applied && !open) return; if (sig() !== rootsSig) { orig.clear(); apply(open ? S() : applied); }
      const set = open ? S() : applied; if (!set) return;
      for (const id in set.mods) if (set.mods[id].del) { const p = byId.get(id); if (p && p.obj.visible) p.obj.visible = false; }
    }
    function applyActive() { apply(db.activo && db.sets[db.activo] ? db.sets[db.activo] : null); }

    /* ---------- edición ---------- */
    let undo = [], redo = [], sel = null, tool = 'sel', open = false, ui = null, H = null, lbox = null;
    const snap = () => JSON.stringify(S());
    function push() { undo.push(snap()); if (undo.length > 60) undo.shift(); redo = []; upd(); }
    function restoreSnap(js) { db.sets[db.cur] = JSON.parse(js); save(); const sid = sel && sel.id; apply(S()); select(byId.get(sid) || null); }
    function doUndo() { if (!undo.length) return; redo.push(snap()); restoreSnap(undo.pop()); upd(); }
    function doRedo() { if (!redo.length) return; undo.push(snap()); restoreSnap(redo.pop()); upd(); }
    function rec(p) {
      const s = S(), obj = p.obj, d = { p: r3(obj.position), r: r3(obj.rotation), s: r3(obj.scale) };
      if (p.nuevo) { const a = s.add.find(x => x.id === p.id); Object.assign(a, d); obj.userData.st = a; }
      else { const m = s.mods[p.id] || (s.mods[p.id] = {}); Object.assign(m, d); }
      save();
    }
    const data = p => (p.nuevo ? S().add.find(x => x.id === p.id) : S().mods[p.id]) || {};
    function setProp(k, v) {
      if (!sel) return; push(); const p = sel, s = S();
      if (p.nuevo) { const a = data(p); a[k] = v; save(); apply(s); select(byId.get(p.id)); return; }
      remember(p.obj); const m = s.mods[p.id] || (s.mods[p.id] = {}); m[k] = v; if (k === 'c' || k === 'm') paint(p.obj, m.c, m.m); save(); props();
    }
    function del(p) {
      p = p || sel; if (!p) return; push(); const s = S();
      if (p.nuevo) s.add = s.add.filter(x => x.id !== p.id); else { remember(p.obj); (s.mods[p.id] || (s.mods[p.id] = {})).del = 1; p.obj.visible = false; }
      save(); select(null); if (p.nuevo) apply(s); explorer(); toast('Pieza borrada · ↶ para deshacer');
    }
    function nid() { return 'n' + Date.now().toString(36) + Math.floor(Math.random() * 1e3); }
    function addPiece(t, from) {
      push(); const s = S(), cam = o.getCamera(); const f = new T.Vector3(); cam.getWorldDirection(f); f.y = 0; f.normalize();
      const tg = view.t.clone().addScaledVector(f, -0); let d;
      if (from) { d = JSON.parse(JSON.stringify(from)); d.id = nid(); d.p = [d.p[0] + 1, d.p[1], d.p[2] + 1]; }
      else d = { id: nid(), t, p: [+tg.x.toFixed(2), +((o.groundAt ? o.groundAt(tg.x, tg.z) : 0) || 0).toFixed(2), +tg.z.toFixed(2)], r: [0, 0, 0], s: [1, 1, 1], c: PAL[t].c, m: PAL[t].m || 'plastico', a: false };
      s.add.push(d); save(); apply(s); select(byId.get(d.id)); toast('Añadido: ' + PAL[d.t].n);
    }
    function dup() {
      if (!sel) return; if (sel.nuevo) return addPiece(null, data(sel));
      const P = PAL.bloque; const b = new T.Box3().setFromObject(sel.obj), c = b.getCenter(new T.Vector3()), z = b.getSize(new T.Vector3());
      push(); const d = { id: nid(), t: 'bloque', p: r3(c.add(new T.Vector3(1, -z.y / 2, 1))), r: [0, 0, 0], s: r3(z.clampScalar(.1, 30)), c: 0xc0c0c0, m: 'plastico', a: false };
      S().add.push(d); save(); apply(S()); select(byId.get(d.id)); toast('Copia como bloque (las piezas originales del plató no se pueden clonar tal cual)');
    }

    /* ---------- cámara del editor ---------- */
    const view = { t: new T.Vector3(0, 1, 0), yaw: 0, pitch: .55, dist: 16 };
    function camHook() {
      const c = o.getCamera(), v = view; v.pitch = Math.max(.05, Math.min(1.5, v.pitch)); v.dist = Math.max(2, Math.min(45, v.dist));
      c.position.set(v.t.x + Math.sin(v.yaw) * Math.cos(v.pitch) * v.dist, v.t.y + Math.sin(v.pitch) * v.dist, v.t.z + Math.cos(v.yaw) * Math.cos(v.pitch) * v.dist);
      c.lookAt(v.t); c.updateMatrixWorld(); frameUpd();
    }
    function focus() { if (!sel) { view.t.set(0, 1, 0); view.dist = 16; return; } const b = new T.Box3().setFromObject(sel.obj); b.getCenter(view.t); view.dist = Math.max(4, b.getSize(new T.Vector3()).length() * 1.6); }

    /* ---------- asas 3D (flechas, bolas, anillos) ---------- */
    function buildHandles() {
      H = new T.Group(); H.name = 'studio-handles'; H.renderOrder = 999; const mk = c => new T.MeshBasicMaterial({ color: c, depthTest: false, depthWrite: false, transparent: true, opacity: .95 });
      H.userData.sets = {};
      const mv = new T.Group(), sc = new T.Group(), rt = new T.Group();
      AX.forEach((a, i) => {
        const dir = new T.Vector3(); dir[a] = 1; const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
        for (const sg of [1, -1]) {
          const g = new T.Group(); g.quaternion.copy(q); if (sg < 0) g.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(i === 1 ? new T.Vector3(1, 0, 0) : new T.Vector3(0, 1, 0).cross(dir).normalize().lengthSq() ? new T.Vector3(0, 1, 0).cross(dir).normalize() : new T.Vector3(1, 0, 0), Math.PI));
          if (sg > 0) {
            const sh = new T.Mesh(new T.CylinderGeometry(.03, .03, .8, 6), mk(AXC[i])); sh.position.y = .55; const hd = new T.Mesh(new T.ConeGeometry(.12, .3, 10), mk(AXC[i])); hd.position.y = 1.05;
            const hit = new T.Mesh(new T.CylinderGeometry(.22, .22, 1.2, 6), new T.MeshBasicMaterial({ visible: false })); hit.position.y = .65;
            for (const m of [sh, hd, hit]) { m.userData.h = { k: 'mv', a, sg }; m.renderOrder = 999; g.add(m); } mv.add(g);
          }
          const b = new T.Mesh(new T.SphereGeometry(.13, 10, 8), mk(AXC[i])); b.position.copy(dir).multiplyScalar(sg); b.userData.h = { k: 'sc', a, sg }; b.renderOrder = 999;
          const bh = new T.Mesh(new T.SphereGeometry(.3, 6, 4), new T.MeshBasicMaterial({ visible: false })); bh.position.copy(b.position); bh.userData.h = b.userData.h; sc.add(b, bh);
        }
        const ring = new T.Mesh(new T.TorusGeometry(1, .025, 6, 48), mk(AXC[i])), rh = new T.Mesh(new T.TorusGeometry(1, .14, 4, 32), new T.MeshBasicMaterial({ visible: false }));
        for (const m of [ring, rh]) { if (a === 'x') m.rotation.y = Math.PI / 2; if (a === 'y') m.rotation.x = Math.PI / 2; m.userData.h = { k: 'rt', a }; m.renderOrder = 999; rt.add(m); }
      });
      H.userData.sets = { mv, sc, rt }; H.add(mv, sc, rt);
    }
    function handlesUpd() {
      if (!H) return; const sc = o.getScene(); if (H.parent !== sc) sc.add(H);
      const on = !!sel && tool !== 'sel'; H.visible = on; if (!on) return;
      const u = H.userData.sets; u.mv.visible = tool === 'mv'; u.sc.visible = tool === 'sc'; u.rt.visible = tool === 'rt';
      const c = center(); H.position.copy(c); const d = o.getCamera().position.distanceTo(c); H.scale.setScalar(d * .13);
    }
    function center() { const b = worldBox(); return b ? b.getCenter(new T.Vector3()) : sel.obj.getWorldPosition(new T.Vector3()); }
    function worldBox() { if (!sel || !lbox) return null; sel.obj.updateMatrixWorld(); return lbox.clone().applyMatrix4(sel.obj.matrixWorld); }

    /* ---------- selección y marco ---------- */
    function select(p) {
      sel = p || null; lbox = null;
      if (sel) { sel.obj.updateMatrixWorld(true); const b = new T.Box3().setFromObject(sel.obj); if (!b.isEmpty()) lbox = b.applyMatrix4(sel.obj.matrixWorld.clone().invert()); }
      explorer(); props(); upd(); frameUpd();
    }
    function frameUpd() {
      handlesUpd(); if (!ui) return; const fr = ui.fr;
      const b = worldBox(); if (!b || !sel.obj.visible) { fr.style.display = 'none'; return; }
      const cam = o.getCamera(), W = innerWidth, Hh = innerHeight; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, behind = 0; const v = new T.Vector3();
      for (let i = 0; i < 8; i++) { v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(cam); if (v.z > 1) behind++; const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * Hh; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
      if (behind === 8) { fr.style.display = 'none'; return; }
      x0 = Math.max(-4, x0); y0 = Math.max(44, y0); x1 = Math.min(W + 4, x1); y1 = Math.min(Hh + 4, y1);
      fr.style.display = 'block'; fr.style.left = x0 + 'px'; fr.style.top = y0 + 'px'; const w = Math.max(40, x1 - x0), h = Math.max(40, y1 - y0); fr.style.left = (x0 + x1 - w) / 2 + 'px'; fr.style.top = (y0 + y1 - h) / 2 + 'px'; fr.style.width = w + 'px'; fr.style.height = h + 'px';
    }

    /* ---------- toques ---------- */
    const ray = new T.Raycaster(), ptr = new Map(); let gest = null;
    const ndc = (x, y) => new T.Vector2(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1);
    function pick(x, y) {
      const cam = o.getCamera(); ray.setFromCamera(ndc(x, y), cam); ray.camera = cam;
      const objs = reg.filter(p => p.obj.visible).map(p => p.obj); let hits = [];
      try { hits = ray.intersectObjects(objs, true); } catch (e) { }
      const pen = h => { const m = h.object.material || {}; return h.object.isSprite ? 1 : (m.transparent && (m.opacity < .6 || m.blending === 2)) || m.visible === false ? 2 : 0; };
      hits.sort((a, b) => pen(a) - pen(b) || a.distance - b.distance);
      for (const h of hits) { let q = h.object; while (q && !idOf.has(q)) q = q.parent; if (q && q.visible) return idOf.get(q); }
      return null;
    }
    function pickHandle(x, y) {
      if (!H || !H.visible) return null; ray.setFromCamera(ndc(x, y), o.getCamera()); H.updateMatrixWorld(true);
      const hs = ray.intersectObject(H, true).filter(h => h.object.userData.h && h.object.parent.visible && h.object.parent.parent.visible !== false); return hs.length ? hs[0].object.userData.h : null;
    }
    function scr(v) { const p = v.clone().project(o.getCamera()); return new T.Vector2((p.x + 1) / 2 * innerWidth, (1 - p.y) / 2 * innerHeight); }
    function axisPx(origin, dir) { const a = scr(origin), b = scr(origin.clone().add(dir)); return b.sub(a); }
    const locked = () => sel && data(sel).a;
    function down(e) {
      e.preventDefault(); ptr.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t: performance.now() });
      try { ui.touch.setPointerCapture(e.pointerId); } catch (er) { }
      if (ptr.size === 1) {
        const hh = sel && !locked() ? pickHandle(e.clientX, e.clientY) : null;
        if (hh) { push(); gest = { k: 'h', h: hh, p0: sel.obj.position.clone(), s0: sel.obj.scale.clone(), q0: sel.obj.quaternion.clone(), c: center(), sz: worldBox() ? worldBox().getSize(new T.Vector3()) : new T.Vector3(1, 1, 1) }; return; }
        const hit = sel && tool !== 'rt' && tool !== 'sc' ? inFrame(e.clientX, e.clientY) : false;
        gest = hit && !locked() ? { k: 'drag', moved: false, p0: sel.obj.position.clone(), y: center().y } : { k: 'tap' };
      } else if (ptr.size === 2) {
        const [a, b] = [...ptr.values()]; const g = { k: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, a0: Math.atan2(b.y - a.y, b.x - a.x), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
        if (sel && !locked() && (gest && (gest.k === 'drag' || inFrame(g.mx, g.my)))) { if (!gest || !gest.pushed) push(); Object.assign(g, { obj: true, s0: sel.obj.scale.clone(), ry0: sel.obj.rotation.y }); }
        else Object.assign(g, { dist0: view.dist, t0: view.t.clone() });
        gest = g;
      }
    }
    function inFrame(x, y) { const r = ui.fr.getBoundingClientRect(); return ui.fr.style.display === 'block' && x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 12 && y <= r.bottom + 12; }
    function planePt(x, y, h) { ray.setFromCamera(ndc(x, y), o.getCamera()); const pt = new T.Vector3(); return ray.ray.intersectPlane(new T.Plane(new T.Vector3(0, 1, 0), -h), pt) ? pt : null; }
    function move(e) {
      const P = ptr.get(e.pointerId); if (!P || !gest) return; const dx = e.clientX - P.x, dy = e.clientY - P.y; P.x = e.clientX; P.y = e.clientY;
      if (gest.k === 'h') {
        const h = gest.h, o3 = sel.obj, dir = new T.Vector3(); dir[h.a] = 1; const A = ui && P;
        const tot = new T.Vector2(P.x - P.x0, P.y - P.y0);
        if (h.k === 'mv' || h.k === 'sc') {
          const ap = axisPx(gest.c, dir.clone().multiplyScalar(h.sg || 1)); const L2 = ap.lengthSq(); if (L2 < 4) return; const d = tot.dot(ap) / L2;
          if (h.k === 'mv') { o3.position.copy(gest.p0); o3.position[h.a] += d * (h.sg || 1); }
          else { const ext = Math.max(.05, gest.sz[h.a]); const f = Math.max(.05, (ext + d) / ext); o3.scale.copy(gest.s0); o3.scale[h.a] = Math.max(.02, gest.s0[h.a] * f); }
        } else {
          const c = scr(gest.c), a0 = Math.atan2(P.y0 - c.y, P.x0 - c.x), a1 = Math.atan2(P.y - c.y, P.x - c.x); let da = a1 - a0;
          const toCam = o.getCamera().position.clone().sub(gest.c); if (toCam.dot(dir) < 0) da = -da;
          o3.quaternion.copy(gest.q0); o3.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(dir, -da));
        }
        return;
      }
      if (gest.k === 'tap' || gest.k === 'orbit') {
        if (gest.k === 'tap' && Math.hypot(P.x - P.x0, P.y - P.y0) < 9) return; gest.k = 'orbit';
        view.yaw -= dx * .008; view.pitch += dy * .006; return;
      }
      if (gest.k === 'drag') {
        if (!gest.moved && Math.hypot(P.x - P.x0, P.y - P.y0) < 6) return;
        if (!gest.moved) { push(); gest.pushed = true; gest.moved = true; gest.a = planePt(P.x0, P.y0, gest.y); }
        const b = planePt(P.x, P.y, gest.y); if (gest.a && b) { sel.obj.position.set(gest.p0.x + b.x - gest.a.x, gest.p0.y, gest.p0.z + b.z - gest.a.z); }
        return;
      }
      if (gest.k === 'pinch' && ptr.size >= 2) {
        const [a, b] = [...ptr.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y) || 1, an = Math.atan2(b.y - a.y, b.x - a.x);
        if (gest.obj) { const f = Math.max(.05, Math.min(20, d / gest.d0)); sel.obj.scale.copy(gest.s0).multiplyScalar(f); sel.obj.rotation.y = gest.ry0 - (an - gest.a0); }
        else { view.dist = gest.dist0 * gest.d0 / d; const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, k = view.dist / 600; const r = new T.Vector3(Math.cos(view.yaw), 0, -Math.sin(view.yaw)), f = new T.Vector3(-Math.sin(view.yaw), 0, -Math.cos(view.yaw)); view.t.copy(gest.t0).addScaledVector(r, -(mx - gest.mx) * k).addScaledVector(f, (my - gest.my) * k); }
      }
    }
    function up(e) {
      const P = ptr.get(e.pointerId); ptr.delete(e.pointerId); if (!P || !gest) return;
      if (gest.k === 'tap' && ptr.size === 0) { const p = pick(e.clientX, e.clientY); select(p && p === sel ? sel : p); }
      else if ((gest.k === 'drag' && gest.moved) || gest.k === 'h' || (gest.k === 'pinch' && gest.obj)) { if (sel) { rec(sel); select(sel); } }
      if (ptr.size === 0) gest = null; else if (gest.k === 'pinch') gest = { k: 'none' };
    }

    /* ---------- interfaz ---------- */
    let toastT = 0;
    function toast(t) { if (!ui) return; ui.toast.textContent = t; ui.toast.style.display = 'block'; clearTimeout(toastT); toastT = setTimeout(() => { if (ui) ui.toast.style.display = 'none'; }, 2200); }
    function btn(parent, html, title, fn, cls) { const b = el('button', 'sto-b' + (cls ? ' ' + cls : ''), html); b.title = title || ''; b.onclick = ev => { ev.stopPropagation(); fn(b); }; parent.appendChild(b); return b; }
    function panel(cls, title, parent, collapsed) { const p = el('div', 'sto-pan ' + cls + (collapsed ? ' col' : '')), h = el('div', 'sto-h', title), c = el('div', 'sto-c'); h.onclick = () => p.classList.toggle('col'); p.append(h, c); parent.appendChild(p); return c; }
    function buildUI() {
      if (!document.getElementById('sto-css')) { const s = el('style'); s.id = 'sto-css'; s.textContent = CSS; document.head.appendChild(s); }
      const R = el('div', 'sto'), touch = el('div', 'sto-touch'); R.appendChild(touch);
      touch.addEventListener('pointerdown', down); touch.addEventListener('pointermove', move); touch.addEventListener('pointerup', up); touch.addEventListener('pointercancel', up);
      const fr = el('div', 'sto-fr'); const xb = el('button', '', '✕'); xb.title = 'Borrar pieza'; xb.onclick = e => { e.stopPropagation(); del(); }; fr.appendChild(xb); R.appendChild(fr);
      const rib = el('div', 'sto-rib'); R.appendChild(rib);
      btn(rib, '✕', 'Salir del editor', () => close());
      rib.appendChild(el('span', 'sto-t', o.title || 'Studio'));
      const tools = {}; [['sel', '⬚ Seleccionar'], ['mv', '✥ Mover'], ['sc', '⤢ Escalar'], ['rt', '⟳ Girar']].forEach(([k, t]) => tools[k] = btn(rib, t, t, () => { tool = k; upd(); frameUpd(); }));
      rib.appendChild(el('span', 'sto-sep'));
      const bDup = btn(rib, '📋 Duplicar', 'Duplicar', dup), bU = btn(rib, '↶', 'Deshacer', doUndo), bR = btn(rib, '↷', 'Rehacer', doRedo), bD = btn(rib, '🗑', 'Borrar pieza', () => del());
      rib.appendChild(el('span', 'sto-sep'));
      btn(rib, '🧰 Caja', 'Caja de objetos', () => box.parentNode.classList.toggle('col'));
      btn(rib, '☰ Paneles', 'Explorador y Propiedades', () => rt.style.display = rt.style.display === 'none' ? '' : 'none');
      rib.appendChild(el('span', 'sto-sep'));
      const selS = el('select'); selS.title = 'Plató guardado'; selS.onchange = () => { db.cur = selS.value; save(); undo = []; redo = []; apply(S()); select(null); }; rib.appendChild(selS);
      btn(rib, '＋ Nuevo', 'Nuevo plató', () => { let n = prompt('Nombre del plató nuevo:', 'Plató ' + (Object.keys(db.sets).length + 1)); if (!n) return; n = n.slice(0, 30); if (!db.sets[n]) db.sets[n] = { mods: {}, add: [] }; db.cur = n; save(); undo = []; redo = []; apply(S()); select(null); sets(); });
      btn(rib, '✎', 'Renombrar plató', () => { const n = prompt('Nuevo nombre:', db.cur); if (!n || db.sets[n]) return; db.sets[n] = S(); delete db.sets[db.cur]; if (db.activo === db.cur) db.activo = n; db.cur = n; save(); sets(); });
      btn(rib, '📑 Copiar plató', 'Guardar una copia de este plató', () => { let n = db.cur + ' (copia)'; while (db.sets[n]) n += '+'; db.sets[n] = JSON.parse(snap()); db.cur = n; save(); sets(); toast('Copia guardada: ' + n); });
      btn(rib, '🗑 Plató', 'Borrar este plató guardado', () => { if (Object.keys(db.sets).length < 2) { toast('Debe quedar al menos un plató'); return; } if (!confirm('¿Borrar el plató «' + db.cur + '»?')) return; delete db.sets[db.cur]; if (db.activo && !db.sets[db.activo]) db.activo = null; db.cur = Object.keys(db.sets)[0]; save(); undo = []; redo = []; apply(S()); select(null); sets(); });
      btn(rib, '↺ Original', 'Jugar con el plató original', () => { db.activo = null; save(); toast('Se jugará con el plató original'); sets(); });
      btn(rib, '▶ Jugar', 'Jugar en este plató', () => { db.activo = db.cur; save(); close(true); }, 'play');
      const box = panel('sto-box', '🧰 Caja de objetos', R, innerWidth < 700); const grid = el('div', 'sto-grid'); box.appendChild(grid);
      let gr = null; const KS = Object.keys(PAL), GS = [...new Set(KS.map(k => PAL[k].g || 'Piezas y formas'))]; KS.sort((a, b) => GS.indexOf(PAL[a].g || 'Piezas y formas') - GS.indexOf(PAL[b].g || 'Piezas y formas')); for (const k of KS) { const g = PAL[k].g || 'Piezas y formas'; if (g !== gr) { gr = g; const hh = el('div', '', g); hh.style.cssText = 'grid-column:1/-1;color:#8a93a6;font-size:10px;padding:4px 2px 0'; grid.appendChild(hh); } const it = el('button', 'sto-it', `<i>${PAL[k].i}</i>${PAL[k].n}`); it.onclick = e => { e.stopPropagation(); addPiece(k); }; grid.appendChild(it); }
      const rt = el('div', 'sto-pan sto-rt'); R.appendChild(rt); if (innerWidth < 700) rt.style.display = 'none';
      const ex = panel('sto-ex', '📂 Explorador', rt), pr = panel('sto-pr', '⚙ Propiedades', rt);
      const cam = el('div', 'sto-cam'); R.appendChild(cam);
      const rot = (f) => () => f();
      [['⟲', 'Girar cámara', () => view.yaw += .35], ['▲', 'Inclinar', () => view.pitch += .15], ['＋', 'Acercar', () => view.dist *= .8], ['🎯', 'Centrar en la pieza', focus],
       ['⟳', 'Girar cámara', () => view.yaw -= .35], ['▼', 'Inclinar', () => view.pitch -= .15], ['－', 'Alejar', () => view.dist *= 1.25], ['⬆', 'Subir pieza', () => nudge(.25)]].forEach(([t, ti, f]) => btn(cam, t, ti, rot(f)));
      const mode = el('div', 'sto-mode', 'Toca una pieza para elegirla · arrastra el fondo para girar la cámara'); R.appendChild(mode);
      const tst = el('div', 'sto-toast'); R.appendChild(tst);
      ui = { R, touch, fr, tools, bDup, bU, bR, bD, selS, ex, pr, toast: tst, mode };
      document.body.appendChild(R);
    }
    function nudge(d) { if (!sel || locked()) return; push(); sel.obj.position.y += d; rec(sel); select(sel); }
    function upd() {
      if (!ui) return; for (const k in ui.tools) ui.tools[k].classList.toggle('on', tool === k);
      ui.bU.disabled = !undo.length; ui.bR.disabled = !redo.length; ui.bDup.disabled = ui.bD.disabled = !sel;
      ui.mode.textContent = sel ? (locked() ? '🔒 ' + sel.name + ' está anclada' : sel.name + ' · 1 dedo: mover · 2 dedos: tamaño y giro') : 'Toca una pieza para elegirla · arrastra el fondo para girar la cámara';
    }
    function sets() { if (!ui) return; ui.selS.innerHTML = ''; for (const n in db.sets) { const op = el('option'); op.value = n; op.textContent = (db.activo === n ? '▶ ' : '') + n; if (n === db.cur) op.selected = true; ui.selS.appendChild(op); } }
    function explorer() {
      if (!ui) return; const ex = ui.ex; ex.innerHTML = ''; let g = '';
      const list = reg.filter(p => p.obj.visible).sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.kind.localeCompare(b.kind, 'es'));
      for (const p of list) { if (p.kind !== g) { g = p.kind; ex.appendChild(el('div', 'g', g)); } const d = el('div', p === sel ? 'on' : '', (p.nuevo ? '🧱 ' : '▫ ') + p.name + (data(p).a ? ' 🔒' : '')); d.onclick = e => { e.stopPropagation(); select(p); }; ex.appendChild(d); }
      const on = ex.querySelector('.on'); if (on) on.scrollIntoView({ block: 'nearest' });
    }
    function props() {
      if (!ui) return; const pr = ui.pr; pr.innerHTML = '';
      if (!sel) { pr.appendChild(el('div', '', 'Ninguna pieza seleccionada.')); return; }
      const d = data(sel), o3 = sel.obj; pr.appendChild(el('div', '', '<b>' + sel.name + '</b>'));
      const sw = el('div', 'sto-sw'); SW.forEach(c => { const b = el('b'); b.style.background = '#' + c.toString(16).padStart(6, '0'); b.onclick = e => { e.stopPropagation(); setProp('c', c); }; sw.appendChild(b); });
      const ci = el('input'); ci.type = 'color'; ci.value = '#' + ((d.c != null ? d.c : 0xffffff) >>> 0).toString(16).padStart(6, '0'); ci.onchange = () => setProp('c', parseInt(ci.value.slice(1), 16)); sw.appendChild(ci);
      const l1 = el('label', '', 'Color'); pr.append(l1, sw);
      const ms = el('select'); ms.appendChild(new Option('(original)', '')); for (const k in MATS) ms.appendChild(new Option(MATS[k], k)); ms.value = d.m || ''; ms.onchange = () => setProp('m', ms.value || null);
      const l2 = el('label', '', 'Material'); l2.appendChild(ms); pr.appendChild(l2);
      const xyz = (lab, get, set) => { const l = el('label', '', lab), w = el('span', 'xyz'); AX.forEach(a => { const n = el('input'); n.type = 'number'; n.step = '0.1'; n.value = (+get()[a]).toFixed(2); n.onchange = () => { if (locked()) return; push(); set(a, parseFloat(n.value) || 0); rec(sel); select(sel); }; w.appendChild(n); }); l.appendChild(w); pr.appendChild(l); };
      xyz('Tamaño', () => o3.scale, (a, v) => o3.scale[a] = Math.max(.02, v));
      xyz('Posición', () => o3.position, (a, v) => o3.position[a] = v);
      const l3 = el('label', '', 'Giro Y°'), ry = el('input'); ry.type = 'number'; ry.step = '15'; ry.value = Math.round(o3.rotation.y * 180 / Math.PI); ry.onchange = () => { if (locked()) return; push(); o3.rotation.y = (parseFloat(ry.value) || 0) * Math.PI / 180; rec(sel); select(sel); }; l3.appendChild(ry); pr.appendChild(l3);
      const l4 = el('label', '', 'Anclado'), an = el('input'); an.type = 'checkbox'; an.checked = !!d.a; an.onchange = () => { setProp('a', an.checked); explorer(); upd(); }; l4.appendChild(an); pr.appendChild(l4);
      pr.appendChild(el('div', '', '<small style="color:#8a93a6">Anclado: la pieza queda fija y no se puede mover, girar ni escalar.</small>'));
      for (const pl of PLUG) if (pl.props && sel.nuevo && d.L) pl.props(pr, d, sel.obj, helper, el);
    }
    let gt = 0;
    function openEd() {
      if (open) return; open = true; if (!H) buildHandles(); buildUI(); sets(); undo = []; redo = []; tool = 'sel';
      apply(S()); select(null); o.setCameraHook(camHook); clearInterval(gt); gt = setInterval(guard, 400); upd();
    }
    function close(play) {
      if (!open) return; open = false; select(null); if (H && H.parent) H.parent.remove(H); o.setCameraHook(null);
      if (ui) { ui.R.remove(); ui = null; } ptr.clear(); gest = null; applyActive(); clearInterval(gt); gt = setInterval(guard, 1000);
      play ? o.onPlay && o.onPlay(db.activo) : o.onExit && o.onExit();
    }
    let liveOn = false;
    const helper = { live(fn) { if (!sel) return; if (!liveOn) { push(); liveOn = true; } const d = data(sel); fn(d); for (const pl of PLUG) if (pl.update) pl.update(sel.obj, d, ctx); },
      commit() { liveOn = false; save(); }, rebuild() { const id = sel && sel.id; save(); apply(S()); select(byId.get(id)); } };
    function tick(dt) { if (!added) return; for (const pl of PLUG) if (pl.tick) try { pl.tick(dt, added.children, ctx); } catch (e) { } }
    const api = { open: openEd, close, applyActive, guard, tick, db: () => db, isOpen: () => open,
      start() { applyActive(); clearInterval(gt); gt = setInterval(guard, 1000); } };
    return api;
  }

  function defaultPalette(T) {
    const one = (geo, y) => (T2, m) => { const g = new T2.Group(), me = new T2.Mesh(geo(T2), m); me.position.y = y; g.add(me); return g; };
    const text = (T2, m) => { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64; const x = cv.getContext('2d'); x.fillStyle = '#111'; x.fillRect(0, 0, 256, 64); x.fillStyle = '#ffd400'; x.font = 'bold 34px Arial'; x.textAlign = 'center'; x.fillText('¡AHORA CAIGO!', 128, 44); const tx = new T2.CanvasTexture(cv); const g = new T2.Group(), me = new T2.Mesh(new T2.PlaneGeometry(3, .75), new T2.MeshBasicMaterial({ map: tx, color: m.color, side: T2.DoubleSide })); me.position.y = .4; g.add(me); return g; };
    return {
      bloque: { n: 'Bloque', i: '🟥', c: 0xc0c0c0, make: one(T => new T.BoxGeometry(1, 1, 1), .5) },
      esfera: { n: 'Esfera', i: '⚪', c: 0x00c2ff, make: one(T => new T.SphereGeometry(.5, 16, 12), .5) },
      cilindro: { n: 'Cilindro', i: '🛢', c: 0xff8a00, make: one(T => new T.CylinderGeometry(.5, .5, 1, 16), .5) },
      cuna: { n: 'Cuña', i: '📐', c: 0x2ecc40, make: one(T => { const s = new T.Shape(); s.moveTo(-.5, 0); s.lineTo(.5, 0); s.lineTo(-.5, 1); s.closePath(); const g = new T.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }); g.translate(0, 0, -.5); return g; }, 0) },
      atril: { n: 'Atril', i: '🎤', c: 0x1f5bff, make: (T, m) => { const g = new T.Group(), a = new T.Mesh(new T.CylinderGeometry(.06, .06, 1.1, 8), m), b = new T.Mesh(new T.BoxGeometry(.5, .08, .35), m); a.position.y = .55; b.position.y = 1.12; b.rotation.x = -.4; g.add(a, b); return g; } },
      trampilla: { n: 'Trampilla', i: '⭕', c: 0xffd400, m: 'neon', make: (T, m) => { const g = new T.Group(), r = new T.Mesh(new T.TorusGeometry(.8, .06, 6, 32), m), d = new T.Mesh(new T.CircleGeometry(.75, 24), new T.MeshLambertMaterial({ color: 0x222222 })); r.rotation.x = d.rotation.x = -Math.PI / 2; r.position.y = .03; d.position.y = .02; g.add(d, r); return g; } },
      pantalla: { n: 'Pantalla LED', i: '📺', c: 0x00c2ff, m: 'neon', make: (T, m) => { const g = new T.Group(), f = new T.Mesh(new T.BoxGeometry(3.2, 1.9, .12), new T.MeshLambertMaterial({ color: 0x111111 })), s = new T.Mesh(new T.PlaneGeometry(3, 1.7), m); f.position.y = s.position.y = 1.5; s.position.z = .07; g.add(f, s); return g; } },
      foco: { n: 'Foco', i: '💡', c: 0xffffcc, m: 'neon', make: (T, m) => { const g = new T.Group(), p = new T.Mesh(new T.CylinderGeometry(.05, .05, 3, 6), new T.MeshLambertMaterial({ color: 0x333333 })), c = new T.Mesh(new T.ConeGeometry(.3, .5, 12, 1, true), m); p.position.y = 1.5; c.position.y = 3.1; c.rotation.x = Math.PI; g.add(p, c); return g; } },
      grada: { n: 'Grada', i: '🪜', c: 0x9b30ff, make: (T, m) => { const g = new T.Group(); for (let i = 0; i < 3; i++) { const b = new T.Mesh(new T.BoxGeometry(4, .4 * (i + 1), .8), m); b.position.set(0, .2 * (i + 1), -i * .8); g.add(b); } return g; } },
      letrero: { n: 'Letrero', i: '🔤', c: 0xffffff, m: 'neon', make: text },
    };
  }
  window.Studio = Object.assign(window.Studio || {}, { create, defaultPalette, version: '1.1' });
})();
