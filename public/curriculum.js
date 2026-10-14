// Actividades originales vinculadas a objetivos de Currículum Nacional.
export const curriculumLessons = [
  {
    "id": "porcentajes",
    "title": "Porcentajes en la vida diaria",
    "subject": "matematica",
    "grade": "7b",
    "description": "MA07 OA 04 · Partes de cada 100",
    "concept": "Por ciento significa de cada 100. El 25 % es 25 de cada 100: un cuarto. Para calcular un porcentaje, multiplica por el número y divide por 100. El 10 % es dividir por 10.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70515.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "El 25 % de 80 es 80 × 25 ÷ 100 = 20.",
    "status": "published",
    "questions": [
      [
        "10 % de 250",
        25,
        "Calcula la cantidad. Escribe solo el número.",
        "El 10 % es la décima parte.",
        "250 ÷ 10 = 25."
      ],
      [
        "35 de 100 casillas están pintadas.",
        35,
        "¿Qué porcentaje está pintado? Escribe sin %.",
        "Porcentaje significa por cada cien.",
        "35 de cada 100 equivale a 35 %."
      ],
      [
        "Una mochila cuesta $20 000 y tiene 15 % de descuento.",
        17000,
        "¿Cuál es el precio final en pesos?",
        "Calcula el descuento y réstalo al precio.",
        "El descuento es 3000; 20 000 − 3000 = 17 000."
      ],
      [
        "Un taller tenía 40 participantes y ahora tiene 50.",
        25,
        "¿En qué porcentaje aumentó respecto de los 40 iniciales?",
        "Divide el aumento por la cantidad inicial y multiplica por 100.",
        "Aumentó en 10; 10 ÷ 40 × 100 = 25 %."
      ]
    ],
    "review": [
      "Una entrada de $8000 tiene 20 % de descuento.",
      6400,
      "Calcula el precio final en pesos.",
      "Resta el 20 % de 8000.",
      "8000 − 1600 = 6400."
    ]
  },
  {
    "id": "circulos",
    "title": "Radio, perímetro y área",
    "subject": "matematica",
    "grade": "7b",
    "description": "MA07 OA 11 · La cabra, la cuerda y el pasto",
    "concept": "Imagina una cabra amarrada a una estaca. La cuerda es el radio. El diámetro son dos radios. El camino alrededor es el perímetro: 2 · π · r. El pasto de adentro es el área: π · r². Usa π ≈ 3,14.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/7-basico/ma07-oa-11\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Con radio 2 cm: diámetro 4 cm, perímetro 12,56 cm y área 12,56 cm².",
    "status": "published",
    "questions": [
      [
        "Radio: 7 cm",
        14,
        "¿Cuánto mide el diámetro en cm?",
        "Multiplica el radio por dos.",
        "2 × 7 = 14 cm."
      ],
      [
        "Diámetro: 18 cm",
        9,
        "¿Cuánto mide el radio en cm?",
        "El radio es la mitad del diámetro.",
        "18 ÷ 2 = 9 cm."
      ],
      [
        "Una rueda tiene radio 5 cm. Usa π = 3,14.",
        31.4,
        "Calcula su perímetro en cm.",
        "Aplica 2 × π × r.",
        "2 × 3,14 × 5 = 31,4 cm."
      ],
      [
        "Un jardín circular tiene radio 3 m. Usa π = 3,14.",
        28.26,
        "Calcula su área en m².",
        "Eleva el radio al cuadrado antes de multiplicar por π.",
        "3,14 × 3² = 28,26 m²."
      ]
    ],
    "review": [
      "Una mesa circular tiene diámetro 10 dm. Usa π = 3,14.",
      78.5,
      "Calcula el área en dm².",
      "Primero encuentra el radio.",
      "r = 5; área = 3,14 × 25 = 78,5 dm²."
    ]
  },
  {
    "id": "pitagoras",
    "title": "Distancias con Pitágoras",
    "subject": "matematica",
    "grade": "8b",
    "description": "MA08 OA 12 · Triángulos con una esquina recta",
    "concept": "Sirve solo en triángulos con una esquina recta. Los dos lados de esa esquina son los catetos. El lado más largo es la hipotenusa. La regla es a² + b² = c², donde c es la hipotenusa.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70561.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Con catetos 3 y 4: c² = 9 + 16 = 25; c = 5.",
    "status": "published",
    "questions": [
      [
        "Catetos de 6 cm y 8 cm",
        10,
        "Calcula la hipotenusa en cm.",
        "Suma los cuadrados y busca la raíz cuadrada.",
        "36 + 64 = 100; √100 = 10."
      ],
      [
        "Hipotenusa de 13 cm y un cateto de 5 cm",
        12,
        "Calcula el otro cateto en cm.",
        "Resta 5² a 13².",
        "169 − 25 = 144; √144 = 12."
      ],
      [
        "Una escalera de 5 m llega a 4 m de altura en un muro vertical.",
        3,
        "¿A qué distancia del muro está su base, en m, sobre suelo horizontal?",
        "La escalera es la hipotenusa.",
        "5² − 4² = 9; la distancia es 3 m."
      ],
      [
        "Un rectángulo mide 9 m de largo y 12 m de ancho.",
        15,
        "Calcula su diagonal en m.",
        "La diagonal forma un triángulo rectángulo.",
        "9² + 12² = 225; √225 = 15 m."
      ]
    ],
    "review": [
      "Catetos de 8 m y 15 m",
      17,
      "Calcula la hipotenusa en m.",
      "Calcula √(8² + 15²).",
      "64 + 225 = 289; √289 = 17 m."
    ]
  },
  {
    "id": "probabilidad-experimental",
    "title": "Probabilidad y frecuencias",
    "subject": "matematica",
    "grade": "7b",
    "description": "MA07 OA 18 · Qué parte de las veces pasa algo",
    "concept": "La frecuencia relativa dice qué parte de las veces pasó algo. Se calcula así: veces que pasó ÷ total de intentos. Si sale cara 12 de 20 veces: 12 ÷ 20 = 0,6. Sirve para estimar, pero la moneda no tiene memoria.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/7-basico/ma07-oa-18\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Si sale cara 12 veces en 20 lanzamientos, su frecuencia relativa es 12/20 = 0,6.",
    "status": "published",
    "questions": [
      [
        "En 50 lanzamientos de moneda se obtienen 28 caras.",
        0.56,
        "Calcula la frecuencia relativa de cara como decimal o fracción.",
        "Divide las caras por el total de lanzamientos.",
        "28/50 = 0,56."
      ],
      [
        "En 80 giros de una ruleta, 20 terminan en azul.",
        25,
        "¿Qué porcentaje de los giros terminó en azul? Escribe sin %.",
        "Multiplica 20/80 por 100.",
        "20/80 = 0,25 = 25 %."
      ],
      [
        "En 60 lanzamientos de dado, 12 muestran un seis.",
        0.2,
        "Estima la probabilidad de seis usando estos datos.",
        "Usa la frecuencia observada, no el valor teórico.",
        "12/60 = 0,2; es una estimación experimental."
      ],
      [
        "Se registran 18 rojas, 12 azules y 10 verdes en una bolsa con reposición.",
        0.3,
        "Estima la probabilidad de azul como decimal o fracción.",
        "Suma los resultados para obtener el total.",
        "Hay 40 extracciones; 12/40 = 0,3."
      ]
    ],
    "review": [
      "En 120 giros se obtiene amarillo 42 veces.",
      0.35,
      "Estima la probabilidad de amarillo como decimal o fracción.",
      "Divide 42 por 120.",
      "42/120 = 0,35."
    ]
  },
  {
    "id": "lectura-narraciones",
    "title": "Comprender una narración",
    "subject": "lenguaje",
    "grade": "7b",
    "description": "LE07 OA 03 · Comprensión lectora",
    "concept": "Para comprender una narración, identifica el conflicto, las acciones y sus consecuencias. Toda inferencia debe apoyarse en indicios del relato.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70382.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Si un personaje guarda un paraguas al ver que salió el sol, podemos inferir que ya no espera lluvia inmediata.",
    "status": "published",
    "questions": [
      [
        "Ana prometió devolver el libro el lunes. Ese día encontró varias páginas mojadas y se quedó mirando la puerta de la biblioteca.\n\n1. Ana quiere comprar otro libro.\n2. Ana debe devolver un libro que está dañado.\n3. La biblioteca no tiene puerta.",
        2,
        "¿Cuál es el conflicto? Escribe el número de la alternativa (1, 2 o 3).",
        "Relaciona la promesa con el estado del libro.",
        "El daño dificulta cumplir la devolución tal como Ana esperaba."
      ],
      [
        "Luis oyó el timbre. Aunque llevaba todo el recreo esperando jugar, dejó la pelota y volvió a la sala.\n\n1. El timbre.\n2. La pelota rota.\n3. Una llamada de su madre.",
        1,
        "¿Qué provoca que Luis vuelva? Escribe el número de la alternativa (1, 2 o 3).",
        "Busca el hecho anterior a la decisión.",
        "El timbre señala el fin del recreo y motiva el regreso."
      ],
      [
        "Antes de salir, Inés revisó tres veces su mochila. Al encontrar la autorización, soltó el aire y sonrió.\n\n1. No quería ir a la salida.\n2. Había perdido la mochila.\n3. Le preocupaba no encontrar la autorización.",
        3,
        "¿Qué se puede inferir? Escribe el número de la alternativa (1, 2 o 3).",
        "Observa el cambio entre revisar y sonreír.",
        "La revisión repetida y el alivio posterior apoyan esa inferencia."
      ],
      [
        "El martes plantaron semillas. El viernes apareció el primer brote. Años después, Julia aún recordaba aquella mañana del martes.\n\n1. Julia recuerda años después.\n2. Plantan las semillas.\n3. Aparece el brote.",
        2,
        "¿Qué ocurre primero en la historia? Escribe el número de la alternativa (1, 2 o 3).",
        "Distingue el orden de los hechos del momento del recuerdo.",
        "La plantación del martes precede al brote y al recuerdo posterior."
      ]
    ],
    "review": [
      "Tomás encontró una billetera al salir de la escuela. Miró la credencial y corrió a entregarla en la oficina. Gracias a eso, su dueña pudo recuperarla.\n\n1. La dueña recupera la billetera.\n2. Tomás pierde su credencial.\n3. La escuela cierra.",
      1,
      "¿Qué consecuencia tiene la acción de Tomás? Escribe el número de la alternativa (1, 2 o 3).",
      "Busca el efecto introducido por «Gracias a eso».",
      "Entregar la billetera permite que vuelva a su dueña."
    ]
  },
  {
    "id": "lectura-interpretacion",
    "title": "Interpretar dilemas literarios",
    "subject": "lenguaje",
    "grade": "7b",
    "description": "LE07 OA 07 · Comprensión lectora",
    "concept": "Interpretar implica proponer un sentido y sostenerlo con detalles del texto. Un dilema enfrenta opciones con consecuencias o valores en tensión.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70386.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Si alguien comparte su única colación, el gesto puede expresar solidaridad porque renuncia a algo propio para ayudar.",
    "status": "published",
    "questions": [
      [
        "Eva llevaba meses ahorrando para una bicicleta. Cuando supo que su hermano necesitaba anteojos, puso su alcancía sobre la mesa y dijo: «La bicicleta puede esperar».\n\n1. Eva dejó de querer una bicicleta.\n2. Eva prioriza una necesidad familiar.\n3. Eva quiere vender anteojos.",
        2,
        "¿Qué interpretación se apoya mejor en el relato? Escribe el número de la alternativa (1, 2 o 3).",
        "Distingue postergar un deseo de dejar de tenerlo.",
        "Su decisión de postergar la compra para ayudar sostiene la interpretación."
      ],
      [
        "Nicolás vio a su mejor amigo copiar en la prueba. Quería ser leal a él, pero también creía que todos debían rendir en las mismas condiciones.\n\n1. Amistad y justicia.\n2. Rapidez y lentitud.\n3. Diversión y aburrimiento.",
        1,
        "¿Qué valores están en tensión? Escribe el número de la alternativa (1, 2 o 3).",
        "Busca las dos razones que dificultan decidir.",
        "El relato enfrenta la lealtad al amigo con la igualdad de condiciones."
      ],
      [
        "En un pueblo sin teléfonos, Clara aguardaba cada semana al cartero. Un sobre de su hija podía cambiarle el día.\n\n1. Clara no sabe leer.\n2. La hija vive con Clara.\n3. Las cartas son un medio de comunicación a distancia.",
        3,
        "¿Qué aspecto del contexto explica la espera? Escribe el número de la alternativa (1, 2 o 3).",
        "Considera la ausencia de teléfonos.",
        "En ese contexto, el correo permite recibir noticias de alguien lejano."
      ],
      [
        "Aunque todos se burlaron de su pequeño árbol, Omar siguió regándolo. Años después descansaron juntos bajo su sombra.\n\n1. La perseverancia puede dar frutos con el tiempo.\n2. Las burlas ayudan a crecer a los árboles.\n3. Todo esfuerzo tiene resultados inmediatos.",
        1,
        "¿Qué idea expresa mejor el desenlace? Escribe el número de la alternativa (1, 2 o 3).",
        "Compara las burlas iniciales con el beneficio final.",
        "El cuidado sostenido produce un beneficio que al principio otros no veían."
      ]
    ],
    "review": [
      "Marina podía ganar el concurso si ocultaba el error de su dibujo. Se acercó al jurado y lo señaló, aun sabiendo que perdería puntos.\n\n1. Marina teme dibujar.\n2. Marina valora la honestidad más que una ventaja.\n3. El jurado le exige retirarse.",
      2,
      "¿Qué interpretación tiene respaldo textual? Escribe el número de la alternativa (1, 2 o 3).",
      "Observa qué acepta perder con su decisión.",
      "Reconoce el error aun cuando eso perjudica su puntuación."
    ]
  },
  {
    "id": "lectura-argumentos",
    "title": "Reconocer posturas y argumentos",
    "subject": "lenguaje",
    "grade": "7b",
    "description": "LE07 OA 08 · Comprensión lectora",
    "concept": "La postura expresa lo que el autor defiende. Un argumento ofrece una razón para sostenerla. Evalúa si esa razón es pertinente y si se apoya en información comprobable.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70387.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "«Debemos ampliar el horario de biblioteca porque muchos salen tarde de clases»: la propuesta es ampliar el horario; la razón es facilitar el acceso.",
    "status": "published",
    "questions": [
      [
        "Propongo instalar bebederos en el patio. Así podremos rellenar nuestras botellas y reducir el uso de envases desechables.\n\n1. Los patios son grandes.\n2. Las botellas están vacías.\n3. Se deben instalar bebederos.",
        3,
        "¿Cuál es la postura? Escribe el número de la alternativa (1, 2 o 3).",
        "Busca la propuesta que las otras ideas apoyan.",
        "Instalar bebederos es la propuesta; reducir envases es una razón."
      ],
      [
        "El club debería reunirse los viernes porque ese día sus veinte integrantes terminan las clases a la misma hora.\n\n1. Todos terminan a la misma hora el viernes.\n2. El club no tiene integrantes.\n3. Los viernes son siempre entretenidos.",
        1,
        "¿Cuál es el argumento? Escribe el número de la alternativa (1, 2 o 3).",
        "Identifica la razón después de «porque».",
        "El horario común justifica escoger ese día."
      ],
      [
        "La biblioteca prestó 300 libros en abril. Creo que es el lugar más agradable del colegio.\n\n1. La biblioteca prestó libros en abril.\n2. Es el lugar más agradable del colegio.\n3. Se prestaron 300 libros.",
        2,
        "¿Qué enunciado expresa una opinión? Escribe el número de la alternativa (1, 2 o 3).",
        "Busca una valoración personal.",
        "«Más agradable» expresa una valoración; la cifra de préstamos se puede verificar."
      ],
      [
        "Una carta propone aumentar las áreas con sombra en el patio porque al mediodía casi todos los bancos quedan al sol.\n\n1. El color favorito del autor.\n2. Una lista de asignaturas.\n3. Un registro de los bancos al sol a esa hora.",
        3,
        "¿Qué evidencia fortalecería la propuesta? Escribe el número de la alternativa (1, 2 o 3).",
        "La evidencia debe relacionarse con la razón dada.",
        "El registro permitiría comprobar la falta de sombra descrita."
      ]
    ],
    "review": [
      "Debemos conservar el huerto escolar: durante el semestre se usó en seis clases de ciencias y permitió observar el crecimiento de las plantas.\n\n1. Su utilidad en el aprendizaje de ciencias.\n2. La preferencia por el color verde.\n3. La falta de clases durante el semestre.",
      1,
      "¿Qué razón sostiene la propuesta? Escribe el número de la alternativa (1, 2 o 3).",
      "Busca el beneficio concreto mencionado.",
      "El uso en clases y la observación del crecimiento justifican conservarlo."
    ]
  },
  {
    "id": "lectura-medios",
    "title": "Leer noticias y publicidad",
    "subject": "lenguaje",
    "grade": "7b",
    "description": "LE07 OA 09 · Comprensión lectora",
    "concept": "Al leer medios, distingue información comprobable, opiniones y propósitos. Pregunta qué quiere lograr el mensaje y si sus afirmaciones están respaldadas.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/lengua-literatura/7-basico/le07-oa-09\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "«Ven hoy y compra dos por el precio de uno» busca promover una compra; no es una noticia.",
    "status": "published",
    "questions": [
      [
        "Aviso: «Trae tu taza y recibe un descuento en tu café. ¡Visítanos esta semana!».\n\n1. Informar un hallazgo científico.\n2. Incentivar una compra en el local.\n3. Narrar una aventura.",
        2,
        "¿Cuál es el propósito principal? Escribe el número de la alternativa (1, 2 o 3).",
        "Observa la invitación y el incentivo.",
        "El descuento y la invitación buscan atraer clientes."
      ],
      [
        "Noticia escolar: «El lunes se inauguró una sala de lectura con 120 libros. La directora afirmó: Es nuestro espacio más hermoso».\n\n1. La sala tiene 120 libros.\n2. Es el espacio más hermoso.\n3. Todos prefieren la sala.",
        1,
        "¿Cuál es un hecho verificable? Escribe el número de la alternativa (1, 2 o 3).",
        "Busca un dato que se pueda comprobar contando.",
        "La cantidad de libros es verificable; «más hermoso» es una valoración."
      ],
      [
        "Titular: «¡Todo el barrio usa bicicleta!». El texto informa que 15 de las 40 personas encuestadas dicen usarla.\n\n1. Es más preciso que los datos.\n2. No menciona el barrio.\n3. Generaliza más de lo que permiten los datos.",
        3,
        "¿Qué problema presenta el titular? Escribe el número de la alternativa (1, 2 o 3).",
        "Compara «todo» con 15 de 40 personas.",
        "La encuesta no demuestra que todo el barrio use bicicleta."
      ],
      [
        "Una publicación afirma: «Solo los jóvenes pueden aprender a usar tecnología». No presenta datos ni ejemplos.\n\n1. Explica una instrucción.\n2. Atribuye una capacidad a un grupo y la niega a otros por su edad.\n3. Describe una encuesta detallada.",
        2,
        "¿Qué problema tiene esta afirmación? Escribe el número de la alternativa (1, 2 o 3).",
        "Revisa qué supone sobre las edades.",
        "La afirmación reproduce un estereotipo sobre la capacidad de aprender según la edad."
      ]
    ],
    "review": [
      "Un anuncio dice: «Este lápiz garantiza las mejores notas». Solo muestra una foto del producto y su precio.\n\n1. La promesa carece de evidencia en el anuncio.\n2. El precio demuestra que mejora las notas.\n3. La foto prueba la promesa.",
      1,
      "¿Qué conclusión es razonable? Escribe el número de la alternativa (1, 2 o 3).",
      "Pregunta qué datos respaldan la garantía.",
      "Ni la foto ni el precio prueban que el lápiz mejore el rendimiento."
    ]
  },
  {
    "id": "lectura-estrategias-5b",
    "title": "Resumen e ideas principales",
    "subject": "lenguaje",
    "grade": "5b",
    "description": "LE05 OA 02 · Estrategias de lectura y síntesis",
    "concept": "Resumir consiste en extraer las ideas esenciales descartando detalles secundarios o redundantes. Pregúntate: ¿de qué habla el texto y qué es lo más importante que comunica?\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70335.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "En un texto sobre la fotosíntesis, la idea principal es la transformación de luz en energía; el color de la maceta es un detalle secundario.",
    "status": "published",
    "questions": [
      [
        "Las abejas desempeñan un rol vital: al recolectar polen para alimentarse, fertilizan miles de plantas que producen frutos y semillas consumidas por animales y seres humanos.\n\n1. Las abejas tienen aguijón defensivo.\n2. La función polinizadora de las abejas es vital para la reproducción de plantas y alimentos.\n3. A los seres humanos les gusta la miel.",
        2,
        "¿Cuál es la idea principal? Escribe el número de la alternativa (1, 2 o 3).",
        "Identifica de qué proceso habla el texto y por qué es relevante.",
        "El texto se centra en la importancia de la polinización para el sustento vegetal y animal."
      ],
      [
        "El desierto de Atacama es el más árido del planeta. Aunque casi no llueve, diversas especies de cactus y fauna autóctona desarrollaron adaptaciones únicas para almacenar agua.\n\n1. Los cactus tienen espinas afiladas.\n2. La capacidad de adaptación biológica ante la extrema aridez de Atacama.\n3. En los desiertos nunca habita ningún ser vivo.",
        2,
        "¿Qué afirmación resume mejor el fragmento? Escribe el número (1, 2 o 3).",
        "Busca la idea que conecta la aridez con la supervivencia de las especies.",
        "Destaca cómo la vida logra adaptarse a condiciones ambientales extremas."
      ],
      [
        "Para armar un volantín se necesitan dos varillas ligeras, papel de volantín y cuerda. Primero se cruzan las varillas en arco, luego se fija el papel tenso y finalmente se atan los tirantes.\n\n1. El viento en septiembre suele ser intenso.\n2. Los materiales y etapas básicas para confeccionar un volantín.\n3. Todos los volantines deben ser obligatoriamente de color rojo.",
        2,
        "¿Cuál es el tema y propósito central? Escribe el número (1, 2 o 3).",
        "Observa si el texto entrega instrucciones de fabricación.",
        "El fragmento sintetiza los elementos y el procedimiento de armado."
      ],
      [
        "En la época colonial, los pregones eran cantos callejeros con que los vendedores ofrecían leche, agua fresca y velas. Constituían el principal medio informativo diario en barrios sin periódicos.\n\n1. Los pregones servían de comunicación y venta cotidiana en el periodo colonial.\n2. La leche se transportaba en camiones refrigerados.\n3. En la colonia nadie se comunicaba verbalmente.",
        1,
        "¿Qué idea sintetiza el texto? Escribe el número (1, 2 o 3).",
        "Relaciona los pregones con su función social y de difusión.",
        "Explica el rol informativo y comercial de los pregoneros en la vida urbana de la época."
      ]
    ],
    "review": [
      "La luz de pantallas antes de dormir bloquea la melatonina, hormona que facilita el sueño. Por ello, médicos aconsejan apagar dispositivos una hora antes de acostarse.\n\n1. El uso nocturno de pantallas perjudica el descanso y se sugiere evitarlo.\n2. Los teléfonos inteligentes son superiores a los libros impresos.\n3. La melatonina es un componente electrónico de las tablets.",
      1,
      "¿Cuál es la conclusión principal? Escribe el número (1, 2 o 3).",
      "Relaciona el efecto de las pantallas con el consejo médico.",
      "Sintetiza la relación causa-efecto entre el brillo de pantallas y la calidad del sueño."
    ]
  },
  {
    "id": "lectura-noliterarios-6b",
    "title": "Evaluar textos no literarios y fuentes",
    "subject": "lenguaje",
    "grade": "6b",
    "description": "LE06 OA 06 · Propósito, emisor y confiabilidad de fuentes",
    "concept": "Al leer textos informativos o normativos, identifica al emisor, su propósito (informar, convencer o promover) y verifica si los datos se sustentan en fuentes comprobables o responden a intereses comerciales.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70360.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Un boletín del Ministerio de Salud sobre vacunación tiene un propósito sanitario e informativo avalado científicamente, a diferencia de un anuncio publicitario.",
    "status": "published",
    "questions": [
      [
        "Un informe sobre higiene bucal está firmado por la Sociedad de Odontología y cita tres investigaciones universitarias con datos de pacientes.\n\n1. Promover la venta de una marca exclusiva de pasta dental.\n2. Brindar orientación sanitaria confiable respaldada por especialistas y evidencia empírica.\n3. Narrar una leyenda ficticia sobre los dientes de leche.",
        2,
        "¿Cuál es el propósito y nivel de confiabilidad? Escribe (1, 2 o 3).",
        "Considera la institución que firma y el respaldo de estudios.",
        "La autoría profesional y los estudios citados otorgan rigor y confiabilidad informativa."
      ],
      [
        "Afiche comunal: «El sábado a las 10:00 sembraremos 50 árboles nativos en el Parque El Roble. Trae pala y guantes para sumarte al voluntariado».\n\n1. Comercializar plantas exóticas en el parque.\n2. Invitar a la comunidad a participar en una jornada ciudadana de arborización.\n3. Exponer una teoría botánica sobre la fotosíntesis.",
        2,
        "¿Qué busca el afiche? Escribe el número de la alternativa (1, 2 o 3).",
        "Examina el tono de convocatoria abierta a la comunidad.",
        "El afiche tiene un propósito apelativo y comunitario: convocar voluntarios."
      ],
      [
        "Un sitio web anónimo asegura: «Comer tres manzanas ácidas cada mañana cura cualquier tipo de infección bacteriana», sin citar médicos ni bibliografía.\n\n1. Es totalmente certero porque las frutas son saludables.\n2. Carece de respaldo científico verificable y no identifica a sus autores responsables.\n3. Es un protocolo formal aprobado por la Organización Mundial de la Salud.",
        2,
        "¿Qué juicio crítico merece este texto? Escribe (1, 2 o 3).",
        "Evalúa si existen fuentes médicas citadas y autores acreditados.",
        "La ausencia de evidencia y anonimato exige desconfiar de afirmaciones médicas extraordinarias."
      ],
      [
        "Una infografía sobre el ciclo hídrico combina esquemas con flechas, ilustraciones de montañas y párrafos numerados sobre condensación y lluvia.\n\n1. Facilitar la comprensión articulando explicaciones verbales y recursos gráficos secuenciales.\n2. Llenar el diseño gráfico por falta de contenido escrito.\n3. Confundir deliberadamente al lector con exceso de diagramas.",
        1,
        "¿Cuál es la función del formato discontinuo? Escribe (1, 2 o 3).",
        "Analiza cómo se complementan el texto escrito y las ilustraciones.",
        "Las infografías integran lo visual y lo textual para explicar fenómenos complejos con claridad."
      ]
    ],
    "review": [
      "Una empresa embotelladora publica un folleto afirmando que los refrescos azucarados son el hidratante más recomendable para niños deportistas.\n\n1. Se debe evaluar críticamente debido al evidente conflicto de interés comercial del emisor.\n2. Corresponde a una guía nutricional imparcial y definitiva.\n3. Los niños no deben realizar actividad deportiva.",
      1,
      "¿Qué actitud crítica corresponde adoptar? Escribe (1, 2 o 3).",
      "Reflexiona sobre los intereses económicos de la empresa detrás del mensaje.",
      "Cuando el emisor se beneficia directamente de la conducta promovida, hay conflicto de interés."
    ]
  },
  {
    "id": "lectura-figuras-8b",
    "title": "Recursos poéticos y figuras literarias",
    "subject": "lenguaje",
    "grade": "8b",
    "description": "LE08 OA 04 · Lenguaje figurado, metáforas y recursos estilísticos",
    "concept": "El lenguaje figurado sugiere asociaciones creativas entre realidades distintas. La metáfora traslada el significado de un término a otro por afinidad («el oro de sus cabellos»); la personificación confiere rasgos humanos a objetos («el viento aullaba de dolor») y la hipérbole magnifica una cualidad para enfatizar un impacto emocional.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70438.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "En «el invierno muerde las esquinas», la personificación del frío resalta su dureza inclemente.",
    "status": "published",
    "questions": [
      [
        "«El tiempo voló mientras compartíamos la tarde de juegos en el patio».\n\n1. El tiempo posee extremidades con alas físicas.\n2. La metáfora expresa que las horas pasaron con gran rapidez y ligereza.\n3. Los relojes de la casa salieron volando.",
        2,
        "¿Qué sentido figurado comunica la expresión? Escribe (1, 2 o 3).",
        "Piensa en cómo se siente el transcurso de las horas cuando nos entretenemos.",
        "La metáfora compara la velocidad del vuelo con la rápida percepción del tiempo ameno."
      ],
      [
        "«La noche arropó al pueblo con su oscuro abrigo de niebla y silencio».\n\n1. Hipérbole desmedida.\n2. Personificación: la noche actúa como un ser que cuida y cubre con un abrigo.\n3. Comparación explícita con nexo «como».",
        2,
        "¿Qué figura literaria predomina? Escribe el número (1, 2 o 3).",
        "Revisa la acción humana de arropar atribuida al momento nocturno.",
        "La noche cobra vida al ejecutar la acción humana y protectora de arropar."
      ],
      [
        "«Te he advertido un millón de veces que guardes los libros antes de salir».\n\n1. Hipérbole: exagera la cantidad para remarcar insistencia y cansancio.\n2. Personificación de los libros en la mesa.\n3. Metáfora matemática exacta sobre números enteros.",
        1,
        "¿Qué recurso estilístico se utiliza? Escribe (1, 2 o 3).",
        "¿Es creíble contar físicamente un millón de advertencias?",
        "La hipérbole abulta la cifra para subrayar la reiteración de una llamada de atención."
      ],
      [
        "«Sus palabras fueron dagas heladas que paralizaron la discusión».\n\n1. Alguien trajo cuchillos de metal al salón.\n2. Metáfora: atribuye a los dichos la capacidad de lastimar emocionalmente y congelar el ambiente.\n3. El frío de la habitación dañó las gargantas.",
        2,
        "¿Cómo se interpreta esta metáfora? Escribe el número (1, 2 o 3).",
        "Conecta la herida de un arma blanca con el dolor moral de una palabra dura.",
        "La metáfora transmite el impacto lesivo, cortante y repentino del mensaje emitido."
      ]
    ],
    "review": [
      "«El río cantaba alegre entre las piedras redondeadas del sendero».\n\n1. Personificación: describe el rumor armonioso y vivo del agua en movimiento.\n2. El río aprendió composiciones musicales de memoria.\n3. Había personas cantando sumergidas en el cauce.",
      1,
      "¿Qué figura se evidencia en el texto? Escribe (1, 2 o 3).",
      "¿Qué cualidad humana se le asigna al caudal hídrico?",
      "Atribuir canto al agua personifica el paisaje para evocar vitalidad y alegría en la naturaleza."
    ]
  },
  {
    "id": "lectura-conflictos-8b",
    "title": "Conflictos y motivaciones en el relato",
    "subject": "lenguaje",
    "grade": "8b",
    "description": "LE08 OA 03 · Dilemas morales, motivaciones y conflicto narrativo",
    "concept": "En una narración, los personajes actúan movidos por valores, lealtades o miedos. El conflicto surge cuando un obstáculo o dilema ético pone a prueba sus convicciones. Comprender las motivaciones permite interpretar el sentido profundo de la historia y juzgar críticamente sus desenlaces.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70437.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Cuando un personaje admite una falta para proteger la verdad colectiva, su motivación prioriza la justicia sobre la comodidad personal.",
    "status": "published",
    "questions": [
      [
        "Matías advirtió que el cronómetro oficial falló a favor de su equipo. Aunque ganar significaba la copa, se acercó al árbitro y señaló la diferencia de segundos.\n\n1. Matías deseaba que su equipo fuese sancionado.\n2. Su motivación priorizó la rectitud y el juego limpio por encima del triunfo fácil.\n3. El árbitro le exigió revisar las planillas por obligación.",
        2,
        "¿Qué motivación guía la conducta de Matías? Escribe (1, 2 o 3).",
        "Considera qué pierde y qué valor moral decide conservar.",
        "Renuncia a una victoria ilegítima porque valora la honestidad por sobre el resultado."
      ],
      [
        "El viejo carpintero rehusó rematar su primer banco de trabajo pese a las deudas. Decía que en la madera tallada vivía el recuerdo de sus comienzos junto a su padre.\n\n1. El valor sentimental y la memoria familiar pesaron más que el beneficio financiero inmediato.\n2. El mueble carecía por completo de valor material para cualquier comprador.\n3. El carpintero no sabía cómo realizar una transacción comercial.",
        1,
        "¿Qué explica la resistencia del protagonista? Escribe (1, 2 o 3).",
        "Observa la vinculación afectiva que le asigna a las huellas del objeto.",
        "La memoria emocional y el lazo filial superan la urgencia puramente económica."
      ],
      [
        "Valeria fue seleccionada para una pasantía científica en el extranjero, pero su abuela enferma dependía de sus cuidados diarios. Pasó días enteros desvelada mirando el pasaje.\n\n1. La indecisión entre el desarrollo académico personal y el deber afectivo del cuidado.\n2. El costo monetario de los vuelos internacionales.\n3. La falta de vocación científica en la protagonista.",
        1,
        "¿Cuál es el conflicto central del personaje? Escribe (1, 2 o 3).",
        "Identifica las dos fuerzas legítimas que entran en colisión.",
        "El dilema ético opone una aspiración profesional con el compromiso de lealtad familiar."
      ],
      [
        "Al notar que varios se burlaban de las zapatillas rotas del alumno nuevo, Diego se acercó, lo saludó con calidez y lo invitó a compartir su almuerzo en el banco central.\n\n1. Diego buscaba burlarse en privado.\n2. La solidaridad y empatía impulsaron su acción para contrarrestar la exclusión grupal.\n3. Diego no tenía hambre y regaló su comida.",
        2,
        "¿Qué valor motiva la postura de Diego? Escribe (1, 2 o 3).",
        "Analiza el contraste entre la actitud del grupo y el gesto individual de acogida.",
        "Diego actúa desde la empatía activa para amparar a su compañero y frenar la hostilidad."
      ]
    ],
    "review": [
      "Sofía encontró un cuaderno con las respuestas de la prueba final en el pasillo y decidió entregarlo cerrado a la sala de profesores sin abrirlo.\n\n1. La integridad académica primó sobre la tentación de una ventaja deshonesta.\n2. No comprendía las materias evaluadas en el examen.\n3. Temía que el papel estuviese manchado.",
      1,
      "¿Qué interpretación de la decisión se sostiene mejor? Escribe (1, 2 o 3).",
      "Reconoce el dilema ético ante la posibilidad de hacer trampa sin testigos.",
      "Entrega el material sin sacar provecho personal, demostrando coherencia ética."
    ]
  },
  {
    "id": "lectura-simbolos-1m",
    "title": "Símbolos y visiones de mundo en la literatura",
    "subject": "lenguaje",
    "grade": "1m",
    "description": "LE01 OA 02 · Interpretación literaria, alegorías y contexto cultural",
    "concept": "Un símbolo literario condensa ideas abstractas en objetos, personajes o espacios físicos (un pájaro enjaulado como anhelo de libertad; una tempestad como quiebre interior). Interpretar implica decodificar estos símbolos a la luz de los valores y la cosmovisión plasmados en la obra.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70487.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Una senda que se bifurca en un bosque brumoso simboliza la encrucijada existencial ante decisiones irreversibles.",
    "status": "published",
    "questions": [
      [
        "En el cuento, el protagonista cuida una lámpara de aceite en medio de una ciudad dominada por luces de neón frías y carteles publicitarios automáticos.\n\n1. Falta de tendido eléctrico en su vivienda.\n2. La lámpara simboliza la persistencia de lo humano, la calidez y la memoria frente a la despersonalización moderna.\n3. Ahorro de dinero en tarifas de energía.",
        2,
        "¿Qué representa el símbolo de la lámpara? Escribe (1, 2 o 3).",
        "Contrasta la cualidad de la llama viva con el frío artificio del neón.",
        "El elemento tradicional encarna la resistencia espiritual ante la frialdad maquinal."
      ],
      [
        "Los personajes viven cercados por una muralla de piedra que nadie recuerda quién construyó; al derribar un fragmento, descubren un valle fértil abierto.\n\n1. La necesidad de reparar albañilerías antiguas.\n2. El muro simboliza los prejuicios y el aislamiento autoimpuesto que impiden descubrir horizontes comunes.\n3. Los habitantes buscaban piedras para edificar viviendas.",
        2,
        "¿Cómo se interpreta alegóricamente la muralla? Escribe (1, 2 o 3).",
        "Considera qué barreras invisibles suelen separar a las comunidades humanas.",
        "La barrera material representa las barreras mentales y el miedo a lo diferente."
      ],
      [
        "Al cumplir la mayoría de edad, el joven recibe como herencia una brújula rota cuya aguja gira sin detenerse en el norte convencional.\n\n1. Un objeto defectuoso que debe repararse con un relojero.\n2. El desafío de construir su propio rumbo vital sin mandatos heredados preestablecidos.\n3. La imposibilidad absoluta de viajar geográficamente.",
        2,
        "¿Qué sugiere la brújula desmagnetizada? Escribe (1, 2 o 3).",
        "Relaciona la falta de un norte fijo con la autonomía para elegir el propio camino.",
        "Simboliza la búsqueda de identidad y la libertad para forjar un destino singular."
      ],
      [
        "En un relato alegórico, dos viajeros contemplan el mar: el primero ve un abismo amenazante que separa continentes; el segundo, un puente infinito hacia lo desconocido.\n\n1. El mar cambia de composición química según el observador.\n2. Un mismo símbolo encarna visiones opuestas según los temores y anhelos de cada individuo.\n3. Ninguno de los dos sabe nadar con destreza.",
        2,
        "¿Qué principio de interpretación se evidencia? Escribe (1, 2 o 3).",
        "Observa cómo la experiencia interna condiciona el significado otorgado al entorno.",
        "El símbolo literario es polisémico y refleja la cosmovisión íntima de quien lo contempla."
      ]
    ],
    "review": [
      "Al concluir la novela, el prisionero abre la jaula del mirlo que cuidó durante su encierro y lo observa elevarse hacia la cordillera.\n\n1. La liberación del ave simboliza su propia trascendencia y emancipación espiritual.\n2. El ave causaba desorden en el recinto carcelario.\n3. Llegaba el periodo estival a la cordillera.",
      1,
      "¿Cuál es el sentido simbólico del desenlace? Escribe (1, 2 o 3).",
      "Conecta el destino del pájaro con el estado interno del protagonista.",
      "El vuelo del animal proyecta la conquista de la dignidad y libertad del personaje."
    ]
  },
  {
    "id": "lectura-critica-1m",
    "title": "Lectura crítica, posturas y falacias",
    "subject": "lenguaje",
    "grade": "1m",
    "description": "LE01 OA 10 · Argumentación, validez de razones y falacias en medios",
    "concept": "La lectura crítica evalúa la consistencia de los razonamientos. Una falacia es un argumento defectuoso que aparenta validez: el ataque personal (ad hominem), apelar al consenso masivo (ad populum) o forzar un falso dilema («o todo o nada»). Detectarlas permite discernir afirmaciones rigurosas de intentos de manipulación.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70495.html\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Decir «no le crean a ese economista porque es muy joven» es una falacia ad hominem: ataca la edad del expositor en lugar de examinar sus cifras y argumentos.",
    "status": "published",
    "questions": [
      [
        "Columna de opinión: «No debemos considerar las propuestas del arquitecto sobre ciclovías, porque es una persona desordenada en su vida privada».\n\n1. Argumentación técnica basada en vialidad urbana.\n2. Falacia ad hominem: descalifica al individuo para esquivar el análisis de su proyecto técnico.\n3. Conclusión basada en mediciones de tránsito.",
        2,
        "¿Qué vicio argumentativo presenta el texto? Escribe (1, 2 o 3).",
        "Examina si la crítica se dirige a la propuesta o a la persona del autor.",
        "Se ataca la esfera privada del emisor en vez de responder con argumentos a su propuesta."
      ],
      [
        "Publicidad: «El 95 % de los clientes encuestados en nuestra sucursal prefiere nuestro café sobre cualquier otro grano del planeta».\n\n1. Muestra sesgada: consultar solo a clientes ya cautivos en el local invalida la representatividad nacional.\n2. Verificación experimental definitiva avalada por científicos.\n3. Los encuestados no sabían degustar bebidas calientes.",
        1,
        "¿Por qué este dato no constituye prueba concluyente? Escribe (1, 2 o 3).",
        "Reflexiona sobre quiénes componen la muestra del sondeo.",
        "Encuestar únicamente a quienes ya compran en el local distorsiona la muestra y los resultados."
      ],
      [
        "«Debes adoptar esta misma aplicación telefónica, ya que absolutamente todos en el curso la tienen instalada».\n\n1. Falacia ad populum: apela a la popularidad masiva como si fuese criterio de utilidad o seguridad.\n2. Razonamiento informático de compatibilidad de redes.\n3. Demostración técnica de eficiencia de memoria.",
        1,
        "¿Qué debilidad lógica contiene la aseveración? Escribe (1, 2 o 3).",
        "¿El hecho de que muchos adopten algo prueba por sí solo que sea lo mejor?",
        "La masividad de una conducta no garantiza la conveniencia, calidad ni veracidad de una opción."
      ],
      [
        "«O prohibimos todo uso de tecnología en las aulas o los estudiantes perderán por completo su capacidad de razonar».\n\n1. Falso dilema: simplifica una realidad compleja reduciéndola a dos extremos excluyentes.\n2. Síntesis pedagógica sustentada en ensayos clínicos controlados.\n3. Estadística oficial validada por ministerios de educación.",
        1,
        "¿Qué trampa de razonamiento se utiliza? Escribe (1, 2 o 3).",
        "¿Existen alternativas intermedias entre la prohibición total y el abandono del raciocinio?",
        "Forzar dos únicas alternativas catastróficas ignora vías equilibradas como la mediación digital."
      ]
    ],
    "review": [
      "«Un vecino probó una infusión herbal y sintió alivio; por consiguiente, esa hierba cura universalmente cualquier dolencia humana».\n\n1. Generalización apresurada: extrae una ley universal infalible desde una anécdota singular y aislada.\n2. Protocolo médico de fase clínica avalado por farmacología.\n3. Principio químico comprobado en laboratorios.",
      1,
      "¿Qué error argumentativo se comete? Escribe (1, 2 o 3).",
      "Distingue un caso particular o experiencia anecdótica de una regla médica general.",
      "Extrapolar una certeza general a partir de un único testimonio carece de validez científica."
    ]
  },
  {
    "id": "jerarquia-mult",
    "since": "2026-10-12",
    "title": "Primero multiplicar y dividir",
    "subject": "matematica",
    "grade": "5b",
    "description": "MA05 OA 05 · Primero multiplicar y dividir",
    "concept": "Cuando hay varias operaciones, hay un orden. Primero multiplica y divide. Después suma y resta. Piensa en la multiplicación como una bolsa cerrada: primero cuentas lo que trae.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/5-basico/ma05-oa-05\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "3 + 4 · 2: primero el paquete, 4 · 2 = 8, y después 3 + 8 = 11. No es 14.",
    "status": "published",
    "questions": [
      [
        "3 + 4 · 2",
        11,
        "Calcula respetando la jerarquía de operaciones.",
        "📦 Primero el paquete: 4 · 2. Después suma lo suelto.",
        "4 · 2 = 8; 3 + 8 = 11.",
        [
          [
            14,
            "Sumaste primero (3 + 4 = 7) y después multiplicaste. La multiplicación va antes: 4 · 2 = 8, y luego 3 + 8 = 11."
          ]
        ]
      ],
      [
        "20 − 12 ÷ 4",
        17,
        "Calcula respetando la jerarquía de operaciones.",
        "La división va antes que la resta: calcula 12 ÷ 4.",
        "12 ÷ 4 = 3; 20 − 3 = 17.",
        [
          [
            2,
            "Restaste primero (20 − 12 = 8) y después dividiste. La división va antes: 12 ÷ 4 = 3, y luego 20 − 3 = 17."
          ]
        ]
      ],
      [
        "5 · 3 + 2 · 6",
        27,
        "Hay dos multiplicaciones: resuélvelas antes de sumar.",
        "Calcula cada paquete por separado: 5 · 3 y 2 · 6.",
        "5 · 3 = 15; 2 · 6 = 12; 15 + 12 = 27.",
        [
          [
            102,
            "Operaste de izquierda a derecha: (5 · 3 + 2) · 6. Primero las dos multiplicaciones: 15 y 12."
          ]
        ]
      ],
      [
        "500 + 3 · 800",
        2900,
        "Un lápiz cuesta $500 y cada cuaderno $800. Compras un lápiz y 3 cuadernos. ¿Cuánto pagas en total?",
        "Primero el costo de los 3 cuadernos (3 · 800); después agrega el lápiz.",
        "3 · 800 = 2400; 500 + 2400 = 2900. Pagas $2 900.",
        [
          [
            402400,
            "Sumaste 500 + 3 antes de multiplicar. Primero calcula los cuadernos: 3 · 800 = 2400."
          ]
        ]
      ]
    ],
    "review": [
      "18 − 2 · 5 + 4",
      12,
      "Calcula respetando la jerarquía de operaciones.",
      "Primero la multiplicación; después resta y suma, de izquierda a derecha.",
      "2 · 5 = 10; 18 − 10 = 8; 8 + 4 = 12.",
      [
        [
          84,
          "Operaste de izquierda a derecha sin respetar la jerarquía: primero va 2 · 5 = 10."
        ],
        [
          4,
          "Después de multiplicar, la resta y la suma van de izquierda a derecha: 18 − 10 = 8 y luego 8 + 4 = 12."
        ]
      ]
    ]
  },
  {
    "id": "jerarquia-parentesis",
    "since": "2026-10-12",
    "title": "Los paréntesis mandan",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA05 OA 05 · Lo de adentro va primero",
    "concept": "Lo que está dentro del paréntesis va primero. Si hay cajas dentro de cajas, empieza por la de más adentro. El orden completo es PAPOMUDAS: Paréntesis, Potencias, Multiplicación y División, Adición y Sustracción.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/5-basico/ma05-oa-05\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "(3 + 4) · 2 = 7 · 2 = 14, mientras que 3 + 4 · 2 = 11.",
    "status": "published",
    "questions": [
      [
        "(3 + 4) · 2",
        14,
        "Calcula respetando la jerarquía de operaciones.",
        "📦 Primero lo que está dentro del paréntesis: 3 + 4.",
        "3 + 4 = 7; 7 · 2 = 14.",
        [
          [
            11,
            "Ignoraste el paréntesis. Lo de adentro va primero: 3 + 4 = 7, y luego 7 · 2 = 14."
          ]
        ]
      ],
      [
        "36 ÷ (2 + 4)",
        6,
        "Calcula respetando la jerarquía de operaciones.",
        "Resuelve el paréntesis antes de dividir.",
        "2 + 4 = 6; 36 ÷ 6 = 6.",
        [
          [
            22,
            "Dividiste antes de resolver el paréntesis (36 ÷ 2 + 4). Primero 2 + 4 = 6."
          ]
        ]
      ],
      [
        "5 · (10 − 4) + 2",
        32,
        "Calcula respetando la jerarquía de operaciones.",
        "Paréntesis, después la multiplicación y al final la suma.",
        "10 − 4 = 6; 5 · 6 = 30; 30 + 2 = 32.",
        [
          [
            48,
            "Ignoraste el paréntesis: primero 10 − 4 = 6."
          ],
          [
            40,
            "El + 2 está fuera del paréntesis: se suma al final, después de multiplicar."
          ]
        ]
      ],
      [
        "2 · [3 + (8 − 2)]",
        18,
        "Hay un paréntesis dentro de un corchete. Calcula desde adentro hacia afuera.",
        "Abre las cajas desde la más chica: primero 8 − 2, después el corchete.",
        "8 − 2 = 6; 3 + 6 = 9; 2 · 9 = 18.",
        [
          [
            12,
            "El 2 multiplica a todo el corchete. Primero 8 − 2 = 6, luego 3 + 6 = 9, y al final 2 · 9 = 18."
          ]
        ]
      ]
    ],
    "review": [
      "(15 − 3) ÷ 4 + 1",
      4,
      "Calcula respetando la jerarquía de operaciones.",
      "Primero el paréntesis; después la división; al final la suma.",
      "15 − 3 = 12; 12 ÷ 4 = 3; 3 + 1 = 4.",
      [
        [
          2.4,
          "El + 1 está fuera del paréntesis: primero 12 ÷ 4 = 3 y después suma 1."
        ]
      ]
    ]
  },
  {
    "id": "jerarquia-enteros",
    "since": "2026-10-12",
    "title": "Jerarquía con números enteros",
    "subject": "matematica",
    "grade": "7b",
    "description": "MA07 OA 01 · El mismo orden, con negativos",
    "concept": "Con números negativos, el orden es el mismo. Primero los paréntesis. Después multiplica y divide. Al final suma y resta. Para sumar y restar, usa el ascensor: sumar es subir y restar es bajar.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/7-basico/ma07-oa-01\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "−8 + 2 · 6 = −8 + 12 = 4.",
    "status": "published",
    "questions": [
      [
        "−8 + 2 · 6",
        4,
        "Calcula respetando la jerarquía de operaciones.",
        "📦 Primero el paquete 2 · 6; después sube desde el −8.",
        "2 · 6 = 12; −8 + 12 = 4.",
        [
          [
            -36,
            "Sumaste −8 + 2 antes de multiplicar. Primero el paquete: 2 · 6 = 12."
          ]
        ]
      ],
      [
        "10 − 3 · 5",
        -5,
        "Calcula respetando la jerarquía de operaciones.",
        "Multiplica primero: 3 · 5 = 15. ¿Qué pasa si al 10 le quitas 15?",
        "3 · 5 = 15; 10 − 15 = −5.",
        [
          [
            35,
            "Restaste primero (10 − 3 = 7). La multiplicación va antes: 3 · 5 = 15, y 10 − 15 = −5."
          ],
          [
            5,
            "10 − 15 queda bajo cero: es −5. Si estás en el piso 10 y bajas 15, llegas al subterráneo −5."
          ]
        ]
      ],
      [
        "−6 − (4 − 9)",
        -1,
        "Calcula respetando la jerarquía de operaciones.",
        "Primero el paréntesis: 4 − 9 = −5. Después, restar −5 es quitar una deuda.",
        "4 − 9 = −5; −6 − (−5) = −6 + 5 = −1.",
        [
          [
            -11,
            "Restar un negativo es sumar: −6 − (−5) = −6 + 5 = −1."
          ],
          [
            -19,
            "Revisa el paréntesis: 4 − 9 = −5, no 13."
          ]
        ]
      ],
      [
        "(−3 + 7) · 2 − 10",
        -2,
        "Calcula respetando la jerarquía de operaciones.",
        "Paréntesis, multiplicación y al final la resta.",
        "−3 + 7 = 4; 4 · 2 = 8; 8 − 10 = −2.",
        [
          [
            1,
            "Ignoraste el paréntesis: primero −3 + 7 = 4."
          ],
          [
            2,
            "8 − 10 queda bajo cero: es −2."
          ]
        ]
      ]
    ],
    "review": [
      "−12 + 18 ÷ 3",
      -6,
      "Calcula respetando la jerarquía de operaciones.",
      "Divide primero: 18 ÷ 3.",
      "18 ÷ 3 = 6; −12 + 6 = −6.",
      [
        [
          2,
          "Sumaste antes de dividir: (−12 + 18) ÷ 3. Primero 18 ÷ 3 = 6."
        ],
        [
          6,
          "−12 + 6 queda bajo cero: es −6."
        ]
      ]
    ]
  },
  {
    "id": "jerarquia-potencias",
    "since": "2026-10-12",
    "title": "Las potencias en la fila",
    "subject": "matematica",
    "grade": "8b",
    "description": "MA08 OA 03 · Las potencias van segundas",
    "concept": "Las potencias van justo después de los paréntesis. La potencia solo afecta a su número: en 2 + 3², solo el 3 se eleva. 3² = 3 · 3 = 9. Recuerda el orden PAPOMUDAS.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/8-basico/ma08-oa-03\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "2 + 3² = 2 + 9 = 11; en cambio, (2 + 3)² = 5² = 25.",
    "status": "published",
    "questions": [
      [
        "2 + 3²",
        11,
        "Calcula respetando la jerarquía de operaciones.",
        "La potencia va antes que la suma: 3² = 3 · 3.",
        "3² = 9; 2 + 9 = 11.",
        [
          [
            25,
            "Sumaste antes de elevar: (2 + 3)². La potencia solo afecta al 3: 3² = 9."
          ],
          [
            8,
            "3² no es 3 · 2: es 3 · 3 = 9."
          ]
        ]
      ],
      [
        "4 · 2³",
        32,
        "Calcula respetando la jerarquía de operaciones.",
        "Primero la potencia: 2³ = 2 · 2 · 2.",
        "2³ = 8; 4 · 8 = 32.",
        [
          [
            512,
            "Multiplicaste antes de elevar: (4 · 2)³. Primero 2³ = 8."
          ],
          [
            24,
            "2³ no es 2 · 3: es 2 · 2 · 2 = 8."
          ]
        ]
      ],
      [
        "(1 + 2)³ − 5",
        22,
        "Calcula respetando la jerarquía de operaciones.",
        "Paréntesis, potencia y al final la resta.",
        "1 + 2 = 3; 3³ = 27; 27 − 5 = 22.",
        [
          [
            4,
            "Revisa dos cosas: el paréntesis va primero (1 + 2 = 3) y 3³ es 3 · 3 · 3 = 27."
          ]
        ]
      ],
      [
        "3 · 2² − (6 − 1)",
        7,
        "Calcula paso a paso con PAPOMUDAS.",
        "Paréntesis (6 − 1), potencia (2²), multiplicación y al final la resta.",
        "6 − 1 = 5; 2² = 4; 3 · 4 = 12; 12 − 5 = 7.",
        [
          [
            31,
            "Multiplicaste antes de elevar: (3 · 2)² = 36. Primero 2² = 4."
          ]
        ]
      ]
    ],
    "review": [
      "5² − 4 · 3 + 1",
      14,
      "Calcula respetando la jerarquía de operaciones.",
      "Potencia, multiplicación y después resta y suma de izquierda a derecha.",
      "5² = 25; 4 · 3 = 12; 25 − 12 = 13; 13 + 1 = 14.",
      [
        [
          64,
          "Operaste de izquierda a derecha: primero va la multiplicación, 4 · 3 = 12."
        ],
        [
          12,
          "La resta y la suma van de izquierda a derecha: 25 − 12 = 13 y después 13 + 1 = 14."
        ]
      ]
    ]
  },
  {
    "id": "base-valor-posicional",
    "since": "2026-10-13",
    "title": "Cada cifra vale según su lugar",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA04 OA 01 · Monedas de $1, $10 y $100",
    "concept": "Cada cifra vale según el lugar donde está, como monedas. En 482 hay 4 monedas de $100, 8 de $10 y 2 de $1. Por eso el 4 vale 400. Multiplicar por 10 sube todo un lugar.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/4-basico/ma04-oa-01\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "En 482, el 4 está en el lugar de las centenas: vale 4 · 100 = 400. Y 482 = 400 + 80 + 2.",
    "status": "published",
    "questions": [
      [
        "¿Cuánto vale el 4 en 482?",
        400,
        "Escribe cuánto vale el 4 según su lugar.",
        "💰 El 4 está en el lugar de las monedas de $100.",
        "El 4 está en las centenas: 4 · 100 = 400.",
        [
          [
            4,
            "Esa es la cifra, pero vale según su lugar: está en las centenas, así que vale 400."
          ],
          [
            40,
            "Cuenta los lugares desde la derecha: unidades, decenas, centenas. El 4 está en las centenas: vale 400."
          ]
        ]
      ],
      [
        "300 + 20 + 7",
        327,
        "Junta las monedas en un solo número.",
        "3 monedas de $100, 2 de $10 y 7 de $1.",
        "300 + 20 + 7 = 327.",
        [
          [
            12,
            "No se suman las cifras: cada una va en su lugar. 3 centenas, 2 decenas y 7 unidades forman 327."
          ]
        ]
      ],
      [
        "46 · 10",
        460,
        "Multiplica por 10.",
        "Por 10, cada moneda se cambia por una que vale 10 veces más: todo sube un lugar.",
        "46 · 10 = 460: se agrega un cero a la derecha.",
        [
          [
            56,
            "Sumaste 10. Multiplicar por 10 es tener 10 veces lo mismo: 460."
          ],
          [
            4600,
            "Por 10 se agrega un solo cero: 460."
          ]
        ]
      ],
      [
        "7 · 100 + 15 · 10 + 3",
        853,
        "Tienes 7 monedas de $100, 15 de $10 y 3 de $1. ¿Cuánto dinero tienes?",
        "15 monedas de $10 son $150.",
        "700 + 150 + 3 = 853. Tienes $853.",
        [
          [
            7153,
            "No se escriben las cantidades una al lado de la otra. 15 monedas de $10 son $150: 700 + 150 + 3 = 853."
          ]
        ]
      ]
    ],
    "review": [
      "¿Cuánto vale el 6 en 615?",
      600,
      "Escribe cuánto vale el 6 según su lugar.",
      "El 6 está en el lugar de las monedas de $100.",
      "El 6 está en las centenas: 6 · 100 = 600.",
      [
        [
          6,
          "Esa es la cifra, pero vale según su lugar: 600."
        ],
        [
          60,
          "Cuenta desde la derecha: unidades, decenas, centenas. El 6 vale 600."
        ]
      ]
    ]
  },
  {
    "id": "base-suma-resta",
    "since": "2026-10-13",
    "title": "Sumar y restar con canje",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA03 OA 06 · Llevar y pedir prestado",
    "concept": "Suma y resta cada lugar por separado: unidades con unidades. Si al sumar juntas 10 o más, cambia 10 monedas por una del lugar siguiente: eso es llevar. Si al restar no alcanza, cambia una moneda grande por 10 chicas: eso es pedir prestado.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/3-basico/ma03-oa-06\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "47 + 38: 7 + 8 = 15, dejas 5 y llevas 1 decena. Luego 4 + 3 + 1 = 8. Resultado: 85.",
    "status": "published",
    "questions": [
      [
        "47 + 38",
        85,
        "Suma con canje.",
        "7 + 8 = 15: deja el 5 y lleva 1 decena.",
        "7 + 8 = 15 (dejo 5, llevo 1); 4 + 3 + 1 = 8. Resultado: 85.",
        [
          [
            715,
            "Escribiste el 15 completo. Deja el 5 y lleva 1 decena: 4 + 3 + 1 = 8. Resultado: 85."
          ],
          [
            75,
            "Olvidaste la decena que llevabas: 4 + 3 + 1 = 8. Resultado: 85."
          ]
        ]
      ],
      [
        "356 + 278",
        634,
        "Suma con canje.",
        "6 + 8 = 14: llevas 1. Después 5 + 7 + 1 = 13: llevas 1 otra vez.",
        "6 + 8 = 14 (llevo 1); 5 + 7 + 1 = 13 (llevo 1); 3 + 2 + 1 = 6. Resultado: 634.",
        [
          [
            524,
            "Olvidaste lo que llevabas. 6 + 8 = 14 deja 4 y lleva 1; 5 + 7 + 1 = 13 deja 3 y lleva 1; 3 + 2 + 1 = 6. Resultado: 634."
          ]
        ]
      ],
      [
        "52 − 27",
        25,
        "Resta con canje.",
        "2 − 7 no alcanza: cambia una decena por 10 unidades. Ahora tienes 12 − 7.",
        "12 − 7 = 5; quedan 4 decenas: 4 − 2 = 2. Resultado: 25.",
        [
          [
            35,
            "Restaste al revés en las unidades (7 − 2). Cambia una decena: 12 − 7 = 5, y 4 − 2 = 2. Resultado: 25."
          ]
        ]
      ],
      [
        "503 − 178",
        325,
        "Resta con canje, aunque haya un cero.",
        "En las decenas hay 0: primero cambia una centena por 10 decenas, y después una decena por 10 unidades.",
        "503 es 4 centenas, 9 decenas y 13 unidades. 13 − 8 = 5; 9 − 7 = 2; 4 − 1 = 3. Resultado: 325.",
        [
          [
            475,
            "Restaste el número chico del grande en cada lugar. Cuando no alcanza, hay que cambiar: 503 − 178 = 325."
          ]
        ]
      ]
    ],
    "review": [
      "64 − 39",
      25,
      "Resta con canje.",
      "4 − 9 no alcanza: cambia una decena por 10 unidades.",
      "14 − 9 = 5; 5 − 3 = 2. Resultado: 25.",
      [
        [
          35,
          "Restaste al revés en las unidades (9 − 4). Cambia una decena: 14 − 9 = 5. Resultado: 25."
        ]
      ]
    ]
  },
  {
    "id": "base-multiplicar",
    "since": "2026-10-13",
    "title": "Multiplicar con atajos",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA04 OA 05 · Grupos iguales y atajos",
    "concept": "Multiplicar es juntar grupos iguales: 4 · 3 son 4 grupos de 3. No necesitas saber todas las tablas de memoria. Por 2 es el doble. Por 4 es el doble del doble. Por 5 es la mitad de por 10. Por 9 es por 10 menos una vez.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/4-basico/ma04-oa-05\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "9 · 8 = 10 · 8 − 8 = 80 − 8 = 72.",
    "status": "published",
    "questions": [
      [
        "6 · 4",
        24,
        "Usa el atajo del doble del doble.",
        "6 · 2 = 12. Ahora el doble de 12.",
        "6 · 2 = 12 y el doble de 12 es 24.",
        [
          [
            10,
            "Sumaste 6 + 4. Multiplicar es juntar 6 grupos de 4: 24."
          ]
        ]
      ],
      [
        "5 · 14",
        70,
        "Usa el atajo de la mitad.",
        "14 · 10 = 140. Ahora la mitad.",
        "5 · 14 es la mitad de 140: 70.",
        [
          [
            19,
            "Sumaste 5 + 14. Por 5 es la mitad de por 10: 140 ÷ 2 = 70."
          ],
          [
            140,
            "Eso es por 10. Por 5 es la mitad: 70."
          ]
        ]
      ],
      [
        "9 · 8",
        72,
        "Usa el atajo de por 10 menos una vez.",
        "10 · 8 = 80. Ahora quita un 8.",
        "9 · 8 = 80 − 8 = 72.",
        [
          [
            80,
            "Eso es 10 · 8. Por 9 es una vez menos: 80 − 8 = 72."
          ],
          [
            17,
            "Sumaste 9 + 8. Multiplicar es juntar 9 grupos de 8: 72."
          ]
        ]
      ],
      [
        "7 · 6",
        42,
        "Elige el atajo que quieras.",
        "Por ejemplo: 7 · 3 = 21, y después el doble.",
        "7 · 3 = 21 y el doble de 21 es 42. También: 7 · 5 + 7 = 35 + 7 = 42.",
        [
          [
            13,
            "Sumaste 7 + 6. Multiplicar es juntar 7 grupos de 6: 42."
          ]
        ]
      ]
    ],
    "review": [
      "9 · 7",
      63,
      "Usa el atajo que prefieras.",
      "10 · 7 = 70. Ahora quita un 7.",
      "9 · 7 = 70 − 7 = 63.",
      [
        [
          70,
          "Eso es 10 · 7. Por 9 es una vez menos: 63."
        ],
        [
          16,
          "Sumaste 9 + 7. Multiplicar es juntar 9 grupos de 7: 63."
        ]
      ]
    ]
  },
  {
    "id": "base-dividir",
    "since": "2026-10-13",
    "title": "Dividir es repartir",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA04 OA 06 · Repartir en partes iguales",
    "concept": "Dividir es repartir en partes iguales. 12 ÷ 3 es repartir 12 entre 3: a cada uno le tocan 4. Piensa en la multiplicación: ¿qué número por 3 da 12? Si no se puede repartir parejo, lo que queda es el resto.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/4-basico/ma04-oa-06\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "20 ÷ 4 = 5, porque 4 · 5 = 20. Y 23 entre 4 da 5 a cada uno y sobran 3.",
    "status": "published",
    "questions": [
      [
        "24 ÷ 4",
        6,
        "Reparte en partes iguales.",
        "¿Qué número por 4 da 24?",
        "4 · 6 = 24, así que 24 ÷ 4 = 6.",
        [
          [
            20,
            "Restaste 4. Dividir es repartir: ¿qué número por 4 da 24? Es 6."
          ],
          [
            96,
            "Multiplicaste. Dividir es lo contrario: ¿qué número por 4 da 24?"
          ]
        ]
      ],
      [
        "56 ÷ 7",
        8,
        "Reparte en partes iguales.",
        "¿Qué número por 7 da 56?",
        "7 · 8 = 56, así que 56 ÷ 7 = 8.",
        [
          [
            49,
            "Restaste 7. Dividir es repartir: ¿qué número por 7 da 56? Es 8."
          ]
        ]
      ],
      [
        "30 láminas ÷ 4 amigos",
        2,
        "Reparte 30 láminas entre 4 amigos, todos con la misma cantidad. ¿Cuántas sobran?",
        "4 · 7 = 28. ¿Cuánto falta de 28 a 30?",
        "A cada amigo le tocan 7 (4 · 7 = 28) y sobran 30 − 28 = 2.",
        [
          [
            7,
            "7 es lo que le toca a cada uno. La pregunta es cuántas sobran: 30 − 28 = 2."
          ],
          [
            7.5,
            "Las láminas no se parten: a cada uno le tocan 7 y sobran 2."
          ]
        ]
      ],
      [
        "84 ÷ 4",
        21,
        "Divide por partes.",
        "Reparte primero 80 y después 4: 80 ÷ 4 y 4 ÷ 4.",
        "80 ÷ 4 = 20; 4 ÷ 4 = 1; 20 + 1 = 21.",
        [
          [
            336,
            "Multiplicaste. Dividir es repartir: 80 ÷ 4 = 20 y 4 ÷ 4 = 1, en total 21."
          ]
        ]
      ]
    ],
    "review": [
      "63 ÷ 9",
      7,
      "Reparte en partes iguales.",
      "¿Qué número por 9 da 63?",
      "9 · 7 = 63, así que 63 ÷ 9 = 7.",
      [
        [
          54,
          "Restaste 9. Dividir es repartir: ¿qué número por 9 da 63? Es 7."
        ]
      ]
    ]
  },
  {
    "id": "base-fracciones",
    "since": "2026-10-13",
    "title": "Fracciones: partes iguales",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA04 OA 08 · Partes de un entero",
    "concept": "Una fracción es una parte de algo dividido en partes iguales. El número de abajo dice en cuántas partes se corta. El número de arriba dice cuántas partes tomas. 3/4 de una pizza: la cortas en 4 y tomas 3.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/4-basico/ma04-oa-08\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "3/4 de 20: 20 ÷ 4 = 5 en cada parte, y 3 partes son 3 · 5 = 15.",
    "status": "published",
    "questions": [
      [
        "¿En cuántas partes se corta la pizza en 3/8?",
        8,
        "Mira el número de abajo.",
        "🍕 El número de abajo dice en cuántas partes iguales se corta.",
        "En 3/8 la pizza se corta en 8 partes y se toman 3.",
        [
          [
            3,
            "El 3 es cuántas partes tomas. El número de abajo, 8, dice en cuántas se corta."
          ]
        ]
      ],
      [
        "1/4 de 20",
        5,
        "Calcula la parte.",
        "Un cuarto es dividir en 4 partes iguales.",
        "20 ÷ 4 = 5.",
        [
          [
            80,
            "Multiplicaste por 4. Un cuarto es dividir en 4 partes: 20 ÷ 4 = 5."
          ],
          [
            16,
            "Restaste 4. Un cuarto es dividir en 4 partes iguales: 5."
          ]
        ]
      ],
      [
        "3/4 de 20",
        15,
        "Calcula la parte.",
        "Primero divide 20 en 4 partes. Después toma 3 de esas partes.",
        "20 ÷ 4 = 5; 3 · 5 = 15.",
        [
          [
            5,
            "Esa es una sola parte. Necesitas 3 partes: 3 · 5 = 15."
          ],
          [
            60,
            "Te faltó dividir en 4 partes: 60 ÷ 4 = 15."
          ]
        ]
      ],
      [
        "1/2 = ?/8",
        4,
        "Encuentra la fracción equivalente.",
        "8 octavos forman la pizza entera. ¿Cuántos octavos son la mitad?",
        "La mitad de 8 es 4: 1/2 = 4/8.",
        [
          [
            2,
            "La mitad no son 2 octavos: 8 octavos forman el entero, y la mitad son 4."
          ]
        ]
      ]
    ],
    "review": [
      "2/5 de 30",
      12,
      "Calcula la parte.",
      "Divide 30 en 5 partes y toma 2.",
      "30 ÷ 5 = 6; 2 · 6 = 12.",
      [
        [
          6,
          "Esa es una sola parte. Toma 2: 2 · 6 = 12."
        ],
        [
          60,
          "Te faltó dividir en 5 partes: 60 ÷ 5 = 12."
        ]
      ]
    ]
  },
  {
    "id": "base-decimales",
    "since": "2026-10-13",
    "title": "Decimales con medidas",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA05 OA 12 · Metros, centímetros y la coma",
    "concept": "Los decimales son partes de una unidad, como los centímetros de un metro. Un metro tiene 100 centímetros: 0,5 m es la mitad, 50 cm. Para sumar o restar decimales, pon la coma debajo de la coma. Si falta una cifra, agrega un cero: 0,5 = 0,50.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/5-basico/ma05-oa-12\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "2,5 + 1,25: escribe 2,50 + 1,25 = 3,75.",
    "status": "published",
    "questions": [
      [
        "0,5 m = ? cm",
        50,
        "Convierte a centímetros.",
        "📏 Un metro tiene 100 cm. 0,5 es la mitad.",
        "0,5 · 100 = 50 cm.",
        [
          [
            5,
            "0,5 m es la mitad de un metro: la mitad de 100 cm es 50 cm."
          ]
        ]
      ],
      [
        "1,25 m = ? cm",
        125,
        "Convierte a centímetros.",
        "1 m son 100 cm y 0,25 m son 25 cm.",
        "1,25 · 100 = 125 cm.",
        [
          [
            12.5,
            "Para pasar de metros a centímetros se multiplica por 100: 125."
          ]
        ]
      ],
      [
        "2,5 + 1,25",
        3.75,
        "Suma con la coma debajo de la coma.",
        "Escribe 2,50 + 1,25.",
        "2,50 + 1,25 = 3,75.",
        [
          [
            3.3,
            "Sumaste 5 + 25 como si fueran iguales. El 5 son décimas: escribe 2,50 + 1,25 = 3,75."
          ],
          [
            1.5,
            "Alinea por la coma, no por la derecha: 2,50 + 1,25 = 3,75."
          ]
        ]
      ],
      [
        "3 − 0,4",
        2.6,
        "Resta con la coma debajo de la coma.",
        "Escribe 3 como 3,0.",
        "3,0 − 0,4 = 2,6.",
        [
          [
            1,
            "Restaste 4 − 3. Escribe 3 como 3,0: 3,0 − 0,4 = 2,6."
          ]
        ]
      ]
    ],
    "review": [
      "0,75 m = ? cm",
      75,
      "Convierte a centímetros.",
      "Un metro tiene 100 cm.",
      "0,75 · 100 = 75 cm.",
      [
        [
          7.5,
          "Para pasar de metros a centímetros se multiplica por 100: 75."
        ]
      ]
    ]
  },
  {
    "id": "multiplos-divisores",
    "since": "2026-10-14",
    "title": "Múltiplos, divisores y primos",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA06 OA 01 · Saltos, repartos y números primos",
    "concept": "Los múltiplos de un número son su tabla: los de 3 son 3, 6, 9, 12. Los divisores de un número lo reparten sin que sobre nada: los de 12 son 1, 2, 3, 4, 6 y 12. Un número primo tiene solo dos divisores: el 1 y él mismo.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/6-basico/ma06-oa-01\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "¿El 15 es múltiplo de 5? Sí, porque 5 · 3 = 15. ¿El 7 es primo? Sí: solo se divide por 1 y por 7.",
    "status": "published",
    "questions": [
      [
        "¿Cuál es el quinto múltiplo de 4?",
        20,
        "Recorre la tabla del 4.",
        "🦘 Salta de 4 en 4: 4, 8, 12, 16…",
        "Los múltiplos de 4 son 4, 8, 12, 16, 20: el quinto es 20.",
        [
          [
            9,
            "Sumaste 4 + 5. El quinto múltiplo es 4 · 5 = 20."
          ],
          [
            16,
            "Ese es el cuarto. Cuenta: 4, 8, 12, 16, 20."
          ]
        ]
      ],
      [
        "¿Cuántos divisores tiene el 12?",
        6,
        "Busca todos los números que dividen a 12 sin que sobre nada.",
        "Busca parejas que multiplicadas den 12: 1 · 12, 2 · 6, 3 · 4.",
        "Las parejas 1 · 12, 2 · 6 y 3 · 4 dan 6 divisores: 1, 2, 3, 4, 6 y 12.",
        [
          [
            4,
            "Te faltaron el 1 y el 12: también dividen a 12."
          ],
          [
            3,
            "Cada pareja tiene dos números: 1 y 12, 2 y 6, 3 y 4. Son 6 divisores."
          ]
        ]
      ],
      [
        "¿Cuál es el único número primo entre 24 y 30?",
        29,
        "Un primo solo se divide por 1 y por sí mismo.",
        "Descarta los pares y los que terminan en 5. ¿Qué queda?",
        "25 = 5 · 5 y 27 = 3 · 9 no son primos; el 29 solo se divide por 1 y por 29.",
        [
          [
            27,
            "27 = 3 · 9: tiene más divisores, no es primo."
          ],
          [
            25,
            "25 = 5 · 5: no es primo."
          ]
        ]
      ],
      [
        "Buses cada 4 y cada 6 minutos",
        12,
        "Dos buses salen juntos. Uno pasa cada 4 minutos y el otro cada 6. ¿En cuántos minutos vuelven a pasar juntos?",
        "Escribe los múltiplos de cada uno y busca el primero que se repite.",
        "Múltiplos de 4: 4, 8, 12. Múltiplos de 6: 6, 12. El primero en común es 12.",
        [
          [
            24,
            "24 también es común, pero hay uno antes: 12."
          ],
          [
            10,
            "Sumaste 4 + 6. Busca el primer múltiplo común: 12."
          ],
          [
            2,
            "El 2 es un divisor común, no un múltiplo. Buscamos cuándo coinciden: 12."
          ]
        ]
      ]
    ],
    "review": [
      "¿Cuántos divisores tiene el 18?",
      6,
      "Busca todos los números que dividen a 18 sin que sobre nada.",
      "Busca parejas: 1 · 18, 2 · 9, 3 · 6.",
      "1, 2, 3, 6, 9 y 18: son 6 divisores.",
      [
        [
          4,
          "Te faltaron el 1 y el 18: también dividen a 18."
        ],
        [
          3,
          "Cada pareja aporta dos divisores: son 6."
        ]
      ]
    ]
  },
  {
    "id": "fracciones-suma",
    "since": "2026-10-14",
    "title": "Sumar y restar fracciones",
    "subject": "matematica",
    "grade": "6b",
    "description": "MA06 OA 06 · Partes del mismo tamaño",
    "concept": "Para sumar fracciones, las partes tienen que ser del mismo tamaño. Si el número de abajo es igual, suma solo los de arriba: 1/5 + 2/5 = 3/5. Si es distinto, primero corta en partes iguales: 1/2 = 2/4. El número de abajo no se suma.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/6-basico/ma06-oa-06\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "1/2 + 1/4: la mitad son 2 cuartos, así que 2/4 + 1/4 = 3/4.",
    "status": "published",
    "questions": [
      [
        "1/5 + 2/5",
        0.6,
        "Suma las fracciones. Puedes responder como fracción, por ejemplo 3/5.",
        "🍕 Las partes ya son del mismo tamaño: suma solo los de arriba.",
        "1/5 + 2/5 = 3/5.",
        [
          [
            0.3,
            "Sumaste también los de abajo (3/10). El de abajo dice el tamaño de las partes: se queda en 5. Resultado: 3/5."
          ]
        ]
      ],
      [
        "5/8 − 3/8",
        0.25,
        "Resta las fracciones.",
        "Mismo tamaño de partes: resta solo los de arriba.",
        "5/8 − 3/8 = 2/8, que es lo mismo que 1/4."
      ],
      [
        "1/2 + 1/4",
        0.75,
        "Suma las fracciones.",
        "Corta la mitad en dos: 1/2 = 2/4.",
        "1/2 = 2/4; 2/4 + 1/4 = 3/4.",
        [
          [
            0.3333333333333333,
            "Sumaste arriba con arriba y abajo con abajo (2/6). Primero haz partes del mismo tamaño: 1/2 = 2/4. Resultado: 3/4."
          ]
        ]
      ],
      [
        "2/3 + 1/6",
        0.8333333333333334,
        "Comes 2/3 de una pizza y tu hermano 1/6. ¿Qué parte se comieron entre los dos?",
        "Corta cada tercio en dos: 2/3 = 4/6.",
        "2/3 = 4/6; 4/6 + 1/6 = 5/6.",
        [
          [
            0.3333333333333333,
            "Sumaste arriba y abajo por separado (3/9). Primero 2/3 = 4/6; después 4/6 + 1/6 = 5/6."
          ]
        ]
      ]
    ],
    "review": [
      "3/4 − 1/2",
      0.25,
      "Resta las fracciones.",
      "Escribe 1/2 como 2/4.",
      "3/4 − 2/4 = 1/4.",
      [
        [
          1,
          "Restaste arriba y abajo por separado (2/2). Primero 1/2 = 2/4: 3/4 − 2/4 = 1/4."
        ]
      ]
    ]
  },
  {
    "id": "fracciones-mult",
    "since": "2026-10-14",
    "title": "Multiplicar y dividir fracciones",
    "subject": "matematica",
    "grade": "7b",
    "description": "MA07 OA 02 · Una parte de una parte",
    "concept": "Multiplicar por una fracción es tomar una parte de algo: 1/2 · 1/3 es la mitad de un tercio. Para multiplicar, se multiplica arriba con arriba y abajo con abajo. Dividir por una fracción es contar cuántas veces cabe: 3 ÷ 1/2 es cuántas mitades caben en 3.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/7-basico/ma07-oa-02\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "2/3 · 3/4 = 6/12 = 1/2. Y 3 ÷ 1/2 = 6, porque en 3 pizzas hay 6 mitades.",
    "status": "published",
    "questions": [
      [
        "1/2 · 1/3",
        0.16666666666666666,
        "Multiplica las fracciones.",
        "🍕 La mitad de un tercio. Arriba por arriba y abajo por abajo.",
        "1 · 1 = 1 y 2 · 3 = 6: 1/6.",
        [
          [
            0.4,
            "Sumaste (2/5). Para multiplicar: arriba por arriba (1) y abajo por abajo (6): 1/6."
          ]
        ]
      ],
      [
        "2/3 · 3/4",
        0.5,
        "Multiplica las fracciones.",
        "Arriba: 2 · 3. Abajo: 3 · 4.",
        "2 · 3 = 6 y 3 · 4 = 12: 6/12, que es 1/2.",
        [
          [
            0.8888888888888888,
            "Eso es dividir (cruzaste los números). Para multiplicar: arriba por arriba y abajo por abajo: 6/12."
          ]
        ]
      ],
      [
        "3 ÷ 1/2",
        6,
        "¿Cuántas mitades caben en 3 pizzas?",
        "Cada pizza tiene 2 mitades.",
        "3 · 2 = 6 mitades.",
        [
          [
            1.5,
            "Esa es la mitad de 3. Dividir por 1/2 es contar cuántas mitades caben: 6."
          ]
        ]
      ],
      [
        "3/4 ÷ 1/4",
        3,
        "¿Cuántos cuartos caben en tres cuartos?",
        "Cuenta cuántas veces cabe un cuarto en tres cuartos.",
        "3/4 son 3 cuartos: 1/4 cabe 3 veces.",
        [
          [
            0.1875,
            "Multiplicaste. Dividir es contar cuántas veces cabe: 1/4 cabe 3 veces en 3/4."
          ]
        ]
      ]
    ],
    "review": [
      "2/3 · 1/2",
      0.3333333333333333,
      "Multiplica las fracciones.",
      "Arriba por arriba y abajo por abajo.",
      "2 · 1 = 2 y 3 · 2 = 6: 2/6, que es 1/3.",
      [
        [
          0.6,
          "Sumaste (3/5). Para multiplicar: arriba por arriba y abajo por abajo: 2/6 = 1/3."
        ]
      ]
    ]
  },
  {
    "id": "promedio",
    "since": "2026-10-14",
    "title": "Promedio, mediana y moda",
    "subject": "matematica",
    "grade": "7b",
    "description": "MA07 OA 17 · Emparejar, el del medio y el que más se repite",
    "concept": "El promedio empareja todo: suma los datos y divide por cuántos son. La mediana es el dato del medio, después de ordenarlos. La moda es el dato que más se repite.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/7-basico/ma07-oa-17\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Notas 4, 5 y 6: suman 15, y 15 ÷ 3 = 5. El promedio es 5. Ordenadas 4, 5, 6: la mediana también es 5.",
    "status": "published",
    "questions": [
      [
        "Promedio de 4, 6 y 8",
        6,
        "Calcula el promedio.",
        "📊 Suma los tres y divide por 3.",
        "4 + 6 + 8 = 18; 18 ÷ 3 = 6.",
        [
          [
            18,
            "Esa es la suma. Falta repartirla en 3: 18 ÷ 3 = 6."
          ]
        ]
      ],
      [
        "Mediana de 7, 2, 9, 4, 5",
        5,
        "Encuentra el dato del medio.",
        "Primero ordénalos de menor a mayor.",
        "Ordenados: 2, 4, 5, 7, 9. El del medio es 5.",
        [
          [
            9,
            "Tomaste el del medio sin ordenar. Ordena primero: 2, 4, 5, 7, 9. La mediana es 5."
          ]
        ]
      ],
      [
        "Moda de 3, 5, 3, 6, 3, 5",
        3,
        "Encuentra el dato que más se repite.",
        "Cuenta cuántas veces aparece cada número.",
        "El 3 aparece 3 veces y el 5, dos. La moda es 3.",
        [
          [
            5,
            "El 5 aparece 2 veces; el 3 aparece 3 veces. La moda es 3."
          ]
        ]
      ],
      [
        "Notas: 5,0; 6,0; 4,0; 5,0",
        5,
        "Tienes las notas 5,0, 6,0, 4,0 y 5,0. ¿Cuál es tu promedio?",
        "Suma las cuatro y divide por 4.",
        "5 + 6 + 4 + 5 = 20; 20 ÷ 4 = 5,0.",
        [
          [
            20,
            "Esa es la suma. Divide por 4: 5,0."
          ],
          [
            6.666666666666667,
            "Son 4 notas: divide por 4, no por 3. Resultado: 5,0."
          ]
        ]
      ]
    ],
    "review": [
      "Promedio de 3, 7, 5, 9",
      6,
      "Calcula el promedio.",
      "Suma los cuatro y divide por 4.",
      "3 + 7 + 5 + 9 = 24; 24 ÷ 4 = 6.",
      [
        [
          24,
          "Esa es la suma. Divide por 4: 6."
        ],
        [
          8,
          "Son 4 datos: divide por 4, no por 3. Resultado: 6."
        ]
      ]
    ]
  },
  {
    "id": "area-triangulos",
    "since": "2026-10-14",
    "title": "Área de triángulos y paralelogramos",
    "subject": "matematica",
    "grade": "7b",
    "description": "MA07 OA 13 · Contar cuadraditos",
    "concept": "El área cuenta cuántos cuadraditos caben en una figura. Un rectángulo de 5 por 3 tiene 5 · 3 = 15 cuadraditos. Un triángulo es la mitad de un rectángulo: base por altura, dividido en 2. Un paralelogramo se ordena como rectángulo: base por altura.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/7-basico/ma07-oa-13\nActividad original de socatres; practica aspectos del objetivo, no su cobertura completa.",
    "examples": "Triángulo de base 6 cm y altura 4 cm: 6 · 4 = 24, y la mitad es 12 cm².",
    "status": "published",
    "questions": [
      [
        "Rectángulo de 5 cm por 3 cm",
        15,
        "Calcula el área en cm².",
        "🟦 Cuenta cuadraditos: 5 por fila y 3 filas.",
        "5 · 3 = 15 cm².",
        [
          [
            16,
            "Ese es el perímetro (5 + 3 + 5 + 3). El área es 5 · 3 = 15."
          ],
          [
            8,
            "Sumaste los lados. El área es 5 · 3 = 15."
          ]
        ]
      ],
      [
        "Triángulo: base 6 cm, altura 4 cm",
        12,
        "Calcula el área en cm².",
        "Es la mitad de un rectángulo de 6 por 4.",
        "6 · 4 = 24; 24 ÷ 2 = 12 cm².",
        [
          [
            24,
            "Ese es el rectángulo completo. El triángulo es la mitad: 12."
          ],
          [
            10,
            "Sumaste base y altura. Es base por altura, dividido en 2: 12."
          ]
        ]
      ],
      [
        "Paralelogramo: base 7 cm, altura 3 cm",
        21,
        "Calcula el área en cm².",
        "Mueve el triángulo de un lado al otro: queda un rectángulo.",
        "7 · 3 = 21 cm².",
        [
          [
            10.5,
            "Dividiste por 2, pero eso es para triángulos. El paralelogramo es base por altura: 21."
          ]
        ]
      ],
      [
        "Triángulo: base 10 m, altura 5 m",
        25,
        "Un terreno con forma de triángulo tiene base 10 m y altura 5 m. ¿Cuántos metros cuadrados tiene?",
        "Base por altura, dividido en 2.",
        "10 · 5 = 50; 50 ÷ 2 = 25 m².",
        [
          [
            50,
            "Falta dividir por 2: es un triángulo. 25 m²."
          ]
        ]
      ]
    ],
    "review": [
      "Triángulo: base 8 cm, altura 5 cm",
      20,
      "Calcula el área en cm².",
      "Base por altura, dividido en 2.",
      "8 · 5 = 40; 40 ÷ 2 = 20 cm².",
      [
        [
          40,
          "Falta dividir por 2: es un triángulo. 20 cm²."
        ]
      ]
    ]
  }
];
