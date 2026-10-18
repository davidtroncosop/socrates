// Versión vertical (9:16) del promocional: misma narración que
// promo/socatres.mjs (mismo `say` paso a paso), con escenas pensadas para el
// celular: capturas de la app en un teléfono que se desplaza suavemente.
import base from "./socatres.mjs";

// `h` es el alto en píxeles de la captura (todas miden 1170 de ancho).
const phone = (src, h, scroll = [0, 0.4]) => ({ type: "phone", src, h, scroll });

const visuals = [
  { type: "cards", items: [{ icon: "😣", title: "Frustración" }, { icon: "⏳", title: "Tareas eternas" }, { icon: "😢", title: "Lágrimas" }] },
  { type: "hero", icon: "🦉", title: "Paso a paso", text: "A su ritmo, sin apuro y sin miedo a equivocarse." },
  phone("ruta-celular.png", 7800, [0, 0.42]),
  { type: "balance", x: 5, left: { bags: 1, balls: 4 }, right: { balls: 9 }, eq: "x + 4 = 9" },
  phone("ejercicio-celular.png", 2553, [0.1, 0.42]),
  undefined, // sigue el mismo teléfono: «puede escuchar cada enunciado»
  phone("resumen-celular.png", 2904, [0.05, 0.5]),
  phone("premios-celular.png", 2433, [0, 0.3]),
  { type: "list", title: "socatres", items: ["📚 Bases Curriculares, de 3° Básico a 4° Medio", "📱 En el celular o el computador", "🦉 Practica con autonomía"] },
  { type: "end", title: "socatres", text: "Prueba gratis en", url: "socatres.pages.dev", tagline: "El siguiente paso lo entiendes tú." },
];

export default {
  ...base,
  beats: base.beats.map(({ visual, eq, ...beat }, i) => ({ ...beat, ...(visuals[i] !== undefined ? { visual: visuals[i] } : {}) })),
};
