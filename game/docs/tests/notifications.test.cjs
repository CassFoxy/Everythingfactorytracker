const test = require("node:test"),
  assert = require("node:assert/strict");
const N = require("../../notification-model.js");
function harness() {
  let id = 0;
  const timers = new Map(),
    cancelled = [];
  const q = N.createQueue({
    schedule: (fn) => {
      timers.set(++id, fn);
      return id;
    },
    cancel: (i) => cancelled.push(i),
  });
  return { q, timers, cancelled };
}
const notice = (id, priority = "information") => ({
  id,
  priority,
  title: id,
  body: "Recorded",
  icon: "cash",
});
test("notification priority and FIFO are deterministic for a simultaneous batch", () => {
  const { q } = harness();
  q.enqueueMany([
    notice("i"),
    notice("a", "major"),
    notice("b", "major"),
    notice("p", "progression"),
  ]);
  const order = [];
  while (q.snapshot().current) {
    order.push(q.snapshot().current.id);
    q.dismiss();
  }
  assert.deepEqual(order, ["a", "b", "p", "i"]);
});
test("major notice preempts information without discarding it", () => {
  const { q } = harness();
  q.enqueueMany([notice("i")]);
  q.enqueueMany([notice("m", "major")]);
  assert.equal(q.snapshot().current.id, "m");
  q.dismiss();
  assert.equal(q.snapshot().current.id, "i");
});
test("same ID is suppressed while waiting, visible and after dismissal", () => {
  const { q } = harness();
  assert.equal(q.enqueueMany([notice("a"), notice("a")]), 1);
  q.dismiss();
  assert.equal(q.enqueueMany([notice("a")]), 0);
});
test("stale expiry cannot dismiss a newer notice", () => {
  const { q, timers } = harness();
  q.enqueueMany([notice("a"), notice("b")]);
  const old = timers.get(1);
  q.dismiss("a");
  old();
  assert.equal(q.snapshot().current.id, "b");
  assert.equal(q.dismiss("a"), false);
});
test("recovery pause cancels timers and resumes sequential delivery", () => {
  const { q, timers } = harness();
  q.enqueueMany([notice("a"), notice("b")]);
  q.setPaused(true);
  timers.get(1)();
  assert.equal(q.snapshot().current.id, "a");
  assert.equal(q.snapshot().paused, true);
  q.setPaused(false);
  [...timers.values()].at(-1)();
  assert.equal(q.snapshot().current.id, "b");
});
test("hover or keyboard hold pauses expiry without hiding the card", () => {
  const { q, timers } = harness();
  q.enqueueMany([notice("a")]);
  q.setHeld(true);
  timers.get(1)();
  assert.equal(q.snapshot().current.id, "a");
  assert.equal(q.snapshot().paused, false);
  q.setHeld(false);
  [...timers.values()].at(-1)();
  assert.equal(q.snapshot().current, null);
});
test("clear invalidates every prior timer and empties the transient queue", () => {
  const { q, timers } = harness();
  q.enqueueMany([notice("a")]);
  q.clear();
  q.enqueueMany([notice("b")]);
  timers.get(1)();
  assert.equal(q.snapshot().current.id, "b");
});
test("no automatic expiry when explicitly persistent", () => {
  const { q, timers } = harness();
  q.enqueueMany([{ ...notice("a"), duration: null }]);
  assert.equal(timers.size, 0);
  q.dismiss();
  assert.equal(q.snapshot().current, null);
});
const catalog = {
  ores: [
    { id: "amber", name: "Amber", tier: 1 },
    { id: "ruby", name: "Ruby", tier: 3 },
  ],
  achievements: {
    a: { name: "A", description: "First" },
    b: { name: "B", description: "Second" },
  },
  milestones: [10, 25, 50, 75, 100, 150, 200, 250, 300],
  shop: {
    miningPower: "Mining Power",
    miningLuck: "Mining Luck",
    miningDuplication: "Mining Duplication",
  },
  perks: {
    overallLuck: { name: "Overall Luck" },
    pickaxeDurability: { name: "Pickaxe Durability" },
  },
  pickaxes: ["Default", "Amber"],
};
const state = () => ({
  cash: 100000,
  stardust: 100,
  rebirthCount: 1,
  factoryLevel: 0,
  oreCollection: { amber: 0, ruby: 0 },
  achievements: { a: { unlocked: false }, b: { unlocked: false } },
  factoryMilestones: {},
  shop: {
    miningPower: 0,
    miningLuck: 0,
    miningDuplication: 0,
    minerUnlocked: false,
  },
  permanentPerks: { overallLuck: 0, pickaxeDurability: 0 },
  factory: {
    minerSlots: [true, false, false, false, false],
    miners: [],
    polishers: [],
    refiner: null,
    furnace: { tier: 1 },
  },
  manual: { pickaxes: [] },
});
function change(fn) {
  const before = state(),
    after = structuredClone(before);
  fn(after, before);
  const bytes = JSON.stringify([before, after]);
  const events = N.events(before, after, catalog);
  assert.equal(
    JSON.stringify([before, after]),
    bytes,
    "Presentation must not mutate state",
  );
  return events;
}
test("all discoveries, achievements, milestones and one level summary coexist", () => {
  const e = change((s) => {
    s.oreCollection = { amber: 3, ruby: 2 };
    s.achievements = { a: { unlocked: true }, b: { unlocked: true } };
    s.factoryMilestones = { 10: true, 25: true };
    s.factoryLevel = 31;
  });
  assert.deepEqual(
    e.map((n) => n.type),
    [
      "discovery",
      "discovery",
      "achievement",
      "achievement",
      "milestone",
      "milestone",
      "level",
    ],
  );
  assert.match(e.at(-1).title, /0 → 31/);
  assert.equal(e[1].tier, 3);
});
test("unchanged high-level loaded state has no replay", () => {
  const s = state();
  s.factoryLevel = 300;
  s.factoryMilestones = { 10: true };
  s.oreCollection.amber = 4;
  s.achievements.a.unlocked = true;
  assert.deepEqual(N.events(s, structuredClone(s), catalog), []);
});
test("pre-reveal milestones remain silent and first Rebirth has no historical backlog", () => {
  let s = state();
  s.rebirthCount = 0;
  let n = structuredClone(s);
  n.factoryMilestones = { 10: true, 25: true };
  n.factoryLevel = 25;
  assert.equal(
    N.events(s, n, catalog).filter((e) => e.type === "milestone").length,
    0,
  );
  s = n;
  n = structuredClone(s);
  n.rebirthCount = 1;
  n.stardust += 10;
  assert.deepEqual(
    N.events(s, n, catalog).map((e) => e.type),
    ["rebirth"],
  );
});
test("large milestone batches group with a visible count and complete level list", () => {
  const e = change((s) =>
    catalog.milestones.forEach((l) => (s.factoryMilestones[l] = true)),
  );
  assert.equal(e.length, 1);
  assert.equal(e[0].levels.length, 9);
  assert.match(e[0].title, /9 milestones/);
  assert.equal(e[0].route, "milestones");
});
for (const key of Object.keys(catalog.shop))
  test("bulk " + key + " uses one committed level/cost summary", () => {
    const e = change((s) => {
      s.shop[key] = 10;
      s.cash -= 1250;
    });
    assert.equal(e.length, 1);
    assert.match(e[0].body, /0 → 10.*1,250/);
  });
test("Stardust bulk purchase uses actual debit", () => {
  const e = change((s) => {
    s.permanentPerks.overallLuck = 10;
    s.stardust -= 55;
  });
  assert.equal(e.length, 1);
  assert.match(e[0].body, /0 → 10.*55 Stardust/);
});
test("unlock and slot access each produce progression notices", () => {
  const e = change((s) => {
    s.shop.minerUnlocked = true;
    s.factory.minerSlots[4] = true;
  });
  assert.equal(e.length, 2);
  assert.ok(e.every((e) => e.priority === "progression"));
});
for (const [key, label] of [
  ["miners", "Miner"],
  ["polishers", "Polisher"],
  ["refiner", "Refiner"],
]) {
  test(label + " purchase and replacement identify new entities", () => {
    const e = change((s) => {
      const m = { id: label.toLowerCase() + ":8", slot: 1, tier: 1 };
      if (key === "refiner") s.factory.refiner = m;
      else s.factory[key] = [m];
      s.cash -= 100;
    });
    assert.match(e[0].body, /:8.*100/);
  });
  test(label + " upgrade ignores reserved/resolved cycle changes", () => {
    const e = change((s, b) => {
      const m = { id: label.toLowerCase() + ":1", tier: 1, oreLuckLevel: 0 };
      if (key === "refiner") {
        b.factory.refiner = m;
        s.factory.refiner = { ...m, tier: 2, cycle: { phase: "reserved" } };
      } else {
        b.factory[key] = [m];
        s.factory[key] = [{ ...m, tier: 2, cycle: { phase: "resolved" } }];
      }
      s.cash -= 400;
    });
    assert.equal(e.length, 1);
    assert.match(e[0].body, /1 → 2.*400/);
  });
  test(label + " resale excludes inventory restitution from refund", () => {
    const e = change((s, b) => {
      const m = { id: label.toLowerCase() + ":1", tier: 1 };
      if (key === "refiner") b.factory.refiner = m;
      else b.factory[key] = [m];
      s.cash += 50;
      s.processedInventory = { polished: [{ amount: 100 }] };
    });
    assert.equal(e.length, 1);
    assert.match(e[0].body, /50 refunded/);
  });
}
test("cycle-only transitions emit no success or reward notice", () => {
  const e = change((s, b) => {
    b.factory.miners = [{ id: "miner:1", tier: 1 }];
    s.factory.miners = [
      { id: "miner:1", tier: 1, cycle: { phase: "resolved" } },
    ];
  });
  assert.deepEqual(e, []);
});
test("Furnace T3 unlock is separate from ordinary tier purchase", () => {
  const e = change((s, b) => {
    b.factory.furnace.tier = 2;
    s.factory.furnace.tier = 3;
    s.cash -= 1000;
  });
  assert.deepEqual(
    e.map((e) => e.type),
    ["purchase", "unlock"],
  );
});
test("craft and broken repair are distinct from perk durability increases", () => {
  const e = change((s, b) => {
    b.manual.pickaxes = [
      { id: "pickaxe:1", tier: 1, remainingDurability: 0 },
      { id: "pickaxe:2", tier: 1, remainingDurability: 200 },
    ];
    s.manual.pickaxes = [
      { id: "pickaxe:1", tier: 1, remainingDurability: 500 },
      { id: "pickaxe:2", tier: 1, remainingDurability: 300 },
      { id: "pickaxe:3", tier: 1, remainingDurability: 500 },
    ];
  });
  assert.deepEqual(
    e.map((e) => e.type),
    ["repair", "craft"],
  );
});
test("Rebirth reports actual award and never interprets resets as sales", () => {
  const e = change((s, b) => {
    b.factory.miners = [{ id: "miner:1", tier: 25 }];
    b.factory.refiner = { id: "refiner:2", tier: 10 };
    s.cash = 0;
    s.rebirthCount++;
    s.stardust += 15.25;
  });
  assert.equal(e.length, 1);
  assert.equal(e[0].type, "rebirth");
  assert.match(e[0].body, /15.25 Stardust/);
});
test("eligibility is current Cash and requires modernised Furnace", () => {
  assert.equal(
    change((s) => (s.cash = 1000000)).at(-1).type,
    "rebirthAvailable",
  );
  assert.deepEqual(
    change((s, b) => {
      delete s.factory.furnace;
      delete b.factory.furnace;
      s.cash = 1000000;
    }),
    [],
  );
});
