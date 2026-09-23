// Actividades originales vinculadas a objetivos de Currículum Nacional.
export const curriculumLessons = [
  {
    "id": "porcentajes",
    "title": "7° Básico · Porcentajes en la vida diaria",
    "description": "MA07 OA 04 · Números",
    "concept": "Un porcentaje expresa una cantidad por cada cien. Para calcular p % de una cantidad, multiplícala por p y divide entre 100.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70515.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "7° Básico · Radio, perímetro y área",
    "description": "MA07 OA 11 · Geometría",
    "concept": "El diámetro es dos veces el radio. La longitud de la circunferencia es 2πr y el área del círculo es πr². En esta lección usa π ≈ 3,14.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/7-basico/ma07-oa-11\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "8° Básico · Distancias con Pitágoras",
    "description": "MA08 OA 12 · Geometría",
    "concept": "En un triángulo rectángulo, a² + b² = c². Los catetos a y b forman el ángulo recto; la hipotenusa c está enfrente y es el lado más largo.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70561.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "7° Básico · Probabilidad y frecuencias",
    "description": "MA07 OA 18 · Probabilidad y estadística",
    "concept": "La frecuencia relativa es el número de veces que ocurre un evento dividido por el total de ensayos. Permite estimar probabilidades; una estimación no garantiza el resultado siguiente.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/7-basico/ma07-oa-18\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "7° Básico · Comprender una narración",
    "description": "LE07 OA 03 · Comprensión lectora",
    "concept": "Para comprender una narración, identifica el conflicto, las acciones y sus consecuencias. Toda inferencia debe apoyarse en indicios del relato.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70382.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "7° Básico · Interpretar dilemas literarios",
    "description": "LE07 OA 07 · Comprensión lectora",
    "concept": "Interpretar implica proponer un sentido y sostenerlo con detalles del texto. Un dilema enfrenta opciones con consecuencias o valores en tensión.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70386.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "7° Básico · Reconocer posturas y argumentos",
    "description": "LE07 OA 08 · Comprensión lectora",
    "concept": "La postura expresa lo que el autor defiende. Un argumento ofrece una razón para sostenerla. Evalúa si esa razón es pertinente y si se apoya en información comprobable.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70387.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "7° Básico · Leer noticias y publicidad",
    "description": "LE07 OA 09 · Comprensión lectora",
    "concept": "Al leer medios, distingue información comprobable, opiniones y propósitos. Pregunta qué quiere lograr el mensaje y si sus afirmaciones están respaldadas.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/lengua-literatura/7-basico/le07-oa-09\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "5° Básico · Resumen e ideas principales",
    "description": "LE05 OA 02 · Estrategias de lectura y síntesis",
    "concept": "Resumir consiste en extraer las ideas esenciales descartando detalles secundarios o redundantes. Pregúntate: ¿de qué habla el texto y qué es lo más importante que comunica?\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70335.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "6° Básico · Evaluar textos no literarios y fuentes",
    "description": "LE06 OA 06 · Propósito, emisor y confiabilidad de fuentes",
    "concept": "Al leer textos informativos o normativos, identifica al emisor, su propósito (informar, convencer o promover) y verifica si los datos se sustentan en fuentes comprobables o responden a intereses comerciales.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70360.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "8° Básico · Recursos poéticos y figuras literarias",
    "description": "LE08 OA 04 · Lenguaje figurado, metáforas y recursos estilísticos",
    "concept": "El lenguaje figurado sugiere asociaciones creativas entre realidades distintas. La metáfora traslada el significado de un término a otro por afinidad («el oro de sus cabellos»); la personificación confiere rasgos humanos a objetos («el viento aullaba de dolor») y la hipérbole magnifica una cualidad para enfatizar un impacto emocional.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70438.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "8° Básico · Conflictos y motivaciones en el relato",
    "description": "LE08 OA 03 · Dilemas morales, motivaciones y conflicto narrativo",
    "concept": "En una narración, los personajes actúan movidos por valores, lealtades o miedos. El conflicto surge cuando un obstáculo o dilema ético pone a prueba sus convicciones. Comprender las motivaciones permite interpretar el sentido profundo de la historia y juzgar críticamente sus desenlaces.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70437.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "1° Medio · Símbolos y visiones de mundo en la literatura",
    "description": "LE01 OA 02 · Interpretación literaria, alegorías y contexto cultural",
    "concept": "Un símbolo literario condensa ideas abstractas en objetos, personajes o espacios físicos (un pájaro enjaulado como anhelo de libertad; una tempestad como quiebre interior). Interpretar implica decodificar estos símbolos a la luz de los valores y la cosmovisión plasmados en la obra.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70487.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
    "title": "1° Medio · Lectura crítica, posturas y falacias",
    "description": "LE01 OA 10 · Argumentación, validez de razones y falacias en medios",
    "concept": "La lectura crítica evalúa la consistencia de los razonamientos. Una falacia es un argumento defectuoso que aparenta validez: el ataque personal (ad hominem), apelar al consenso masivo (ad populum) o forzar un falso dilema («o todo o nada»). Detectarlas permite discernir afirmaciones rigurosas de intentos de manipulación.\nReferencia curricular (MINEDUC): https://www.curriculumnacional.cl/614/w3-article-70495.html\nActividad original de Tutorai; practica aspectos del objetivo, no su cobertura completa.",
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
  }
];
