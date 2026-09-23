# socatres

Espacio de aprendizaje de matemática y comprensión lectora alineado con las Bases Curriculares (MINEDUC). El frontend es estático, sin compilación y con módulos JavaScript. El backend usa Cloudflare Pages Functions con una base D1.

## Ejecutar

```sh
npm test                 # 62 pruebas (Node 22+)
npm run db:migrate:local # una vez: crea la base D1 local
npm run dev              # sitio + API en http://localhost:8788
npm run dev:static       # solo el sitio, sin cuentas (puerto 3000)
```

`npm run dev` y el deploy usan `wrangler` (`npx wrangler …` si no está instalado).

## Estructura

| Carpeta | Contenido |
|---|---|
| `public/` | Lo que se publica: páginas, estilos y módulos del cliente. |
| `functions/` | API (`/api/*`). `api/[[path]].js` delega en `_lib/router.js`. |
| `migrations/` | Esquema D1. |
| `test/` | Pruebas con `node --test`; las del backend corren sobre SQLite real con el mismo esquema. |
| `docs/` | Progresión curricular, datos de referencia, capturas y la landing anterior. No se publica. |

Módulos del cliente (`public/`):

- `learning.js`: lecciones iniciales, validación numérica, resolución lineal, estado, fusión entre dispositivos y cursos (`GRADES`).
- `curriculum.js`: lecciones de la ampliación curricular.
- `generators.js`: ejercicios generados por lección y nivel.
- `video.js`: enlaces de YouTube, tiempos y reproductor.
- `content.js`, `csv.js`, `admin.js`: catálogo, importación y exportación CSV, mantenedor.
- `app.js`: navegación, lecciones, repasos, cuaderno, sincronización.
- `ui.js`, `units.js`, `stats.js`, `dialogs.js`: utilidades de interfaz, unidades de la ruta, métricas de motivación y diálogos.
- `class-view.js`: «Mi clase».
- `auth.js`, `session.js`, `api.js`, `landing.js`: sesión, verificación con el servidor y cliente de la API.

## Qué incluye

- Diagnóstico inicial, ruta por unidades y filtros por materia y curso (5° Básico a 1° Medio).
- 26 lecciones con cuatro ejercicios, repaso independiente, lección conceptual previa y pistas escalonadas.
- **Metadatos explícitos:** cada lección declara `subject` (`matematica`, `lenguaje`) y `grade` (`5b`, `6b`, `7b`, `8b`, `1m`, `2m`). Los filtros y distintivos usan esos campos, no el título. Los catálogos y CSV anteriores se migran: el curso se infiere del prefijo del título («7° Básico · …») y el prefijo se quita.
- **Ejercicios generados:** 13 lecciones de matemática tienen generador. La primera vez se usan los ejercicios curados. Al volver a practicar una lección completada y en cada repaso, se generan ejercicios nuevos del mismo tipo y dificultad, con respuesta, pista y explicación calculadas. Las lecciones sin generador (lectura, círculos, probabilidad, modelamiento) mantienen su contenido curado.
- Validación de respuestas equivalentes (enteros, decimales, fracciones y `x = …`), resolución a mano con foto comprimida en el navegador y «Mi cuaderno».
- Separación entre completar y dominar: el dominio se confirma en un repaso sin ayuda al menos 24 horas después.
- «Trae tu ejercicio» para ecuaciones `ax + b = cx + d`.
- **Videos de YouTube opcionales** por lección, con tramo de inicio y fin. Aparecen en la lección inicial y en la segunda pista de las tres primeras fases; nunca en el desafío de autonomía ni en los repasos, donde se confirma el dominio. Hasta que el estudiante pulsa ▶ la página no hace ninguna petición a Google (ni siquiera la miniatura); luego se usa `youtube-nocookie.com`. Si YouTube está bloqueado, la lección funciona igual y se ofrece un enlace directo. Ver el video queda registrado (`watched`), no cuenta para el dominio, y el profesor ve cuántos videos vio cada estudiante. Las lecciones con video llevan la etiqueta 🎬 en la ruta.

## Cuentas, progreso y clases

El acceso ofrece **Entrar**, **Crear cuenta** (estudiante o profesor/a) y **Probar demo** (estudiante o profesor, sin registro, 24 horas y solo en el navegador).

- **Progreso sincronizado:** con cuenta, el progreso se guarda en el navegador (clave `socatres.v1.<id>`) y se envía al servidor en segundo plano. Al entrar desde otro dispositivo se fusiona: lecciones completadas, intentos y notas se suman; el dominio y los repasos se toman del dispositivo con la actividad más reciente. Sin conexión se sigue practicando y se sincroniza al volver. Al crear una cuenta se conserva lo practicado en la demo de ese navegador.
- **Las fotos no salen del dispositivo:** el cliente las quita antes de sincronizar y el servidor rechaza cualquier foto.
- **Clases:** el profesor crea una clase y comparte su código de 6 caracteres. El estudiante lo ingresa en «Mi clase». El profesor ve, por estudiante, lecciones completadas y dominadas, videos vistos, intentos y aciertos de los últimos 7 días y última actividad. No ve notas, fotos ni correos. Un profesor solo accede a sus propias clases y puede retirar estudiantes.
- **Mantenedor de contenido:** visible solo para profesores (cuenta o demo). El catálogo sigue guardándose en el navegador; todavía no se publica a las clases.
- **Mis datos:** borrar el progreso lo elimina aquí y en la cuenta. «Eliminar mi cuenta» borra usuario, sesiones, progreso, clases y membresías.

### Seguridad

- Contraseñas con PBKDF2-SHA-256 (100 000 iteraciones, sal por usuario), mínimo 8 caracteres.
- Sesión en cookie `HttpOnly; SameSite=Lax` (y `Secure` en HTTPS) de 30 días. En la base solo se guarda el hash SHA-256 del token.
- Las peticiones que modifican datos exigen `Content-Type: application/json`; junto con `SameSite=Lax`, eso bloquea peticiones forjadas desde otros sitios.
- El login responde igual, y con el mismo costo, exista o no el correo.
- El rol se valida en el servidor (`student` o `teacher`); cualquier otro valor se registra como estudiante.
- **Pendiente:** limitar intentos de login. Se recomienda una regla de *rate limiting* de Cloudflare sobre `/api/auth/*`.

### API

| Método y ruta | Descripción |
|---|---|
| `POST /api/auth/register` | `{name, email, password, role}` → crea la cuenta e inicia sesión |
| `POST /api/auth/login` · `POST /api/auth/logout` | Inicia o cierra sesión |
| `GET /api/me` · `DELETE /api/me` | Usuario actual · eliminar cuenta |
| `GET /api/progress` · `PUT /api/progress` | Progreso (`{state}`, máximo 256 KB, sin fotos) |
| `GET /api/classes` · `POST /api/classes` | Clases propias (profesor) o a las que se unió (estudiante) · crear clase |
| `POST /api/classes/join` | `{code}` → unirse (estudiante) |
| `GET /api/classes/:id` | Avance de la clase (solo su profesor) |
| `DELETE /api/classes/:id/students/:studentId` | Retirar a un estudiante |

## Publicación

Para el primer despliegue con backend:

1. `npx wrangler d1 create socatres` y copia el `database_id` en `wrangler.toml`.
2. `npm run db:migrate` aplica el esquema en la base remota.
3. En Cloudflare Pages, vincula la base D1 al proyecto `socatres` con el nombre `DB` (Settings → Bindings), o deja que `wrangler.toml` lo configure.
4. `npm run deploy` publica `public/` y `functions/` en `https://socatres.pages.dev`.

Sin el paso 1 el sitio funciona, pero las cuentas responden «El servicio de cuentas no está disponible» y solo queda la demo.

## Mantenedor de contenido

Abre **Contenido** en el menú lateral (`#contenido`, solo profesores). Permite crear y editar lecciones (con materia, curso y video opcional), previsualizar ejercicios, publicar o retirar lecciones de la ruta, buscar y reordenar. Cada lección tiene cuatro ejercicios con respuesta numérica y un repaso independiente.

### Cargar desde Excel / CSV

1. Descarga **Plantilla para Excel (CSV)** desde el mantenedor.
2. Completa una fila por ejercicio. Cada `leccion_id` necesita cuatro filas de tipo `ejercicio` (orden 1–4) y una de tipo `repaso`.
3. Guarda como **CSV UTF-8** y usa **Subir CSV o JSON**. No se admite `.xlsx`.
4. Revisa la vista previa y confirma. Las lecciones importadas entran como borradores; usa **Publicar** para mostrarlas en la ruta.

Columnas: `leccion_id`, `titulo`, `descripcion`, `concepto`, `ejemplo`, `tipo`, `orden`, `expresion`, `respuesta`, `instruccion`, `pista`, `explicacion` y, opcionales, `materia` (`matematica` o `lenguaje`), `curso` (`7b` o «7° Básico»), `video_url`, `video_titulo`, `video_inicio` y `video_fin`. Escribe los tiempos del video en segundos (`90`) o como `1m30s`: Excel convierte «1:30» en una hora del día. Sin `materia` y `curso`, se infieren del título. Se admiten separadores coma, punto y coma o tabulación, celdas entre comillas y saltos de línea dentro de celdas. Las respuestas pueden ser decimales o fracciones.

La importación comprueba estructura, identificadores, ejercicios faltantes, respuestas numéricas, materia y curso. En modo **Añadir** no sobrescribe lecciones existentes. **Restaurar catálogo** reemplaza el contenido tras una advertencia. Límite: 1 MB por archivo y 100 lecciones por catálogo. El catálogo se guarda en `socatres.content.v1`.

## Límites de esta versión

- No hay IA conectada ni OCR: el procedimiento en foto no se evalúa, solo el resultado final.
- El catálogo del mantenedor es local y no se comparte con las clases.
- Los videos pueden dejar de estar disponibles si su canal los borra o los hace privados; conviene revisarlos periódicamente desde la vista previa del mantenedor.
- La demo no es una barrera de seguridad; el mantenedor en modo demo solo afecta ese navegador.
- Si se borra el progreso en un dispositivo mientras otro sin conexión conserva el anterior, al reconectar ese otro dispositivo las lecciones completadas vuelven a sumarse.
- Si un estudiante es menor de 14 años, su cuenta debe crearse con su apoderado. Antes de usarlo con colegios, revisa las obligaciones de la Ley 21.719 de protección de datos personales.
