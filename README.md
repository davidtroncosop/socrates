# socatres

Espacio de aprendizaje autónomo, al estilo Duolingo, de matemática y comprensión lectora alineado con las Bases Curriculares (MINEDUC). Se usa sin profesor: la app explica los errores, arma una práctica diaria y recuerda practicar. El frontend es estático, sin compilación y con módulos JavaScript. El backend usa Cloudflare Pages Functions con una base D1.

## Ejecutar

```sh
npm test                 # 101 pruebas (Node 22+)
npm run db:migrate:local # una vez: crea la base D1 local
npm run dev              # sitio + API en http://localhost:8788
npm run dev:static       # solo el sitio, sin cuentas (puerto 3000)
```

Para probar el mantenedor y los recordatorios en local, crea `.dev.vars` (no se versiona) con `ADMIN_EMAILS=tu@correo` y `VAPID_PUBLIC_KEY=…` (de `node scripts/vapid-keys.mjs`). La base local se identifica por el `database_id` de `wrangler.toml`: si lo cambias, vuelve a correr `npm run db:migrate:local`. `npm run dev` y el deploy usan `wrangler` (`npx wrangler …` si no está instalado).

## Estructura

| Carpeta | Contenido |
|---|---|
| `public/` | Lo que se publica: páginas, estilos y módulos del cliente. |
| `functions/` | API (`/api/*`). `api/[[path]].js` delega en `_lib/router.js`. |
| `migrations/` | Esquema D1. |
| `workers/reminders/` | Worker con cron que envía el recordatorio diario (Pages no ejecuta tareas programadas). |
| `scripts/` | `vapid-keys.mjs` genera las claves de notificaciones; `iconos.py` genera los íconos de la app desde `docs/marca/buho-original.png` (`python3 scripts/iconos.py docs/marca/buho-original.png public`, requiere Pillow). |
| `video/` | Videos de las lecciones: guiones, narración (Fish Audio), animación (Remotion) y subida a R2. No se publica; ver `video/README.md`. |
| `test/` | Pruebas con `node --test`; las del backend corren sobre SQLite real con el mismo esquema. |
| `docs/` | Ilustración original del búho (`docs/marca/`), progresión curricular, datos de referencia, capturas y la landing anterior. No se publica. |

Módulos del cliente (`public/`):

- `learning.js`: lecciones iniciales, validación numérica, resolución lineal, estado, fusión entre dispositivos y cursos (`GRADES`).
- `curriculum.js`: lecciones de la ampliación curricular.
- `generators.js`: ejercicios generados por lección y nivel.
- `video.js`: enlaces de YouTube, tiempos y reproductor.
- `content.js`, `csv.js`, `admin.js`: catálogo, importación y exportación CSV, mantenedor.
- `app.js`: navegación, lecciones, repasos, cuaderno, sincronización, catálogo central.
- `daily.js`: práctica del día y meta diaria.
- `mistakes.js`: retroalimentación para errores frecuentes.
- `notify.js`, `sw.js`, `manifest.webmanifest`: app instalable, uso sin conexión y recordatorio diario.
- `subjects.js`: materias visibles para los estudiantes.
- `ui.js`, `units.js`, `stats.js`, `dialogs.js`: utilidades de interfaz, unidades de la ruta, métricas de motivación y diálogos.
- `family-view.js`: «Mi familia».
- `auth.js`, `session.js`, `api.js`, `landing.js`: sesión, verificación con el servidor y cliente de la API.

## Qué incluye

- **Explica el error:** si la respuesta coincide con un error frecuente, la app dice qué pasó en vez de solo «incorrecto». En ecuaciones lineales detecta sola el signo contrario, olvidar dividir, multiplicar en vez de dividir y la operación inversa equivocada. Los generadores declaran errores típicos de su tema (exponentes, porcentajes, Pitágoras, productos notables, enteros…), y los autores pueden agregar los suyos por ejercicio.
- **Práctica del día:** una sesión de 3 a 6 ejercicios que mezcla los repasos vencidos, las lecciones con más errores en los últimos 14 días y recuerdo de lo aprendido hace más tiempo. Solo usa lecciones completadas (lo nuevo se aprende en su lección, con la explicación). Los repasos incluidos confirman dominio con la misma regla de siempre.
- **Meta diaria:** relajada (30 XP, unos 5 min), regular (50 XP) o intensa (80 XP). Cada respuesta correcta suma 10 XP; un anillo en la ruta muestra el avance del día.
- **App instalable y sin conexión:** manifiesto, íconos y service worker. Sin conexión se abre la última versión y se sigue practicando; el progreso se sincroniza al volver.
- **Recordatorio diario:** notificación a la hora que elige el estudiante, solo si ese día no ha practicado. En iPhone requiere agregar la app a la pantalla de inicio (iOS 16.4+).
- **Diagnóstico adaptativo por curso:** el estudiante elige su curso y responde hasta 4 preguntas de matemática y 4 de lectura de ese curso. Cada materia se detiene en su primer tropiezo, así que suele tomar menos de 5 minutos. Lo resuelto antes del tropiezo queda completado y pendiente de confirmar en un repaso (nunca como dominio); el tropiezo es el punto de partida sugerido. El curso se guarda y la ruta se abre filtrada en él.
- **Pensado para estudiantes con dificultades de aprendizaje (6° Básico a 4° Medio):** explicaciones con frases cortas y sin tecnicismos; los códigos de objetivos y enlaces del MINEDUC no se le muestran al estudiante (`forStudent`), solo en el mantenedor.
- **Escuchar (🔊):** la explicación, cada ejercicio y cada pista se pueden oír con la voz del navegador (`public/speak.js`), sin enviar nada a internet. Los símbolos se dicen con palabras: «3 + 4 · 2» suena «tres más cuatro por dos».
- **Bases para avanzar:** la primera unidad, visible en cualquier curso, repasa valor posicional, sumar y restar con canje, multiplicar con atajos, dividir, fracciones y decimales (3° a 5° Básico). El diagnóstico empieza por la base y recuerda la lección donde conviene partir (`focus`).
- **Respuestas a la chilena:** se aceptan miles con punto o espacio y el signo $ («2.900», «$2 900»).
- **Jerarquía de operaciones (PAPOMUDAS):** la primera unidad de matemática recorre el orden de las operaciones de 5° a 8° Básico (MA05 OA 05, MA07 OA 01, MA08 OA 03): multiplicar y dividir antes de sumar y restar, paréntesis y corchetes, enteros y potencias. Cada ejercicio anticipa el error típico de operar de izquierda a derecha.
- **Materias visibles:** por ahora solo Matemática (`public/subjects.js`). Las lecciones de Lenguaje siguen en el catálogo, en el mantenedor y con sus videos; para mostrarlas basta agregar `"lenguaje"` a `ACTIVE_SUBJECTS`. Con una sola materia se ocultan el filtro y el progreso por materia, y el diagnóstico pregunta solo matemática.
- Ruta por unidades y filtros por materia y curso (5° Básico a 4° Medio). Las lecciones se desbloquean en orden **dentro de su curso y materia**; la primera de cada curso está abierta.
- 80 lecciones con cuatro ejercicios, repaso independiente, lección conceptual previa y pistas escalonadas.
- **Metadatos explícitos:** cada lección declara `subject` (`matematica`, `lenguaje`) y `grade` (`5b`, `6b`, `7b`, `8b`, `1m`, `2m`). Los filtros y distintivos usan esos campos, no el título. Los catálogos y CSV anteriores se migran: el curso se infiere del prefijo del título («7° Básico · …») y el prefijo se quita.
- **Ejercicios generados:** 67 lecciones de matemática tienen generador. La primera vez se usan los ejercicios curados. Al volver a practicar una lección completada y en cada repaso, se generan ejercicios nuevos del mismo tipo y dificultad, con respuesta, pista y explicación calculadas. Las lecciones sin generador (lectura, círculos, probabilidad, modelamiento) mantienen su contenido curado.
- Validación de respuestas equivalentes (enteros, decimales, fracciones y `x = …`), resolución a mano con foto comprimida en el navegador y «Mi cuaderno».
- Separación entre completar y dominar: el dominio se confirma en un repaso sin ayuda al menos 24 horas después.
- **Lectura sin adivinar:** en cada sesión se mezcla el orden de las alternativas, así el número correcto no se memoriza ni se puede adivinar respondiendo siempre lo mismo. El repaso de lectura pide dos respuestas correctas (el repaso y el desafío final), lo que baja la probabilidad de confirmar el dominio al azar de 1/3 a 1/9.
- «Trae tu ejercicio» para ecuaciones `ax + b = cx + d`.
- **Video animado de cada lección:** las 80 lecciones tienen un video propio, animado y narrado, con subtítulos y metáforas visuales (la balanza y la bolsa misteriosa, el ascensor de los enteros, la cabra del círculo, las baldosas de Pitágoras…). Se guarda en R2 y se sirve desde el mismo sitio (`/media/…`), así que no depende de YouTube ni carga nada de terceros. Tiene prioridad sobre el video de YouTube que defina el catálogo y sigue las mismas reglas de dónde aparece.
- **Videos de YouTube opcionales** por lección, con tramo de inicio y fin. Aparecen en la lección inicial y en la segunda pista de las tres primeras fases; nunca en el desafío de autonomía ni en los repasos, donde se confirma el dominio. Hasta que el estudiante pulsa ▶ la página no hace ninguna petición a Google (ni siquiera la miniatura); luego se usa `youtube-nocookie.com`. Si YouTube está bloqueado, la lección funciona igual y se ofrece un enlace directo. Ver el video queda registrado (`watched`), no cuenta para el dominio, y el apoderado ve cuántos videos vio. Las lecciones con video llevan la etiqueta 🎬 en la ruta.

## Cuentas, familia y catálogo

El acceso ofrece **Entrar** (con correo o usuario), **Crear cuenta** y **Probar demo** (sin registro, 24 horas y solo en el navegador).

- **Estudiantes de 14 años o más** crean su cuenta con correo, confirmando su edad.
- **Menores de 14 años:** su **apoderado** crea su propia cuenta y, desde «Mi familia», la del menor, con usuario y contraseña, sin correo. Así queda registrado el consentimiento del apoderado (Ley 21.719).
- **Vincular a un estudiante mayor:** el estudiante genera en «Mi familia» un código de un solo uso que vence en 24 horas, y el apoderado lo ingresa.
- **El apoderado ve** por estudiante: lecciones completadas y dominadas, ejercicios y aciertos de los últimos 7 días, videos vistos y última actividad. No ve notas ni fotos. Puede cambiar la contraseña de los menores cuya cuenta creó (cierra sus sesiones; un estudiante con cuenta propia la recupera con su código), desvincular a un estudiante mayor o eliminar la cuenta de un menor que creó.
- **Recuperar la contraseña sin correo:** al registrarse se muestra una sola vez un código de recuperación (`XXXX-XXXX-XXXX`) para copiar o descargar. Con él se crea una contraseña nueva en «¿Olvidaste tu contraseña?»; se cierran las demás sesiones y se entrega un código nuevo. Las cuentas de menores se recuperan a través del apoderado.
- **Progreso sincronizado:** se guarda en el navegador (clave `socatres.v1.<id>`) y en el servidor. Entre dispositivos se fusiona: lecciones completadas, intentos, notas y videos se suman; el dominio, los repasos, el curso y la meta se toman del dispositivo con la actividad más reciente. Los intentos de más de 30 días (o más allá de los 2 000 más recientes) se resumen en días de práctica, aciertos y última práctica por lección, así el progreso no crece sin límite. Las fotos se guardan en una clave aparte (`…photos`): si el navegador se queda sin espacio, se pierde la foto nueva y se avisa, pero nunca el progreso.
- **Las fotos no salen del dispositivo:** el cliente las quita antes de sincronizar y el servidor rechaza cualquier foto.
- **Catálogo central:** el mantenedor («Contenido») solo aparece para las cuentas cuyo correo está en `ADMIN_EMAILS`. Cada cambio guardado se publica para todos, incluida la demo. Los clientes lo reciben al abrir la app o al volver a ella, y guardan una copia para usarla sin conexión.
- **Mis datos:** borrar el progreso lo elimina aquí y en la cuenta. «Eliminar mi cuenta» borra usuario, sesiones, progreso, vínculos y recordatorios; si es un apoderado, también las cuentas de menores que creó.

### Seguridad

- `public/_headers` aplica Content-Security-Policy (`script-src 'self'`, sin scripts en línea; estilos solo como atributo; iframes solo de `youtube-nocookie.com`), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` y `Permissions-Policy`. Si agregas un recurso externo, añade su origen a la política.
- Contraseñas con PBKDF2-SHA-256 (100 000 iteraciones, sal por usuario), mínimo 8 caracteres.
- Sesión en cookie `HttpOnly; SameSite=Lax` (y `Secure` en HTTPS) de 30 días. En la base solo se guarda el hash SHA-256 del token.
- Las peticiones que modifican datos exigen `Content-Type: application/json`; junto con `SameSite=Lax`, eso bloquea peticiones forjadas desde otros sitios.
- El login responde igual, y con el mismo costo, exista o no el correo.
- El rol se valida en el servidor (`student` o `parent`); cualquier otro valor se registra como estudiante. Registrarse como estudiante exige confirmar 14 años o más.
- Los permisos de administración se deciden en el servidor con `ADMIN_EMAILS`; lo que guarda el navegador solo sirve para mostrar u ocultar el menú.
- Del código de recuperación solo se guarda su hash.
- Recordatorios: el servidor solo envía avisos a los servicios de push conocidos (Google, Mozilla, Apple, Microsoft), así que no se puede usar para hacer peticiones a cualquier URL. Los avisos van sin contenido: el texto lo pide el service worker a `/api/reminder` con la sesión del usuario, así que ningún dato del estudiante pasa por esos servicios.
- **Pendiente:** limitar intentos de login. Se recomienda una regla de *rate limiting* de Cloudflare sobre `/api/auth/*`.

### API

| Método y ruta | Descripción |
|---|---|
| `POST /api/auth/register` | `{name, email, password, role: "student" \| "parent", age14}` → cuenta, sesión y `recoveryCode` |
| `POST /api/auth/login` | `{login (correo o usuario), password}` |
| `POST /api/auth/recover` | `{login, code, password}` → nueva contraseña y nuevo código |
| `POST /api/auth/logout` · `GET /api/me` · `DELETE /api/me` | Cerrar sesión · usuario actual (`isAdmin`) · eliminar cuenta |
| `GET /api/progress` · `PUT /api/progress` | Progreso (`{state}`, máximo 256 KB, sin fotos) |
| `GET /api/family` | Apoderado: estudiantes con su resumen · estudiante: nombres de sus apoderados |
| `POST /api/family/children` | Apoderado crea la cuenta de un menor `{name, username, password}` |
| `POST /api/family/link-code` · `POST /api/family/link` | Estudiante genera código · apoderado lo usa `{code}` |
| `POST /api/family/children/:id/password` · `DELETE /api/family/children/:id` | Cambiar contraseña · desvincular o eliminar |
| `GET /api/catalog` · `PUT /api/catalog` | Catálogo central (lectura pública · publicar solo administración, máximo 2 MB) |
| `GET /api/push/key` · `PUT /api/push` · `DELETE /api/push` | Clave VAPID · suscribir `{endpoint, hour, timeZone}` · anular |
| `GET /api/reminder` | Texto del recordatorio según la racha y los repasos del usuario |

## Publicación

La base D1 `socatres` ya existe y su ID está en `wrangler.toml`. Para publicar una versión nueva:

1. `npm run db:migrate` aplica las migraciones pendientes en la base remota.
2. `npm run deploy` publica `public/` y `functions/` en `https://socatres.pages.dev`.

Configuración que se hace una sola vez:

- **Administración:** `npx wrangler pages secret put ADMIN_EMAILS --project-name=socatres` (correos separados por coma).
- **Recordatorios:**
  1. `node scripts/vapid-keys.mjs` genera el par de claves.
  2. La **pública** va en `VAPID_PUBLIC_KEY` de `wrangler.toml` y de `workers/reminders/wrangler.toml`.
  3. La **privada** se guarda como secreto del worker: `npx wrangler secret put VAPID_PRIVATE_KEY -c workers/reminders/wrangler.toml`.
  4. El worker se publica con `npx wrangler deploy -c workers/reminders/wrangler.toml` y corre cada hora.

Si cambias las claves, los dispositivos suscritos deben volver a activar el recordatorio.

## Mantenedor de contenido

Abre **Contenido** en el menú lateral (`#contenido`, solo administración). Cada cambio guardado se publica para todos. Permite crear y editar lecciones (con materia, curso, video opcional y errores frecuentes por ejercicio), previsualizar ejercicios, publicar o retirar lecciones de la ruta, buscar y reordenar. Cada lección tiene cuatro ejercicios con respuesta numérica y un repaso independiente.

### Cargar desde Excel / CSV

1. Descarga **Plantilla para Excel (CSV)** desde el mantenedor.
2. Completa una fila por ejercicio. Cada `leccion_id` necesita cuatro filas de tipo `ejercicio` (orden 1–4) y una de tipo `repaso`.
3. Guarda como **CSV UTF-8** y usa **Subir CSV o JSON**. No se admite `.xlsx`.
4. Revisa la vista previa y confirma. Las lecciones importadas entran como borradores; usa **Publicar** para mostrarlas en la ruta.

Columnas: `leccion_id`, `titulo`, `descripcion`, `concepto`, `ejemplo`, `tipo`, `orden`, `expresion`, `respuesta`, `instruccion`, `pista`, `explicacion` y, opcionales, `materia` (`matematica` o `lenguaje`), `curso` (`7b` o «7° Básico»), `video_url`, `video_titulo`, `video_inicio`, `video_fin` y `errores` (por ejemplo `−7: Revisa el signo. | 12: Falta dividir entre 2.`). Escribe los tiempos del video en segundos (`90`) o como `1m30s`: Excel convierte «1:30» en una hora del día. Sin `materia` y `curso`, se infieren del título. Se admiten separadores coma, punto y coma o tabulación, celdas entre comillas y saltos de línea dentro de celdas. Las respuestas pueden ser decimales o fracciones.

La importación comprueba estructura, identificadores, ejercicios faltantes, respuestas numéricas, materia y curso. En modo **Añadir** no sobrescribe lecciones existentes. **Restaurar catálogo** reemplaza el contenido tras una advertencia. Límite: 2 MB por archivo y 200 lecciones por catálogo. Cada navegador guarda una copia del catálogo en `socatres.content.v1`.

## Límites de esta versión

- No hay IA conectada ni OCR: el procedimiento en foto no se evalúa, solo el resultado final.
- La recuperación de contraseña por correo necesita un dominio propio y un servicio de envío; por ahora se recupera con el código o a través del apoderado.
- Faltan límites de intentos en `/api/auth/*`: configura una regla de *rate limiting* en Cloudflare (Security → WAF).
- Los videos pueden dejar de estar disponibles si su canal los borra o los hace privados; conviene revisarlos periódicamente desde la vista previa del mantenedor.
- Si se borra el progreso en un dispositivo mientras otro sin conexión conserva el anterior, al reconectar ese otro dispositivo las lecciones completadas vuelven a sumarse.
- El recordatorio usa horas en punto; en zonas horarias con media hora se envía en la hora local más cercana siguiente.
- Antes de abrirla al público, revisa con asesoría legal la política de privacidad y el consentimiento parental según la Ley 21.719.
