-- Cobro con Flow. Solo se guardan los identificadores de Flow y el plan: los
-- datos de la tarjeta los registra y guarda Flow, nunca pasan por socatres.
ALTER TABLE users ADD COLUMN flow_customer_id TEXT;
ALTER TABLE users ADD COLUMN flow_subscription_id TEXT;
-- Plan pagado: 'estudiante' (1 estudiante) o 'familia' (hasta 3). NULL con
-- paid_until = acceso dado a mano (piloto con un colegio), sin límite.
ALTER TABLE users ADD COLUMN plan TEXT;
-- Plan elegido mientras la persona registra su tarjeta en Flow.
ALTER TABLE users ADD COLUMN plan_pending TEXT;
-- Última vez que se consultó la suscripción en Flow (para no consultar de más).
ALTER TABLE users ADD COLUMN billing_checked_at INTEGER;
CREATE UNIQUE INDEX users_flow_customer ON users(flow_customer_id);
