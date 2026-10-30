# Plantilla «Ahora Caigo 1.64» para los juegos de Iker

Estudiado del APK de la release v1.64 (`ikeriano/ahoracaigo-grok-bot`, `assets/www/js/app.js`, `extras159.js`, `data159.js`, `editor164.js`, `studio.js`, `museo148.js`, `clasicas155.js`). Sirve para aplicar el mismo menú, las mismas escenas y la misma «historia» a otros concursos.

## 1. Menú principal (orden real de 1.64)
Cada botón es `_t(título, subtítulo, clase, acción)`; `gold` = destacado.
1. **Jugar** (gold): «Programa completo, entrenamiento, clásico…» → submenú *play*.
2. **AHORA CAIGO ARGENTINA** (gold, versión internacional del formato con su presentador).
3. **📱 App clásica** (gold): app 2D antigua recreada.
4. **⭐ Lo mejor de…** (gold, id `lm144`): mejores momentos, duelos, finales y vídeos de Ikeriano. Dentro, bloque «🆕 NOVEDADES · TODO INVENTADO» con accesos a mejores momentos, cámaras ocultas, tomas falsas, fuera de cámaras y pruebas inventadas.
5. **🎞️ Recreaciones e historias** (id `rh144`): vídeos de Ikeriano.
6. **🏆 Mejores momentos · 🆕** (gold, id `mj159`): recreaciones 3D inventadas (cámara lenta, repetición).
7. **🏛️ Museo de…** (`museo148`): paseo por la historia del programa con un guía (Sir Trampillón).
8. **🕹️ APPS CLÁSICAS** (`clasicas155`): apps antiguas jugables dentro del juego.
9. **Promos**: promos 3D con el presentador (casting, gran anuncio, esta noche…); incluye 🎬 Creador de promos.
10. **Promos de <presentador>**: el presentador presenta el programa en el plató (próximo programa, bote, casting, especiales).
11. **Publicidad**: pausa de Show Time TV con anuncios inventados, ⏱️ cortinillas («Publicidad · Volvemos en 1 minuto · 30 segundos…») y 📺 pausa publicitaria completa.
12. **Cámara oculta**: bromas al presentador… «¡Inocente, inocente!».
13. **Tomas falsas**: lapsus y objetos impacientes.
14. **Fuera de cámaras**: maquillaje, ensayos, técnicos y la pausa.
15. **Paseo**: pasea por el plató, sube a la grada y sal a la calle.
16. **Casting**: apúntate (nombre) y sal como concursante en las partidas.
17. **Elige el valor de…** (específico del formato: valores de la moneda / escalera de premios).
18. **Cámara libre**: vuela por el plató, graba tu toma y úsala de cabecera o en promos.
19. **Studio · Editor de plató** (editor164 + `studio.js`): mueve, escala, gira, pinta y añade piezas y luces (1.64: grupo 💡 Iluminación: foco, cabeza móvil, tira/barra LED, panel de píxeles, wash).
20. **Opciones**: sonido, calidad gráfica, pantalla completa.
21. **La historia de <programa>** (clase `hist`): «<presentador> te cuenta la historia del programa».
22. **Cómo se juega**: reglas.
23. **Créditos**.
24. **Instalar app** (solo en web).

### Submenú Jugar
- **Programa completo** (gold): cabecera → todas las rondas → final → despedida.
- **🎯 Empiezo como oponente** (variante propia del formato).
- **Entrenamiento** → submenú *train* «Entrenamiento (sin caídas)»: cada prueba suelta, «con reloj», «sin tiempo», y la fase final; nadie pierde; la iluminación pasa a la tonalidad «blanco» (`lookEvent('entrenamiento')`).
- **Clásico**: el minijuego original de Scratch.
- **Explorar el plató**: paseo libre (joystick/WASD, arrastrar para mirar, 👁 cambia de cámara); los personajes saludan al acercarte.
- **Monólogos del presentador**: números de humor (con el público, al teléfono, las normas). Al acabar: «Siguiente ▶ / Repetir / Lista».
- **Programa especial**: fila de temas (Halloween, Navidad…) que cambian decoración.

### Opciones (orden)
🎵 Música (Sí/No + volumen) · 🔊 Efectos (Sí/No + volumen) · 🎤 Voz del presentador · 📖 El presentador lee las preguntas · ⏩ Velocidad de lectura (Normal/Rápida) · 😄 Chistes del presentador · 🎭 Monólogo del presentador · 🎤 Copresentador sorpresa (Sí/No) · ✨ Calidad gráfica (Baja/Media/Alta) · ⛶ Pantalla completa. Lo nuevo/inventado va marcado y APAGADO por defecto.

### Créditos
Lista `[rol, [nombres]]` → `<p><b>rol</b><br>nombres</p>`, dedicatoria al canal «Ikeriano el campeón 2», productora (Show Time TV), versión, y aviso: «Juego de fans sin ánimo de lucro… El presentador es un personaje virtual inventado».

## 2. Escenas (Cámara oculta / Tomas falsas / Fuera de cámaras / Mejores momentos)
**Datos**: cada escena es `{id, titulo, lugar?, pasos:[[quién, texto, cámara, gesto, efecto], …]}`.
- quién: `adrian` (el presentador, voz Piper davefx), `conc` (concursante), o un personaje del equipo (`lola` directora, `nuria` maquillaje, `rober` sonido, `reg` regidor…); cada personaje tiene `[nombre visible, voz]`.
- cámara: `host`, `wide`, `oppN`, `holeN`, `cerca`, y en 1.59 `grua, suelo, cenital, lado, espalda, publico, gloria, orbita, lugar, detalle`.
- gesto: `saluda, senala, habla, aplaude, arriba, lamenta, gracias, encoge`.
- efecto: `claqueta:N`, `inocente`, `tomafalsa`, `corten`, `risas`, `aplauso`, `ooh`, `silencio`, efectos de formato (`cae:N`, `trampillaNo:N`…) y los FX 3D/2D de 1.59 combinables con `+` (`flash, rayo, shake, apagon, estatica, rebobina, lenta, bn, sepia, rotulo:TEXTO, sello:TEXTO, confeti, nieve, monedas, luces, tarta, micro, pato, robot, globos, ovni, humo, gato, pelota, dron, cartel:TEXTO, moneda, trofeo, rueda`, y sonidos sintéticos: `pitido, bocina, sirena, redoble, tada, trueno, boing, campana, telefono, grillos, ding, trompeta, squeak, zumbido, whoosh, tos`).

**Cómo se ejecuta** (`exCorre`): reinicia posiciones → crea la **capa de look** (canvas 2D encima del 3D) → si `lugar` ≠ plató, monta el decorado (maquillaje/camerino, control, cafetería, pasillo, azotea, almacén, parking) a un lado del plató con sus personajes → por cada paso: corte de cámara, gesto, efecto, y el personaje habla con bocadillo (nombre + texto) y su voz; pausa 350 ms → al final 1,2 s y, al azar (30 %, opción Copresentador), aparece un copresentador → menú «Siguiente ▶ / Repetir / Lista» y órbita lenta de cámara. Lista de escenas con «▶ Ver todas seguidas». Las escenas nuevas llevan «🆕» en el título y una insignia «INVENTADO» abajo a la izquierda.

**Capa de look por modo**:
- *Cámara oculta*: esquinas de visor blancas, punto rojo parpadeante + «CÁMARA OCULTA»; música corta de fondo; sello amarillo «¡INOCENTE, INOCENTE!» con confeti, risas y ovación.
- *Tomas falsas*: grano blanco, rótulo amarillo «TOMAS FALSAS» arriba a la izquierda, código de tiempo «TC 01:17:ss:ff» abajo a la derecha; claqueta animada en el centro («ESCENA 1 · TOMA N») con chasquido; sello rojo «TOMA FALSA» + risas.
- *Fuera de cámaras*: viñeta oscura, grano, «FUERA DE CÁMARAS» arriba a la izquierda, «● REC» arriba a la derecha, cámara en mano (el canvas 3D tiembla y escala 1,06).
- Rótulo inferior azul durante 4,5 s: «MODO · título de la escena».

## 3. La historia del programa
Modo `historia`: tarjeta grande (`#hCard`) + subtítulo (`#hSub`) + controles «◀ Anterior · ⏭ Saltar · Siguiente ▶» + puntitos de capítulo. Música «Trilha» bajita; el presentador mira a cámara.
Capítulos `{id, titulo, emoji, narr:[frases], card:{k, items}, cam, luces}`. Para cada capítulo: pinta la tarjeta, mueve la cámara (órbita, barrido…), cambia la iluminación; aplausos en el primero y el último; luego el **presentador narra frase a frase** (subtítulo «<b>Presentador</b> frase», gesto «habla», voz Piper), espera a que termine (o tiempo ≈1,2 s + 45 ms/letra); tocar el subtítulo salta la frase. Al terminar pasa solo al siguiente capítulo (0,9 s); en el último el botón pone «Terminar ✓».
Tipos de tarjeta: `text` (filas título/dato), `timeline` (fechas), `chips` (+nota), `cols`, `tiles`, `stats`, `world` (versiones internacionales), `bars` (audiencias).
Capítulos de Ahora Caigo: El origen · El estreno · Los especiales · Las remodelaciones · … (datos reales con fuentes, tono positivo).

## 4. Reglas de estilo comunes
Todo positivo (nunca «has perdido»: «¡casi!», «te llevas…»). Personajes y presentador inventados con voz sintética Piper es_ES. Mosca de Show Time TV. Lo inventado se marca «🆕 INVENTADO» y las opciones nuevas empiezan en No. Rendimiento Redmi A2: pocas luces reales, pixelRatio ≤ 1, sombras desactivadas.

## 5. Excepciones pedidas por Iker al copiar la plantilla (Uno para ganar)
- En las tomas falsas el presentador **no** dice «¡Corten!» y no sale el sello «¡CORTEN!» (se usa «TOMA FALSA» y la claqueta).
- En «Fuera de cámaras» **no** hay rótulos «MOMENTO 1 / MOMENTO 2».
