"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  M = require("../../factory-feedback-model.js");
const cycle = (phase = "reserved") => ({
  id: "cycle:1",
  phase,
  startedAtMs: 100,
  durationMs: 1000,
  result:
    phase === "resolved"
      ? {
          outputs: [{ resourceId: "ruby", amount: 2 }],
          cashDelta: 37.5,
          factoryXPDelta: 4,
          gemDustDelta: 1,
          itemOutcomes: [{ destroyed: true }, { destroyed: false }],
        }
      : null,
});
function state(kind, work = null) {
  const m = { id: kind + ":1", slot: 1, cycle: work },
    factory = { miners: [], polishers: [], refiner: null, furnace: null };
  if (kind === "miner") factory.miners = [m];
  else if (kind === "polisher") factory.polishers = [m];
  else factory[kind] = m;
  return { developmentProfile: "miner-1", rebirthCount: 0, factory };
}
for (const kind of ["miner", "polisher", "refiner", "furnace"]) {
  test("GAME25 " + kind + " activation only from committed reservation", () => {
    const a = state(kind),
      b = state(kind, cycle());
    assert.equal(M.events(a, b)[0].type, "activation");
    assert.deepEqual(M.events(b, structuredClone(b)), []);
    assert.deepEqual(M.events(b, state(kind, cycle("resolved"))), []);
  });
  test(
    "GAME25 " + kind + " delivery uses saved result without repricing",
    () => {
      const a = state(kind, cycle("resolved")),
        b = state(kind),
        snapshot = JSON.stringify([a, b]),
        random = Math.random;
      try {
        Math.random = () => {
          throw Error("cosmetic RNG");
        };
        const e = M.events(a, b)[0];
        assert.equal(e.cash, 37.5);
        assert.equal(e.xp, 4);
        assert.equal(e.dust, 1);
        assert.equal(e.destroyed, 1);
        assert.equal(e.outputs[0].amount, 2);
        assert.equal(JSON.stringify([a, b]), snapshot);
      } finally {
        Math.random = random;
      }
    },
  );
  test(
    "GAME25 " + kind + " cancellation/removal/Rebirth are not production",
    () => {
      assert.deepEqual(M.events(state(kind, cycle()), state(kind)), []);
      const a = state(kind, cycle("resolved")),
        b = state(kind);
      b.factory = {};
      assert.deepEqual(M.events(a, b), []);
      b.rebirthCount = 1;
      assert.deepEqual(M.events(a, b), []);
    },
  );
}
test("GAME25 captured progress is clamped and never commits", () => {
  assert.deepEqual(M.progress(null, 0), {
    state: "idle",
    percent: 0,
    remainingMs: 0,
  });
  assert.equal(M.progress(cycle(), -10).percent, 0);
  assert.equal(M.progress(cycle(), 600).percent, 50);
  assert.equal(M.progress(cycle(), 1200).state, "awaiting settlement");
  assert.equal(M.progress(cycle("resolved"), 600).state, "completing");
  assert.equal(M.progress({ ...cycle(), durationMs: 0 }, 600), null);
});
test("GAME25 all captured durations including historical 10 seconds remain authoritative", () => {
  for (const durationMs of [500, 1000, 3360.25, 7848.75, 10000, 15000]) {
    const c = { ...cycle(), durationMs };
    assert.equal(M.progress(c, 100 + durationMs / 2).percent, 50);
    assert.equal(
      M.progress(c, 100 + durationMs / 2).remainingMs,
      durationMs / 2,
    );
  }
});
test("GAME25 simultaneous machines remain independent and no legacy cycle is invented", () => {
  const a = state("miner", cycle("resolved")),
    b = state("miner");
  a.factory.polishers = [{ id: "polisher:2", cycle: cycle("resolved") }];
  b.factory.polishers = [{ id: "polisher:2", cycle: null }];
  assert.deepEqual(
    M.events(a, b).map((e) => e.kind),
    ["miner", "polisher"],
  );
  delete b.developmentProfile;
  assert.deepEqual(M.events(a, b), []);
  assert.deepEqual(M.machines({ droppers: 3 }), []);
});
