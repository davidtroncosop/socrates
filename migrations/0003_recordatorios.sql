-- Recordatorio diario por notificación push (una fila por dispositivo).
-- Las notificaciones van sin contenido: no se guardan claves de cifrado.
CREATE TABLE push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  remind_hour INTEGER NOT NULL CHECK (remind_hour BETWEEN 0 AND 23),
  time_zone TEXT NOT NULL,
  last_sent TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX push_subscriptions_user ON push_subscriptions(user_id);
