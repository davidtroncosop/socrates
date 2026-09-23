# socatres

Espacio de aprendizaje de matemáticas y comprensión lectora. Interfaz estática sin proceso de compilación, con módulos JavaScript y progreso local.

## Ejecutar

```sh
npm run dev
npm test
```

El servidor utiliza el puerto 3000. `npm run dev` requiere que `serve` esté disponible o acceso a npm para descargarlo.

## Incluido

- Diagnóstico inicial que orienta el punto de partida en la ruta curricular.
- Filtros por materia (**Todas**, **📐 Matemática**, **📖 Lenguaje**) y por curso (**Todos**, **7° Básico**, **8° Básico**, **1° Medio**), con distintivos visuales de asignatura y desglose de avance.
- Doce lecciones de cuatro ejercicios alineadas directamente con los Objetivos de Aprendizaje (OA) de las **Bases Curriculares de Chile (MINEDUC)**:
  - **7° Básico**:
    1. **MA07 OA 09:** Ecuaciones lineales de la forma $ax + b = c$, operaciones inversas y principio de la balanza (`equations`).
    2. **MA07 OA 01:** Suma y resta de números enteros en $\mathbb{Z}$, valor absoluto y signos (`enteros`).
    3. **MA07 OA 07:** Reducción de términos semejantes y coeficientes numéricos (`semejantes`).
    4. **MA07 OA 08:** Proporcionalidad directa, constante de cambio $k$ y regla de tres (`proporciones`).
  - **8° Básico**:
    5. **MA08 OA 08:** Propiedad distributiva $a(x + b) = c$, paréntesis y signos en $\mathbb{Z}$ (`signs`).
    6. **MA08 OA 08:** Ecuaciones con la incógnita en ambos lados: $ax + b = cx + d$ (`both`).
    7. **MA08 OA 08:** Ecuaciones con coeficientes racionales en $\mathbb{Q}$ y decimales (`racionales`).
    8. **MA08 OA 08:** Ecuaciones complejas con distribución y reducción combinada (`combinadas`).
    9. **MA08 OA 02:** Potencias de base entera y exponente natural, multiplicación y división (`potencias`).
    10. **MA08 OA 07:** Noción de función afín $f(x) = mx + n$, tasa de cambio y valor inicial (`funcion`).
  - **1° Medio**:
    11. **MA01 OA 03:** Productos notables: cuadrado de binomio y suma por su diferencia (`notables`).
    12. **MA01 OA 04 / MA08 OA 08:** Modelamiento algebraico y problemas cotidianos (`problemas`).
- **Lección inicial conceptual previa a los ejercicios:** antes de resolver, el estudiante ve una pantalla introductoria con el concepto clave explicado pedagógicamente, la analogía de la balanza en equilibrio (para matemáticas) o la estrategia de lectura (para lenguaje), un ejemplo guiado paso a paso y la indicación de preparar su cuaderno.
- **Pistas y ayudas con enfoque pedagógico:** en el panel lateral y al solicitar pistas, se enseña el porqué de cada paso, enfatizando explícitamente el **Principio de la Balanza** (en una ecuación hay que mantener el equilibrio aplicando siempre la misma operación a ambos lados) y la comprobación final.
- Validación numérica de respuestas equivalentes (enteros, decimales, fracciones y `x = …`).
- **Resolución a mano y subida de fotos:** el estudiante resuelve en su cuaderno o en papel con lápiz, toma o sube una foto de su desarrollo (comprimida automáticamente en el navegador con Canvas para optimizar el almacenamiento local) y guarda su procedimiento en el cuaderno.
- Procedimientos, fotos y notas guardados en «Mi cuaderno»; el procedimiento no se evalúa automáticamente por OCR, sino que se valida el resultado final mientras se conserva el registro visual de los pasos.
- Desbloqueo de lecciones y separación entre completar y dominar.
- Repaso de errores y repaso programado al día siguiente. El dominio solo se confirma en práctica independiente posterior, transcurridas al menos 24 horas desde el último intento de esa habilidad.
- Práctica de ecuaciones propias en «Trae tu ejercicio» de la forma `ax + b = cx + d`, con posibilidad de adjuntar la foto del ejercicio del cuaderno.
- Progreso guardado en localStorage y eliminación desde «Mis datos».
- Diseño adaptable y controles con etiquetas y foco visible.

## Archivos

- `index.html`, `landing.css`, `landing.js`: landing pública y diálogo de acceso demo.
- `aprender.html`: estructura de la aplicación.
- `auth.js`, `session.js`: sesión local de prueba, caducidad y cierre de sesión.
- `styles.css`: estilos y adaptación a móvil.
- `learning.js`: contenido, validación numérica, resolución lineal, compresión de imágenes y lectura de estado.
- `app.js`: navegación, lección inicial conceptual, captura/subida de fotos de desarrollo a mano, cuaderno y recorridos de aprendizaje.
- `learning.test.js`, `app.test.js`: pruebas de cálculo, recuperación del estado, compresión y recorridos mediante un adaptador mínimo de DOM.
- `landing-original.html`: respaldo de la página anterior, excluido del despliegue.

## Límites de esta versión

No hay IA conectada, OCR, cuentas reales, sincronización, pagos, interpretación automática del procedimiento ni arena. La compresión de fotos se ejecuta del lado del cliente en un `<canvas>` in-memory a ~800px para permitir almacenar decenas de ejercicios en `localStorage` sin rebasar la cuota de 5 MB. La personalización usa resultados y ayudas por habilidad, no diagnóstico semántico del error. Los ejercicios son locales y predefinidos; los repasos tienen un ejercicio alternativo por habilidad. Las notas y fotos permanecen en este navegador. Las fuentes de Google son opcionales y existe una fuente de respaldo.

La lógica se verifica con `npm test` (32 pruebas). La landing y el acceso demo se verificaron en Chromium: entrada, recarga, salida, redirección sin sesión y ausencia de desbordamiento horizontal a 320, 390, 768 y 1440 píxeles. Se inspeccionaron capturas de escritorio, móvil y diálogo de acceso.

## Publicación

El comando `npm run deploy` publica en Cloudflare Pages usando el proyecto `socatres` (disponible en `https://socatres.pages.dev`).

## Mantenedor de contenido

Abre **Contenido** en el menú lateral (`#contenido`). Permite crear y editar lecciones, previsualizar ejercicios, publicar o retirar contenido de la ruta, buscar y cambiar el orden. Cada lección contiene cuatro ejercicios y un repaso independiente. Las respuestas son numéricas; el autor debe revisar su exactitud pedagógica.

### Cargar desde Excel / CSV

1. Descarga **Plantilla para Excel (CSV)** desde el mantenedor.
2. Ábrela en Excel y completa una fila por ejercicio. Cada `leccion_id` debe tener cuatro filas de tipo `ejercicio` con orden 1–4, y una fila de tipo `repaso`.
3. Guarda como **CSV UTF-8** y usa **Subir CSV o JSON**. No se admite `.xlsx` directamente.
4. Revisa la vista previa y confirma la importación. Las lecciones CSV entran como borradores; usa **Publicar** para mostrarlas en la ruta.

Columnas: `leccion_id`, `titulo`, `descripcion`, `concepto`, `ejemplo`, `tipo`, `orden`, `expresion`, `respuesta`, `instruccion`, `pista`, `explicacion`. Los datos generales de la lección pueden repetirse o aparecer solo en su primera fila. Se admiten separadores coma, punto y coma o tabulación, celdas entre comillas y saltos de línea dentro de celdas. Las respuestas pueden escribirse como decimales o fracciones.

La importación comprueba estructura, identificadores, ejercicios faltantes y respuestas numéricas. No sobrescribe lecciones existentes en el modo **Añadir**. Para recuperar un respaldo, selecciona **Restaurar catálogo** y revisa la advertencia de reemplazo antes de confirmar. El respaldo JSON conserva los estados de publicación; el CSV importa como borrador. Límite: 1 MB por archivo y 100 lecciones por catálogo.

**Exportar CSV** permite editar el catálogo en Excel; **Respaldo JSON** conserva el formato completo. Los cambios se almacenan en `socatres.content.v1` de localStorage (con soporte para el formato previo). El progreso se guarda por separado. Este mantenedor es local: no tiene autenticación, permisos de administrador ni publicación compartida entre dispositivos.

Módulos: `content.js` valida y persiste el catálogo; `csv.js` importa/exporta CSV; `admin.js` contiene el mantenedor. Las pruebas de catálogo y CSV se ejecutan con `npm test`. También se verificó la interacción de creación, edición, publicación e importación CSV con jsdom; esto no sustituye una revisión visual en navegador.

## Landing y acceso de prueba

Abre `/` y pulsa **Probar mi primera lección** → **Continuar con cuenta demo**. El espacio de aprendizaje está en `/aprender.html#ruta`. **Salir** cierra la sesión sin borrar el progreso. Los enlaces antiguos como `/#contenido` pasan por el acceso demo.

El diálogo simula la experiencia de acceso OAuth, pero **no implementa OAuth real**, no contacta con proveedores ni valida identidades. Usa una cuenta ficticia y una sesión local de 24 horas en `socatres.demo-session.v1`. No hay secretos, contraseñas ni tokens de proveedor. Esta sesión no es una barrera de seguridad ni protege el mantenedor; el progreso y catálogo siguen compartidos por navegador. Para OAuth real se necesita configurar un proveedor y validar sesiones en un backend.

`auth.test.js` verifica persistencia, caducidad, datos corruptos, almacenamiento bloqueado y cierre sin pérdida del progreso.


## Ampliación curricular (septiembre de 2026)

El catálogo inicial contiene **20 lecciones**. `curriculum.js` agrega ocho lecciones originales con cuatro ejercicios y un repaso independiente cada una:

- 7° básico: porcentajes (MA07 OA 04), círculo (MA07 OA 11) y probabilidad experimental (MA07 OA 18).
- 8° básico: aplicaciones del teorema de Pitágoras (MA08 OA 12).
- 7° básico: narraciones (LE07 OA 03), interpretación literaria (LE07 OA 07), argumentos (LE07 OA 08) y medios de comunicación (LE07 OA 09).

Cada lección conserva la URL del objetivo consultado en Currículum Nacional dentro de su concepto. Los textos y ejercicios son originales; trabajan aspectos de los OA, sin afirmar una cobertura completa ni reproducir guías oficiales. En comprensión lectora se responde con el número de alternativa (1–3); la justificación escrita es opcional y no se evalúa automáticamente.

Estas ocho lecciones se pueden abrir directamente. Al leer un catálogo anterior se incorporan una sola vez, conservando las lecciones existentes y su progreso. La marca `socatres.curriculum.2026-09` evita reponer lecciones eliminadas o retiradas después de la actualización. Se respeta un catálogo vacío y el límite de 100 lecciones. La importación/exportación CSV sigue siendo compatible.
