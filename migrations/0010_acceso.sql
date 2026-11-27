-- Acceso pagado: hasta cuándo está pagada la cuenta (lo llenará el cobro con
-- Flow; para un piloto con un colegio se puede poner a mano en el docente).
-- La prueba de 14 días no necesita columna: se calcula con created_at y la
-- variable BILLING_START (ver functions/_lib/access.js).
ALTER TABLE users ADD COLUMN paid_until INTEGER;
