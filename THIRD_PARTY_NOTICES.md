# Avisos de terceros

La licencia GPL-3.0-or-later de Mondo no sustituye las licencias de los componentes que se enumeran a continuación. Cada componente conserva sus propios derechos de autor y condiciones.

## LingoTweaker 0.2.8 y LanguageTool

Mondo redistribuye, sin modificaciones funcionales, los siguientes artefactos de LingoTweaker 0.2.8:

- `lingotweaker-wasm` 0.2.8, incluido en la compilación como WebAssembly.
- `lingotweaker-data-es` 0.2.8, copiado en `public/grammar/packs/es.pack.gz` con SHA-256 `a01cb04af857160b94e5d9a23b36f5abec2e4767f161afdc70ae5b458848694e`.

El código fuente correspondiente está disponible en la [etiqueta v0.2.8 de LingoTweaker](https://github.com/fiduswriter/LingoTweaker/tree/v0.2.8), commit `819dc354224c9087ff486708adfd413ecb45f466`. El paquete de datos declara como base de LanguageTool el commit `622328535865050c077ccb64cabb5fad77038bc4`.

Licencias y procedencia relevantes:

- El motor, el port y el código de integración de LingoTweaker: LGPL-2.1-or-later.
- Los recursos centrales y las reglas de LanguageTool: LGPL-2.1-or-later, salvo excepciones declaradas por archivo en el proyecto de origen.
- El diccionario morfosintáctico español `org.softcatala:spanish-pos-dict:2.5`: LGPL-2.1-only.
- El modelo de identificación `lid.176.ftz`, de Facebook AI Research, y el discriminador de conjuntos confundibles incorporados al WASM: CC BY-SA 3.0. El primero fue entrenado con Wikipedia, Tatoeba y SETimes; el segundo fue entrenado por LingoTweaker con textos de Wikipedia y conserva esa licencia.

LingoTweaker es un proyecto independiente y no está afiliado ni respaldado por LanguageTool. La marca LanguageTool pertenece a sus titulares.

Se conservan localmente:

- El texto completo de la LGPL-2.1 en `third_party_licenses/LINGOTWEAKER-LGPL-2.1.txt`.
- El texto completo de CC BY-SA 3.0 en `third_party_licenses/CC-BY-SA-3.0.txt`.
- El aviso oficial íntegro de la versión utilizada en `third_party_licenses/LINGOTWEAKER-0.2.8-NOTICES.md`.

## Bibliotecas de interfaz

- Lucide y los iconos derivados de Feather conservan los avisos ISC y MIT incluidos en `third_party_licenses/LUCIDE-LICENSE.txt`.
- React y React DOM se distribuyen bajo MIT; el aviso se incluye en `third_party_licenses/REACT-MIT.txt`.
- React Router se distribuye bajo MIT; el aviso se incluye en `third_party_licenses/REACT-ROUTER-MIT.md`.

Las dependencias usadas únicamente para desarrollo conservan los avisos y licencias distribuidos en sus respectivos paquetes npm.
