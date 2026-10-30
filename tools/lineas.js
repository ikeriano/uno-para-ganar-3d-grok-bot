global.window={};require('../app/assets/www/js/data.js');const U=window.UPG,V=U.voces,out=[];
const h=s=>{let x=5381;for(let i=0;i<s.length;i++)x=((x*33)^s.charCodeAt(i))>>>0;return x.toString(16)};
const add=(q,t)=>out.push([V[q]||V.host,h(q+'|'+t),t]);
Object.values(U.frases).forEach(t=>add('host',t));U.pruebas.forEach(p=>{add('host',p.nombre+'. '+p.meta+'.');p.plano.forEach(t=>add('host',t))});
[...U.monologos,...U.promos].forEach(m=>m.lineas.forEach(t=>add('host',t)));U.anuncios.forEach(m=>m.lineas.forEach(t=>add('locu',t)));
Object.values(U.escenas).forEach(L=>L.forEach(e=>e.pasos.forEach(p=>add(p[0],p[1]))));U.copres.forEach(c=>c.lineas.forEach(t=>add(c.quien,t)));
[...U.promosHost].forEach(m=>m.lineas.forEach(t=>add('host',t)));U.chistes.forEach(t=>add('host',t));
U.historia.forEach(c=>c.narr.forEach(t=>add('host',t)));U.museo.forEach(t=>add('guia',t));
const seen=new Set();console.log(out.filter(o=>!seen.has(o[1])&&seen.add(o[1])).map(o=>o.join('|')).join('\n'));
