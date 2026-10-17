// Metáfora: acercarse a una puerta sin cruzarla.
export default {
  id: "limites",
  title: "Límites",
  grade: "Electivo",
  beats: [
    {
      say: "El límite pregunta a dónde se acerca una función cuando equis se acerca a un número. Como caminar hacia una puerta, cada vez más cerca.",
      visual: { type: "cards", items: [{ icon: "🚪", title: "Límite", text: "¿A qué valor se acerca f(x)?" }] },
    },
    {
      say: "Si la función no tiene problemas, basta reemplazar. Dos equis más uno, con equis acercándose a tres, se acerca a siete.",
      visual: { type: "lines", lines: ["lím (x→3) de 2x + 1", "= 2 · 3 + 1 = {{7}}"] },
    },
    {
      say: "A veces reemplazar da cero dividido en cero. Equis al cuadrado menos cuatro, dividido en equis menos dos, con equis igual dos.",
      visual: { type: "lines", lines: ["(x² − 4) ÷ (x − 2)", "con x = 2: 0 ÷ 0 ⚠️"] },
    },
    {
      say: "Factoriza: equis al cuadrado menos cuatro es equis menos dos por equis más dos. Se cancela equis menos dos y queda equis más dos, que se acerca a cuatro.",
      visual: { type: "lines", lines: ["(x − 2)(x + 2) ÷ (x − 2)", "= x + 2", "→ {{4}}"] },
    },
    {
      say: "También hay límites al infinito. Uno dividido en equis, cuando equis crece y crece, se acerca a cero sin llegar nunca.",
      visual: { type: "curve", f: { kind: "inv", k: 1 }, window: [0, 10, -0.2, 2] },
      eq: "lím (x→∞) de 1/x = 0",
    },
    {
      say: "Recuerda: primero intenta reemplazar. Si da cero dividido en cero, factoriza y simplifica. Y uno partido en algo muy grande se acerca a cero.",
      visual: {
        type: "list",
        title: "Límites",
        items: ["🔁 Primero reemplaza.", "⚠️ 0 ÷ 0: factoriza y simplifica.", "♾️ 1/x → 0 cuando x crece."],
      },
      eq: "",
    },
  ],
};
