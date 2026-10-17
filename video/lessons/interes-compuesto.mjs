// Metáfora: la bola de nieve: el interés se suma y también gana interés.
export default {
  id: "interes-compuesto",
  title: "Interés compuesto",
  grade: "4° Medio",
  beats: [
    {
      say: "Con interés compuesto, el interés de cada año se suma al ahorro, y el año siguiente también gana interés. Como una bola de nieve que crece rodando.",
      visual: { type: "cards", items: [{ icon: "⛄", title: "Interés compuesto", text: "El interés también gana interés" }] },
    },
    {
      say: "Paso uno: pasa la tasa a factor. Diez por ciento es multiplicar por uno coma diez.",
      visual: { type: "lines", lines: ["Paso 1: 10 % → · {{1,10}}"] },
    },
    {
      say: "Paso dos: multiplica por el factor una vez por cada año. Cien mil por uno coma diez es ciento diez mil. Y otra vez: ciento veintiún mil.",
      visual: { type: "lines", lines: ["Paso 2:", "100.000 · 1,10 = 110.000", "110.000 · 1,10 = {{121.000}}"] },
    },
    {
      say: "Paso tres: el interés ganado es el total menos lo que depositaste. Ciento veintiún mil menos cien mil: veintiún mil.",
      visual: { type: "lines", lines: ["Paso 3: 121.000 − 100.000", "= {{21.000}} de interés"] },
    },
    {
      say: "Con interés simple habrías ganado veinte mil. El compuesto da más, porque el segundo año el diez por ciento se calcula sobre ciento diez mil.",
      visual: { type: "bars", ymax: 140, ystep: 20, series: ["Simple", "Compuesto"], bars: [{ label: "inicio", values: [100, 100] }, { label: "año 1", values: [110, 110] }, { label: "año 2", values: [120, 121] }, { label: "año 3", values: [130, 133.1] }] },
      eq: "en miles de $",
    },
    {
      say: "Ojo: con una deuda pasa lo mismo, pero en tu contra. Si no pagas, el interés se suma a lo que debes.",
      visual: { type: "cards", items: [{ icon: "⚠️", title: "Las deudas también se componen", text: "$50.000 al 20 %: 60.000 → 72.000" }] },
      eq: "",
    },
    {
      say: "Recuerda: pasa la tasa a factor, multiplica una vez por cada período y, para el interés, resta el capital. La fórmula es capital por uno más la tasa, elevado al tiempo.",
      visual: {
        type: "list",
        title: "Interés compuesto",
        items: ["1️⃣ Factor: 10 % → 1,10.", "2️⃣ Multiplica una vez por período.", "3️⃣ Interés = total − capital.", "📐 Capital · (1 + tasa)ᵗ."],
      },
    },
  ],
};
