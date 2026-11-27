import test from "node:test";
import assert from "node:assert/strict";
import { SESSION_KEY, readSession, startSession, endSession } from "../public/auth.js";
function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}
test("demo session survives reload and expires at 24 hours", () => {
  const store = storage();
  assert.equal(readSession(store, 100), null);
  startSession(store, 100);
  assert.equal(readSession(store, 101).name, "Estudiante demo");
  assert.equal(readSession(store, 100 + 86400000), null);
});
test("logout removes session while preserving learning data", () => {
  const store = storage();
  store.setItem("socatres.v1", "progress");
  startSession(store);
  endSession(store);
  assert.equal(readSession(store), null);
  assert.equal(store.getItem("socatres.v1"), "progress");
});
test("corrupt or inaccessible session storage fails closed", () => {
  const store = storage();
  for (const value of [
    "broken",
    "null",
    "{}",
    '{"mode":"demo","name":"Estudiante demo","expiresAt":"forever"}',
  ]) {
    store.setItem(SESSION_KEY, value);
    assert.equal(readSession(store), null);
  }
  const blocked = {
    getItem() {
      throw Error("blocked");
    },
    setItem() {
      throw Error("blocked");
    },
  };
  assert.equal(readSession(blocked), null);
  assert.throws(() => startSession(blocked), /blocked/);
});
test("account and teacher demo sessions are recognized; tampered roles are rejected", async () => {
  const { startAccountSession, progressKey } = await import("../public/auth.js");
  const store = storage();
  store.setItem(SESSION_KEY, '{"mode":"demo","name":"Estudiante demo","expiresAt":999}');
  assert.equal(readSession(store, 101).role, "student", "older demo sessions stay valid");
  startSession(store, 100, "teacher");
  assert.equal(readSession(store, 101).role, "teacher", "teacher B2B demo is recognized");
  assert.equal(readSession(store, 101).name, "Docente PIE demo");
  store.setItem(SESSION_KEY, '{"mode":"demo","role":"teacher","name":"Nombre alterado","expiresAt":999}');
  assert.equal(readSession(store, 101), null, "tampered demo name is rejected");
  const account = startAccountSession(store, { id: "u1", name: "Carla", role: "parent", isAdmin: true }, 100);
  assert.deepEqual(readSession(store, 101), account);
  assert.equal(account.isAdmin, true);
  assert.equal(progressKey(account), "socatres.v1.u1");
  assert.equal(progressKey(readSession(store, 100 + 31 * 86400000)), "socatres.v1");
  const teacherAcc = startAccountSession(store, { id: "t1", name: "Profe", role: "teacher", isAdmin: false }, 100);
  assert.equal(readSession(store, 101).role, "teacher");
  assert.equal(progressKey(teacherAcc), "socatres.v1.t1");
  for (const role of ["admin", "superuser", "owner"]) {
    store.setItem(SESSION_KEY, JSON.stringify({ ...account, role }));
    assert.equal(readSession(store, 101), null, role);
  }
});
