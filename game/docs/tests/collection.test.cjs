const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  path = require("node:path");
const M = require("../../collection-model.js"),
  N = require("../../notification-model.js");
const context = vm.createContext({});
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "../../ores.js"), "utf8"),
  context,
);
const ores = JSON.parse(vm.runInContext("JSON.stringify(ORES)", context)),
  keys = Object.keys(ores),
  all = Object.fromEntries(keys.map((k) => [k, 1]));
test("GAME22 catalogue uses exactly twenty authoritative ores and canonical tier order", () => {
  const x = M.snapshot(ores, all),
    order = JSON.parse(
      vm.runInContext(
        "JSON.stringify([...TIER_1_ORES,...TIER_2_ORES,...TIER_3_ORES,...TIER_4_ORES])",
        context,
      ),
    );
  assert.equal(x.total, 20);
  assert.equal(new Set(x.entries.map((e) => e.id)).size, 20);
  assert.deepEqual(
    x.entries.map((e) => e.id),
    order,
  );
  assert.ok(!x.entries.some((e) => e.id === "stone"));
  for (const e of x.entries) {
    assert.equal(e.name, ores[e.id].name);
    assert.equal(e.tier, ores[e.id].tier);
    assert.equal(e.baseValue, ores[e.id].value);
    assert.equal(e.rarity, ores[e.id].rarity);
    assert.equal(e.icon, e.id);
  }
});
test("GAME22 completion is unique, derived, and excludes Stone materials and processed counters", () => {
  for (const count of [0, 1, 7, 20]) {
    const quantities = Object.fromEntries(
      keys.slice(0, count).map((k) => [k, 9]),
    );
    Object.assign(quantities, { stone: 99, wood: 99, polished: 99 });
    const before = structuredClone(quantities),
      x = M.snapshot(ores, quantities);
    assert.equal(x.discovered, count);
    assert.equal(x.percentage, count * 5);
    assert.deepEqual(quantities, before);
  }
  const a = M.snapshot(ores, { amber: 1 }),
    b = M.snapshot(ores, { amber: 100 });
  assert.equal(a.percentage, b.percentage);
  assert.equal(b.entries[0].amount, 100);
});
test("GAME22 unknown presentation facts contain no identifying data or quantity", () => {
  const x = M.snapshot(ores, {});
  for (const e of x.entries)
    assert.deepEqual(Object.keys(e), ["slot", "tier", "discovered"]);
  for (const key of keys) assert.equal(JSON.stringify(x).includes(key), false);
  const revealed = M.snapshot(ores, { ruby: 1 });
  assert.equal(revealed.entries.filter((e) => e.id).length, 1);
  assert.equal(revealed.entries.find((e) => e.id).name, ores.ruby.name);
});
test("GAME22 validates cumulative counts without inventing history", () => {
  for (const n of [-1, 0.5, NaN, Infinity, "1"])
    assert.throws(() => M.snapshot(ores, { amber: n }));
  assert.equal(M.snapshot(ores, {}).discovered, 0);
});
test("GAME22 discovery facts retain all distinct events and carry Collection focus targets", () => {
  const before = {
      oreCollection: {},
      achievements: {},
      factoryMilestones: {},
      factoryLevel: 0,
      rebirthCount: 0,
      cash: 0,
      shop: {},
      permanentPerks: {},
      factory: {
        minerSlots: [true, false, false, false, false],
        miners: [],
        polishers: [],
        refiner: null,
        furnace: { tier: 1 },
      },
      manual: { pickaxes: [] },
    },
    after = structuredClone(before);
  after.oreCollection = { amber: 5, ruby: 2 };
  const catalog = {
    ores: keys.map((id) => ({ id, ...ores[id] })),
    achievements: {},
    milestones: [],
    shop: {},
    perks: {},
    pickaxes: [],
  };
  const events = N.events(before, after, catalog).filter(
    (e) => e.type === "discovery",
  );
  assert.deepEqual(
    events.map((e) => e.resourceId),
    ["amber", "ruby"],
  );
  assert.ok(events.every((e) => e.route === "collection"));
  assert.equal(N.events(after, structuredClone(after), catalog).length, 0);
});
