/* Uno para ganar 3D · datos (textos en español). Presentador y equipo INVENTADOS, voces sintéticas Piper es_ES. */
window.UPG = {
version: '1.0',
presentador: 'Javier Valle',
voces: { host: 'davefx', marta: 'sharvard:1', lucia: 'mls_9972', dani: 'carlfm', sergio: 'mls_10246', conc: 'sharvard:0', guia: 'sharvard:1', locu: 'carlfm' },
personajes: { marta: 'Marta · dirección', lucia: 'Lucía · maquillaje', dani: 'Dani · sonido', sergio: 'Sergio · regidor', conc: 'Concursante', guia: 'Doña Clepsidra · guía del museo', locu: 'Voz en off' },
escalera: [1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000],
escaleraReal: [1000, 2000, 3000, 5000, 10000, 15000, 40000, 100000, 250000, 500000],
seguros: [1, 5],
pruebas: [
 { id: 'gravedad', nombre: 'Gravedad cero', emoji: '🎈', img: 'globo0', meta: 'Mantén los 3 globos en el aire 60 segundos', plano: ['En esta prueba hay que mantener tres globos en el aire durante los sesenta segundos.', 'Toca los globos para que suban.', 'Ningún globo puede tocar el suelo.'] },
 { id: 'colores', nombre: 'Colores separados', emoji: '🍬', img: 'carame1', meta: 'Mete 30 caramelos en el vaso de su color', plano: ['Esta caja de chocolatinas trae caramelos de muchos colores.', 'Hay que meter cada caramelo en el vaso de su mismo color.', 'Toca el vaso correcto. ¡Treinta caramelos!'] },
 { id: 'caja', nombre: 'Fuera de la caja', emoji: '🧻', img: 'caja', meta: 'Saca los 100 pañuelos de la caja', plano: ['Esta caja trae muchos pañuelos de papel.', 'Hay que sacarlos todos antes de que se acabe el tiempo.', 'Desliza o toca la caja muy rápido. ¡Cien pañuelos!'] },
 { id: 'aterrizaje', nombre: 'Aterrizaje', emoji: '🍼', img: 'botella', meta: 'Haz que la botella caiga de pie 3 veces', plano: ['Hay que lanzar una botella para que caiga de pie en la mesa.', 'Mantén pulsado para cargar la fuerza y suelta en la zona verde.', 'El acierto se repite tres veces.'] },
 { id: 'vasos', nombre: 'Sube los vasos', emoji: '🥤', img: 'vaso_rojo', meta: 'Pasa vasos hasta que el rojo vuelva abajo', plano: ['Hay veinticuatro vasos azules y un vaso rojo.', 'Desliza hacia abajo el vaso de arriba para llevarlo a la base.', 'Repite hasta que el vaso rojo vuelva a su sitio, abajo del todo.'] },
 { id: 'zona', nombre: 'Zona de caída', emoji: '🧺', img: 'cesto', meta: 'Una bola en cada uno de los 3 cestos', plano: ['Las bolas pasan por arriba moviéndose.', 'Toca para soltarlas y que caigan dentro de los cestos.', 'Hacen falta tres aciertos: uno en cada cesto.'] },
 { id: 'luz', nombre: 'Apaga la luz', emoji: '💡', img: 'luz_on', meta: 'Apaga las 6 luces con la pelota', plano: ['Hay que lanzar una pelota de ping pong y apagar las seis luces del panel.', 'Toca cuando la mira esté encima de una luz encendida.', '¡Atención! Si la pelota da a una luz apagada, se enciende otra vez.'] },
 { id: 'balde', nombre: 'Bolas al cubo', emoji: '🪣', img: 'pelota', meta: 'Encesta 10 pelotas rebotando en la pared', plano: ['Hay que botar pelotas de ping pong contra la pared y meterlas en el cubo.', 'Toca cuando el medidor de fuerza esté en el centro verde.', 'En total, hay que encestar diez pelotas.'] },
 { id: 'lapiz', nombre: 'Derriba el lápiz', emoji: '✏️', img: 'lapiz', meta: 'Derriba el lápiz con la canica', plano: ['Hay que derribar un lápiz de pie usando una canica.', 'La canica se mueve de lado a lado.', 'Toca en el momento justo para lanzarla hacia el lápiz.'] },
 { id: 'moneda', nombre: 'Súper moneda', emoji: '🪙', img: 'moneda', meta: 'Mete 6 monedas en la garrafa', plano: ['Una moneda puede convertirse en un millón.', 'Hay que lanzar monedas y meterlas dentro de una garrafa.', 'Toca cuando la mira esté sobre la boca de la garrafa. ¡Seis monedas!'] },
],
frases: {
 bienvenida: '¡Bienvenidos a Uno para ganar! Diez pruebas, sesenta segundos cada una, y un millón de euros esperando. ¡Vamos a por ello!',
 listo: '¿Preparado? Tres, dos, uno... ¡Ya!',
 superado: '¡Prueba superada! ¡Fantástico!', superado2: '¡Lo has conseguido! ¡Qué manos!', superado3: '¡Bravo! ¡Nivel completado!',
 casi: '¡Casi! Ha estado muy cerca. ¡Seguimos con energía!',
 vidas2: 'Te quedan dos vidas. ¡Tú puedes!', vidas1: 'Te queda una vida. ¡Con calma y a por ello!',
 fin: '¡Qué gran concurso! Te llevas tu premio y un montón de aplausos.',
 plantarse: 'Muy buena decisión. ¡Te plantas con tu premio!', seguro: '¡Cantidad asegurada! Este dinero ya es tuyo.',
 millon: '¡Increíble! ¡Has ganado el gran premio! ¡Eres un campeón!', pregunta: '¿Te plantas o sigues jugando?',
 entreno: '¡Bienvenido al entrenamiento! Aquí nadie pierde vidas. ¡Practica todo lo que quieras!', entrenoBien: '¡Muy bien entrenado! Así se hace.', entrenoOtra: '¡Buen intento! ¿Otra vez?',
 despedida: 'Esto ha sido Uno para ganar. ¡Gracias por jugar, y hasta el próximo programa!',
 explorar: '¡Hola! Pasea por el plató todo lo que quieras. ¡Bienvenido a Uno para ganar!',
 n1: 'Nivel uno.', n2: 'Nivel dos.', n3: 'Nivel tres.', n4: 'Nivel cuatro.', n5: 'Nivel cinco.', n6: 'Nivel seis.', n7: 'Nivel siete.', n8: 'Nivel ocho.', n9: 'Nivel nueve.', n10: 'Nivel diez. ¡La prueba final!',
},
monologos: [
 { id: 'reloj', titulo: 'Mi amigo el reloj', lineas: ['¿Sabéis quién es mi mejor amigo en este plató? ¡El reloj!', 'Siempre puntual, nunca se cansa y cuenta hasta sesenta sin equivocarse.', 'Yo una vez intenté contar hasta sesenta y en el treinta ya estaba pensando en la merienda.', 'Así que un aplauso para el reloj, ¡que trabaja más que nadie!'] },
 { id: 'globos', titulo: 'Los globos del ensayo', lineas: ['Esta mañana, en el ensayo, hemos inflado cien globos para la prueba de gravedad cero.', 'Y claro, el regidor ha acabado hablando con voz de pito.', 'Ahora todos le entienden mejor, porque habla más alegre.', '¡Un aplauso para Sergio, nuestro regidor más divertido!'] },
 { id: 'normas', titulo: 'Las normas del plató', lineas: ['Normas del plató de Uno para ganar. Número uno: aquí se sonríe.', 'Número dos: los vasos se apilan, no se lanzan.', 'Número tres: los caramelos de la prueba de colores no se comen... hasta que acaba el programa.', 'Y número cuatro: el público aplaude fuerte. ¡Vamos a practicar!'] },
],
promos: [
 { id: 'esta_noche', titulo: 'Esta noche', lineas: ['Esta noche, en Show Time TV, vuelve Uno para ganar.', 'Diez pruebas, un minuto cada una, y un gran premio esperando.', '¿Tendrás la habilidad que hace falta? ¡No te lo pierdas!'] },
 { id: 'casting', titulo: 'Casting', lineas: ['¿Eres rápido, tienes buena puntería y te encantan los retos?', '¡Uno para ganar busca concursantes!', 'Apúntate en el menú Casting y sal en el próximo programa.'] },
 { id: 'especial', titulo: 'Gran especial', lineas: ['Muy pronto, un gran especial de Uno para ganar.', 'Pruebas nuevas, más globos, más vasos, y mucha diversión.', 'Solo en Show Time TV.'] },
],
anuncios: [
 { id: 'pegatodo', titulo: 'Pegamento Pegatodo', lineas: ['¿Se te despegan los vasos de la torre? ¡Prueba Pegatodo!', 'Pega vasos, globos y hasta caramelos de colores.', 'Pegatodo. ¡Lo que une, no se separa!'] },
 { id: 'zumo', titulo: 'Zumo Sesenta', lineas: ['¿Tienes sed después de un minuto de esfuerzo?', 'Zumo Sesenta, con sesenta naranjas en cada botella.', 'Zumo Sesenta. ¡Energía para ganar!'] },
 { id: 'reloj', titulo: 'Relojes Tic', lineas: ['Relojes Tic: puntuales como el reloj de Uno para ganar.', 'Sumergibles, ligeros y con alarma divertida.', 'Relojes Tic. ¡Cada segundo cuenta!'] },
],
escenas: {
 oculta: [
  { id: 'globo', titulo: 'El globo que no bajaba', pasos: [
   ['host', 'Vamos a ensayar la prueba de gravedad cero. Suelto el globo y...', 'host', 'habla', ''],
   ['host', '¡Un momento! ¡El globo no baja! ¡Se queda quieto en el aire!', 'cerca', 'senala', 'ooh'],
   ['sergio', 'Será que hoy el globo tiene mucha energía, Javier.', 'wide', '', 'risas'],
   ['host', 'Esto es magia de verdad. ¡Que venga la ciencia a explicarlo!', 'host', 'arriba', ''],
   ['marta', '¡Inocente, inocente! El globo lleva un hilo transparente que sujeta Sergio.', 'wide', '', 'inocente'],
   ['host', '¡Qué buenos sois! Me lo he creído del todo. ¡Un aplauso para el equipo!', 'host', 'aplaude', 'aplauso']] },
  { id: 'reloj', titulo: 'El reloj que contaba al revés', pasos: [
   ['host', 'Atención, que arranca el reloj. Sesenta segundos para la prueba.', 'host', 'habla', ''],
   ['host', 'Uno, dos, tres... ¡Un momento! ¡El reloj está subiendo en vez de bajar!', 'reloj', 'senala', 'ooh'],
   ['conc', 'Pues así tengo todo el tiempo del mundo. ¡Me encanta!', 'wide', '', 'risas'],
   ['dani', 'Javier, creo que el reloj se ha levantado con ganas de jugar.', 'wide', '', ''],
   ['marta', '¡Inocente, inocente! Lo hemos programado nosotros para la broma.', 'wide', '', 'inocente'],
   ['host', '¡Me habéis pillado! Ahora sí, reloj, cuenta hacia atrás. ¡Gracias!', 'host', 'gracias', 'aplauso']] },
  { id: 'caramelos', titulo: 'Los caramelos de un solo color', pasos: [
   ['host', 'Prueba de colores separados. Abrimos la caja de caramelos y...', 'host', 'habla', ''],
   ['host', '¡Todos los caramelos son azules! ¿Dónde están los demás colores?', 'cerca', 'senala', 'ooh'],
   ['lucia', 'Yo creo que los colores se han ido de vacaciones, Javier.', 'wide', '', 'risas'],
   ['marta', '¡Inocente, inocente! Hemos cambiado la caja. La de verdad está aquí.', 'wide', '', 'inocente'],
   ['host', '¡Menuda broma más dulce! ¡Muchas gracias, equipo!', 'host', 'aplaude', 'aplauso']] },
 ],
 tomas: [
  { id: 'trabalenguas', titulo: 'El trabalenguas de los vasos', pasos: [
   ['host', 'Y ahora, la prueba de... sube los vasos, vasos los sube, ¡los vasos suben!', 'host', 'habla', 'claqueta:1'],
   ['host', 'Uy, que se me ha hecho un lío la lengua. ¡Vamos otra vez!', 'host', 'encoge', 'tomafalsa'],
   ['marta', 'Toma dos. ¡Tranquilo, Javier, que te sale genial!', 'wide', '', 'claqueta:2'],
   ['host', 'Prueba número cinco: ¡Sube los vasos! ¡Perfecto!', 'host', 'arriba', 'aplauso']] },
  { id: 'globo', titulo: 'El globo despistado', pasos: [
   ['host', 'Gravedad cero. Tres globos y sesenta segundos para...', 'host', 'habla', 'claqueta:1'],
   ['host', '¡Ay! Un globo se ha escapado y se ha ido a saludar al público.', 'wide', 'senala', 'tomafalsa'],
   ['sergio', 'Ya lo tengo. Dice el globo que quería salir en la tele.', 'wide', '', 'risas'],
   ['host', '¡Pues ya ha salido! Repetimos, que ha quedado muy gracioso.', 'host', 'aplaude', 'claqueta:2']] },
  { id: 'botella', titulo: 'La botella bailarina', pasos: [
   ['host', 'Para enseñaros el aterrizaje, lanzo la botella y cae de pie...', 'host', 'habla', 'claqueta:1'],
   ['host', '¡Ha dado tres vueltas y se ha quedado bailando en la mesa!', 'cerca', 'senala', 'tomafalsa'],
   ['dani', 'Esa botella tiene más ritmo que nuestra sintonía, Javier.', 'wide', '', 'risas'],
   ['host', '¡Me encanta! Otra vez, que ahora sí cae de pie.', 'host', 'arriba', 'claqueta:2']] },
  { id: 'reloj', titulo: 'El reloj con prisa', pasos: [
   ['host', 'Tienes sesenta segundos, empezando... ¡ya!', 'host', 'habla', 'claqueta:1'],
   ['host', '¡Si todavía no he dicho ya y el reloj ya ha sonado!', 'reloj', 'encoge', 'tomafalsa'],
   ['dani', 'Perdón, Javier, se me ha ido el dedo al botón de la bocina.', 'wide', '', 'risas'],
   ['host', 'No pasa nada, Dani. Respiramos, sonreímos, y vamos otra vez.', 'host', 'gracias', 'claqueta:2']] },
 ],
 fuera: [
  { id: 'maquillaje', titulo: 'En maquillaje', lugar: 'maquillaje', pasos: [
   ['lucia', 'Javier, un poquito de polvo para que no brilles con los focos.', 'cerca', '', ''],
   ['host', 'Gracias, Lucía. ¿Sabes qué prueba me toca ensayar hoy?', 'cerca', 'habla', ''],
   ['lucia', 'La de los pañuelos. Así que te dejo uno para el estornudo.', 'cerca', '', 'risas'],
   ['host', '¡Qué detalle! ¡Listo para salir al plató!', 'cerca', 'saluda', '']] },
  { id: 'control', titulo: 'En la sala de control', lugar: 'control', pasos: [
   ['marta', 'Cámara dos, plano del reloj. Cámara uno, a Javier.', 'cerca', '', ''],
   ['host', 'Hola, Marta. ¿Todo preparado para el programa?', 'cerca', 'saluda', ''],
   ['marta', 'Todo listo. Cuarenta pantallas, diez pruebas y un reloj muy puntual.', 'cerca', '', ''],
   ['dani', 'Y el sonido de la bocina, probado y funcionando.', 'cerca', '', 'bocina'],
   ['host', '¡Sois el mejor equipo de la tele! Me voy al plató.', 'cerca', 'aplaude', 'aplauso']] },
  { id: 'ensayo', titulo: 'Ensayo en el plató', lugar: 'plato', pasos: [
   ['sergio', 'Javier, en el ensayo te colocas aquí, junto al reloj grande.', 'wide', '', ''],
   ['host', '¿Aquí? ¡Perfecto! Desde aquí se ve todo el plató.', 'host', 'senala', ''],
   ['sergio', 'Y cuando suene la música, entras saludando al público.', 'wide', '', ''],
   ['host', '¡Hola a todos! ¿Así está bien, Sergio?', 'host', 'saluda', 'aplauso'],
   ['sergio', '¡Genial! El público de ensayo ya te está aplaudiendo.', 'wide', '', 'risas']] },
 ],
 mejor: [
  { id: 'millon', titulo: 'El gran premio', pasos: [
   ['host', 'Recordamos uno de los grandes momentos de Uno para ganar.', 'wide', 'habla', 'lenta'],
   ['host', 'La moneda entra en la garrafa... ¡y el plató entero se pone a aplaudir!', 'reloj', 'arriba', 'confeti'],
   ['conc', '¡No me lo puedo creer! ¡Gracias a todos!', 'wide', '', 'aplauso'],
   ['host', '¡Un momento para recordar siempre!', 'host', 'aplaude', '']] },
  { id: 'globos', titulo: 'El minuto de los globos', pasos: [
   ['host', 'Este concursante mantuvo los tres globos en el aire con una sola mano.', 'wide', 'habla', 'lenta'],
   ['host', '¡Mirad qué saltos! ¡Parecía un malabarista!', 'host', 'senala', 'globos'],
   ['conc', '¡Lo practiqué mucho en el entrenamiento!', 'wide', '', 'aplauso']] },
 ],
},
copres: [
 { id: 'sergio', quien: 'sergio', lineas: ['¡Hola a todos! Hoy me han dejado presentar un ratito.', '¡Un aplauso enorme para nuestro concursante!'] },
 { id: 'lucia', quien: 'lucia', lineas: ['Vengo a retocar a Javier, que con tanta emoción brilla mucho.', '¡Ahora sí, listo para seguir!'] },
],
historia: [
 { id: 'origen', titulo: 'El origen', emoji: '🌍', narr: ['¡Hola! Bienvenidos a la historia de Uno para ganar. Empecemos por el principio.', 'El concurso nació en Estados Unidos en dos mil diez, en la cadena NBC. Allí se llamaba Minute to Win It.', 'La idea era muy sencilla y muy divertida: pruebas de habilidad con objetos de casa, y solo un minuto para superarlas.'],
   card: { k: 'text', items: [['Formato original', 'Minute to Win It · NBC, Estados Unidos, 2010'], ['La idea', 'Pruebas de habilidad con objetos cotidianos'], ['El tiempo', '60 segundos por prueba']] }, cam: 'orbita' },
 { id: 'espana', titulo: 'Llega a España', emoji: '📺', narr: ['En España se llamó Uno para ganar y se estrenó en Cuatro el cuatro de julio de dos mil once.', 'Lo presentaba Jesús Vázquez, y lo producía Big Bang Media.', 'En este juego, el presentador es un personaje inventado: ¡yo, Javier Valle!'],
   card: { k: 'timeline', items: [['4 jul 2011', 'Estreno en Cuatro, a las 22:30'], ['Presentador real', 'Jesús Vázquez'], ['Productora', 'Big Bang Media'], ['En este juego', 'Javier Valle (presentador inventado)']] }, cam: 'barrido' },
 { id: 'formato', titulo: 'Cómo era el concurso', emoji: '⏱️', narr: ['Cada concursante tenía que superar diez pruebas, de dificultad creciente, en un minuto cada una.', 'Tenía tres vidas para los fallos, y antes de cada prueba podía plantarse con el dinero ganado.', 'En Cuatro, la escalera llegaba hasta medio millón de euros. En este juego, como en el proyecto de Scratch, ¡llega al millón!'],
   card: { k: 'chips', items: ['🔟 Diez pruebas', '⏱️ Un minuto', '❤️ Tres vidas', '✋ Plantarse', '💶 Hasta 500.000 € en Cuatro'], note: 'Escalera real de Cuatro: 1.000 · 2.000 · 3.000 · 5.000 · 10.000 · 15.000 · 40.000 · 100.000 · 250.000 · 500.000 €' }, cam: 'reloj' },
 { id: 'pruebas', titulo: 'Las pruebas', emoji: '🥤', narr: ['Las pruebas usaban cosas de todos los días: vasos, globos, botellas, pelotas de ping pong y caramelos.', 'Por ejemplo, lanzar una botella para que cayera de pie, o apilar vasos a toda velocidad.', 'Muchas de esas pruebas están en este juego, tal y como venían en el proyecto de Scratch.'],
   card: { k: 'tiles', items: [['🎈', 'Gravedad cero', 'Globos en el aire'], ['🍼', 'Aterrizaje', 'Botella de pie'], ['🥤', 'Sube los vasos', 'Torre de vasos'], ['💡', 'Apaga la luz', 'Pelota de ping pong']] }, cam: 'mesa' },
 { id: 'temporadas', titulo: 'Las temporadas', emoji: '📅', narr: ['Uno para ganar tuvo dos temporadas y cuarenta y dos programas.', 'La primera tuvo veintiocho programas y la segunda, catorce, hasta julio de dos mil doce.', 'La primera temporada reunió a más de un millón de espectadores de media cada noche.'],
   card: { k: 'stats', items: [['2', 'temporadas'], ['42', 'programas'], ['28 + 14', 'programas por temporada'], ['1,24 M', 'espectadores de media en la 1.ª']] }, cam: 'publico' },
 { id: 'mundo', titulo: 'Por todo el mundo', emoji: '🗺️', narr: ['El formato viajó por todo el mundo.', 'Tuvo versiones en muchos países, como Australia o el Reino Unido.', 'Y en Brasil, un fan creó en Scratch el juego en el que se basa esta app. ¡Muchas gracias a su autor!'],
   card: { k: 'world', items: [['🇺🇸', 'Estados Unidos', 'Minute to Win It'], ['🇪🇸', 'España', 'Uno para ganar'], ['🇧🇷', 'Brasil', '1 Minuto para Vencer (Scratch)'], ['🇦🇺', 'Australia', 'Seven, 2010'], ['🇬🇧', 'Reino Unido', 'ITV, 2014']] }, cam: 'orbita' },
 { id: 'fin', titulo: 'Y ahora, ¡tú!', emoji: '🏆', narr: ['Y ahora, la historia continúa contigo.', 'Diez pruebas, sesenta segundos y tres vidas. ¡Mucha suerte!', '¡Gracias por acompañarme en la historia de Uno para ganar!'],
   card: { k: 'text', items: [['Tu turno', 'Pulsa Jugar › Programa completo'], ['Consejo', 'Practica primero en Entrenamiento']] }, cam: 'host' },
],
museo: ['¡Bienvenido al museo de Uno para ganar! Soy Doña Clepsidra, la guía. Me encantan los relojes.', 'En esta sala están los objetos más famosos de las pruebas: globos, vasos, botellas y monedas.', 'Cada objeto tiene su panel. Toca Siguiente para pasear por la sala.', '¡Gracias por visitar el museo! Vuelve cuando quieras.'],
creditos: [
 ['Presentador (personaje virtual)', ['Javier Valle · voz sintética Piper es_ES']],
 ['Dirección', ['Marta Olmedo']], ['Realización', ['Sergio Lanza']], ['Sonido', ['Dani Robles']], ['Maquillaje', ['Lucía Prado']],
 ['Guion', ['Nacho Bermejo']], ['Grafismo 3D', ['Paula Quintana']], ['Producción', ['Show Time TV para Ikeriano']],
 ['Basado en', ['El proyecto de Scratch «1 Minuto Para Vencer» (Brasil): pruebas, escalera, sonidos y gráficos', 'El formato Minute to Win It y su versión española Uno para ganar (Cuatro, 2011-2012)']],
],
};

(function(U){
U.promosHost = [
 { id: 'proximo', titulo: 'El próximo programa', lineas: ['¡Hola! Soy Javier Valle, y os espero en el próximo programa de Uno para ganar.', 'Habrá globos, vasos, monedas y un reloj que no para nunca.', '¡No faltéis! Os espero aquí, en el plató.'] },
 { id: 'especial', titulo: 'Programas especiales', lineas: ['Este mes tenemos programas especiales: Halloween, Navidad y Verano.', 'El plató se viste de fiesta, ¡y las pruebas también!', 'Elige tu especial en Jugar, Programa especial.'] },
 { id: 'entrena', titulo: 'A entrenar', lineas: ['¿Quieres ser concursante? ¡Entrena conmigo!', 'En el entrenamiento nadie pierde vidas y puedes repetir cada prueba.', '¡Te espero en el plató!'] },
];
U.frases.como = 'Diez pruebas, sesenta segundos y tres vidas. ¡Así se juega a Uno para ganar!';
U.chistes = ['¿Sabes por qué el reloj fue al médico? ¡Porque tenía las manecillas cansadas!', '¿Qué le dice un vaso a otro vaso? ¡Qué bien apilados estamos!', '¿Por qué el globo nunca se aburre? ¡Porque siempre está por las nubes!', '¿Qué hace una moneda en el gimnasio? ¡Ejercicios de caída libre!'];
})(window.UPG);
