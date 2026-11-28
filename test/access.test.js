import test from "node:test";
import assert from "node:assert/strict";
import { daysLeft, practiceBlocked, trialBanner, paywallView, plansView, WARN_DAYS } from "../public/access.js";

const DAY = 86400000;
const now = Date.UTC(2026, 11, 1, 15);
const acct = (access, extra = {}) => ({ mode: "account", role: "student", managedByParent: false, access, ...extra });

test("only students with an expired trial are blocked; demo and free never are", () => {
  assert.equal(practiceBlocked(acct({ status: "expired" })), true);
  assert.equal(practiceBlocked(acct({ status: "trial", endsAt: now + DAY })), false);
  assert.equal(practiceBlocked(acct({ status: "free" })), false);
  assert.equal(practiceBlocked(acct({ status: "expired" }, { role: "parent" })), false, "parents keep their panel");
  assert.equal(practiceBlocked({ mode: "demo", role: "student" }), false);
  assert.equal(practiceBlocked(acct(undefined)), false, "no info yet: never block");
});

test("the countdown shows only in the last days and only to whoever pays", () => {
  assert.equal(daysLeft({ endsAt: now + 2.5 * DAY }, now), 3);
  assert.equal(trialBanner(acct({ status: "trial", endsAt: now + (WARN_DAYS + 2) * DAY, via: "self" }), now), "");
  assert.match(trialBanner(acct({ status: "trial", endsAt: now + 3 * DAY, via: "self" }), now), /Te quedan 3 días de prueba gratis/);
  assert.match(trialBanner(acct({ status: "trial", endsAt: now + 3 * 3600_000, via: "self" }), now), /Hoy es tu último día/);
  assert.equal(trialBanner(acct({ status: "trial", endsAt: now + DAY, via: "parent" }, { managedByParent: true }), now), "", "a child never sees prices or countdowns");
  assert.match(trialBanner(acct({ status: "trial", endsAt: now + DAY, via: "self" }, { role: "parent" }), now), /Ver planes/);
  assert.match(trialBanner(acct({ status: "trial", endsAt: now + DAY, via: "self" }, { role: "teacher" }), now), /piloto/);
});

test("the pause screen keeps progress safe and talks to the child, not about money", () => {
  const child = paywallView(acct({ status: "expired" }, { managedByParent: true }));
  assert.match(child, /Tu avance está guardado/);
  assert.match(child, /pídele a tu apoderado/);
  assert.doesNotMatch(child, /\$|Ver planes/);
  assert.match(paywallView(acct({ status: "expired", via: "self" })), /Ver planes/);
  const off = { available: false, canPay: true };
  assert.match(plansView(acct({ status: "trial", endsAt: now + 2 * DAY }), off, { now }), /quedan 2 días/);
  assert.match(plansView(acct({ status: "expired" }), off, { now }), /\$9\.990.*\$18\.990/s);
  assert.match(plansView(acct({ status: "expired" }), off, { now }), /Muy pronto/, "no fake pay button before Flow is ready");
  assert.doesNotMatch(plansView(acct({ status: "expired" }), off, { now }), /subscribe:/);
});

test("with Flow ready the plans page sells, shows the active plan and cancels in two steps", () => {
  const ready = { available: true, canPay: true, active: false };
  const buy = plansView(acct({ status: "trial", endsAt: now + DAY }), ready, { now });
  for (const key of ["estudiante-mes", "estudiante-anual", "familia-mes", "familia-anual"]) assert.match(buy, new RegExp(`subscribe:${key}`));
  assert.match(buy, /nunca ve los datos de tu tarjeta/);
  const until = Date.UTC(2027, 0, 10, 15);
  const active = plansView(acct({ status: "paid" }), { available: true, canPay: true, active: true, plan: "familia", paidUntil: until }, { now });
  assert.match(active, /Plan Familia activo hasta el 10 de enero de 2027; se renueva solo/);
  assert.doesNotMatch(active, /subscribe:/, "no second subscription");
  assert.match(active, /cancel-plan"/);
  assert.match(plansView(acct({ status: "paid" }), { available: true, canPay: true, active: true, plan: "familia", paidUntil: until }, { now, confirmCancel: true }), /sigues usando todo hasta el 10 de enero/);
  assert.match(plansView(acct({ status: "paid" }), { available: true, canPay: true, active: true, plan: "familia", paidUntil: until, cancelAtPeriodEnd: true }, { now }), /lo cancelaste y sigue vigente/);
  assert.match(plansView(acct({ status: "trial" }), ready, { now, result: "tarjeta" }), /no pudo registrar tu tarjeta/);
  assert.match(plansView(acct({ status: "trial" }, { managedByParent: true }), { available: true, canPay: false }, { now }), /Tu apoderado es quien activa/);
});
