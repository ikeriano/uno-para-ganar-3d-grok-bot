# Uno para ganar 3D

Juego de fans para Android, hecho por **Show Time TV para Ikeriano**. Recrea *Uno para ganar*, el concurso de Cuatro (2011-2012) presentado por Jesús Vázquez, que era la versión española de *Minute to Win It*.

- Tiene 10 niveles con 60 segundos cada uno, 3 vidas, la opción de plantarse y una escalera de premios hasta 1.000.000 €.
- Las pruebas, la escalera, los sonidos y los gráficos vienen del proyecto de Scratch brasileño «1 Minuto Para Vencer». Todo está traducido al español.
- El plató es 3D (three.js) y está pensado para móviles modestos como el Redmi A2.
- El presentador es Javier Valle, un personaje inventado. Él y el equipo hablan con voces sintéticas Piper en es_ES.
- El menú y las escenas siguen la plantilla de Ahora Caigo 1.64: cámara oculta, tomas falsas, fuera de cámaras, mejores momentos, historia, museo, promos, publicidad, paseo, casting, cámara libre, editor de plató y AntenaPlayStation TV.

Para compilar hay que ejecutar `app/build.sh`. Necesita la variable de entorno `KS_PASS`. El keystore no está en el repositorio.
Las voces se generan con `tools/voces.sh`.

Es un juego sin ánimo de lucro, y todo el contenido inventado está marcado con 🆕 INVENTADO.
