// Menús y modos de juego (estructura copiada de Ahora Caigo 1.64)
import { E, THREE, cam, gesto, aplausos, tema, setPantallas, setCalidad, orbita } from './engine.js';
import * as M from './main.js';
const { O, U, $, H, show, decir, pide, cartel, titulo, musica, paraMus, sfx, modo, alMenu, espera, vivo, jugarPrueba, hud, escalera, eur, lista, escenas, capa, confeti, camara, copresentador } = M;
const guarda = () => localStorage.setItem('upg.o', JSON.stringify(O));
const N = s => s + ' <span class="nuevo">🆕 INVENTADO</span>';
const rnd = a => a[Math.floor(Math.random() * a.length)];
// ---------- menú principal ----------
const MENU = [
  ['▶️ Jugar', 'Programa completo, entrenamiento, clásico…', 'gold', () => sub('jugar')],
  ['🇧🇷 1 MINUTO PARA VENCER', 'Versión brasileña del formato (la del proyecto Scratch)', 'gold', () => programa({ brasil: 1 })],
  ['📱 App clásica', 'El juego 2D original de Scratch, en español', 'gold', () => programa({ clasico: 1 })],
  ['⭐ Lo mejor de Uno para ganar', 'Mejores momentos y novedades', 'gold', () => sub('mejor')],
  ['🎞️ Recreaciones e historias', 'La historia, el museo y recreaciones', '', () => sub('recre')],
  ['🏆 Mejores momentos · 🆕', 'Recreaciones 3D inventadas', 'gold', () => escenas('mejor')],
  ['🏛️ Museo de Uno para ganar', 'Con la guía Doña Clepsidra', '', museo],
  ['🕹️ APPS CLÁSICAS', 'Versiones 2D jugables', '', () => sub('apps')],
  ['📣 Promos', 'Promos 3D y creador de promos', '', () => sub('promos')],
  ['🎙️ Promos de Javier', 'Javier presenta el programa', '', () => sub('promosJ')],
  ['📺 Publicidad', 'Anuncios inventados y cortinillas', '', () => sub('publi')],
  ['🕵️ Cámara oculta', 'Bromas al presentador', '', () => escenas('oculta')],
  ['🎬 Tomas falsas', 'Lapsus y objetos traviesos', '', () => escenas('tomas')],
  ['🎥 Fuera de cámaras', 'Maquillaje, control y ensayos', '', () => escenas('fuera')],
  ['🚶 Paseo', 'Pasea por el plató y sube a la grada', '', () => paseo(false)],
  ['🪪 Casting', 'Apúntate como concursante', '', casting],
  ['💶 Elige el valor de cada nivel', 'La escalera de premios', '', escaleraMenu],
  ['🎥 Cámara libre', 'Vuela, graba tu toma y úsala de cabecera', '', camLibre],
  ['🛠️ Studio · Editor de plató', 'Mueve, pinta y añade piezas y luces', '', editor],
  ['⚙️ Opciones', 'Sonido, voz, calidad, pantalla completa', '', opciones],
  ['📖 La historia de Uno para ganar', 'Javier te cuenta la historia del programa', 'gold', historia],
  ['❓ Cómo se juega', 'Las reglas', '', comoSeJuega],
  ['👏 Créditos', '', '', creditos],
  ['📺 AntenaPlayStation TV', 'La tele de Show Time TV', '', () => window.AntenaPS && AntenaPS.open()],
];
function grid(items) { const d = document.createElement('div'); d.className = 'grid'; for (const [t, s, c, f] of items) { const b = document.createElement('button'); b.innerHTML = t + (s ? '<small>' + s + '</small>' : ''); if (c) b.className = c; b.onclick = () => { sfx('boton', .6); f(); }; d.appendChild(b); } return d; }
export function menu() { const m = $('#menu'); show('#menu'); m.innerHTML = `<h1>UNO <span>PARA</span> GANAR <span style="color:#9fc4ff">3D</span></h1><div class="sub">Show Time TV · versión ${U.version}${O.nombre ? ' · ¡Hola, ' + O.nombre + '!' : ''}</div>`; m.appendChild(grid(MENU)); m.scrollTop = 0;
  orbita(1); if (!M.__mm) musica('menu', true, .45); }
function sub(k) { const S = {
  jugar: ['▶️ Jugar', [['🏁 Programa completo', 'Cabecera, 10 niveles, final y despedida', 'gold', () => programa({})], ['🎯 Elige tu prueba', 'Una prueba suelta con reloj y vidas', '', eligePrueba],
    ['🏋️ Entrenamiento', 'Sin perder vidas', '', () => sub('entreno')], ['🕹️ Clásico', 'El minijuego original de Scratch', '', () => programa({ clasico: 1 })],
    ['🗺️ Explorar el plató', 'Joystick, arrastra para mirar', '', () => paseo(true)], ['🎭 Monólogos del presentador', '', '', monologos], ['🎉 Programa especial', 'Halloween, Navidad, Verano', '', () => sub('especial')]]],
  entreno: ['🏋️ Entrenamiento (sin perder vidas)', [...U.pruebas.map((p, i) => [p.emoji + ' ' + p.nombre, 'Con reloj', '', () => entreno(i, true)]), ...U.pruebas.map((p, i) => [p.emoji + ' ' + p.nombre, 'Sin tiempo', '', () => entreno(i, false)])]],
  especial: ['🎉 Programa especial', [['🎃 Halloween', '', '', () => programa({ tema: 'halloween' })], ['🎄 Navidad', '', '', () => programa({ tema: 'navidad' })], ['☀️ Verano', '', '', () => programa({ tema: 'verano' })], ['📺 Normal', '', '', () => programa({})]]],
  mejor: ['⭐ Lo mejor de Uno para ganar', [['🏆 Mejores momentos', N(''), 'gold', () => escenas('mejor')], ['🕵️ Cámaras ocultas', N(''), '', () => escenas('oculta')], ['🎬 Tomas falsas', N(''), '', () => escenas('tomas')], ['🎥 Fuera de cámaras', N(''), '', () => escenas('fuera')], ['🎯 Prueba al azar', 'Entrenamiento', '', () => entreno(Math.floor(Math.random() * 10), true)]]],
  recre: ['🎞️ Recreaciones e historias', [['📖 La historia de Uno para ganar', '', 'gold', historia], ['🏛️ Museo', '', '', museo], ['🏆 Mejores momentos', N(''), '', () => escenas('mejor')]]],
  apps: ['🕹️ APPS CLÁSICAS', [['📱 1 Minuto Para Vencer (Scratch, en español)', 'Programa en 2D', 'gold', () => programa({ clasico: 1 })], ['🇧🇷 Versión de Brasil 2D', 'Con reales (R$)', '', () => programa({ clasico: 1, brasil: 1 })], ['🏋️ Entrenamiento 2D', 'Gravedad cero', '', () => entreno(0, true, true)]]],
  promos: ['📣 Promos', [...U.promos.map(p => ['🎬 ' + p.titulo, N(''), '', () => promo(p, 'promo')]), ['🎬 Creador de promos', 'Haz tu propia promo', 'gold', creadorPromos]]],
  promosJ: ['🎙️ Promos de Javier', U.promosHost.map(p => ['🎙️ ' + p.titulo, N(''), '', () => promo(p, 'host')])],
  publi: ['📺 Publicidad', [['📺 Pausa publicitaria completa', '', 'gold', () => pausa(U.anuncios.length)], ...U.anuncios.map(a => ['🛒 ' + a.titulo, N(''), '', () => pausa(1, a)]),
    ['⏱️ Publicidad', 'cortinilla', '', () => cortinilla('PUBLICIDAD')], ['⏱️ Volvemos en 1 minuto', 'cortinilla', '', () => cortinilla('VOLVEMOS EN 1 MINUTO')], ['⏱️ Volvemos en 30 segundos', 'cortinilla', '', () => cortinilla('VOLVEMOS EN 30 SEGUNDOS')]]],
}[k]; show('#menu', false); show('#panel'); H('#panel', `<button class="volver">⬅ Volver</button><h2>${S[0]}</h2>`); $('#panel').appendChild(grid(S[1])); $('#panel .volver').onclick = () => { show('#panel', false); k === 'entreno' || k === 'especial' ? sub('jugar') : menu(); }; }
// ---------- programa completo ----------
function quita() { show('#menu', false); show('#panel', false); }
function vozNivel(i) { return U.frases['n' + (i + 1)]; }
async function cabecera(id) {
  musica('getup', false); setPantallas('UNO PARA GANAR', O.moneda === 'R$' ? '1 MINUTO PARA VENCER' : 'SHOW TIME TV');
  if (O.cabecera && O.cabecera.length > 4) { E.manual = true; const P = O.cabecera; for (let k = 0; k < P.length; k++) { const [x, y, z, a, b] = P[k]; E.camera.position.set(x, y, z); E.camera.rotation.set(a, b, 0, 'YXZ'); await espera(100, id); } E.manual = false; }
  else { cam([[0, 12, 22], [0, 3, 0]], true); cam('general'); cartel('UNO PARA GANAR', 'Show Time TV', 3500); aplausos(4); await espera(3800, id); }
  musica('menu', true, .3); cam('presentador'); gesto('host', 'saluda'); await decir('host', U.frases.bienvenida, id); gesto('host', '');
}
async function programa(op) { modo(async id => {
  O.moneda = op.brasil ? 'R$' : '€'; M.setTema(op.tema || (op.brasil ? 'brasil' : 'normal')); const clasico = !!op.clasico; const L = escalera();
  if (!clasico) { await cabecera(id); if (O.monologo) await monologo(rnd(U.monologos), id); }
  else { musica('getup', false); cartel(op.brasil ? '1 MINUTO PARA VENCER' : '1 MINUTO PARA GANAR', 'Versión clásica 2D', 2500); await decir('host', U.frases.bienvenida, id); }
  let vidas = 3, banco = 0; const orden = U.pruebas.slice();
  for (let i = 0; i < 10; i++) { const pr = orden[i];
    while (true) { hud(i, vidas, banco); cam('presentador'); gesto('host', 'explica'); musica('prueba', true, .35); cartel('NIVEL ' + (i + 1), eur(L[i])); await decir('host', vozNivel(i), id);
      await plano(pr, id); gesto('host', '');
      await pide([['▶ ¡Empezar!', 1, 'gold']], id); paraMus(); cam('mesa'); await decir('host', U.frases.listo, id); sfx('gong');
      musica('reloj' + (1 + (i % 7)), true, .55); const r = await jugarPrueba(pr, id, { clasico }); paraMus(); sfx(r === 'win' ? 'gcm1' : 'bocina');
      if (r === 'win') { banco = L[i]; hud(i + 1, vidas, banco); cam('concursante'); gesto('conc', 'celebra'); gesto('host', 'aplaude'); aplausos(4); confeti(90); sfx('polvo');
        cartel('¡SUPERADO!', eur(banco), 2200); await decir('host', rnd([U.frases.superado, U.frases.superado2, U.frases.superado3]), id);
        if (O.chistes) { cam('presentador'); await decir('host', rnd(U.chistes), id); }
        if (U.seguros.includes(i)) { cartel('★ ASEGURADO ★', eur(banco)); await decir('host', U.frases.seguro, id); }
        gesto('conc', ''); gesto('host', '');
        if (O.copres && Math.random() < .2) await copresentador(id);
        if (i < 9) { cam('dos'); await decir('host', U.frases.pregunta, id);
          const v = await pide([['💪 ¡Sigo jugando!', 's', 'gold'], ['✋ Me planto con ' + eur(banco), 'p']], id);
          if (v === 'p') { await decir('host', U.frases.plantarse, id); return final(banco, false, id); } }
        break; }
      vidas--; hud(i, vidas, banco); gesto('conc', 'piensa'); cam('concursante'); await decir('host', U.frases.casi, id); gesto('conc', '');
      if (vidas <= 0) { let seg = 0; U.seguros.forEach(s => { if (s < i) seg = L[s]; }); return final(Math.max(seg, 0), false, id); }
      await decir('host', U.frases['vidas' + vidas], id); await pide([['🔁 ¡Otra vez!', 1, 'gold']], id); }
  }
  return final(banco, true, id);
}); }
async function plano(pr, id) { if (!O.explica) return; H('#plano', `<img src="img/${pr.img}.png"><h2>${pr.emoji} ${pr.nombre}</h2><div style="color:#ffd23a">🎯 ${pr.meta}</div><ul>${pr.plano.map(l => '<li>' + l + '</li>').join('')}</ul><button id="plSk">⏭ Saltar</button>`);
  show('#plano'); musica('plano', true, .3); let skip = false; $('#plSk').onclick = () => { skip = true; M.cortaVoz(); };
  try { await decir('host', pr.nombre + '. ' + pr.meta + '.', id); for (const l of pr.plano) { if (skip) break; await decir('host', l, id); } } finally { show('#plano', false); } }
async function final(banco, todo, id) { show('#hud', false); cam('general'); gesto('conc', 'celebra'); gesto('host', 'aplaude'); aplausos(6); confeti(200); sfx('polvo'); musica('getup', false);
  cartel(todo ? '🏆 ¡GRAN PREMIO!' : '¡ENHORABUENA!', 'Te llevas ' + eur(banco), 4000); await decir('host', todo ? U.frases.millon : U.frases.fin, id);
  cam('presentador'); gesto('host', 'saluda'); await decir('host', U.frases.despedida, id); gesto('host', ''); gesto('conc', ''); orbita(1); musica('menu', true, .4);
  const v = await pide([['🔁 Jugar otra vez', 'r', 'gold'], ['👏 Créditos', 'c'], ['🏠 Menú', 'm']], id); v === 'r' ? programa({}) : v === 'c' ? creditos() : alMenu(); }
function eligePrueba() { modo(async id => { const i = await lista('🎯 Elige tu prueba', U.pruebas.map((p, k) => [p.emoji + ' ' + (k + 1) + '. ' + p.nombre + '<small>' + p.meta + '</small>', k]), id);
  O.moneda = '€'; let vidas = 3; const pr = U.pruebas[i];
  while (vidas > 0) { hud(i, vidas, null); await plano(pr, id); await pide([['▶ ¡Empezar!', 1, 'gold']], id); await decir('host', U.frases.listo, id); sfx('gong'); musica('reloj' + (1 + i % 7), true, .55);
    const r = await jugarPrueba(pr, id); paraMus(); if (r === 'win') { sfx('gcm1'); confeti(); aplausos(3); cartel('¡SUPERADO!'); await decir('host', U.frases.superado, id); break; }
    vidas--; hud(i, vidas, null); await decir('host', U.frases.casi, id); if (vidas) await decir('host', U.frases['vidas' + vidas], id); }
  show('#hud', false); const v = await pide([['🎯 Otra prueba', 'o', 'gold'], ['🏠 Menú', 'm']], id); v === 'o' ? eligePrueba() : alMenu(); }); }
function entreno(i, reloj, clasico) { modo(async id => { M.setTema('entreno'); O.moneda = '€'; const pr = U.pruebas[i]; H('#esc', ''); H('#vidas', '🏋️ Entrenamiento'); H('#banco', pr.emoji + ' ' + pr.nombre); cam('presentador'); await decir('host', U.frases.entreno, id);
  while (true) { await plano(pr, id); await pide([['▶ ¡Empezar!', 1, 'gold']], id); sfx('gong'); reloj && musica('reloj' + (1 + i % 7), true, .5);
    const r = await jugarPrueba(pr, id, { reloj, clasico }); paraMus(); if (r === 'win') { sfx('gcm1'); confeti(60); aplausos(2); } await decir('host', r === 'win' ? U.frases.entrenoBien : U.frases.entrenoOtra, id);
    const v = await pide([['🔁 Repetir', 'r', 'gold'], ['▶ Siguiente prueba', 'n'], ['📋 Lista', 'l'], ['🏠 Menú', 'm']], id);
    if (v === 'n') return entreno((i + 1) % 10, reloj, clasico); if (v === 'l') { M.setTema('normal'); return alMenu(), sub('entreno'); } if (v === 'm') { M.setTema('normal'); return alMenu(); } } }); }
// ---------- monólogos ----------
async function monologo(m, id) { titulo('🎭 ' + m.titulo); cam('presentador'); musica('menu', true, .2); for (const l of m.lineas) { gesto('host', rnd(['explica', 'señala', 'explica', 'risa'])); await decir('host', l, id); }
  gesto('host', 'saluda'); aplausos(4); sfx('gcm1', .7); await espera(1200, id); gesto('host', ''); }
function monologos(k) { modo(async id => { let i = typeof k === 'number' ? k : await lista('🎭 Monólogos del presentador', U.monologos.map((m, j) => ['🎭 ' + m.titulo, j]), id);
  while (true) { await monologo(U.monologos[i], id); const v = await pide([['Siguiente ▶', 'n', 'gold'], ['🔁 Repetir', 'r'], ['📋 Lista', 'l']], id); if (v === 'n') i = (i + 1) % U.monologos.length; if (v === 'l') return monologos(); } }); }
// ---------- promos y publicidad ----------
async function correPromo(p, tipo, id) { capa('fx', { inv: true }); titulo((tipo === 'host' ? '🎙️ ' : '📣 PROMO · ') + p.titulo); if (tipo !== 'host') { cam([[0, 12, 20], [0, 3, 0]], true); orbita(1); musica('getup', false); }
  else { cam('presentador'); musica('menu', true, .25); }
  for (const [k, l] of p.lineas.entries()) { if (tipo !== 'host' && k === 1) { orbita(0); cam('presentador'); } gesto('host', k === 0 ? 'saluda' : 'explica'); await decir('host', l, id); }
  gesto('host', ''); cartel('UNO PARA GANAR', 'Show Time TV', 2600); await espera(2600, id); }
function promo(p, tipo) { modo(async id => { await correPromo(p, tipo, id); orbita(1); const v = await pide([['🔁 Repetir', 'r', 'gold'], ['🏠 Menú', 'm']], id); v === 'r' ? promo(p, tipo) : alMenu(); }); }
function creadorPromos() { modo(async id => { const nb = await lista('🎬 Creador de promos · 1. Elige el título', [['Esta noche', 'Esta noche'], ['Gran especial', 'Gran especial'], ['El gran premio', 'El gran premio'], ['¡Vuelve!', '¡Vuelve!']], id);
  const ls = await lista('2. Elige lo que dice Javier', [...U.promos, ...U.promosHost].map((p, k) => [p.titulo + '<small>' + p.lineas[0] + '</small>', k]), id);
  const p = [...U.promos, ...U.promosHost][ls]; const mias = JSON.parse(localStorage.getItem('upg.promos') || '[]'); mias.push({ titulo: nb, lineas: p.lineas }); localStorage.setItem('upg.promos', JSON.stringify(mias.slice(-10)));
  await correPromo({ titulo: nb, lineas: p.lineas }, 'promo', id); const v = await pide([['🎬 Hacer otra', 'o', 'gold'], ['🏠 Menú', 'm']], id); v === 'o' ? creadorPromos() : alMenu(); }); }
async function corteCortinilla(t, id) { capa('fx'); E.hidden = true; H('#cartel', ''); show('#panel'); H('#panel', `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(#1d58d8,#020a30)"><img src="img/showtime.png" style="width:200px"><h2 style="font-size:40px">${t}</h2><div style="font:bold 16px Arial;color:#9fc4ff">Uno para ganar · Show Time TV</div></div>`);
  musica('intro', false); await espera(3500, id); show('#panel', false); E.hidden = false; }
function cortinilla(t) { modo(async id => { await corteCortinilla(t, id); const v = await pide([['🔁 Repetir', 'r', 'gold'], ['🏠 Menú', 'm']], id); v === 'r' ? cortinilla(t) : alMenu(); }); }
async function anuncio(a, id) { const col = ['#e8262d', '#2ecc71', '#ffd23a'][U.anuncios.indexOf(a) % 3]; show('#panel');
  H('#panel', `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(${col},#101020)"><div style="font-size:90px;animation:pop 1s infinite alternate">🛒</div><h2 style="font-size:44px">${a.titulo}</h2><div id="anT" style="font:bold 22px Arial;max-width:70%;text-align:center"></div><div class="nuevo" style="position:absolute;left:10px;bottom:10px">🆕 ANUNCIO INVENTADO</div></div>`);
  musica('juego', true, .3); for (const l of a.lineas) { $('#anT').textContent = l; await decir('locu', l, id); } await espera(600, id); show('#panel', false); }
function pausa(n, solo) { modo(async id => { await corteCortinilla('PUBLICIDAD', id); const L = solo ? [solo] : U.anuncios.slice(0, n); for (const a of L) await anuncio(a, id);
  if (!solo) { await correPromo(rnd(U.promos), 'promo', id); } await corteCortinilla('VOLVEMOS', id); const v = await pide([['🔁 Repetir', 'r', 'gold'], ['🏠 Menú', 'm']], id); v === 'r' ? pausa(n, solo) : alMenu(); }); }
// ---------- historia (como Ahora Caigo 1.64) ----------
function tarjeta(c) { const k = c.card; let h = `<h3>${c.emoji} ${c.titulo}</h3>`;
  if (k.k === 'text' || k.k === 'timeline') h += k.items.map(([a, b]) => `<div class="r"><b>${k.k === 'timeline' ? '📅 ' : ''}${a}</b><span>${b}</span></div>`).join('');
  if (k.k === 'chips') h += k.items.map(x => `<span class="chip">${x}</span>`).join('') + (k.note ? `<p style="font:13px Arial;color:#cfe3ff">${k.note}</p>` : '');
  if (k.k === 'tiles') h += k.items.map(([e, a, b]) => `<div class="tile"><div style="font-size:30px">${e}</div>${a}<br><small style="font:12px Arial">${b}</small></div>`).join('');
  if (k.k === 'stats') h += k.items.map(([a, b]) => `<div class="stat"><b>${a}</b>${b}</div>`).join('');
  if (k.k === 'world') h += k.items.map(([f, a, b]) => `<div class="r"><b>${f} ${a}</b><span>${b}</span></div>`).join('');
  return h; }
function historia(desde = 0) { modo(async id => { show('#hist'); musica('menu', true, .18); const C = U.historia; let i = desde, dir = 0;
  const mueve = d => { dir = d; M.cortaVoz(); };
  $('#hPrev').onclick = () => mueve(-1); $('#hNext').onclick = () => mueve(1); $('#hSkip').onclick = () => mueve(99);
  while (i >= 0 && i < C.length) { const c = C[i]; dir = 0; H('#hCard', tarjeta(c)); H('#hDots', C.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join(''));
    $('#hNext').textContent = i === C.length - 1 ? 'Terminar ✓' : 'Siguiente ▶'; $('#hPrev').disabled = i === 0;
    camara(c.cam === 'host' ? 'host' : c.cam, false, 'host'); if (i === 0 || i === C.length - 1) { aplausos(3); sfx('gcm1', .6); }
    gesto('host', 'explica'); E.people.host.rotation.y = .2;
    for (const l of c.narr) { if (dir) break; await decir('host', l, id, '🎙️ ' + U.presentador); }
    gesto('host', ''); if (dir === 99) break; if (dir === -1) { i = Math.max(0, i - 1); continue; } if (!dir) await espera(900, id); i++; }
  show('#hist', false); orbita(1); const v = await pide([['🔁 Desde el principio', 'r'], ['🏠 Menú', 'm', 'gold']], id); v === 'r' ? historia(0) : alMenu(); }); }
// ---------- museo ----------
let paneles = null;
function panelesMuseo(on) { if (paneles) { E.scene.remove(paneles); paneles = null; } if (!on) return; const G = paneles = new THREE.Group(); E.scene.add(G);
  const items = [...U.pruebas.map(p => [p.emoji + ' ' + p.nombre, p.meta, p.img]), ...U.historia.slice(0, 6).map(h => [h.emoji + ' ' + h.titulo, h.narr[0], null])];
  items.forEach(([t, s, im], k) => { const a = k / items.length * Math.PI * 2, tex = E.txt(512, 320, (g, w, h) => { g.fillStyle = '#0b2a8a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffd23a'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
      g.fillStyle = '#fff'; g.font = 'bold 40px Arial'; g.textAlign = 'center'; g.fillText(t, w / 2, 70); g.font = '24px Arial'; const words = s.split(' '); let line = '', y = 260; const lines = [];
      for (const wd of words) { if ((line + wd).length > 34) { lines.push(line); line = ''; } line += wd + ' '; } lines.push(line); lines.slice(0, 3).forEach((l, j) => g.fillText(l, w / 2, 230 + j * 30 - (im ? 0 : 100)));
      if (im) { const i = new Image(); i.onload = () => { g.drawImage(i, w / 2 - 60, 90, 120, 120 * i.height / i.width > 120 ? 120 : 120 * i.height / i.width); tex.needsUpdate = true; }; i.src = 'img/' + im + '.png'; } });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(Math.sin(a) * 5, 1.9, Math.cos(a) * 5); m.rotation.y = a + Math.PI; G.add(m);
    const pie = new THREE.Mesh(new THREE.BoxGeometry(.1, 1.1, .1), new THREE.MeshLambertMaterial({ color: 0x888888 })); pie.position.set(m.position.x, .55, m.position.z); G.add(pie); m.userData.a = a; });
  return items.length; }
M.setMuseo(panelesMuseo);
function museo() { modo(async id => { const n = panelesMuseo(true); E.people.host.visible = E.people.conc.visible = false; E.mesa.visible = false; const gu = E.people.guia; gu.visible = true; musica('menu', true, .2);
  try { titulo('🏛️ Museo de Uno para ganar · guía: Doña Clepsidra'); gu.position.set(0, .25, 2); gu.rotation.y = 0; cam('dos'); gesto('guia', 'saluda'); await decir('guia', U.museo[0], id); gesto('guia', 'explica'); await decir('guia', U.museo[1], id); await decir('guia', U.museo[2], id);
    for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, R = 5; gu.position.set(Math.sin(a + .35) * 3.6, .25, Math.cos(a + .35) * 3.6); gu.rotation.y = a + Math.PI;
      E.camT.p.set(Math.sin(a) * 1.2, 2, Math.cos(a) * 1.2); E.camT.l.set(Math.sin(a) * R, 1.9, Math.cos(a) * R); gesto('guia', 'señala');
      const v = await pide([['Siguiente ▶', 'n', 'gold'], ['🏠 Salir', 'm']], id); if (v === 'm') break; }
    cam('dos'); gu.position.set(0, .25, 2); gu.rotation.y = 0; gesto('guia', 'saluda'); await decir('guia', U.museo[3], id); } finally { E.mesa.visible = true; }
  alMenu(); }); }
// ---------- paseo / explorar ----------
function paseo(explorar) { modo(async id => { show('#joy'); E.manual = true; musica('menu', true, .25); titulo(explorar ? '🗺️ Explorar el plató' : '🚶 Paseo · sube a la grada', 4000);
  const st = { x: 0, z: 9, yaw: 0, pitch: -.05, jx: 0, jy: 0, saludo: {} }; const joy = $('#joy'), kn = $('#joy i'); let jid = null, lid = null, lx = 0, ly = 0;
  joy.onpointerdown = e => { jid = e.pointerId; joy.setPointerCapture(jid); mv(e); }; const mv = e => { const r = joy.getBoundingClientRect(); let dx = (e.clientX - r.left - 65) / 50, dy = (e.clientY - r.top - 65) / 50; const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; } st.jx = dx; st.jy = dy; kn.style.left = 40 + dx * 40 + 'px'; kn.style.top = 40 + dy * 40 + 'px'; };
  joy.onpointermove = e => e.pointerId === jid && mv(e); joy.onpointerup = () => { jid = null; st.jx = st.jy = 0; kn.style.left = kn.style.top = '40px'; };
  const c3 = $('#c3d'); c3.onpointerdown = e => { lid = e.pointerId; lx = e.clientX; ly = e.clientY; }; c3.onpointermove = e => { if (e.pointerId !== lid) return; st.yaw -= (e.clientX - lx) * .005; st.pitch = Math.max(-1, Math.min(.8, st.pitch - (e.clientY - ly) * .004)); lx = e.clientX; ly = e.clientY; }; c3.onpointerup = () => lid = null;
  const alto = (x, z) => { const r = Math.hypot(x, z); return r < 7.3 ? .25 : r > 11.6 ? Math.min(3.2, Math.floor((r - 11.6) / 1.3 + 1) * .7) : 0; };
  M.setWalk(dt => { const f = -st.jy * 4 * dt, s = st.jx * 4 * dt; st.x += -Math.sin(st.yaw) * f + Math.cos(st.yaw) * s; st.z += -Math.cos(st.yaw) * f - Math.sin(st.yaw) * s;
    const r = Math.hypot(st.x, st.z); if (r > 17) { st.x *= 17 / r; st.z *= 17 / r; } if (st.z < -10.5) st.z = -10.5;
    E.camera.position.set(st.x, alto(st.x, st.z) + 1.7, st.z); E.camera.rotation.set(st.pitch, st.yaw, 0, 'YXZ');
    for (const k of ['host', 'conc']) { const p = E.people[k].position, d = Math.hypot(p.x - st.x, p.z - st.z); if (d < 2.5 && !st.saludo[k]) { st.saludo[k] = 1; gesto(k, 'saluda'); if (k === 'host') decir('host', U.frases.explorar, id).catch(() => { }); setTimeout(() => gesto(k, ''), 2500); } if (d > 4) st.saludo[k] = 0; } });
  await pide([['🏠 Salir', 1]], id); c3.onpointerdown = c3.onpointermove = c3.onpointerup = null; alMenu(); }); }
// ---------- casting ----------
function casting() { modo(async id => { show('#panel'); H('#panel', `<button class="volver">⬅ Volver</button><h2>🪪 Casting de Uno para ganar</h2><div class="fila">Tu nombre <input id="cN" maxlength="16" value="${O.nombre || ''}"></div>
  <div class="fila">Color de camiseta <span class="op">${['#e8262d', '#1d58d8', '#2ecc71', '#ffd23a', '#9b59b6', '#ff7a1a'].map(c => `<button data-c="${c}" style="background:${c}" class="${O.camisa === c ? 'on' : ''}">&nbsp;</button>`).join('')}</span></div><div style="text-align:center;margin-top:16px"><button id="cOk" class="gold">✅ ¡Apuntarme!</button></div>`);
  $('#panel .volver').onclick = alMenu; $('#panel').querySelectorAll('[data-c]').forEach(b => b.onclick = () => { O.camisa = b.dataset.c; pinta(); $('#panel').querySelectorAll('[data-c]').forEach(x => x.classList.toggle('on', x === b)); });
  cam('concursante'); await new Promise(r => $('#cOk').onclick = r); vivo(id); O.nombre = $('#cN').value.trim() || 'Concursante'; guarda(); pinta(); show('#panel', false);
  gesto('conc', 'celebra'); aplausos(3); cartel('¡BIENVENIDO, ' + O.nombre.toUpperCase() + '!', 'Ya eres concursante de Uno para ganar', 2500); await espera(2600, id); alMenu(); }); }
function pinta() { const c = new THREE.Color(O.camisa); E.people.conc.traverse(o => { if (o.isMesh && o.material.color && o.material.color.getHex() === E.people.conc.userData.col) o.material.color.copy(c); }); E.people.conc.userData.col = c.getHex(); }
// ---------- escalera ----------
function escaleraMenu() { modo(async id => { const P = [['sb3', '1 Minuto Para Vencer (Scratch) · hasta 1.000.000 €', U.escalera], ['real', 'Cuatro, Uno para ganar · hasta 500.000 €', U.escaleraReal], ['custom', 'Personalizada', O.custom || U.escalera]];
  const dibuja = () => { H('#panel', `<button class="volver">⬅ Volver</button><h2>💶 Elige el valor de cada nivel</h2>` + P.map(([k, t, l]) => `<div class="fila"><span>${t}<br><small style="font:12px Arial">${l.map(v => fmt(v)).join(' · ')}</small></span><span class="op"><button data-k="${k}" class="${O.escalera === k ? 'on' : ''}">${O.escalera === k ? '✔ Elegida' : 'Elegir'}</button></span></div>`).join('') +
    `<h2 style="font-size:18px">✏️ Escalera personalizada</h2><div class="grid" style="max-width:640px">${(O.custom || U.escalera).map((v, i) => `<div class="fila">Nivel ${i + 1}<input data-i="${i}" type="number" min="1" value="${v}" style="width:120px"></div>`).join('')}</div><div style="text-align:center"><button id="eOk" class="gold">💾 Guardar personalizada</button></div>`);
    $('#panel .volver').onclick = alMenu; $('#panel').querySelectorAll('[data-k]').forEach(b => b.onclick = () => { O.escalera = b.dataset.k; if (O.escalera === 'custom' && !O.custom) O.custom = U.escalera.slice(); guarda(); dibuja(); });
    $('#eOk').onclick = () => { O.custom = [...$('#panel').querySelectorAll('[data-i]')].map(x => Math.max(1, Math.round(+x.value || 1))); O.escalera = 'custom'; guarda(); dibuja(); cartel('💾 Guardada'); }; };
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); show('#panel'); dibuja(); await new Promise(() => { }); }); }
// ---------- cámara libre ----------
function camLibre() { modo(async id => { show('#joy'); E.manual = true; const st = { p: E.camera.position.clone(), yaw: 0, pitch: -.2, jx: 0, jy: 0, up: 0 }; let rec = null;
  const joy = $('#joy'), kn = $('#joy i'); let jid = null, lid = null, lx = 0, ly = 0; const c3 = $('#c3d');
  const mv = e => { const r = joy.getBoundingClientRect(); let dx = (e.clientX - r.left - 65) / 50, dy = (e.clientY - r.top - 65) / 50; const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; } st.jx = dx; st.jy = dy; kn.style.left = 40 + dx * 40 + 'px'; kn.style.top = 40 + dy * 40 + 'px'; };
  joy.onpointerdown = e => { jid = e.pointerId; joy.setPointerCapture(jid); mv(e); }; joy.onpointermove = e => e.pointerId === jid && mv(e); joy.onpointerup = () => { jid = null; st.jx = st.jy = 0; kn.style.left = kn.style.top = '40px'; };
  c3.onpointerdown = e => { lid = e.pointerId; lx = e.clientX; ly = e.clientY; }; c3.onpointermove = e => { if (e.pointerId !== lid) return; st.yaw -= (e.clientX - lx) * .005; st.pitch = Math.max(-1.4, Math.min(1.2, st.pitch - (e.clientY - ly) * .004)); lx = e.clientX; ly = e.clientY; }; c3.onpointerup = () => lid = null;
  let acc = 0; M.setWalk(dt => { const f = -st.jy * 6 * dt; st.p.x += -Math.sin(st.yaw) * Math.cos(st.pitch) * f + Math.cos(st.yaw) * st.jx * 6 * dt; st.p.z += -Math.cos(st.yaw) * Math.cos(st.pitch) * f - Math.sin(st.yaw) * st.jx * 6 * dt; st.p.y = Math.max(.4, Math.min(16, st.p.y + Math.sin(st.pitch) * f + st.up * 4 * dt));
    E.camera.position.copy(st.p); E.camera.rotation.set(st.pitch, st.yaw, 0, 'YXZ'); if (rec) { acc += dt; if (acc >= .1) { acc = 0; rec.push([st.p.x, st.p.y, st.p.z, st.pitch, st.yaw].map(v => +v.toFixed(3))); if (rec.length >= 80) parar(); } } });
  const parar = () => { if (!rec) return; O.toma = rec; rec = null; guarda(); cartel('🎬 Toma grabada', (O.toma.length / 10).toFixed(1) + ' s'); };
  titulo('🎥 Cámara libre · joystick para volar, arrastra para mirar', 4000);
  while (true) { const v = await pide([['⬆️ Subir', 'u'], ['⬇️ Bajar', 'd'], [rec ? '⏹ Parar' : '⏺ Grabar toma (8 s)', 'g', 'rojo'], ...(O.toma ? [['⭐ Usar de cabecera', 'c', 'gold']] : []), ...(O.cabecera ? [['↩️ Cabecera normal', 'x']] : []), ['🏠 Salir', 'm']], id);
    if (v === 'u') st.up = st.up === 1 ? 0 : 1; if (v === 'd') st.up = st.up === -1 ? 0 : -1; if (v === 'g') { rec ? parar() : (rec = [], cartel('⏺ Grabando…', '', 1200)); }
    if (v === 'c') { O.cabecera = O.toma; guarda(); cartel('⭐ Toma guardada como cabecera'); } if (v === 'x') { O.cabecera = null; guarda(); cartel('Cabecera normal'); }
    if (v === 'm') break; }
  c3.onpointerdown = c3.onpointermove = c3.onpointerup = null; alMenu(); }); }
// ---------- editor (studio.js de Ahora Caigo 1.64) ----------
let ed = null;
function creaEditor() { if (ed || !window.Studio) return; ed = Studio.create({ THREE, title: 'Studio · Uno para ganar', storageKey: 'upg_studio', getScene: () => E.scene, getCamera: () => E.camera, getCanvas: () => $('#c3d'),
    roots: () => [{ id: 'plato', name: 'Plató', prefix: 'p', root: E.set, kind: c => c.name || (c.isInstancedMesh ? 'Grada' : c.geometry ? ({ BoxGeometry: 'Bloque', CylinderGeometry: 'Cilindro', TorusGeometry: 'Aro de luz', PlaneGeometry: 'Pantalla', CircleGeometry: 'Disco', ConeGeometry: 'Haz de luz', SphereGeometry: 'Foco' }[c.geometry.type] || 'Pieza') : 'Mesa') }], setCameraHook: f => { E.camHook = f; }, plugins: Studio.lights ? [Studio.lights({ maxReal: 3, maxAnim: 12 })] : [],
    groundAt: () => 0, followTarget: () => E.people.conc, onExit: () => { if (!window.__edMudo) alMenu(); }, onPlay: () => { if (!window.__edMudo) programa({}); } }); ed.start(); window.__ed = ed; }
function editor() { modo(async id => { creaEditor(); if (!ed) { cartel('Editor no disponible'); return alMenu(); }
  musica('menu', true, .2); ed.open(); }); }
// ---------- opciones ----------
function opciones() { modo(async id => { show('#panel'); const F = [['musica', '🎵 Música'], ['efectos', '🔊 Efectos'], ['voz', '🎤 Voz del presentador'], ['explica', '📖 El presentador explica las pruebas'], ['rapida', '⏩ Lectura rápida'],
  ['chistes', '😄 Chistes del presentador', 1], ['monologo', '🎭 Monólogo antes del programa', 1], ['copres', '🎤 Copresentador sorpresa', 1]];
  const dib = () => { H('#panel', '<button class="volver">⬅ Volver</button><h2>⚙️ Opciones</h2>' + F.map(([k, t, n]) => `<div class="fila"><span>${t}${n ? ' <span class="nuevo">🆕 INVENTADO</span>' : ''}</span><span class="op"><button data-k="${k}" data-v="1" class="${O[k] ? 'on' : ''}">Sí</button><button data-k="${k}" data-v="0" class="${!O[k] ? 'on' : ''}">No</button></span></div>`).join('') +
    `<div class="fila"><span>🎚️ Volumen música</span><input type="range" min="0" max="1" step=".1" value="${O.mvol}" id="mv"></div><div class="fila"><span>🎚️ Volumen efectos</span><input type="range" min="0" max="1" step=".1" value="${O.evol}" id="ev"></div>` +
    `<div class="fila"><span>✨ Calidad gráfica</span><span class="op">${['baja', 'media', 'alta'].map(q => `<button data-q="${q}" class="${O.calidad === q ? 'on' : ''}">${q[0].toUpperCase() + q.slice(1)}</button>`).join('')}</span></div>` +
    `<div class="fila"><span>⛶ Pantalla completa</span><span class="op"><button id="fs">Activar</button></span></div>`);
    $('#panel .volver').onclick = alMenu; $('#panel').querySelectorAll('[data-k]').forEach(b => b.onclick = () => { O[b.dataset.k] = b.dataset.v === '1'; guarda(); sfx('boton'); if (b.dataset.k === 'musica') O.musica ? musica('menu', true, .45) : paraMus(); dib(); });
    $('#panel').querySelectorAll('[data-q]').forEach(b => b.onclick = () => { O.calidad = b.dataset.q; guarda(); setCalidad(O.calidad); dib(); });
    $('#mv').oninput = e => { O.mvol = +e.target.value; guarda(); M.vols && M.vols(); }; $('#ev').oninput = e => { O.evol = +e.target.value; guarda(); };
    $('#fs').onclick = () => { const d = document.documentElement; (d.requestFullscreen || d.webkitRequestFullscreen || (() => { })).call(d); }; };
  dib(); await new Promise(() => { }); }); }
// ---------- cómo se juega / créditos ----------
function comoSeJuega() { modo(async id => { show('#panel'); H('#panel', `<button class="volver">⬅ Volver</button><h2>❓ Cómo se juega</h2><div class="cred" style="text-align:left">
  <p>⏱️ Hay <b>10 niveles</b>. En cada uno tienes <b>60 segundos</b> para superar una prueba.</p><p>💶 Cada nivel superado te sube en la escalera de premios. Los niveles con ★ (2 y 6) son <b>cantidades aseguradas</b>.</p>
  <p>❤️ Tienes <b>3 vidas</b>. Si una prueba no sale, ¡no pasa nada!: repites el nivel con una vida menos.</p><p>✋ Después de cada nivel puedes <b>plantarte</b> y llevarte el premio que tienes.</p>
  <p>👆 Todas las pruebas se juegan tocando la pantalla. Antes de cada una, Javier te explica el plano de la prueba.</p><p>🏋️ En <b>Entrenamiento</b> puedes practicar sin perder vidas.</p></div>`);
  $('#panel .volver').onclick = alMenu; cam('presentador'); await decir('host', U.frases.como, id).catch(e => { if (e instanceof M.Stop) throw e; }); await new Promise(() => { }); }); }
function creditos() { modo(async id => { show('#panel'); musica('menu', true, .4); orbita(1);
  H('#panel', `<button class="volver">⬅ Volver</button><h2>👏 Créditos</h2><div class="cred">${U.creditos.map(([r, n]) => `<p><b>${r}</b><br>${n.join('<br>')}</p>`).join('')}
  <p><b>Dedicado a</b><br>Ikeriano el campeón 2</p><p><b>Producción</b><br>Show Time TV</p><p>Versión ${U.version}</p>
  <p style="font-size:13px;color:#9fc4ff">Juego de fans sin ánimo de lucro. El presentador Javier Valle y todo el equipo son personajes virtuales inventados con voz sintética (Piper, es_ES). Uno para ganar se emitió en Cuatro (2011-2012), presentado por Jesús Vázquez y producido por Big Bang Media. Las pruebas, la escalera, los sonidos y los gráficos vienen del proyecto de Scratch «1 Minuto Para Vencer».</p></div>`);
  $('#panel .volver').onclick = alMenu; await new Promise(() => { }); }); }
// ---------- arranque ----------
export function arranca() { try { creaEditor(); } catch (e) { console.error(e); } E.people.conc.userData.col = 0xe8262d; pinta();
  try { window.AntenaPS && AntenaPS.init({ base: 'aps/', game: 'Uno para ganar 3D', hooks: { canPlay: p => false, play: () => Promise.resolve(), stop() { }, onClose() { } } }); } catch (e) { }
  alMenu(); }
export { escenas, entreno, programa, historia, museo, paseo, camLibre, editor, opciones, creditos, pausa, promo, monologos, casting, escaleraMenu, sub };
