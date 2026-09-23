-- Uso autónomo: estudiantes y apoderados en lugar de profesores y clases.
-- - Menores de 14: cuenta creada por su apoderado (consent_by), con usuario
--   y sin correo.
-- - Código de recuperación de contraseña (solo su hash).
-- - Vínculos apoderado–estudiante y catálogo central de lecciones.
PRAGMA defer_foreign_keys = true;

-- Borrar la tabla users dispararía ON DELETE CASCADE en sesiones y progreso:
-- se respaldan y se restauran después de reconstruirla.
CREATE TABLE sessions_backup AS SELECT * FROM sessions;
CREATE TABLE progress_backup AS SELECT * FROM progress;

CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent')),
  password_hash TEXT NOT NULL,
  recovery_hash TEXT,
  consent_by TEXT REFERENCES users_new(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  CHECK (email IS NOT NULL OR username IS NOT NULL)
);
INSERT INTO users_new (id, email, name, role, password_hash, created_at)
  SELECT id, email, name, CASE role WHEN 'teacher' THEN 'parent' ELSE role END,
         password_hash, created_at
  FROM users;

DROP TABLE class_members;
DROP TABLE classes;
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

INSERT OR IGNORE INTO sessions SELECT * FROM sessions_backup;
INSERT OR IGNORE INTO progress SELECT * FROM progress_backup;
DROP TABLE sessions_backup;
DROP TABLE progress_backup;

CREATE TABLE family_links (
  parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (parent_id, child_id)
);
CREATE INDEX family_links_child ON family_links(child_id);

-- Código temporal que un estudiante entrega a su apoderado para vincularse.
CREATE TABLE link_codes (
  code TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

-- Catálogo publicado por el administrador para todos (una sola fila).
CREATE TABLE catalog (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
