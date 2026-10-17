-- Medición anónima para mejorar las lecciones: solo contadores por lección,
-- ejercicio, tipo de evento y día. Sin usuario, sin IP, sin respuestas.
CREATE TABLE lesson_metrics (
  lesson TEXT NOT NULL,
  step INTEGER NOT NULL,
  kind TEXT NOT NULL,
  day TEXT NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (lesson, step, kind, day)
);
