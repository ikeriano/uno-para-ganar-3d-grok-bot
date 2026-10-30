// Uno para ganar 3D · juego de fans (Show Time TV para Ikeriano)
import { E, THREE, init, loop, cam, gesto, habla, aplausos, tema, setReloj, setPantallas, setCalidad, orbita } from './engine.js';
import { crear, VW, VH } from './pruebas.js';
const U = window.UPG, $ = s => document.querySelector(s), H = (s, h) => ($(s).innerHTML = h);
const show = (s, on = true) => $(s).classList.toggle('hide', !on);
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const eur = n => (O.moneda === 'R$' ? 'R$ ' + fmt(n) : fmt(n) + ' €');
// ---------- opciones ----------
const DEF = { musica: true, mvol: .7, efectos: true, evol: .9, voz: true, explica: true, rapida: false, chistes: false, monologo: false, copres: false, calidad: 'media', escalera: 'sb3', custom: null, nombre: 'Iker', camisa: '#e8262d', cabecera: null };
const O = Object.assign({}, DEF, JSON.parse(localStorage.getItem('upg.o') || '{}')); const guarda = () => localStorage.setItem('upg.o', JSON.stringify(O));
const escalera = () => O.escalera === 'real' ? U.escaleraReal : O.escalera === 'custom' && O.custom ? O.custom : U.escalera;
// ---------- audio ----------
const AC = new (window.AudioContext || window.webkitAudioContext)(); const gM = AC.createGain(), gS = AC.createGain(), gV = AC.createGain();
gM.connect(AC.destination); gS.connect(AC.destination); gV.connect(AC.destination);
const vols = () => { gM.gain.value = O.mvol * (voz.src ? .35 : 1); gS.gain.value = O.evol; };
const buf = {}; const load = u => buf[u] || (buf[u] = fetch(u).then(r => r.ok ? r.arrayBuffer() : null).then(b => b && AC.decodeAudioData(b)).catch(() => null));
let mus = null, musTok = 0;
async function musica(n, lp = true, v = 1) { const t = ++musTok; paraMus(); if (!O.musica || !n) return; const b = await load('snd/' + n + '.ogg'); if (!b || t !== musTok) return;
  const s = AC.createBufferSource(); s.buffer = b; s.loop = lp; const g = AC.createGain(); g.gain.value = v; s.connect(g).connect(gM); s.start(); mus = { s, g, n }; }
function paraMus() { if (mus) { try { mus.s.stop(); } catch (e) { } mus = null; } }
function sfx(n, v = 1) { if (!O.efectos) return; load('snd/' + n + '.ogg').then(b => { if (!b) return; const s = AC.createBufferSource(); s.buffer = b; const g = AC.createGain(); g.gain.value = v; s.connect(g).connect(gS); s.start(); }); }
const hash = s => { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x * 33) ^ s.charCodeAt(i)) >>> 0; return x.toString(16); };
const voz = { src: null, fin: null };
function cortaVoz() { if (voz.src) { try { voz.src.stop(); } catch (e) { } } voz.src = null; if (voz.fin) { const f = voz.fin; voz.fin = null; f(); } vols(); show('#bub', false); }
const QUIEN = { host: U.presentador.split(' ')[0] ? U.presentador : 'Presentador' };
const nombreDe = q => q === 'host' ? U.presentador : q === 'conc' ? (O.nombre || 'Concursante') : (U.personajes[q] || q);
const persona = q => q === 'guia' ? 'guia' : E.people[q] ? q : null;
// ---------- sesiones (cancelables) ----------
let SES = 0; class Stop extends Error { }
const vivo = id => { if (id !== SES) throw new Stop(); };
const espera = (ms, id) => new Promise(r => setTimeout(r, ms)).then(() => vivo(id));
function decir(q, t, id, nb) {
  return new Promise(res => { cortaVoz(); show('#bub'); $('#bub b').textContent = nb || nombreDe(q); $('#bub span').textContent = t;
    const p = persona(q); let done = false; const fin = () => { if (done) return; done = true; voz.fin = null; if (voz.src) { try { voz.src.stop(); } catch (e) { } voz.src = null; } vols(); p && habla(p, 0); res(); };
    voz.fin = fin; const ms = 1200 + t.length * (O.rapida ? 35 : 55);
    if (!O.voz) { p && habla(p, ms / 1000); setTimeout(fin, ms); return; }
    load('voz/' + hash(q + '|' + t) + '.ogg').then(b => { if (done) return; if (!b) { p && habla(p, ms / 1000); setTimeout(fin, ms); return; }
      const s = AC.createBufferSource(); s.buffer = b; s.playbackRate.value = O.rapida ? 1.12 : 1; s.connect(gV); voz.src = s; vols(); s.onended = () => setTimeout(fin, 250); s.start(); p && habla(p, b.duration); });
  }).then(() => vivo(id));
}
$('#bub').onclick = () => voz.fin && voz.fin();
// ---------- UI ----------
function botones(list) { return new Promise(res => { const b = $('#btns'); b.innerHTML = ''; for (const [t, v, c] of list) { const e = document.createElement('button'); e.innerHTML = t; if (c) e.className = c; e.onclick = () => { sfx('boton', .6); b.innerHTML = ''; res(v); }; b.appendChild(e); } }); }
const pide = (list, id) => botones(list).then(v => (vivo(id), v));
function cartel(t, s, ms = 1800) { H('#cartel', t + (s ? '<small>' + s + '</small>' : '')); const c = $('#cartel'); c.classList.add('hide'); void c.offsetWidth; show('#cartel'); clearTimeout(cartel.t); cartel.t = setTimeout(() => show('#cartel', false), ms); }
function titulo(t, ms = 4500) { H('#titulo', t); const e = $('#titulo'); e.classList.add('hide'); void e.offsetWidth; show('#titulo'); clearTimeout(titulo.t); titulo.t = setTimeout(() => show('#titulo', false), ms); }
async function fundido(fn) { $('#fade').style.opacity = 1; await new Promise(r => setTimeout(r, 420)); fn && fn(); $('#fade').style.opacity = 0; }
function limpia() { cortaVoz(); if (window.__ed && window.__ed.isOpen()) { window.__edMudo = 1; window.__ed.close(); window.__edMudo = 0; } ['#hud', '#cj', '#plano', '#hist', '#joy', '#inv', '#cartel', '#titulo', '#panel', '#menu', '#capa'].forEach(s => show(s, false)); H('#btns', '');
  E.slow = false; E.hidden = false; E.manual = false; E.camHook = null; orbita(0); setReloj(null); capa(null); juego = null; walk = null; $('#c3d').style.transform = ''; ['marta', 'dani', 'lucia', 'sergio', 'guia'].forEach(k => E.people[k].visible = false);
  E.people.host.visible = E.people.conc.visible = true; E.people.host.position.set(-2.2, .25, 1.6); E.people.host.rotation.y = .5; E.people.conc.position.set(2.2, .25, 1.6); E.people.conc.rotation.y = -.5;
  for (const k in E.people) gesto(k, ''); museoPaneles(false); lugar(null); }
function modo(fn) { const id = ++SES; limpia(); fn(id).catch(e => { if (!(e instanceof Stop)) console.error(e); }); }
function alMenu() { SES++; limpia(); tema(temaActual); menu(); }
let temaActual = 'normal';
// ---------- canvas de pruebas ----------
const cj = $('#cj'), g = cj.getContext('2d'), imgs = {};
const I = n => { if (!imgs[n]) { const i = new Image(); i.src = 'img/' + n + '.png'; imgs[n] = i; } return imgs[n]; };
['globo0', 'globo1', 'globo2', 'vaso1', 'vaso2', 'vaso3', 'vaso4', 'vaso5', 'carame1', 'carame2', 'carame3', 'carame4', 'carame5', 'caja', 'panuelo', 'botella', 'vaso_azul', 'vaso_rojo', 'cesto', 'pelota', 'luz_on', 'luz_off', 'lapiz', 'canica', 'moneda'].forEach(I);
const fondoClasico = new Image(); fondoClasico.src = 'img/fondo_clasico.jpg';
let juego = null, esc = 1, ox = 0, oy = 0;
function ajusta() { const dpr = Math.min(devicePixelRatio, E.q === 'alta' ? 1.5 : 1); cj.width = innerWidth * dpr; cj.height = innerHeight * dpr; esc = Math.min(cj.width / VW, cj.height / VH); ox = (cj.width - VW * esc) / 2; oy = (cj.height - VH * esc) / 2; }
addEventListener('resize', ajusta);
const vp = e => { const r = cj.getBoundingClientRect(), k = cj.width / r.width; return [((e.clientX - r.left) * k - ox) / esc, ((e.clientY - r.top) * k - oy) / esc]; };
cj.addEventListener('pointerdown', e => { if (juego && juego.p.down && !juego.p.done) juego.p.down(...vp(e)); });
cj.addEventListener('pointermove', e => { if (juego && juego.p.move && !juego.p.done) juego.p.move(...vp(e)); });
cj.addEventListener('pointerup', e => { if (juego && juego.p.up && !juego.p.done) juego.p.up(...vp(e)); });
function tickJuego(dt) { if (!juego) return; const j = juego, p = j.p;
  if (!p.done) { p.update(dt); if (j.reloj) { j.left -= dt; if (j.left <= 0) { j.left = 0; p.onTime ? p.onTime() : (p.done = 'fail'); } }
    const s = Math.ceil(j.left); if (j.reloj) { $('#relojH').textContent = s; $('#relojH').classList.toggle('poco', s <= 10); setReloj(j.left); if (s <= 5 && s !== j.ult) { j.ult = s; sfx('boton', .5); } } $('#progH').textContent = p.prog(); }
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cj.width, cj.height);
  if (j.clasico) { g.fillStyle = '#0a1d6a'; g.fillRect(0, 0, cj.width, cj.height); if (fondoClasico.width) { g.globalAlpha = .45; g.drawImage(fondoClasico, ox, oy, VW * esc, VH * esc); g.globalAlpha = 1; } }
  else { g.fillStyle = 'rgba(2,6,30,.45)'; g.fillRect(0, 0, cj.width, cj.height); }
  g.setTransform(esc, 0, 0, esc, ox, oy); p.draw(g, dt);
  if (p.done && !j.fin) { j.fin = 1; setTimeout(() => j.res(p.done), 700); } }
function jugarPrueba(pr, id, { reloj = true, clasico = false } = {}) {
  return new Promise(res => { ajusta(); show('#bub', false); juego = { p: crear(pr.id, I, sfx), reloj, left: 60, res, clasico, ult: 99 }; show('#cj'); show('#hud'); show('#relojH', reloj); show('#progH'); E.slow = !clasico; E.hidden = clasico; cam('mesa'); })
    .then(r => { juego = null; show('#cj', false); show('#relojH', false); show('#progH', false); E.slow = false; E.hidden = false; setReloj(null); vivo(id); return r; });
}
// ---------- HUD escalera ----------
function hud(nivel, vidas, banco) { show('#hud'); const L = escalera();
  H('#esc', L.map((v, i) => `<div class="${U.seguros.includes(i) ? 'seg ' : ''}${i < nivel ? 'ok' : i === nivel ? 'act' : ''}">${i + 1} · ${eur(v)}${U.seguros.includes(i) ? ' ★' : ''}</div>`).join(''));
  $('#vidas').textContent = vidas == null ? '' : '❤️'.repeat(vidas) + '🤍'.repeat(3 - vidas); $('#banco').textContent = banco == null ? '' : '💶 ' + eur(banco); $('#nombreH').textContent = '🧑 ' + (O.nombre || 'Concursante'); }
export { O, U, $, H, show, decir, botones, pide, cartel, titulo, musica, paraMus, sfx, modo, alMenu, limpia, espera, vivo, jugarPrueba, hud, escalera, eur, fundido, Stop };
// ---------- capa de look (port de exCapa) ----------
const cp = $('#capa'), cg = cp.getContext('2d'); let look = null;
function capa(m, info) { look = m ? { m, t: 0, toma: 1, sello: null, info: info || '' } : null; show('#capa', !!m); show('#inv', !!(info && info.inv)); $('#c3d').style.transform = ''; }
function tickCapa(dt) { if (!look) return; look.t += dt; const W = cp.width = innerWidth, Hh = cp.height = innerHeight, c = cg, t = look.t;
  c.clearRect(0, 0, W, Hh); if (look.m !== 'oculta') { for (let i = 0; i < 160; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * .12})`; c.fillRect(Math.random() * W, Math.random() * Hh, 2, 2); } }
  c.font = 'bold 18px Arial'; c.textAlign = 'left';
  if (look.m === 'oculta') { c.strokeStyle = '#fff'; c.lineWidth = 4; const m = 26, l = 40; [[m, m, 1, 1], [W - m, m, -1, 1], [m, Hh - m, 1, -1], [W - m, Hh - m, -1, -1]].forEach(([x, y, a, b]) => { c.beginPath(); c.moveTo(x, y + b * l); c.lineTo(x, y); c.lineTo(x + a * l, y); c.stroke(); });
    if (Math.floor(t * 2) % 2) { c.fillStyle = '#e8262d'; c.beginPath(); c.arc(W - 150, 50, 9, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.fillText('CÁMARA OCULTA', W - 134, 56); }
  if (look.m === 'tomas') { c.fillStyle = '#ffd23a'; c.font = '900 22px Arial Black,Arial'; c.fillText('TOMAS FALSAS', 24, 40); c.font = 'bold 16px monospace'; c.fillStyle = '#fff'; c.textAlign = 'right';
    const ss = String(Math.floor(t) % 60).padStart(2, '0'), ff = String(Math.floor(t * 25) % 25).padStart(2, '0'); c.fillText(`TC 01:17:${ss}:${ff}`, W - 96, Hh - 20); }
  if (look.m === 'fuera' || look.m === 'mejor') { const gr = c.createRadialGradient(W / 2, Hh / 2, Hh * .35, W / 2, Hh / 2, W * .7); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.65)'); c.fillStyle = gr; c.fillRect(0, 0, W, Hh);
    c.fillStyle = '#fff'; c.font = '900 20px Arial Black,Arial'; c.fillText(look.m === 'fuera' ? 'FUERA DE CÁMARAS' : '🏆 MEJORES MOMENTOS', 24, 40);
    if (look.m === 'fuera') { c.textAlign = 'right'; c.fillStyle = Math.floor(t * 2) % 2 ? '#e8262d' : '#fff'; c.fillText('● REC', W - 24, 40);
      $('#c3d').style.transform = `scale(1.06) translate(${Math.sin(t * 1.7) * 4}px,${Math.cos(t * 2.3) * 3}px) rotate(${Math.sin(t * .9) * .3}deg)`; } }
  if (look.claq > 0) { look.claq -= dt; const k = Math.min(1, (1.2 - look.claq) * 4), cx = W / 2, cy = Hh / 2 - 40; c.save(); c.translate(cx, cy); c.fillStyle = '#111'; c.fillRect(-130, -20, 260, 120);
    c.save(); c.translate(-130, -20); c.rotate(-.5 * (1 - k)); for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#fff' : '#111'; c.fillRect(i * 38, -26, 38, 26); } c.restore();
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = 'bold 22px Arial'; c.fillText('ESCENA 1 · TOMA ' + look.toma, 0, 30); c.font = '15px Arial'; c.fillText('UNO PARA GANAR', 0, 62); c.restore(); }
  if (look.sello > 0) { look.sello -= dt; c.save(); c.translate(W / 2, Hh * .42); c.rotate(-.15); const s = 1 + Math.max(0, look.sello - 1.6) * 3; c.scale(s, s);
    c.strokeStyle = c.fillStyle = look.selloC || '#e8262d'; c.lineWidth = 6; c.font = '900 46px Arial Black,Arial'; c.textAlign = 'center'; const w = c.measureText(look.selloT).width + 40; c.strokeRect(-w / 2, -44, w, 66); c.fillText(look.selloT, 0, 8); c.restore(); }
  if (look.conf) { look.conf = look.conf.filter(p => (p.y += p.v * dt) < Hh + 20); for (const p of look.conf) { c.fillStyle = p.c; c.fillRect(p.x + Math.sin(t * 3 + p.y * .02) * 10, p.y, 8, 12); } }
}
function confeti(n = 120, emoji) { if (!look) capa('fx'); look.conf = (look.conf || []).concat(Array.from({ length: n }, () => ({ x: Math.random() * innerWidth, y: -Math.random() * innerHeight, v: 120 + Math.random() * 200, c: ['#ffd23a', '#e8262d', '#3a7bff', '#2ecc71', '#fff'][Math.floor(Math.random() * 5)] }))); }
function sello(t, c) { if (!look) capa('fx'); look.selloT = t; look.selloC = c; look.sello = 2.2; }
// ---------- lugares fuera del plató ----------
let lugarG = null;
function lugar(l) { if (lugarG) { E.scene.remove(lugarG); lugarG = null; } if (!l || l === 'plato') return;
  const G = lugarG = new THREE.Group(), M = c => new THREE.MeshLambertMaterial({ color: c }); G.position.set(26, 0, 0); E.scene.add(G);
  const suelo = new THREE.Mesh(new THREE.BoxGeometry(12, .1, 10), M(l === 'control' ? 0x222833 : 0x6a4a3a)); G.add(suelo);
  const pared = new THREE.Mesh(new THREE.BoxGeometry(12, 5, .2), M(l === 'control' ? 0x1a2030 : 0xe8d8c8)); pared.position.set(0, 2.5, -4); G.add(pared);
  if (l === 'maquillaje') { const esp = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.6), new THREE.MeshBasicMaterial({ color: 0xcfe3ff })); esp.position.set(0, 2.4, -3.85); G.add(esp);
    for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(.12, 6, 5), new THREE.MeshBasicMaterial({ color: 0xfff2c0 })); b.position.set(-1.5 + i * .6, 3.35, -3.8); G.add(b); }
    const silla = new THREE.Mesh(new THREE.BoxGeometry(.8, .9, .8), M(0x222222)); silla.position.set(0, .45, -1.2); G.add(silla); }
  if (l === 'control') { for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1), new THREE.MeshBasicMaterial({ map: E.logoTex(i * 10) })); m.position.set(-4.2 + i * 1.7, 2.6, -3.85); G.add(m); }
    const mesa = new THREE.Mesh(new THREE.BoxGeometry(9, .9, 1.4), M(0x333a48)); mesa.position.set(0, .45, -2.5); G.add(mesa); }
  E.cams.cercaL = [[26 - .5, 2.1, 3.5], [26 - .5, 1.6, -1]]; E.cams.wideL = [[26, 3.2, 6], [26, 1.4, -1.5]];
  const sitios = [[-1.2, 1], [1.2, 1], [0, 0]]; let i = 0;
  return k => { const p = E.people[k]; const [x, z] = sitios[i++ % 3]; p.visible = true; p.position.set(26 + x, 0, z - 1); p.rotation.y = -x * .3; }; }
// ---------- escenas (exCorre) ----------
const GEST = { habla: 'explica', senala: 'señala', arriba: 'celebra', aplaude: 'aplaude', gracias: 'saluda', encoge: 'piensa', saluda: 'saluda', '': '' };
const CAMS = { host: 'presentador', wide: 'general', cerca: 'cerca', reloj: 'reloj', mesa: 'mesa', publico: 'publico' };
function camara(n, fuera, who) { orbita(0); if (fuera) { cam(n === 'wide' || n === 'orbita' || n === 'barrido' ? 'wideL' : 'cercaL'); if (who && E.people[who] && n !== 'wide') { const p = E.people[who].position; E.camT.p.set(p.x, 2.1, p.z + 2.6); E.camT.l.set(p.x, 1.8, p.z); } return; }
  if (n === 'orbita') return orbita(1); if (n === 'barrido') { cam([[-9, 3, 9], [0, 1.5, 0]], true); cam('lateral'); return; }
  if ((n === 'cerca' || n === 'host') && who && E.people[who] && E.people[who].visible) { const p = E.people[who].position; E.camT.p.set(p.x + .6, 2.1, p.z + 3.4); E.camT.l.set(p.x, 1.8, p.z); return; }
  cam(CAMS[n] || 'general'); }
async function efecto(f, id) { if (!f) return; for (const e of f.split('+')) { const [k, v] = e.split(':');
  if (k === 'claqueta') { if (look) { look.toma = +v || 1; look.claq = 1.2; } sfx('boton', 1); }
  else if (k === 'tomafalsa') { sello('TOMA FALSA'); sfx('bocina', .5); aplausos(2); }
  else if (k === 'inocente') { sello('¡INOCENTE, INOCENTE!', '#ffd23a'); confeti(); sfx('polvo'); aplausos(3); }
  else if (k === 'risas' || k === 'ooh') { aplausos(1.5); sfx('gc', .6); }
  else if (k === 'aplauso') { aplausos(3); sfx('gcm1', .8); }
  else if (k === 'bocina') sfx('bocina', .7);
  else if (k === 'lenta') { cartel('⏪ REPETICIÓN', 'a cámara lenta', 1600); }
  else if (k === 'confeti' || k === 'globos') { confeti(160); sfx('polvo'); aplausos(3); }
} }
async function corre(mode, sc, id) {
  for (const k in E.people) gesto(k, ''); capa(mode, { inv: true }); const fuera = sc.lugar && sc.lugar !== 'plato'; const pon = lugar(sc.lugar);
  const quienes = [...new Set(sc.pasos.map(p => p[0]))]; ['marta', 'dani', 'lucia', 'sergio'].forEach(k => E.people[k].visible = false);
  if (fuera) { E.people.host.visible = E.people.conc.visible = false; quienes.forEach(k => E.people[k] && pon(k)); }
  else { quienes.forEach((k, i) => { if (['marta', 'dani', 'lucia', 'sergio'].includes(k)) { const p = E.people[k]; p.visible = true; p.position.set(-4.5 + i * 1.2, .25, 3); p.rotation.y = .2; } }); }
  titulo((mode === 'oculta' ? 'CÁMARA OCULTA' : mode === 'tomas' ? 'TOMAS FALSAS' : mode === 'fuera' ? 'FUERA DE CÁMARAS' : 'MEJORES MOMENTOS') + ' · ' + sc.titulo);
  camara('wide', fuera); await espera(1500, id);
  for (const [q, t, c, ge, f] of sc.pasos) { camara(c, fuera, q); E.people[q] && gesto(q, GEST[ge] ?? ge); await efecto(f, id); await decir(q, t, id); await espera(350, id); E.people[q] && gesto(q, ''); }
  await espera(1200, id);
  if (O.copres && Math.random() < .3) await copresentador(id);
}
async function copresentador(id) { const c = U.copres[Math.floor(Math.random() * U.copres.length)]; const p = E.people[c.quien]; if (!p) return; p.visible = true; p.position.set(0, .25, 2.6); p.rotation.y = 0;
  titulo('🆕 Copresentador sorpresa · ' + nombreDe(c.quien)); camara('cerca', false, c.quien); gesto(c.quien, 'saluda'); for (const t of c.lineas) await decir(c.quien, t, id); gesto(c.quien, ''); }
function escenas(mode, auto) { modo(async id => { musica(mode === 'oculta' ? 'juego' : 'menu', true, .35); const L = U.escenas[mode];
  let i = typeof auto === 'number' ? auto : -1;
  if (i < 0) { const v = await lista((mode === 'oculta' ? '🕵️ Cámara oculta' : mode === 'tomas' ? '🎬 Tomas falsas' : mode === 'fuera' ? '🎥 Fuera de cámaras' : '🏆 Mejores momentos') + ' <span class="nuevo">🆕 INVENTADO</span>',
      [['▶ Ver todas seguidas', 'all', 'gold'], ...L.map((s, k) => ['🆕 ' + s.titulo, k])], id); if (v === 'all') { for (const s of L) await corre(mode, s, id); return fin(); } i = v; }
  while (true) { await corre(mode, L[i], id); orbita(1); const v = await pide([['Siguiente ▶', 'n', 'gold'], ['🔁 Repetir', 'r'], ['📋 Lista', 'l'], ['🏠 Menú', 'm']], id);
    if (v === 'n') i = (i + 1) % L.length; if (v === 'l') return escenas(mode); if (v === 'm') return alMenu(); }
  async function fin() { orbita(1); const v = await pide([['📋 Lista', 'l', 'gold'], ['🏠 Menú', 'm']], id); v === 'l' ? escenas(mode) : alMenu(); } }); }
function lista(t, items, id) { return new Promise(res => { show('#panel'); H('#panel', `<button class="volver">⬅ Volver</button><h2>${t}</h2><div class="grid"></div>`); const gr = $('#panel .grid');
  $('#panel .volver').onclick = () => { show('#panel', false); alMenu(); };
  for (const [tt, v, c] of items) { const b = document.createElement('button'); b.innerHTML = tt; if (c) b.className = c; b.onclick = () => { sfx('boton', .6); show('#panel', false); res(v); }; gr.appendChild(b); } }).then(v => (vivo(id), v)); }
export { lista, escenas, corre, capa, confeti, sello, camara, efecto, copresentador, lugar, tickCapa, tickJuego, ajusta, GEST };
// ---------- arranque ----------
let walk = null, museoPaneles = () => { };
export function setWalk(w) { walk = w; } export function setMuseo(f) { museoPaneles = f; } export function getWalk() { return walk; }
export function setTema(t) { temaActual = t; tema(t); }
import('./modos.js').then(m => { window.__M = m; m.arranca(); });
init($('#c3d'), O.calidad); ajusta();
loop((dt, t) => { tickJuego(dt); tickCapa(dt); walk && walk(dt, t); window.__ed && window.__ed.tick(dt); });
window.__rlAtras = () => { if (window.AntenaPS && AntenaPS.isOpen && AntenaPS.isOpen()) { AntenaPS.close(); return true; } if (window.__ed && window.__ed.isOpen()) { window.__ed.close(); return true; } if (!$('#menu').classList.contains('hide')) return false; alMenu(); return true; };
document.addEventListener('pointerdown', () => AC.state !== 'running' && AC.resume(), { capture: true });
function menu() { window.__M && window.__M.menu(); }
export { cortaVoz, nombreDe, AC, vols };
