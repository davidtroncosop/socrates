-- Vista docente B2B (colegios, sostenedores y equipos PIE):
-- 1) Amplía users.role a ('student', 'parent', 'teacher') conservando todos
--    los registros y claves foráneas existentes.
-- 2) Crea cursos/grupos PIE (classes) con código de pizarra y lección foco,
--    más su nómina de estudiantes (class_members).
PRAGMA defer_foreign_keys = true;

CREATE TABLE bak_sessions AS SELECT * FROM sessions;
CREATE TABLE bak_progress AS SELECT * FROM progress;
CREATE TABLE bak_family_links AS SELECT * FROM family_links;
CREATE TABLE bak_link_codes AS SELECT * FROM link_codes;
CREATE TABLE bak_push AS SELECT * FROM push_subscriptions;
CREATE TABLE bak_rewards AS SELECT * FROM family_rewards;
CREATE TABLE bak_claims AS SELECT * FROM reward_claims;
CREATE TABLE bak_tg AS SELECT * FROM telegram_links;
CREATE TABLE bak_tg_codes AS SELECT * FROM telegram_link_codes;

DELETE FROM reward_claims;
DELETE FROM family_rewards;
DELETE FROM sessions;
DELETE FROM progress;
DELETE FROM family_links;
DELETE FROM link_codes;
DELETE FROM push_subscriptions;
DELETE FROM telegram_links;
DELETE FROM telegram_link_codes;

CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher')),
  password_hash TEXT NOT NULL,
  recovery_hash TEXT,
  consent_by TEXT REFERENCES users_new(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  CHECK (email IS NOT NULL OR username IS NOT NULL)
);

INSERT INTO users_new (id, email, username, name, role, password_hash, recovery_hash, consent_by, created_at)
  SELECT id, email, username, name, role, password_hash, recovery_hash, consent_by, created_at
  FROM users
  ORDER BY consent_by IS NOT NULL;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

INSERT INTO sessions SELECT * FROM bak_sessions;
INSERT INTO progress SELECT * FROM bak_progress;
INSERT INTO family_links SELECT * FROM bak_family_links;
INSERT INTO link_codes SELECT * FROM bak_link_codes;
INSERT INTO push_subscriptions SELECT * FROM bak_push;
INSERT INTO family_rewards SELECT * FROM bak_rewards;
INSERT INTO reward_claims SELECT * FROM bak_claims;
INSERT INTO telegram_links SELECT * FROM bak_tg;
INSERT INTO telegram_link_codes SELECT * FROM bak_tg_codes;

DROP TABLE bak_sessions;
DROP TABLE bak_progress;
DROP TABLE bak_family_links;
DROP TABLE bak_link_codes;
DROP TABLE bak_push;
DROP TABLE bak_rewards;
DROP TABLE bak_claims;
DROP TABLE bak_tg;
DROP TABLE bak_tg_codes;

CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  school TEXT NOT NULL DEFAULT '',
  grade TEXT NOT NULL DEFAULT 'all',
  code TEXT NOT NULL UNIQUE,
  focus_lesson TEXT,
  focus_note TEXT NOT NULL DEFAULT '',
  focus_updated_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX classes_teacher ON classes(teacher_id);

CREATE TABLE class_members (
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at INTEGER NOT NULL,
  PRIMARY KEY (class_id, student_id)
);
CREATE INDEX class_members_student ON class_members(student_id);
