// Metáfora: la base es el ladrillo que se repite.
export default {
  id: "logaritmo-base",
  title: "La base de un logaritmo",
  grade: "2° Medio",
  beats: [
    {
      say: "En logaritmo en base dos de ocho, la base es el dos: el número que se multiplica una y otra vez, como un ladrillo que se repite.",
      visual: { type: "lines", lines: ["log₂ 8", "2 · 2 · 2 = 8", "la base es {{2}}"] },
    },
    {
      say: "La base puede ser casi cualquier número. En base cuatro: cuatro por cuatro por cuatro es sesenta y cuatro, así que el logaritmo en base cuatro de sesenta y cuatro es tres.",
      visual: { type: "lines", lines: ["4 · 4 · 4 = 64", "log₄ 64 = {{3}}"] },
    },
    {
      say: "Pero la base no puede ser uno: uno por uno siempre da uno, y nunca llegaría a otro número. Y tiene que ser positiva.",
      visual: { type: "cards", items: [{ icon: "🚫", title: "Base 1 no sirve", text: "1 · 1 · 1… siempre da 1" }] },
    },
    {
      say: "La base más usada es diez, porque contamos de diez en diez. Su logaritmo cuenta los ceros: logaritmo de cien mil es cinco.",
      visual: { type: "lines", lines: ["log 100.000", "= cuenta los ceros", "= {{5}}"] },
    },
    {
      say: "Con números menores que uno, el logaritmo es negativo. Cero coma cero uno es un centésimo, diez a la menos dos: su logaritmo es menos dos.",
      visual: { type: "lines", lines: ["0,01 = 1/100 = 10⁻²", "log 0,01 = {{−2}}"] },
    },
    {
      say: "Si la calculadora solo tiene base diez, cambia de base dividiendo: logaritmo en base dos de ocho es logaritmo de ocho dividido en logaritmo de dos. Cero coma nueve cero tres dividido en cero coma tres cero uno: tres.",
      visual: { type: "lines", lines: ["log₂ 8 = log 8 ÷ log 2", "= 0,903 ÷ 0,301", "= {{3}}"] },
    },
    {
      say: "Recuerda: la base es el número que se repite. La base diez cuenta ceros. Y para cambiar de base, divide los logaritmos en base diez.",
      visual: {
        type: "list",
        title: "La base de un logaritmo",
        items: ["🧱 Base: el número que se repite.", "🔟 Base 10: cuenta los ceros.", "🚫 La base no puede ser 1.", "➗ Cambio de base: log a ÷ log b."],
      },
    },
  ],
};
