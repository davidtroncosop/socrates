import test from "node:test";
import assert from "node:assert/strict";
import { SESSION_KEY, readSession, startSession, endSession } from "./auth.js";
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
