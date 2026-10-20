// Reels verticales (9:16) de lecciones. Cada uno reutiliza el guion de la
// lección con un id propio, para narrarlo con otra voz.
import equations from "./equations.mjs";
import equationsCorto from "./equations-corto.mjs";
import balanza from "./equations-balanza.mjs";
import zapatos from "./equations-zapatos.mjs";

export const reels = [equations, equationsCorto, balanza, zapatos];

// Dirección del cierre de cada reel: cambiarla cuando esté el dominio propio.
export const REEL_URL = "socatres.pages.dev";
