import test from "node:test";
import assert from "node:assert/strict";

test("auto-read is a per-device preference that survives reloads and broken storage", async () => {
  const store = new Map();
  globalThis.localStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) };
  const { autoRead, setAutoRead, autoReadButton } = await import("../public/speak.js");
  assert.equal(autoRead(), false, "off by default");
  setAutoRead(true);
  assert.equal(autoRead(), true);
  assert.equal(store.get("socatres.autoRead"), "1");
  assert.equal(autoReadButton(), "", "no button where the browser cannot speak");
  globalThis.localStorage = { getItem: () => { throw new Error("bloqueado"); }, setItem: () => { throw new Error("bloqueado"); } };
  assert.equal(autoRead(), false);
  assert.doesNotThrow(() => setAutoRead(true));
  delete globalThis.localStorage;
});
