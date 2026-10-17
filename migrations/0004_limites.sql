-- Límite de intentos por ventana de tiempo (inicio de sesión, registro,
-- recuperación y vinculación familiar). La clave combina la acción con la IP
-- o la cuenta; no se guarda nada más.
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL
);
