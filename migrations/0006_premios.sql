-- Premios acordados en familia: el apoderado define los premios y su costo
-- en fichas; el estudiante pide el canje y el apoderado lo aprueba.
CREATE TABLE family_rewards (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  cost INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX family_rewards_parent ON family_rewards(parent_id);

-- El canje guarda nombre y costo del premio: si el apoderado lo borra, el
-- historial y las fichas gastadas se mantienen.
CREATE TABLE reward_claims (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id TEXT REFERENCES family_rewards(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  cost INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at INTEGER NOT NULL,
  decided_at INTEGER
);
CREATE INDEX reward_claims_child ON reward_claims(child_id);
CREATE INDEX reward_claims_parent ON reward_claims(parent_id);
