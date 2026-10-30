/* Studio · kit de iluminación de espectáculo (focos, cabezas móviles, LED, paneles de píxeles y washes).
   Plugin para studio.js. Haces volumétricos falsos (conos aditivos), materiales emisivos,
   como mucho MAXR luces reales y como mucho MAXA luces animadas a la vez (pensado para móviles modestos). */
(function () {
  'use strict';
  const ANIM = { fijo: 'Fijo', barrido: 'Barrido', parpadeo: 'Parpadeo', arcoiris: 'Arcoíris', seguir: 'Seguir al concursante' };
  function lights(opt = {}) {
    const MAXR = opt.maxReal ?? 3, MAXA = opt.maxAnim ?? 12;
    let beamTex = null, pool = null, T = null, time = 0;
    const tex = () => { if (beamTex) return beamTex; const c = document.createElement('canvas'); c.width = 4; c.height = 128; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(.35, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 4, 128); beamTex = new T.CanvasTexture(c); return beamTex; };
    const glowTex = () => { if (glowTex.t) return glowTex.t; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return glowTex.t = new T.CanvasTexture(c); };
    const add = (c, o) => new T.MeshBasicMaterial(Object.assign({ color: c, transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false }, o || {}));
    const dark = () => new T.MeshLambertMaterial({ color: 0x1a1a1e });
    const BL = 8; // largo del haz
    function beam(c, ang, op) { // cono abierto con la punta en el foco, apuntando a -Y
      const g = new T.ConeGeometry(1, BL, 20, 1, true); g.translate(0, -BL / 2, 0); // ápice en 0, base en -BL
      const m = new T.Mesh(g, add(c, { map: tex(), opacity: op })); m.userData.beam = 1; m.renderOrder = 5; setAng(m, ang); return m;
    }
    function setAng(m, ang) { const r = Math.tan(Math.max(2, Math.min(80, ang)) * Math.PI / 360) * BL; m.scale.set(r, 1, r); }
    function head(T2, d, kind) { // foco o cabeza móvil
      init(T2);
      const g = new T.Group(), yoke = new T.Group(), hd = new T.Group();
      const base = new T.Mesh(new T.BoxGeometry(.5, .18, .5), dark()); base.position.y = .09; g.add(base);
      if (kind === 'cabeza') { const y = new T.Mesh(new T.BoxGeometry(.5, .35, .08), dark()); y.position.set(0, .35, 0); yoke.add(y); }
      yoke.position.y = .18; g.add(yoke); hd.position.y = .4; yoke.add(hd);
      const body = new T.Mesh(new T.CylinderGeometry(.16, .2, .45, 12), dark()); body.position.y = .1; hd.add(body);
      const lens = new T.Mesh(new T.CircleGeometry(.15, 14), new T.MeshBasicMaterial({ color: d.c })); lens.rotation.x = Math.PI / 2; lens.position.y = -.13; hd.add(lens);
      const b = beam(d.c, d.L.ang, .22); b.position.y = -.13; hd.add(b);
      hd.rotation.x = kind === 'cabeza' ? 0.5 : 0.9; // apunta hacia delante y abajo
      g.userData.lt = { kind, hd, yoke, lens, beams: [b], base0: hd.rotation.x };
      return g;
    }
    function cells(n, w, h, cols, rows, depth) {
      const g = new T.Group(); const box = new T.Mesh(new T.BoxGeometry(w + .06, h + .06, depth), dark()); g.add(box);
      const cw = w / cols, ch = h / rows; const geo = new T.PlaneGeometry(cw * .82, ch * .82);
      const im = new T.InstancedMesh(geo, new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), cols * rows); const M = new T.Matrix4();
      let k = 0; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { M.makeTranslation(-w / 2 + cw * (c + .5), -h / 2 + ch * (r + .5), depth / 2 + .005); im.setMatrixAt(k, M); im.setColorAt(k++, new T.Color(1, 1, 1)); }
      g.add(im); return { g, im, cols, rows };
    }
    function led(kind) {
      return (T2, m, d) => {
        init(T2);
        const S = kind === 'tira' ? [4, .06, 32, 1, .04] : kind === 'barra' ? [1.6, .14, 8, 1, .12] : [1.6, 1.2, 12, 9, .1];
        const { g, im, cols, rows } = cells(0, S[0], S[1], S[2], S[3], S[4]);
        const root = new T.Group(); g.position.y = kind === 'panel' ? 1.4 : .3; root.add(g);
        if (kind === 'panel') { const leg = new T.Mesh(new T.BoxGeometry(.08, .8, .08), dark()); leg.position.y = .4; root.add(leg); }
        const glow = new T.Mesh(new T.PlaneGeometry(S[0] * 1.5, Math.max(.5, S[1] * 3)), add(d.c, { map: glowTex(), opacity: .35 })); glow.position.set(0, 0, S[4] / 2 + .02); g.add(glow);
        root.userData.lt = { kind, im, cols, rows, glow, beams: [] }; return root;
      };
    }
    function wash(T2, m, d) {
      init(T2);
      const g = new T.Group(); const body = new T.Mesh(new T.BoxGeometry(.6, .3, .45), dark()); body.position.y = .3; g.add(body);
      const hd = new T.Group(); hd.position.y = .3; g.add(hd);
      const lens = new T.Mesh(new T.PlaneGeometry(.5, .2), new T.MeshBasicMaterial({ color: d.c })); lens.position.z = .23; hd.add(lens);
      const b = beam(d.c, d.L.ang, .12); b.rotation.x = -1.22; b.position.z = .23; hd.add(b);
      const pool2 = new T.Mesh(new T.CircleGeometry(1, 24), add(d.c, { map: glowTex(), opacity: .35 })); pool2.rotation.x = -Math.PI / 2; pool2.position.set(0, .03, 3); pool2.userData.pool = 1; g.add(pool2);
      g.userData.lt = { kind: 'wash', hd, lens, beams: [b], pool: pool2 }; return g;
    }
    function init(T2) { if (T) return; T = T2; tmpC = new T.Color(); tmpV = new T.Vector3(); tmpV2 = new T.Vector3(); tmpQ = new T.Quaternion(); }
    const L = (ang, extra) => Object.assign({ i: 1, ang, anim: 'fijo', vel: 1 }, extra || {});
    const palette = {
      foco: { n: 'Foco', i: '🔦', g: '💡 Iluminación', c: 0xfff2c0, L: L(18), make: (T2, m, d) => head(T2, d, 'foco') },
      cabeza: { n: 'Cabeza móvil', i: '🎯', g: '💡 Iluminación', c: 0x55ccff, L: L(14, { anim: 'barrido' }), make: (T2, m, d) => head(T2, d, 'cabeza') },
      tiraled: { n: 'Tira LED', i: '➖', g: '💡 Iluminación', c: 0xff2fb0, L: L(0, { anim: 'arcoiris' }), make: led('tira') },
      barraled: { n: 'Barra LED', i: '📏', g: '💡 Iluminación', c: 0x00e5ff, L: L(0), make: led('barra') },
      panelpx: { n: 'Panel de píxeles', i: '🟪', g: '💡 Iluminación', c: 0x9b30ff, L: L(0, { anim: 'arcoiris' }), make: led('panel') },
      wash: { n: 'Wash', i: '🌈', g: '💡 Iluminación', c: 0xff4fb6, L: L(60), make: wash },
    };
    let tmpC = null, tmpV = null, tmpV2 = null, tmpQ = null;
    function color(d, k, n) { // color actual de la luz (k = índice de celda)
      const c = tmpC.setHex(d.c); const a = d.L.anim, v = d.L.vel || 1;
      if (a === 'arcoiris') c.setHSL(((time * v * .15) + (n ? k / n : 0)) % 1, 1, .55);
      return c;
    }
    function level(d, k, n) {
      const a = d.L.anim, v = d.L.vel || 1, i = d.L.i ?? 1;
      if (a === 'parpadeo') return ((time * v * 3 + (n ? 0 : 0)) % 1) < .45 ? i : 0;
      if (a === 'barrido' && n) { const p = (time * v * 1.5) % 1; const dd = Math.abs(k / n - p); return i * Math.max(.08, 1 - Math.min(dd, 1 - dd) * 6); }
      if (a === 'barrido' && !n && d.t === 'wash') return i * (.55 + .45 * Math.sin(time * v * 2));
      return i;
    }
    function update(obj, d, ctx, animOK = true) {
      const u = obj.userData.lt; if (!u || !d.L) return; const n = u.im ? u.cols * u.rows : 0;
      if (u.im) {
        for (let k = 0; k < n; k++) { const kk = u.rows > 1 ? (k % u.cols) + Math.floor(k / u.cols) * .5 : k; const nn = u.rows > 1 ? u.cols + u.rows * .5 : n; const lv = level(d, kk, nn); u.im.setColorAt(k, color(d, kk, nn).multiplyScalar(Math.min(1.6, .15 + lv))); }
        u.im.instanceColor.needsUpdate = true; u.glow.material.color.copy(color(d, 0, 0)); u.glow.material.opacity = .3 * level(d, 0, 0); return;
      }
      const c = color(d, 0, 0), lv = level(d, 0, 0);
      u.lens.material.color.copy(c).multiplyScalar(Math.min(1.5, .3 + lv));
      for (const b of u.beams) { b.material.color.copy(c); b.material.opacity = Math.min(.9, (u.kind === 'wash' ? .22 : .42) * lv); b.visible = lv > .01; setAng(b, d.L.ang || 20); }
      if (u.pool) { u.pool.material.color.copy(c); u.pool.material.opacity = .35 * lv; const r = Math.max(.6, Math.tan((d.L.ang || 60) * Math.PI / 360) * 3); u.pool.scale.set(r, r, 1); }
      if (u.hd && u.kind !== 'wash') {
        const a = d.L.anim, v = d.L.vel || 1;
        if (a === 'barrido') { u.yoke.rotation.y = Math.sin(time * v * .9) * .9; u.hd.rotation.x = u.base0 + Math.sin(time * v * 1.3) * .3; }
        else if (a === 'seguir' && ctx.follow) {
          const t = ctx.follow(); if (t) { // apunta el -Y de la cabeza al concursante
            obj.updateMatrixWorld(); const p = u.hd.getWorldPosition(tmpV); const dir = tmpV2.copy(t).sub(p).normalize();
            const inv = obj.getWorldQuaternion(tmpQ).invert(); dir.applyQuaternion(inv);
            u.yoke.rotation.y = Math.atan2(-dir.x, -dir.z) ; const horiz = Math.hypot(dir.x, dir.z); u.hd.rotation.x = Math.atan2(horiz, -dir.y);
          }
        } else if (animOK) { u.yoke.rotation.y = 0; u.hd.rotation.x = u.base0; }
      }
    }
    function realLights(objs, ctx) {
      const sc = ctx.getScene(); const cand = objs.filter(o => o.userData.lt && !o.userData.lt.im && o.visible).slice(0, MAXR);
      if (!cand.length) { if (pool) pool.forEach(l => l.intensity = 0); return; }
      if (!pool) { pool = []; for (let i = 0; i < MAXR; i++) { const l = new T.PointLight(0xffffff, 0, 9, 1.6); l.name = 'studio-luz-' + i; pool.push(l); } }
      pool.forEach((l, i) => { if (l.parent !== sc) sc.add(l); const o = cand[i]; if (!o) { l.intensity = 0; return; }
        const d = o.userData.st, u = o.userData.lt; l.color.copy(color(d, 0, 0)); l.intensity = 3.2 * level(d, 0, 0);
        // la luz real se pone donde cae el haz (o delante del wash)
        if (u.pool) { u.pool.getWorldPosition(l.position); l.position.y += 1.2; } else { o.updateMatrixWorld(); const p = u.hd.getWorldPosition(tmpV); const dir = tmpV2.set(0, -1, 0).applyQuaternion(u.hd.getWorldQuaternion(tmpQ)); const k = dir.y < -.1 ? Math.min(BL, (p.y - .3) / -dir.y) : 3; l.position.copy(p).addScaledVector(dir, k * .85); }
      });
    }
    return {
      palette,
      built(objs, ctx) { init(ctx.T); for (const o of objs) if (o.userData.lt) update(o, o.userData.st, ctx, true); realLights(objs, ctx); },
      update(obj, d, ctx) { update(obj, d, ctx, true); },
      tick(dt, objs, ctx) {
        if (!T) return; time += dt; let na = 0, any = false;
        for (const o of objs) { const d = o.userData.st; if (!o.userData.lt || !d || !d.L) continue; any = true; if (d.L.anim === 'fijo' || !o.visible) continue; if (++na > MAXA) break; update(o, d, ctx, false); }
        if (any) realLights(objs, ctx);
      },
      props(pr, d, obj, h, el) {
        pr.appendChild(el('div', '', '<b style="color:#ffd400">💡 Luz</b> <small style="color:#8a93a6">(el color de arriba es el de la luz)</small>'));
        const rng = (lab, k, min, max, st) => { const l = el('label', '', lab), r = el('input'); r.type = 'range'; r.min = min; r.max = max; r.step = st; r.value = d.L[k]; r.style.width = '92px';
          r.oninput = () => h.live(dd => dd.L[k] = parseFloat(r.value)); r.onchange = () => h.commit(); l.appendChild(r); pr.appendChild(l); };
        rng('Intensidad', 'i', 0, 2, .05);
        if (!obj.userData.lt.im) rng('Ángulo del haz', 'ang', 4, 80, 1);
        const l = el('label', '', 'Animación'), s = el('select'); for (const k in ANIM) s.appendChild(new Option(ANIM[k], k)); s.value = d.L.anim;
        s.onchange = () => { h.live(dd => dd.L.anim = s.value); h.commit(); }; l.appendChild(s); pr.appendChild(l);
        rng('Velocidad', 'vel', .1, 3, .1);
        pr.appendChild(el('div', '', `<small style="color:#8a93a6">Para ir fluido en móviles: solo ${MAXR} luces iluminan de verdad el plató y como mucho ${MAXA} se animan a la vez.</small>`));
      },
    };
  }
  window.Studio = Object.assign(window.Studio || {}, { lights });
})();
