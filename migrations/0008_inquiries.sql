-- Solicitudes de piloto o licencias enviadas desde la portada por colegios, sostenedores o equipos PIE.
CREATE TABLE IF NOT EXISTS school_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_school_inquiries_created_at
  ON school_inquiries (created_at DESC);
