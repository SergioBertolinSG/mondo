# Mondo

Aplicación web de práctica por inmersión, pensada primero para móviles. Incluye vocabulario, conjugación y escritura libre. Toda la interfaz y todo el contenido visible están en español.

No hay cuentas, telemetría, almacenamiento persistente ni servicios remotos. Las respuestas y resultados viven únicamente en la memoria de la pestaña actual. El corrector LingoTweaker y sus datos de español se sirven con los demás archivos estáticos y se ejecutan en un Web Worker dentro del navegador.

## Desarrollo

Requisitos: Node.js `^22.22.2`, `^24.15.0` o `>=26.0.0`. El archivo `.nvmrc` fija Node.js 24.15.0, que es la versión comprobada durante el desarrollo.

```bash
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

La compilación queda en `dist/`. La navegación usa rutas con hash, por lo que el resultado funciona en alojamiento estático sin reglas especiales de reescritura.

Las pruebas de navegador recorren los tres flujos principales a 320, 375, 390 y 430 px. También inicializan el WASM y los datos españoles reales desde la compilación estática. Se han ejecutado con Chromium automatizado; no se afirma haber realizado pruebas físicas en iOS Safari o Android Chrome.

## Contenido y funcionamiento

- Vocabulario: 850 entradas entre A1 y B2 (750 sustantivos y 100 verbos frecuentes), agrupadas por temas. Las pistas son paráfrasis didácticas y cada ficha enlaza su entrada del DLE como fuente de consulta. Las respuestas distinguen entre acierto, tilde ausente y error; solo se aceptan las alternativas declaradas en los datos.
- Verbos: 20 verbos y ocho tiempos. Los irregulares se han codificado explícitamente; el generador regular solo se aplica a combinaciones morfológicamente regulares. El imperfecto de subjuntivo acepta las variantes en `-ra` y `-se`.
- Frases: 60 preguntas originales —15 por nivel— inspiradas en la práctica conversacional abierta. No existe afiliación con el Instituto Cervantes ni se reproducen preguntas oficiales.

## Corrector local y límites conocidos

La integración usa `lingotweaker-wasm` 0.2.8 y `lingotweaker-data-es` 0.2.8. El paquete español comprimido se copia a `public/grammar/packs/es.pack.gz`; Vite incluye el módulo WASM en la compilación. El motor se inicializa de forma diferida al hacer la primera revisión, y todo el trabajo ocurre en un Web Worker.

Los offsets que devuelve el motor son bytes UTF-8. El adaptador los convierte a índices UTF-16 antes de resaltar o reemplazar texto; hay pruebas con tildes y emoji.

Corpus de integración comprobado con esta versión:

- `Normalmente yo va al parque con mis amigos.` detecta la falta de concordancia `yo va` y sugiere `voy`. También puede proponer una coma tras el adverbio; es una recomendación estilística, no un error inequívoco.
- `Ayer fuimos ala playa.` detecta la posible confusión entre `ala` y `a la`.
- `Mi amigo están contento.` detecta la concordancia verbal y sugiere `está`, pero no siempre detecta todos los problemas nominales de la misma frase.
- `El árbol es verde.` no genera observaciones.

LingoTweaker es un proyecto joven y basado en reglas. Puede producir falsos positivos y falsos negativos, no evalúa si una respuesta aborda la pregunta ni asigna una nota de calidad. La capa de presentación descarta recomendaciones de puntuación o estilo, exige una sustitución cercana y de alta confianza, muestra como máximo seis problemas y una sola propuesta por problema. Por eso la interfaz dice que no se detectaron errores claros, nunca que el texto sea perfecto. Si faltan los datos, el navegador no admite WASM o falla la inicialización, la aplicación muestra el error real y permite reintentar; no genera correcciones simuladas.

## Privacidad y red

No se usa `localStorage`, IndexedDB, cookies, API, backend ni analítica. Una vez descargados los archivos iniciales, los ejercicios y la revisión no realizan peticiones a terceros. Esto no se presenta como una garantía de uso sin conexión: el sitio sigue siendo una web normal y no instala un service worker.

## Licencias

El código original de Mondo se distribuye bajo la licencia GNU General Public License v3.0 o posterior (`GPL-3.0-or-later`); consulta `LICENSE`. Las dependencias y los datos de terceros conservan sus licencias respectivas:

- LingoTweaker, `lingotweaker-wasm` y el empaquetado de datos: LGPL-2.1-or-later.
- Los datos, reglas y modelos incorporados por LingoTweaker conservan las licencias de sus fuentes; consulta el archivo local [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) y los textos incluidos en [`third_party_licenses/`](third_party_licenses/).
- React, React Router, Lucide, Vite, Vitest y sus dependencias conservan sus respectivas licencias publicadas.

La aplicación muestra ilustraciones tipográficas del sistema y los iconos de interfaz proceden de Lucide. No descarga imágenes ni tipografías de terceros durante su uso.
