# Primera fase — verificación técnica

Fecha: 20 de octubre de 2026.
Base: 23d86e789fa9ef001da3f744c5754324772f2383.
Rama de revisión: feature/listening-03-05-review.

## Alcance

Solo se añaden tres MP3, tres actividades, un índice de revisión fuera de la navegación publicada y documentación. No se cambia ningún archivo previo. Listening 01 y 02, Reading, Writing, Grammar, CSS general y el sitio antiguo de Netlify no se modifican. No se fusiona con main.

## Generación y transferencia

- ElevenLabs, modelo eleven_v3; voces peninsulares obtenidas de su catálogo actual. Una toma por turno o reportaje, sin regeneraciones manuales.
- 03: Alberto y Matilda Paz, entrevista en seis turnos. Unión de los MP3 originales con copia de flujo, sin recodificación. Se conservan los seis originales en la entrega.
- 04: Mario. MP3 original descargado, sin conversión.
- 05: María Díaz. MP3 original descargado, sin conversión.
- Tres archivos decodificados íntegramente con FFmpeg sin errores. Tamaños, duraciones y hashes en audio-verification.json.
- Subida real a GitHub con create_blob, encoding base64. Los tres SHA de blob devueltos coinciden exactamente con los calculados localmente. No se han creado archivos vacíos ni enlaces temporales como fuentes del reproductor.

## Lógica de las actividades

Comprobaciones con Node y un DOM simulado: sintaxis JavaScript; cinco grupos y quince opciones por actividad; alternancia de pistas; respuestas todas correctas (5/5), todas incorrectas (0/5) y sin contestar; soluciones con evidencia; reinicio; velocidad de reproducción; aviso de error de audio y existencia del MP3 enlazado. Todas pasan. Esto no equivale a una prueba en navegador.

## Navegadores y publicación

No se ha completado una prueba real en Safari/iPad ni en navegador de ordenador. Playwright estaba disponible, pero faltaban los navegadores. La instalación de Chromium falló por descargas incompletas. WebKit se descargó, pero no pudo arrancar por falta de bibliotecas GTK/GStreamer; la instalación de dependencias falló por restricciones del sistema. Quedan pendientes la comprobación visual, interacción táctil, reproducción, búsqueda dentro del audio y cambio de velocidad en dispositivos reales.

La URL publicada de Listening 01 sirve HTTP 200 y contenido audio/mp3. La página people-01 nueva devuelve 404 en GitHub Pages antes de publicar, como corresponde a una actividad aún fuera de main. No se han cambiado los ajustes de Pages ni desplegado la rama sobre el sitio público. No se puede certificar que los tres MP3 nuevos se sirvan en Pages o que el reproductor público los cargue hasta una publicación autorizada. La verificación de los binarios de la rama de revisión es una comprobación distinta.

## Revisión pendiente del profesor

Escuchar los tres audios y valorar ritmo, naturalidad y pronunciación; aprobar contenido y dificultad; probar las páginas en Safari de iPad y ordenador; autorizar expresamente cualquier incorporación a main. No se inicia la siguiente tanda.

## Verificación remota completada

La rama se ha vuelto a descargar con git fetch. Los once archivos añadidos coinciden byte por byte con los locales. Los tres MP3 de la rama también se han descargado desde raw.githubusercontent.com: HTTP 200, Content-Type audio/mpeg y SHA-256 idéntico en los tres casos. Es una prueba de los binarios de la rama; no es una prueba del reproductor en GitHub Pages.
