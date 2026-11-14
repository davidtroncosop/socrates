// Desarrollo a mano con foto: el estudiante resuelve en papel (una servilleta
// sirve) y le saca una foto. Con cuenta, Gemini (vía OpenRouter) revisa los
// pasos de toda foto de matemática (functions/_lib/work-review.js).
//
// `required` decide cuándo la foto es obligatoria para comprobar:
//   "challenge"  solo en el desafío final de cada lección (por defecto): se
//                pide donde se confirma que lo hace solo, sin frenar cada
//                ejercicio. En el resto es opcional.
//   true         en todos los ejercicios de matemática.
//   false        nunca.
export const WORK_PHOTO = { required: "challenge" };
