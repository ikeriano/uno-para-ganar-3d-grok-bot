// Las 10 pruebas del proyecto Scratch «1 Minuto Para Vencer», adaptadas a pantalla táctil (espacio virtual 1000x560)
const TAU = Math.PI * 2, R = (a, b) => a + Math.random() * (b - a), cl = (v, a, b) => Math.max(a, Math.min(b, v));
export const VW = 1000, VH = 560;
function base(meta, total) { return { meta, total, n: 0, done: null, t: 0, fx: [], prog() { return this.n + ' / ' + this.total; } }; }
function txt(g, s, x, y, size, col) { g.font = `bold ${size}px Arial`; g.textAlign = 'center'; g.fillStyle = col || '#fff'; g.fillText(s, x, y); }
function chispa(P, x, y, col) { for (let i = 0; i < 10; i++) P.fx.push({ x, y, vx: R(-200, 200), vy: R(-300, -50), l: .7, c: col || '#ffd23a' }); }
function fxDraw(P, g, dt) { P.fx = P.fx.filter(f => (f.l -= dt) > 0); for (const f of P.fx) { f.vy += 600 * dt; f.x += f.vx * dt; f.y += f.vy * dt; g.globalAlpha = f.l / .7; g.fillStyle = f.c; g.fillRect(f.x - 4, f.y - 4, 8, 8); } g.globalAlpha = 1; }
function im(g, I, n, x, y, w, h, rot) { const i = I(n); if (!i || !i.width) return; h = h || w * i.height / i.width; if (rot) { g.save(); g.translate(x, y); g.rotate(rot); g.drawImage(i, -w / 2, -h / 2, w, h); g.restore(); } else g.drawImage(i, x - w / 2, y - h / 2, w, h); }
function mesa(g) { g.fillStyle = 'rgba(29,88,216,.85)'; g.fillRect(60, 500, 880, 22); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(60, 500, 880, 4); }
function medidor(g, x, y, w, v, z0, z1, vert) {
  g.fillStyle = 'rgba(0,0,0,.6)'; vert ? g.fillRect(x, y, 34, w) : g.fillRect(x, y, w, 34); g.fillStyle = '#2ecc71';
  vert ? g.fillRect(x, y + w * (1 - z1), 34, w * (z1 - z0)) : g.fillRect(x + w * z0, y, w * (z1 - z0), 34);
  g.fillStyle = '#fff'; vert ? g.fillRect(x - 6, y + w * (1 - v) - 3, 46, 6) : g.fillRect(x + w * v - 3, y - 6, 6, 46);
}
const P = {};
P.gravedad = (I, S) => { const p = base('Mantén los globos en el aire', 60); p.time = true; p.prog = () => 'Globos en el aire: ' + p.b.length;
  p.b = [0, 1, 2].map(i => ({ x: 260 + i * 240, y: 200, vx: 0, vy: 0, i }));
  p.down = (x, y) => { for (const b of p.b) if (Math.hypot(x - b.x, y - b.y) < 80) { b.vy = -330; b.vx = R(-90, 90) + (b.x - x) * 2; S('pop'); return; } };
  p.update = dt => { p.t += dt; const gv = 120 + p.t * 1.6; for (const b of p.b) { b.vy += gv * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= .995;
      if (b.x < 60 || b.x > 940) { b.vx *= -1; b.x = cl(b.x, 60, 940); } if (b.y < 70) { b.y = 70; b.vy = 40; } if (b.y > 470) { p.done = 'fail'; b.y = 470; } } };
  p.onTime = () => (p.done = 'win');
  p.draw = (g) => { mesa(g); g.fillStyle = 'rgba(232,38,45,.35)'; g.fillRect(60, 520, 880, 6); for (const b of p.b) { g.strokeStyle = '#fff'; g.beginPath(); g.moveTo(b.x, b.y + 55); g.lineTo(b.x + 6, b.y + 95); g.stroke(); im(g, I, 'globo' + b.i, b.x, b.y, 100); } };
  return p; };
P.colores = (I, S) => { const p = base('Cada caramelo en su vaso', 30); const pos = [160, 330, 500, 670, 840];
  const nuevo = () => (p.c = { k: Math.floor(R(0, 5)), x: 500, y: 170, tx: 0, ty: 0, mv: 0, sh: 0 }); nuevo(); p.vol = [];
  p.down = (x, y) => { if (p.c.mv) return; for (let i = 0; i < 5; i++) if (Math.abs(x - pos[i]) < 80 && y > 280) {
    if (i === p.c.k) { p.c.mv = 1; p.c.tx = pos[i]; p.c.ty = 400; S('pop'); } else { p.c.sh = .4; S('boton'); } return; } };
  p.update = dt => { const c = p.c; if (c.sh > 0) c.sh -= dt; if (c.mv) { c.x += (c.tx - c.x) * Math.min(1, dt * 14); c.y += (c.ty - c.y) * Math.min(1, dt * 14);
      if (Math.abs(c.y - c.ty) < 6) { p.n++; chispa(p, c.x, 380); nuevo(); if (p.n >= p.total) p.done = 'win'; } } };
  p.draw = g => { mesa(g); for (let i = 0; i < 5; i++) im(g, I, 'vaso' + (i + 1), pos[i], 430, 120); const c = p.c;
    im(g, I, 'carame' + (c.k + 1), c.x + (c.sh > 0 ? Math.sin(c.sh * 60) * 10 : 0), c.y, 80); if (!c.mv) txt(g, 'Toca el vaso del mismo color', 500, 90, 26, '#cfe3ff'); };
  return p; };
P.caja = (I, S) => { const p = base('Saca todos los pañuelos', 100); p.v = [];
  p.down = (x, y) => { if (Math.abs(x - 500) < 260 && y > 200) { p.n++; S('pop'); p.v.push({ x: 500, y: 320, vx: R(-350, 350), vy: R(-600, -400), r: 0, vr: R(-6, 6), l: 1.4 }); if (p.n >= p.total) p.done = 'win'; } };
  p.update = dt => { p.v = p.v.filter(v => (v.l -= dt) > 0); for (const v of p.v) { v.vy += 500 * dt; v.x += v.vx * dt; v.y += v.vy * dt; v.r += v.vr * dt; } };
  p.draw = g => { mesa(g); im(g, I, 'caja', 500, 410, 300); if (p.n < p.total) im(g, I, 'panuelo', 500, 300, 110); for (const v of p.v) { g.globalAlpha = Math.min(1, v.l); im(g, I, 'panuelo', v.x, v.y, 90, 0, v.r); } g.globalAlpha = 1;
    txt(g, 'Toca la caja muy rápido (puedes usar varios dedos)', 500, 90, 24, '#cfe3ff'); };
  return p; };
P.aterrizaje = (I, S) => { const p = base('La botella tiene que caer de pie', 3); let hold = 0, pw = 0, dir = 1, fly = null; const zona = () => { const a = R(.5, .66); p.z = [a, a + .14]; }; zona();
  p.down = () => { if (!fly) hold = 1; };
  p.up = () => { if (!hold || fly) return; hold = 0; const ok = pw >= p.z[0] && pw <= p.z[1]; fly = { t: 0, ok, dist: 380 + (pw - .58) * 500 }; S('boton'); };
  p.update = dt => { if (hold) { pw += dir * dt * .9; if (pw > 1) { pw = 1; dir = -1; } if (pw < 0) { pw = 0; dir = 1; } }
    if (fly) { fly.t += dt; if (fly.t > 1.6) { if (fly.ok) { p.n++; S('gcm2'); chispa(p, 200 + fly.dist, 420, '#2ecc71'); if (p.n >= p.total) p.done = 'win'; } fly = null; pw = 0; zona(); } } };
  p.draw = g => { mesa(g); g.fillStyle = '#2ecc71'; g.fillRect(540, 496, 140, 6); txt(g, 'Mantén pulsado y suelta en la zona verde', 500, 90, 24, '#cfe3ff');
    medidor(g, 900, 140, 300, pw, p.z[0], p.z[1], 1);
    if (fly) { const k = Math.min(1, fly.t / .8), x = 200 + fly.dist * k, y = 420 - Math.sin(k * Math.PI) * 220 + (k >= 1 ? 0 : 0);
      const rot = k < 1 ? k * TAU * 1.5 : fly.ok ? 0 : Math.PI / 2; im(g, I, 'botella', x, k >= 1 && !fly.ok ? 470 : y, 70, 0, rot);
      if (k >= 1) txt(g, fly.ok ? '¡De pie!' : '¡Casi! Otra vez', x, 300, 34, fly.ok ? '#2ecc71' : '#ffd23a'); }
    else im(g, I, 'botella', 200, 420, 70); };
  return p; };
P.vasos = (I, S) => { const p = base('Pasa los vasos hasta que el rojo vuelva abajo', 25); p.st = Array(25).fill(0); p.st[0] = 1; let anim = 0, y0 = null;
  const mueve = () => { if (anim > 0) return; anim = .15; p.st.unshift(p.st.pop()); p.n++; S('pop'); if (p.n >= p.total && p.st[0] === 1) p.done = 'win'; };
  p.down = (x, y) => { y0 = y; }; p.move = (x, y) => { if (y0 != null && y - y0 > 35) { mueve(); y0 = null; } }; p.up = () => { if (y0 != null) mueve(); y0 = null; };
  p.update = dt => { anim -= dt; };
  p.draw = g => { mesa(g); txt(g, 'Desliza hacia abajo (o toca) para pasar el vaso de arriba', 500, 70, 24, '#cfe3ff');
    p.st.forEach((c, i) => im(g, I, c ? 'vaso_rojo' : 'vaso_azul', 500, 450 - i * 13, 110));
    const pos = p.st.indexOf(1); txt(g, pos === 0 ? '🔴 El rojo está abajo' : '🔴 El rojo está en el puesto ' + (pos + 1), 820, 300, 24, '#ffd23a'); };
  return p; };
P.zona = (I, S) => { const p = base('Mete una pelota en cada cesto', 3); const cx = [250, 500, 750]; p.ok = [0, 0, 0]; let bx = 100, d = 1, drop = null;
  p.down = () => { if (!drop) { drop = { x: bx, y: 130, vy: 0 }; S('boton'); } };
  p.update = dt => { bx += d * dt * (300 + p.n * 60); if (bx > 920) d = -1; if (bx < 80) d = 1;
    if (drop) { drop.vy += 1400 * dt; drop.y += drop.vy * dt; if (drop.y > 400 && !drop.hit) { drop.hit = 1; const i = cx.findIndex(c => Math.abs(c - drop.x) < 45);
        if (i >= 0 && !p.ok[i]) { p.ok[i] = 1; p.n++; chispa(p, cx[i], 400); S('gcm2'); drop = null; if (p.n >= 3) p.done = 'win'; } }
      if (drop && drop.y > 520) drop = null; } };
  p.draw = g => { mesa(g); g.fillStyle = '#888'; g.fillRect(60, 104, 880, 6); txt(g, 'Toca para soltar la pelota', 500, 70, 24, '#cfe3ff');
    cx.forEach((c, i) => { im(g, I, 'cesto', c, 450, 130); if (p.ok[i]) im(g, I, 'pelota', c, 420, 50); });
    if (!drop) im(g, I, 'pelota', bx, 130, 50); else im(g, I, 'pelota', drop.x, drop.y, 50); };
  return p; };
P.luz = (I, S) => { const p = base('Apaga las 6 luces', 6); const L = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) L.push({ x: 690 + c * 140, y: 170 + r * 120, on: 1 });
  let ball = null; p.prog = () => 'Apagadas: ' + L.filter(l => !l.on).length + ' / 6';
  p.down = () => { if (!ball) { ball = { t: 0, tx: p.ax, ty: p.ay }; S('boton'); } };
  p.update = dt => { p.t += dt; p.ax = 760 + 120 * Math.sin(p.t * 1.3); p.ay = 290 + 160 * Math.sin(p.t * 1.9 + 1);
    if (ball) { ball.t += dt * 2; if (ball.t >= 1) { const l = L.find(l => Math.hypot(l.x - ball.tx, l.y - ball.ty) < 55); if (l) { l.on = !l.on; S(l.on ? 'boton' : 'gcm2'); chispa(p, l.x, l.y); }
        ball = null; p.n = L.filter(l => !l.on).length; if (p.n >= 6) p.done = 'win'; } } };
  p.draw = g => { g.fillStyle = 'rgba(20,20,30,.85)'; g.fillRect(610, 100, 300, 380); for (const l of L) im(g, I, l.on ? 'luz_on' : 'luz_off', l.x, l.y, 100);
    g.strokeStyle = '#e8262d'; g.lineWidth = 4; g.beginPath(); g.arc(p.ax, p.ay, 26, 0, TAU); g.moveTo(p.ax - 36, p.ay); g.lineTo(p.ax + 36, p.ay); g.moveTo(p.ax, p.ay - 36); g.lineTo(p.ax, p.ay + 36); g.stroke(); g.lineWidth = 1;
    txt(g, 'Toca para lanzar la pelota a la mira', 300, 90, 24, '#cfe3ff'); txt(g, 'Si das a una luz apagada, ¡se vuelve a encender!', 300, 125, 20, '#ffd23a');
    if (ball) { const k = ball.t, x = 150 + (ball.tx - 150) * k, y = 450 + (ball.ty - 450) * k - Math.sin(k * Math.PI) * 120; im(g, I, 'pelota', x, y, 40 - k * 14); } else im(g, I, 'pelota', 150, 450, 40); };
  return p; };
P.balde = (I, S) => { const p = base('Rebota 10 pelotas hasta el cubo', 10); let pw = 0, d = 1, ball = null; p.z = [.44, .6];
  p.down = () => { if (!ball) { ball = { t: 0, ok: pw >= p.z[0] && pw <= p.z[1], pw }; S('boton'); } };
  p.update = dt => { pw += d * dt * 1.1; if (pw > 1) { pw = 1; d = -1; } if (pw < 0) { pw = 0; d = 1; }
    if (ball) { ball.t += dt * 1.4; if (ball.t > 1) { if (ball.ok) { p.n++; chispa(p, 600, 420); S('gcm2'); if (p.n >= p.total) p.done = 'win'; } ball = null; } } };
  p.draw = g => { mesa(g); g.fillStyle = '#556'; g.fillRect(900, 100, 30, 400); im(g, I, 'cesto', 600, 450, 120); txt(g, 'Toca cuando la barra esté en la zona verde', 500, 70, 24, '#cfe3ff');
    medidor(g, 200, 100, 500, pw, p.z[0], p.z[1]);
    if (ball) { const k = ball.t, wallX = 900, endX = ball.ok ? 600 : ball.pw < p.z[0] ? 480 : 760; let x, y;
      if (k < .5) { const q = k / .5; x = 150 + (wallX - 150) * q; y = 420 - Math.sin(q * Math.PI * .6) * 200; } else { const q = (k - .5) / .5; x = wallX + (endX - wallX) * q; y = 230 + q * q * 200; }
      im(g, I, 'pelota', x, y, 40); } else im(g, I, 'pelota', 150, 420, 40); };
  return p; };
P.lapiz = (I, S) => { const p = base('Derriba el lápiz con la canica', 1); let mx = 100, d = 1, shot = null, caida = 0;
  p.down = () => { if (!shot && !caida) { shot = { x: mx, y: 500 }; S('boton'); } };
  p.update = dt => { mx += d * dt * 420; if (mx > 900) d = -1; if (mx < 100) d = 1; if (caida) { caida = Math.min(Math.PI / 2, caida + dt * 3); if (caida >= Math.PI / 2 && !p.done) { p.n = 1; p.done = 'win'; } }
    if (shot) { shot.y -= dt * 900; if (Math.abs(shot.x - 500) < 38 && shot.y < 420) { caida = .01; S('gcm2'); chispa(p, 500, 400); shot = null; } else if (shot.y < 150) shot = null; } };
  p.draw = g => { mesa(g); txt(g, 'Toca cuando la canica pase por debajo del lápiz', 500, 70, 24, '#cfe3ff');
    g.save(); g.translate(500, 470); g.rotate(caida); im(g, I, 'lapiz', 0, -90, 40, 180); g.restore(); g.fillStyle = 'rgba(46,204,113,.5)'; g.fillRect(462, 530, 76, 8);
    if (shot) im(g, I, 'canica', shot.x, shot.y, 36); else if (!caida) im(g, I, 'canica', mx, 515, 36); };
  return p; };
P.moneda = (I, S) => { const p = base('Mete 6 monedas en la garrafa', 6); let ax = 200, d = 1, coin = null;
  p.down = () => { if (!coin) { coin = { x: ax, y: 160, vy: 0 }; S('boton'); } };
  p.update = dt => { ax += d * dt * (330 + p.n * 30); if (ax > 820) d = -1; if (ax < 180) d = 1;
    if (coin) { coin.vy += 1500 * dt; coin.y += coin.vy * dt; if (coin.y > 245 && !coin.h) { coin.h = 1; if (Math.abs(coin.x - 500) < 32) { p.n++; S('gcm2'); chispa(p, 500, 250); coin = null; if (p.n >= p.total) p.done = 'win'; } }
      if (coin && coin.y > 500) coin = null; } };
  p.draw = g => { mesa(g); txt(g, 'Toca para soltar la moneda sobre la boca de la garrafa', 500, 70, 24, '#cfe3ff');
    g.fillStyle = 'rgba(180,220,255,.25)'; g.strokeStyle = '#cfe3ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(465, 250); g.lineTo(465, 290); g.quadraticCurveTo(360, 320, 360, 400); g.lineTo(360, 500); g.lineTo(640, 500); g.lineTo(640, 400); g.quadraticCurveTo(640, 320, 535, 290); g.lineTo(535, 250); g.closePath(); g.fill(); g.stroke(); g.lineWidth = 1;
    for (let i = 0; i < p.n; i++) im(g, I, 'moneda', 420 + (i % 4) * 50, 480 - Math.floor(i / 4) * 20, 40);
    if (coin) im(g, I, 'moneda', coin.x, coin.y, 44); else im(g, I, 'moneda', ax, 160, 44); };
  return p; };
export function crear(id, I, S) { const p = P[id](I, S); const d = p.draw; p.draw = (g, dt) => { d(g, dt); fxDraw(p, g, dt); }; return p; }
