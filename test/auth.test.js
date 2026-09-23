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
test("teacher demo and account sessions are recognized; tampered ones are not", async () => {
  const { startAccountSession, progressKey } = await import("../public/auth.js");
  const store = storage();
  startSession(store, 100, "teacher");
  assert.equal(readSession(store, 101).name, "Profesor demo");
  assert.equal(readSession(store, 101).role, "teacher");
  store.setItem(SESSION_KEY, '{"mode":"demo","name":"Estudiante demo","expiresAt":999}');
  assert.equal(readSession(store, 101).role, "student", "older demo sessions stay valid");
  store.setItem(SESSION_KEY, '{"mode":"demo","role":"teacher","name":"Estudiante demo","expiresAt":999}');
  assert.equal(readSession(store, 101), null);
  const account = startAccountSession(store, { id: "u1", name: "Ana", role: "student" }, 100);
  assert.deepEqual(readSession(store, 101), account);
  assert.equal(progressKey(account), "socatres.v1.u1");
  assert.equal(progressKey(readSession(store, 100 + 31 * 86400000)), "socatres.v1");
  store.setItem(SESSION_KEY, JSON.stringify({ ...account, role: "admin" }));
  assert.equal(readSession(store, 101), null);
});
