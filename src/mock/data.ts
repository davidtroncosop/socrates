export interface TeacherProfile {
  name: string;
  email: string;
  school: string;
  role: string;
  currentCourse: string;
  subject: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  status: 'logrado' | 'en_proceso' | 'requiere_revision';
  actionLabel: string;
  actionRoute: string;
}

export interface BatchItem {
  id: string;
  name: string;
  course: string;
  processedSheets: number;
  totalSheets: number;
  status: 'en_progreso' | 'completado' | 'pausado';
  date: string;
}

export interface LearningObjective {
  code: string;
  description: string;
  category: string;
  lastEvaluatedDaysAgo: number;
  achievedCount: number;
  inProcessCount: number;
  notAchievedCount: number;
  totalStudents: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  run: string;
  course: string;
  generalScorePercent: number;
  status: 'logrado' | 'en_proceso' | 'no_logrado';
  interests: string[];
  lastEvaluationScore: number;
  totalEvaluations: number;
  notes?: string;
}

export interface QuestionAnalysis {
  number: number;
  objectiveCode: string;
  correctOption: string;
  correctPercent: number;
  distractors: {
    option: string;
    percent: number;
    misconception?: string;
  }[];
}

export interface EvaluationItem {
  id: string;
  title: string;
  course: string;
  subject: string;
  date: string;
  status: 'borrador' | 'corregida' | 'publicada';
  averageScorePercent: number;
  studentsCount: number;
  questionsCount: number;
  objectives: string[];
  questions?: QuestionAnalysis[];
  rubricLevels: {
    logradoMin: number;
    enProcesoMin: number;
  };
}

export interface CourseGap {
  id: string;
  title: string;
  misconception: string;
  affectedStudentsCount: number;
  totalStudents: number;
  relatedObjective: string;
  suggestedPlan: string;
}

export interface ActivityContextSuggestion {
  id: string;
  objectiveCode: string;
  interestTitle: string;
  activityTitle: string;
  draftText: string;
  sampleProblem: string;
}

export interface ConnectedScanner {
  id: string;
  name: string;
  location: string;
  ipAddress: string;
  status: 'conectado' | 'ocupado' | 'desconectado';
  lastPing: string;
  defaultTray: string;
}

export const initialTeacherProfile: TeacherProfile = {
  name: "Prof. Carolina Herrera",
  email: "carolina.herrera@liceocordillera.cl",
  school: "Liceo Bicentenario Cordillera",
  role: "Docente de Educación Media",
  currentCourse: "8°B",
  subject: "Matemática",
};

export const availableCourses = [
  { id: "8B", name: "8°B · Matemática", level: "8° Básico", count: 42 },
  { id: "8A", name: "8°A · Matemática", level: "8° Básico", count: 40 },
  { id: "7B", name: "7°B · Matemática", level: "7° Básico", count: 38 },
];

export const mockStats: StatItem[] = [
  { value: "12", label: "evaluaciones por revisar" },
  { value: "3", label: "objetivos en riesgo" },
  { value: "1h 40min", label: "recuperadas esta semana" },
];

export const mockAttentionItems: AttentionItem[] = [
  {
    id: "att-1",
    title: "7 marcas ambiguas detectadas",
    description: "En Evaluación 3: Álgebra y Ecuaciones Lineales para 8°B.",
    status: "requiere_revision",
    actionLabel: "Revisar marcas",
    actionRoute: "/escaneo",
  },
  {
    id: "att-2",
    title: "OA 04 en riesgo crítico",
    description: "14 de 38 estudiantes no lograron el objetivo en potencias.",
    status: "en_proceso",
    actionLabel: "Ver brechas",
    actionRoute: "/feedback",
  },
  {
    id: "att-3",
    title: "Lote escaneado pendiente de confirmación",
    description: "Lote #108 con 38 hojas procesadas listo para publicación.",
    status: "logrado",
    actionLabel: "Publicar resultados",
    actionRoute: "/escaneo",
  },
  {
    id: "att-4",
    title: "2 estudiantes sin diagnóstico inicial",
    description: "Matías Soto y Camila Morales se incorporaron recientemente.",
    status: "requiere_revision",
    actionLabel: "Asignar evaluación",
    actionRoute: "/evaluaciones",
  },
];

export const mockBatches: BatchItem[] = [
  {
    id: "lote-108",
    name: "Evaluación Álgebra Básica",
    course: "8°B",
    processedSheets: 38,
    totalSheets: 45,
    status: "en_progreso",
    date: "Hoy, 09:15",
  },
  {
    id: "lote-107",
    name: "Control Rápido Fracciones",
    course: "8°A",
    processedSheets: 32,
    totalSheets: 32,
    status: "completado",
    date: "Ayer, 16:30",
  },
  {
    id: "lote-106",
    name: "Diagnóstico Semestral",
    course: "7°B",
    processedSheets: 29,
    totalSheets: 35,
    status: "pausado",
    date: "14 de septiembre",
  },
];

export const mockLearningObjectives: LearningObjective[] = [
  {
    code: "OA 01",
    description: "Mostrar que comprenden la multiplicación y la división de números enteros y racionales.",
    category: "Números",
    lastEvaluatedDaysAgo: 6,
    achievedCount: 28,
    inProcessCount: 10,
    notAchievedCount: 4,
    totalStudents: 42,
  },
  {
    code: "OA 02",
    description: "Resolver problemas que involucren proporciones directas e inversas en contextos cotidianos.",
    category: "Álgebra y Funciones",
    lastEvaluatedDaysAgo: 14,
    achievedCount: 22,
    inProcessCount: 12,
    notAchievedCount: 8,
    totalStudents: 42,
  },
  {
    code: "OA 03",
    description: "Modelar situaciones de la vida diaria y de otras asignaturas mediante ecuaciones lineales.",
    category: "Álgebra y Funciones",
    lastEvaluatedDaysAgo: 8,
    achievedCount: 18,
    inProcessCount: 14,
    notAchievedCount: 10,
    totalStudents: 42,
  },
  {
    code: "OA 04",
    description: "Explicar y fundamentar las propiedades de potencias de base racional y exponente entero.",
    category: "Números",
    lastEvaluatedDaysAgo: 3,
    achievedCount: 15,
    inProcessCount: 13,
    notAchievedCount: 14,
    totalStudents: 42,
  },
  {
    code: "OA 08",
    description: "Desarrollar y aplicar las fórmulas del área y volumen de prismas rectos y cilindros.",
    category: "Geometría",
    lastEvaluatedDaysAgo: 35,
    achievedCount: 31,
    inProcessCount: 8,
    notAchievedCount: 3,
    totalStudents: 42,
  },
];

export const mockStudents: StudentRecord[] = [
  {
    id: "est-1",
    name: "Matías Soto Miranda",
    run: "23.456.781-2",
    course: "8°B",
    generalScorePercent: 86,
    status: "logrado",
    interests: ["Roblox", "Edición de video", "Skate"],
    lastEvaluationScore: 86,
    totalEvaluations: 4,
    notes: "Buena capacidad de razonamiento geométrico.",
  },
  {
    id: "est-2",
    name: "Javiera Valenzuela Díaz",
    run: "23.891.204-K",
    course: "8°B",
    generalScorePercent: 93,
    status: "logrado",
    interests: ["Música urbana", "K-pop", "Diseño gráfico"],
    lastEvaluationScore: 93,
    totalEvaluations: 4,
  },
  {
    id: "est-3",
    name: "Martín González Muñoz",
    run: "23.112.445-3",
    course: "8°B",
    generalScorePercent: 53,
    status: "en_proceso",
    interests: ["Fútbol", "Minecraft", "Automovilismo"],
    lastEvaluationScore: 53,
    totalEvaluations: 4,
    notes: "Requiere apoyo en reglas de signos con exponentes negativos.",
  },
  {
    id: "est-4",
    name: "Camila Morales Palma",
    run: "23.774.910-8",
    course: "8°B",
    generalScorePercent: 47,
    status: "no_logrado",
    interests: ["Rescate animal", "Dibujo digital", "Ciclismo"],
    lastEvaluationScore: 47,
    totalEvaluations: 3,
    notes: "Refuerzo sugerido en despeje de incógnitas fraccionarias.",
  },
  {
    id: "est-5",
    name: "Ignacio Tapia Castro",
    run: "23.332.189-6",
    course: "8°B",
    generalScorePercent: 80,
    status: "logrado",
    interests: ["Programación", "Ajedrez", "Minecraft"],
    lastEvaluationScore: 80,
    totalEvaluations: 4,
  },
  {
    id: "est-6",
    name: "Valentina Castro Romero",
    run: "23.551.802-1",
    course: "8°B",
    generalScorePercent: 60,
    status: "en_proceso",
    interests: ["Básquetbol", "TikTok", "Fotografía"],
    lastEvaluationScore: 60,
    totalEvaluations: 4,
  },
  {
    id: "est-7",
    name: "Benjamín Silva Paredes",
    run: "23.904.312-5",
    course: "8°B",
    generalScorePercent: 40,
    status: "no_logrado",
    interests: ["Mecánica", "Trap", "Fútbol"],
    lastEvaluationScore: 40,
    totalEvaluations: 4,
  },
  {
    id: "est-8",
    name: "Fernanda Rojas Ortiz",
    run: "23.670.219-4",
    course: "8°B",
    generalScorePercent: 87,
    status: "logrado",
    interests: ["Astronomía", "Música clásica", "Lectura"],
    lastEvaluationScore: 87,
    totalEvaluations: 4,
  },
];

export const mockQuestions: QuestionAnalysis[] = [
  {
    number: 1,
    objectiveCode: "OA 01",
    correctOption: "C",
    correctPercent: 88,
    distractors: [
      { option: "A", percent: 5, misconception: "Multiplicación directa sin regla de signos" },
      { option: "B", percent: 7, misconception: "Suma de enteros en vez de producto" },
      { option: "D", percent: 0 },
    ],
  },
  {
    number: 2,
    objectiveCode: "OA 02",
    correctOption: "A",
    correctPercent: 45,
    distractors: [
      { option: "B", percent: 40, misconception: "Confusión entre proporción directa e inversa" },
      { option: "C", percent: 10, misconception: "Operación de suma en lugar de cociente" },
      { option: "D", percent: 5, misconception: "Inversión de los términos de la razón" },
    ],
  },
  {
    number: 3,
    objectiveCode: "OA 03",
    correctOption: "D",
    correctPercent: 62,
    distractors: [
      { option: "A", percent: 6, misconception: "Olvido de agrupar términos semejantes" },
      { option: "B", percent: 4, misconception: "Error de signos al trasponer un término" },
      { option: "C", percent: 28, misconception: "Traducción literal errada del enunciado verbal" },
    ],
  },
  {
    number: 4,
    objectiveCode: "OA 04",
    correctOption: "B",
    correctPercent: 38,
    distractors: [
      { option: "A", percent: 45, misconception: "Confusión de base negativa con o sin paréntesis" },
      { option: "C", percent: 12, misconception: "Multiplicación de bases distintas" },
      { option: "D", percent: 5, misconception: "Suma de exponentes con bases diferentes" },
    ],
  },
];

export const mockEvaluations: EvaluationItem[] = [
  {
    id: "eval-03",
    title: "Evaluación 3: Álgebra y Ecuaciones Lineales",
    course: "8°B",
    subject: "Matemática",
    date: "12 de septiembre de 2026",
    status: "corregida",
    averageScorePercent: 68,
    studentsCount: 42,
    questionsCount: 15,
    objectives: ["OA 02", "OA 03", "OA 04"],
    questions: mockQuestions,
    rubricLevels: {
      logradoMin: 75,
      enProcesoMin: 50,
    },
  },
  {
    id: "eval-02",
    title: "Evaluación 2: Números Racionales y Operaciones",
    course: "8°B",
    subject: "Matemática",
    date: "28 de agosto de 2026",
    status: "publicada",
    averageScorePercent: 78,
    studentsCount: 42,
    questionsCount: 20,
    objectives: ["OA 01", "OA 02"],
    rubricLevels: {
      logradoMin: 75,
      enProcesoMin: 50,
    },
  },
  {
    id: "eval-01",
    title: "Diagnóstico Inicial de Matemática",
    course: "8°B",
    subject: "Matemática",
    date: "10 de marzo de 2026",
    status: "publicada",
    averageScorePercent: 62,
    studentsCount: 40,
    questionsCount: 25,
    objectives: ["OA 01", "OA 08"],
    rubricLevels: {
      logradoMin: 75,
      enProcesoMin: 50,
    },
  },
  {
    id: "eval-04",
    title: "Control Rápido: Potencias y Raíces",
    course: "8°B",
    subject: "Matemática",
    date: "18 de septiembre de 2026",
    status: "borrador",
    averageScorePercent: 0,
    studentsCount: 42,
    questionsCount: 10,
    objectives: ["OA 04"],
    rubricLevels: {
      logradoMin: 75,
      enProcesoMin: 50,
    },
  },
];

export const mockCourseGaps: CourseGap[] = [
  {
    id: "gap-1",
    title: "Multiplicación de potencias con signos negativos",
    misconception: "Confusión sistemática entre (-a)ⁿ y -aⁿ cuando n es par. 16 estudiantes asumen que el signo siempre resulta positivo sin verificar el alcance del paréntesis.",
    affectedStudentsCount: 16,
    totalStudents: 42,
    relatedObjective: "OA 04",
    suggestedPlan: "1. Actividad de apertura de 10 min: Contraste de cálculo con calculadora y desarrollo manual.\n2. Ejemplificación con deudas y temperaturas escalonadas.\n3. Síntesis grupal: 'El paréntesis manda sobre el signo'.",
  },
  {
    id: "gap-2",
    title: "Despeje de incógnita con coeficiente fraccionario",
    misconception: "Inversión errónea del numerador y denominador al aplicar el inverso multiplicativo para despejar x en ecuaciones de la forma (a/b)x = c.",
    affectedStudentsCount: 14,
    totalStudents: 42,
    relatedObjective: "OA 03",
    suggestedPlan: "1. Visualización mediante balanza virtual de masas equivalentes.\n2. Práctica guiada en parejas con tarjetas de intercambio recíproco.\n3. 3 ejercicios de cierre para verificación formativa individual.",
  },
  {
    id: "gap-3",
    title: "Interpretación del contexto en razones inversas",
    misconception: "Multiplicación cruzada automática en problemas de velocidad y tiempo sin razonar si a mayor velocidad corresponde mayor o menor duración.",
    affectedStudentsCount: 9,
    totalStudents: 42,
    relatedObjective: "OA 02",
    suggestedPlan: "1. Análisis de tabla de datos de un viaje Santiago-Valparaíso.\n2. Pregunta orientadora: '¿Si duplico la velocidad, tardo el doble o la mitad?'.",
  },
];

export const mockActivitySuggestions: ActivityContextSuggestion[] = [
  {
    id: "sug-1",
    objectiveCode: "OA 02",
    interestTitle: "Minecraft y construcción de recursos",
    activityTitle: "Proporcionalidad en crafteo y tiempos de fundición en hornos",
    draftText: "Un grupo de jugadores de Minecraft necesita fundir 128 bloques de hierro. Con 1 horno regular tardan 21 minutos y 20 segundos. Si construyen un sistema con 4 hornos automáticos paralelos, ¿cuánto tiempo demorarán en procesar todo el material? Formula la tabla de proporcionalidad inversa y explica qué ocurre con la cantidad de carbón consumida.",
    sampleProblem: "1 horno = 1280 seg. ¿4 hornos = 320 seg?",
  },
  {
    id: "sug-2",
    objectiveCode: "OA 03",
    interestTitle: "Fútbol y rendimiento físico",
    activityTitle: "Ecuaciones de distancia recorrida y sprint en partidos",
    draftText: "En un partido del torneo escolar, el delantero central recorre una base fija de 3.5 kilómetros al trote, más una distancia variable de 0.25 kilómetros por cada sprint completado. Si al finalizar los 90 minutos el dispositivo GPS registró un total de 7.5 kilómetros, modela la ecuación lineal que permite determinar la cantidad de sprints ejecutados y resuelve justificando cada paso.",
    sampleProblem: "3.5 + 0.25x = 7.5  =>  x = 16 sprints",
  },
  {
    id: "sug-3",
    objectiveCode: "OA 04",
    interestTitle: "Edición de video y almacenamiento digital",
    activityTitle: "Potencias de base 2 en resolución de cuadros y bits",
    draftText: "Al renderizar un clip en formato 4K a 60 cuadros por segundo, cada segundo almacena 2¹⁶ bytes comprimidos en audio y 2²⁴ bytes en video. Utiliza propiedades de potencias de igual base para expresar la razón entre el peso del video y el peso del audio en un segundo de grabación.",
    sampleProblem: "2²⁴ / 2¹⁶ = 2⁸ = 256 veces más espacio",
  },
];

export const mockConnectedScanners: ConnectedScanner[] = [
  {
    id: "scan-ricoh",
    name: "Ricoh Aficio MP 5055",
    location: "Sala de Profesores · Piso 2",
    ipAddress: "192.168.1.142",
    status: "conectado",
    lastPing: "Hace 2 minutos",
    defaultTray: "Bandeja alimentadora automática (ADF)",
  },
  {
    id: "scan-canon",
    name: "Canon imageRUNNER ADVANCE DX",
    location: "Biblioteca Central",
    ipAddress: "192.168.1.155",
    status: "conectado",
    lastPing: "Hace 5 minutos",
    defaultTray: "Alimentador doble cara duplex",
  },
  {
    id: "scan-konica",
    name: "Konica Minolta bizhub 4052",
    location: "Secretaría Académica",
    ipAddress: "192.168.1.168",
    status: "ocupado",
    lastPing: "Hace 1 minuto",
    defaultTray: "Bandeja 1",
  },
];

export interface ScannedSheetReviewItem {
  id: string;
  sheetNumber: number;
  studentName: string;
  studentRun: string;
  totalQuestions: number;
  confidencePercent: number;
  hasAmbiguity: boolean;
  ambiguities: {
    questionNumber: number;
    detectedMark: string;
    alternativeMark?: string;
    reason: string;
    resolved: boolean;
    acceptedMark: string;
  }[];
  answers: {
    questionNumber: number;
    option: string;
    confidence: number;
  }[];
}

export const mockScannedSheets: ScannedSheetReviewItem[] = [
  {
    id: "sheet-3",
    sheetNumber: 3,
    studentName: "Martín González Muñoz",
    studentRun: "23.112.445-3",
    totalQuestions: 15,
    confidencePercent: 64,
    hasAmbiguity: true,
    ambiguities: [
      {
        questionNumber: 4,
        detectedMark: "B",
        alternativeMark: "C",
        reason: "Marca ambigua: borrado parcial con lápiz de grafito",
        resolved: false,
        acceptedMark: "B",
      },
      {
        questionNumber: 9,
        detectedMark: "A",
        alternativeMark: "D",
        reason: "Dos casillas con trazos visibles",
        resolved: false,
        acceptedMark: "A",
      },
    ],
    answers: [
      { questionNumber: 1, option: "C", confidence: 99 },
      { questionNumber: 2, option: "B", confidence: 95 },
      { questionNumber: 3, option: "D", confidence: 97 },
      { questionNumber: 4, option: "B", confidence: 62 },
      { questionNumber: 5, option: "A", confidence: 96 },
      { questionNumber: 6, option: "C", confidence: 98 },
      { questionNumber: 7, option: "D", confidence: 94 },
      { questionNumber: 8, option: "B", confidence: 99 },
      { questionNumber: 9, option: "A", confidence: 65 },
      { questionNumber: 10, option: "C", confidence: 92 },
      { questionNumber: 11, option: "D", confidence: 98 },
      { questionNumber: 12, option: "B", confidence: 95 },
      { questionNumber: 13, option: "A", confidence: 93 },
      { questionNumber: 14, option: "C", confidence: 96 },
      { questionNumber: 15, option: "D", confidence: 97 },
    ],
  },
  {
    id: "sheet-4",
    sheetNumber: 4,
    studentName: "Camila Morales Palma",
    studentRun: "23.774.910-8",
    totalQuestions: 15,
    confidencePercent: 71,
    hasAmbiguity: true,
    ambiguities: [
      {
        questionNumber: 8,
        detectedMark: "B",
        alternativeMark: "C",
        reason: "Marca tenue fuera del óvalo delimitador",
        resolved: false,
        acceptedMark: "B",
      },
    ],
    answers: [
      { questionNumber: 1, option: "A", confidence: 98 },
      { questionNumber: 2, option: "A", confidence: 95 },
      { questionNumber: 3, option: "C", confidence: 92 },
      { questionNumber: 4, option: "A", confidence: 96 },
      { questionNumber: 5, option: "C", confidence: 94 },
      { questionNumber: 6, option: "D", confidence: 95 },
      { questionNumber: 7, option: "A", confidence: 97 },
      { questionNumber: 8, option: "B", confidence: 68 },
      { questionNumber: 9, option: "C", confidence: 93 },
      { questionNumber: 10, option: "B", confidence: 91 },
      { questionNumber: 11, option: "D", confidence: 95 },
      { questionNumber: 12, option: "A", confidence: 97 },
      { questionNumber: 13, option: "C", confidence: 96 },
      { questionNumber: 14, option: "B", confidence: 98 },
      { questionNumber: 15, option: "A", confidence: 94 },
    ],
  },
  {
    id: "sheet-6",
    sheetNumber: 6,
    studentName: "Valentina Castro Romero",
    studentRun: "23.551.802-1",
    totalQuestions: 15,
    confidencePercent: 58,
    hasAmbiguity: true,
    ambiguities: [
      {
        questionNumber: 1,
        detectedMark: "C",
        reason: "Encabezado con escritura manuscrita tenue en casilla de RUT",
        resolved: false,
        acceptedMark: "C",
      },
    ],
    answers: [
      { questionNumber: 1, option: "C", confidence: 60 },
      { questionNumber: 2, option: "B", confidence: 95 },
      { questionNumber: 3, option: "D", confidence: 94 },
      { questionNumber: 4, option: "C", confidence: 93 },
      { questionNumber: 5, option: "B", confidence: 97 },
      { questionNumber: 6, option: "A", confidence: 96 },
      { questionNumber: 7, option: "C", confidence: 92 },
      { questionNumber: 8, option: "D", confidence: 94 },
      { questionNumber: 9, option: "B", confidence: 95 },
      { questionNumber: 10, option: "A", confidence: 98 },
      { questionNumber: 11, option: "C", confidence: 91 },
      { questionNumber: 12, option: "D", confidence: 97 },
      { questionNumber: 13, option: "B", confidence: 96 },
      { questionNumber: 14, option: "A", confidence: 95 },
      { questionNumber: 15, option: "C", confidence: 93 },
    ],
  },
];
