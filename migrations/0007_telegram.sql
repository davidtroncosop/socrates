-- Recordatorios diarios y resúmenes de avance opcionales por Telegram.
-- Menores de 14 años (consent_by IS NOT NULL) no vinculan Telegram propio:
-- el apoderado vincula su cuenta y recibe ahí avisos y resúmenes semanales.
CREATE TABLE telegram_links (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  chat_id TEXT NOT NULL UNIQUE,
  remind_hour INTEGER NOT NULL DEFAULT 18 CHECK (remind_hour BETWEEN 0 AND 23),
  time_zone TEXT NOT NULL DEFAULT 'America/Santiago',
  daily_enabled INTEGER NOT NULL DEFAULT 1 CHECK (daily_enabled IN (0, 1)),
  weekly_enabled INTEGER NOT NULL DEFAULT 1 CHECK (weekly_enabled IN (0, 1)),
  paused INTEGER NOT NULL DEFAULT 0 CHECK (paused IN (0, 1)),
  last_daily_sent TEXT,
  last_weekly_sent TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX telegram_links_chat ON telegram_links(chat_id);

-- Código temporal de un solo uso para vincular mediante t.me/<bot>?start=<codigo>.
CREATE TABLE telegram_link_codes (
  code TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  remind_hour INTEGER NOT NULL DEFAULT 18 CHECK (remind_hour BETWEEN 0 AND 23),
  time_zone TEXT NOT NULL DEFAULT 'America/Santiago',
  expires_at INTEGER NOT NULL
);
CREATE INDEX telegram_link_codes_user ON telegram_link_codes(user_id);
