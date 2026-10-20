# Videos de las lecciones

Cada lección tiene un video animado (Remotion) y narrado (Fish Audio), con
subtítulos. Los videos se guardan en R2 (`socatres-videos`) y la app los sirve
desde `/media/lessons/…` (`functions/_lib/media.js`), sin depender de YouTube.

## Flujo

```sh
npm install
npm run narrate            # narra lo que cambió (todas, o: npm run narrate -- equations)
npm run stills -- signs    # un cuadro por paso en out/stills/signs/, para revisar
npm run studio             # vista previa interactiva
npm run render             # out/<id>.mp4 (todas, o: npm run render -- signs)
npm run upload             # sube a R2 y actualiza ../public/lesson-videos.js
```

Después de `upload`, publica la app (`npm run deploy` en la raíz) para que use
los videos nuevos. Cada archivo lleva su huella en el nombre: un video nuevo
nunca choca con la copia vieja en la caché.

Las claves van en `../.env` (ver `../.env.example`): `FISH_AUDIO_API_KEY`,
`FISH_AUDIO_VOICE_ID` y, opcionales, `FISH_AUDIO_MODEL` y `R2_BUCKET`. La subida
usa la sesión de wrangler (`npx wrangler login`).

## Guiones

`lessons/<id>.mjs`: cada paso es una frase narrada (`say`), con lo que se ve
mientras tanto. `eq` (la ecuación de arriba) y `visual` se mantienen hasta que
un paso los cambie. En textos y ecuaciones, `[[…]]` marca una operación o
pista, `{{…}}` una idea clave o comprobación y `~~…~~` lo que se descarta.

| `visual.type` | Para qué | Ejemplo |
|---|---|---|
| `balance` | Ecuaciones: bolsas (x), medias bolsas (0,5x) y bolitas. Se inclina según el peso real. | `equations` |
| `numberline` | Recta numérica o ascensor (`vertical`), saltos y flechas. | `enteros`, `signs` |
| `tokens` | Grupos de objetos o fichas con letra. | `semejantes` |
| `table` | Tablas con flecha entre filas. | `proporciones` |
| `grid100`, `bar` | Porcentajes. | `porcentajes` |
| `area` | Modelo de área de (a + b)². | `notables` |
| `circle` | La cabra: centro, radio, perímetro y área. | `circulos` |
| `triangle` | Pitágoras con baldosas. | `pitagoras` |
| `chart` | Función afín: partida, escalera y recta. | `funcion` |
| `freq` | Resultados de un experimento. | `probabilidad-experimental` |
| `passage` | Texto con pistas destacadas y notas. | lecturas |
| `cards`, `steps`, `list`, `lines` | Metáforas, pasos en orden, cierre y desarrollo algebraico. | todas |

Para cambiar una frase basta editarla y volver a correr `narrate`, `render` y
`upload`: solo se vuelve a narrar lo que cambió.

## Video promocional

El guion está en `promo/socatres.mjs` y usa capturas de la app (`public/promo/`). Se narra y renderiza aparte del catálogo, con su propia voz:

```sh
FISH_AUDIO_VOICE_ID=<voz> SCRIPT=promo/socatres.mjs node --env-file=../.env narrate.mjs
SCRIPT=promo/socatres.mjs ENTRY=src/promo.jsx node render.mjs   # → out/promo-socatres.mp4
# Vertical (9:16), con la misma narración y capturas de celular (public/promo/*-celular.png):
SCRIPT=promo/socatres-vertical.mjs ENTRY=src/promo-vertical.jsx COMPOSITION=promo-socatres-vertical node render.mjs
# Otra voz: promo/socatres-voz2.mjs guarda su narración aparte (id promo-socatres-voz2);
# la composición vertical correspondiente es promo-socatres-voz2-vertical.
```

Una variable ya definida en el entorno tiene prioridad sobre `../.env`. En un paso, `caption` reemplaza el subtítulo cuando la voz debe decir algo distinto (por ejemplo, una dirección web).

## Reels de lecciones (9:16)

`reels/` reutiliza el guion de una lección con un id propio (`reel-<lección>`), para narrarlo con otra voz sin tocar el audio de la app. `src/LessonVertical.jsx` dibuja las visualizaciones de 1920×1080 en el ancho del celular (los dibujos a ancho completo; los textos, más grandes) y cierra con la marca y `REEL_URL` (`reels/index.mjs`).

```sh
FISH_AUDIO_VOICE_ID=<voz> SCRIPT=reels/equations.mjs node --env-file=../.env narrate.mjs
SCRIPT=reels/equations.mjs ENTRY=src/reels.jsx node render.mjs   # → out/reel-equations.mp4
```

## Licencias

- Remotion es gratis para personas y empresas de hasta 3 empleados; sobre eso
  requiere licencia de empresa.
- Fish Audio: revisa que el modelo usado (`FISH_AUDIO_MODEL`) permita uso
  comercial antes de publicar.
