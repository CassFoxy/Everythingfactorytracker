"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const ores = fs.readFileSync(path.join(root, "ores.js"), "utf8");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");
const KEY = "ef_incremental";

const furnaceCandidates = vm.runInNewContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); }; FurnaceUpgradeCandidateModel;');
function furnaceCandidateFixture(tier = 1, cash = 100000000000000) {
    return { cash, factory: { furnace: { id: "furnace:permanent", tier, autoEnabled: true,
        resourceMode: "oresStone", batchMode: "available", selection: null, queue: [], nextCycleSequence: 17, cycle: null } } };
}

test("Furnace upgrade candidates use each original tier quote and change only Cash and next tier", () => {
    for (let tier = 1; tier < 20; tier++) {
        for (const discount of [0, 1, 10]) {
            const target = tier + 1, raw = target === 2 ? 100 : 1000 * 4 ** (target - 3);
            const discounted = raw * (1 - 0.05 * discount);
            const step = discounted < 1000 ? 1 : discounted < 1000000 ? 10 : discounted < 1000000000 ? 1000 : 1000000;
            const paid = step * Math.floor(discounted / step + 0.5);
            const state = freezeCandidate(furnaceCandidateFixture(tier, paid + 0.5));
            const result = furnaceCandidates.prepareTierUpgrade(state, discount);
            const expected = structuredClone(state); expected.cash = 0.5; expected.factory.furnace.tier = target;
            assert.deepEqual(structuredClone(result), expected);
            assert.equal(state.cash, paid + 0.5); assert.equal(state.factory.furnace.tier, tier);
        }
    }
    assert.doesNotThrow(() => furnaceCandidates.validateCandidate(furnaceCandidateFixture(20)));
    assert.throws(() => furnaceCandidates.prepareTierUpgrade(furnaceCandidateFixture(20), 0));
    const exact = furnaceCandidates.prepareTierUpgrade(furnaceCandidateFixture(1, 100), 0);
    assert.equal(exact.cash, 0);
    assert.throws(() => furnaceCandidates.prepareTierUpgrade(furnaceCandidateFixture(), { targetTier: 20, discountLevel: 0 }));
});

test("Furnace candidates preserve preferences and independently copy every supported selection stage", () => {
    const selections = [null,
        { resourceId: "stone", stage: "raw", refineCount: 0, polishedValue: null, preRefinerValue: null, refineBonus: null },
        { resourceId: "ruby", stage: "raw", refineCount: 0, polishedValue: null, preRefinerValue: null, refineBonus: null },
        { resourceId: "ruby", stage: "polished", refineCount: 0, polishedValue: 123.456789, preRefinerValue: null, refineBonus: null },
        { resourceId: "ruby", stage: "refined", refineCount: 15, polishedValue: null, preRefinerValue: 123.456789, refineBonus: -0.9 }];
    for (const selection of selections) for (const autoEnabled of [false, true])
        for (const resourceMode of ["stoneOnly", "oresOnly", "oresStone"]) for (const batchMode of ["available", "full"]) {
            const state = furnaceCandidateFixture(2);
            Object.assign(state.factory.furnace, { selection, autoEnabled, resourceMode, batchMode }); freezeCandidate(state);
            const result = furnaceCandidates.prepareTierUpgrade(state, 0);
            const other = furnaceCandidates.prepareTierUpgrade(state, 0);
            const expected = structuredClone(state); expected.cash -= 1000; expected.factory.furnace.tier = 3;
            assert.deepEqual(structuredClone(result), expected);
            result.factory.furnace.queue.push("test");
            assert.equal(state.factory.furnace.queue.length, 0); assert.equal(other.factory.furnace.queue.length, 0);
            if (selection) {
                result.factory.furnace.selection.resourceId = "changed";
                assert.equal(other.factory.furnace.selection.resourceId, selection.resourceId);
                assert.equal(state.factory.furnace.selection.resourceId, selection.resourceId);
            }
        }
});

test("Furnace candidate validation rejects missing fields, malformed selectors and unsupported work", () => {
    for (const field of Object.keys(furnaceCandidateFixture().factory.furnace)) {
        const state = furnaceCandidateFixture(); delete state.factory.furnace[field];
        assert.throws(() => furnaceCandidates.validateCandidate(state), field);
    }
    for (const mutate of [
        s => { s.factory.furnace = null; }, s => { delete s.factory.furnace; }, s => { s.factory.furnace = []; },
        s => { s.factory.furnace.id = "furnace:1"; }, s => { s.factory.furnace.autoEnabled = 1; },
        s => { s.factory.furnace.resourceMode = "all"; }, s => { s.factory.furnace.batchMode = "partial"; },
        s => { s.factory.furnace.investment = { entries: [] }; }, s => { s.factory.furnace.owned = true; },
        s => { s.factory.furnace.queue = [{}]; }, s => { s.factory.furnace.queue.extra = true; },
        s => { s.factory.furnace.queue = {}; }, s => { s.factory.furnace.cycle = { phase: "reserved" }; },
        s => { s.factory.furnace.cycle = { phase: "resolved" }; }, s => { s.factory.furnace.selection = {}; },
        s => { s.factory.furnace.nextCycleSequence = 0; }, s => { s.factory.furnace.nextCycleSequence = Number.MAX_SAFE_INTEGER + 1; },
        s => { s.identity = { nextEntitySequence: 1, nextManualEquipSequence: 1 }; }, s => { s.factory.miners = []; },
        s => { s.factory.furnace.targetTier = 20; }]) {
        const state = furnaceCandidateFixture(); mutate(state); const before = structuredClone(state);
        assert.throws(() => furnaceCandidates.prepareTierUpgrade(state, 0)); assert.deepEqual(state, before);
    }
    for (const tier of [0, 21, 1.5, "1", null, NaN, Infinity])
        assert.throws(() => furnaceCandidates.validateCandidate(furnaceCandidateFixture(tier)));
    const selection = { resourceId: "ruby", stage: "polished", refineCount: 0, polishedValue: 123.5, preRefinerValue: null, refineBonus: null };
    for (const invalid of [{ ...selection, resourceId: "stone" }, { ...selection, resourceId: "wood" },
        { ...selection, resourceId: "unknown" }, { ...selection, amount: 1 }, { ...selection, polishedValue: Infinity },
        { ...selection, refineCount: 1 }, { ...selection, polishedValue: null }, { ...selection, stage: "unknown" }])
        assert.throws(() => furnaceCandidates.validateSelection(invalid));
    let invoked = false;
    const state = furnaceCandidateFixture(); Object.defineProperty(state, "cash", { enumerable: true, get() { invoked = true; return 100; } });
    assert.throws(() => furnaceCandidates.validateCandidate(state)); assert.equal(invoked, false);
});

test("Furnace candidate debit failures are atomic without arbitrary Cash or counter caps", () => {
    for (const cash of [0, 99, -1, "100", null, NaN, Infinity, Number.MAX_VALUE, 1e30]) {
        const state = furnaceCandidateFixture(1, cash), before = structuredClone(state);
        assert.throws(() => furnaceCandidates.prepareTierUpgrade(state, 0)); assert.deepEqual(state, before);
    }
    const state = freezeCandidate(furnaceCandidateFixture());
    for (const discount of [-1, 11, 0.5, null, undefined, "0", NaN, Infinity])
        assert.throws(() => furnaceCandidates.prepareTierUpgrade(state, discount));
    for (const invalid of [null, undefined, [], {}, { cash: 100 }, { ...state, extra: true }])
        assert.throws(() => furnaceCandidates.prepareTierUpgrade(invalid, 0));
    const large = furnaceCandidateFixture(1, 2 ** 54);
    large.factory.furnace.nextCycleSequence = Number.MAX_SAFE_INTEGER;
    const result = furnaceCandidates.prepareTierUpgrade(large, 0);
    assert.equal(large.cash - result.cash, 100);
    assert.equal(result.factory.furnace.nextCycleSequence, Number.MAX_SAFE_INTEGER);
    assert.deepEqual(Object.keys(result).sort(), ["cash", "factory"]);
});

test("Furnace pure candidates do not change schema-1 saves, prototype upgrades or timers", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 }))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timers = app.intervals.length;
        app.run(`FurnaceUpgradeCandidateModel.prepareTierUpgrade(${JSON.stringify(furnaceCandidateFixture(2))},10);`);
        assert.deepEqual(app.state(), before); assert.equal(app.intervals.length, timers); assert.equal(app.writes.length, 0);
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state(); assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const refinerCandidates = vm.runInNewContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); }; RefinerCandidateModel;');
const refinerPricing = vm.runInNewContext(ores + '\nRefinerModel;');
const refinerExternalIds = Object.freeze(["miner:1", "polisher:2", "pickaxe:3"]);
const refinerBuyOptions = Object.freeze({ discountLevel: 0, preservationLevel: 0 });
function refinerCandidateFixture(cash = 100000000000000) {
    return { cash, factory: { refiner: null }, identity: { nextEntitySequence: 8, nextManualEquipSequence: 19 } };
}
function ownedRefinerFixture(tier = 1) {
    return { id: "refiner:4", tier, selection: null, nextCycleSequence: 11, cycle: null,
        investment: { entries: [{ kind: "purchase", targetLevel: null, cashPaid: 25000.5, basis: "actual" }] } };
}

test("Refiner singleton purchases quote Discount, allocate once and create only canonical idle state", () => {
    const empty = freezeCandidate(refinerCandidateFixture());
    assert.doesNotThrow(() => refinerCandidates.validateCandidate(empty, refinerExternalIds));
    for (const [discountLevel, price] of [[0, 25000], [1, 23750], [10, 12500]]) {
        assert.equal(refinerCandidates.getPurchasePrice(discountLevel), price);
        const result = refinerCandidates.preparePurchase(empty, { discountLevel, preservationLevel: 0 }, refinerExternalIds);
        assert.equal(result.cash, empty.cash - price);
        assert.deepEqual(structuredClone(result.factory.refiner), {
            id: "refiner:8", tier: 1, selection: null, nextCycleSequence: 1, cycle: null,
            investment: { entries: [{ kind: "purchase", targetLevel: null, cashPaid: price, basis: "actual" }] }
        });
        assert.equal(result.identity.nextEntitySequence, 9);
        assert.equal(result.identity.nextManualEquipSequence, 19);
        const before = structuredClone(result);
        assert.throws(() => refinerCandidates.preparePurchase(result, refinerBuyOptions, refinerExternalIds));
        assert.deepEqual(structuredClone(result), before);
    }
    assert.equal(empty.factory.refiner, null); assert.equal(empty.identity.nextEntitySequence, 8);
});

test("Refiner Preservation grants only a starting tier with one purchase payment", () => {
    for (const preservationLevel of [0, 1, 5, 10, 25]) {
        const result = refinerCandidates.preparePurchase(refinerCandidateFixture(),
            { discountLevel: 0, preservationLevel }, refinerExternalIds);
        assert.equal(result.factory.refiner.tier, Math.min(10, Math.max(1, preservationLevel)));
        assert.equal(result.factory.refiner.investment.entries.length, 1);
        assert.equal(result.factory.refiner.investment.entries[0].cashPaid, 25000);
    }
});

test("Refiner upgrades use original tier costs, rounded Discount quotes and preserve historical payments", () => {
    for (let target = 2; target <= 10; target++) {
        const raw = 125000 * 10 ** (target - 2);
        assert.equal(refinerPricing.getRawTierUpgradeCost(target), raw);
        for (const discount of [0, 1, 10]) {
            const discounted = raw * (1 - 0.05 * discount);
            const step = discounted < 1000 ? 1 : discounted < 1000000 ? 10 : discounted < 1000000000 ? 1000 : 1000000;
            const price = step * Math.floor(discounted / step + 0.5);
            assert.equal(refinerPricing.getTierUpgradePrice(target, discount), price);
            const state = refinerCandidateFixture(price + 125.5); state.factory.refiner = ownedRefinerFixture(target - 1);
            freezeCandidate(state);
            const result = refinerCandidates.prepareTierUpgrade(state, discount, refinerExternalIds);
            assert.equal(result.cash, 125.5); assert.equal(result.factory.refiner.tier, target);
            assert.deepEqual(structuredClone(result.identity), state.identity);
            assert.equal(result.factory.refiner.nextCycleSequence, 11); assert.equal(result.factory.refiner.cycle, null);
            assert.deepEqual(structuredClone(result.factory.refiner.investment.entries), [
                state.factory.refiner.investment.entries[0], { kind: "tier", targetLevel: target, cashPaid: price, basis: "actual" }
            ]);
            assert.equal(state.factory.refiner.tier, target - 1);
        }
    }
    for (const target of [1, 11, 2.5, "2", null, NaN, Infinity])
        assert.throws(() => refinerPricing.getRawTierUpgradeCost(target));
    const capped = refinerCandidateFixture(); capped.factory.refiner = ownedRefinerFixture(10);
    assert.throws(() => refinerCandidates.prepareTierUpgrade(capped, 0, refinerExternalIds));
    assert.throws(() => refinerCandidates.prepareTierUpgrade(refinerCandidateFixture(), 0, refinerExternalIds));
});

test("Refiner idle selections validate cohort keys without requiring or reserving inventory", () => {
    assert.doesNotThrow(() => refinerCandidates.validateSelection(null));
    const ids = vm.runInNewContext(ores + '\nObject.keys(ORES);');
    for (const resourceId of ids) {
        for (let count = 0; count <= 14; count++) {
            const selection = { resourceId, stage: count ? "refined" : "polished", refineCount: count,
                polishedValue: count ? null : 123.456789, preRefinerValue: count ? 123.456789 : null,
                refineBonus: count ? -0.09 : null };
            assert.doesNotThrow(() => refinerCandidates.validateSelection(selection));
        }
    }
    const valid = { resourceId: "ruby", stage: "polished", refineCount: 0, polishedValue: 123.456789,
        preRefinerValue: null, refineBonus: null };
    for (const bad of [undefined, {}, { ...valid, resourceId: "stone" }, { ...valid, resourceId: "wood" },
        { ...valid, resourceId: "unknown" }, { ...valid, stage: "raw" }, { ...valid, amount: 1 },
        { ...valid, polishedValue: null }, { ...valid, polishedValue: Infinity },
        { ...valid, stage: "refined", refineCount: 15, polishedValue: null, preRefinerValue: 100, refineBonus: -0.9 }])
        assert.throws(() => refinerCandidates.validateSelection(bad));
    const state = refinerCandidateFixture(); state.factory.refiner = ownedRefinerFixture(); state.factory.refiner.selection = valid;
    freezeCandidate(state);
    const a = refinerCandidates.prepareTierUpgrade(state, 0, refinerExternalIds);
    const b = refinerCandidates.prepareTierUpgrade(state, 0, refinerExternalIds);
    assert.deepEqual(structuredClone(a.factory.refiner.selection), valid);
    a.factory.refiner.selection.polishedValue = 0; a.factory.refiner.investment.entries[0].cashPaid = 0;
    assert.equal(b.factory.refiner.selection.polishedValue, 123.456789);
    assert.equal(b.factory.refiner.investment.entries[0].cashPaid, 25000.5);
    assert.equal(state.factory.refiner.selection.polishedValue, 123.456789);
});

test("Refiner projection rejects malformed ownership, global identities, ledgers and active work atomically", () => {
    const valid = refinerCandidateFixture(); valid.factory.refiner = ownedRefinerFixture();
    for (const mutate of [
        s => { s.factory.refiner = []; }, s => { s.factory.refiner.slot = 1; }, s => { s.factory.refiner.queue = []; },
        s => { delete s.factory.refiner.selection; }, s => { s.factory.refiner.id = "refiner:04"; },
        s => { s.factory.refiner.id = "miner:4"; }, s => { s.factory.refiner.id = "refiner:8"; },
        s => { s.factory.refiner.nextCycleSequence = 0; }, s => { s.factory.refiner.nextCycleSequence = Number.MAX_SAFE_INTEGER + 1; },
        s => { s.factory.refiner.cycle = { phase: "reserved" }; }, s => { s.factory.refiner.cycle = { phase: "resolved" }; },
        s => { s.factory.refiner.investment.entries = []; },
        s => { s.factory.refiner.investment.entries.push({ ...s.factory.refiner.investment.entries[0] }); },
        s => { s.factory.refiner.investment.entries.push({ kind: "tier", targetLevel: 2, cashPaid: 1, basis: "actual" }); },
        s => { s.factory.refiner.investment.entries.push({ kind: "oreLuck", targetLevel: 1, cashPaid: 1, basis: "actual" }); },
        s => { s.identity.nextEntitySequence = 4; }, s => { s.identity.nextManualEquipSequence = 0; },
        s => { s.extra = true; }, s => { s.factory.miners = []; }]) {
        const state = structuredClone(valid); mutate(state); const before = structuredClone(state);
        assert.throws(() => refinerCandidates.preparePurchase(state, refinerBuyOptions, refinerExternalIds));
        assert.throws(() => refinerCandidates.prepareTierUpgrade(state, 0, refinerExternalIds));
        assert.deepEqual(state, before);
    }
    for (const tier of [0, 11, 1.5, "1", null, NaN, Infinity])
        assert.throws(() => refinerCandidates.validateIdleRefiner({ ...ownedRefinerFixture(), tier }));
    for (const ids of [undefined, ["miner:4"], ["miner:1", "pickaxe:1"], ["polisher:8"], ["refiner:7"],
        ["pickaxe:default"], ["miner:01"], ["miner:9007199254740992"], new Array(1)])
        assert.throws(() => refinerCandidates.validateCandidate(valid, ids));
    let accessed = false;
    const accessor = { ...valid, get cash() { accessed = true; return 1000000; } };
    assert.throws(() => refinerCandidates.validateCandidate(accessor, refinerExternalIds)); assert.equal(accessed, false);
    const duplicate = structuredClone(valid); duplicate.factory.refiner.tier = 2;
    duplicate.factory.refiner.investment.entries.push(...[1, 2].map(() => ({ kind: "tier", targetLevel: 2, cashPaid: 1, basis: "actual" })));
    assert.throws(() => refinerCandidates.prepareTierUpgrade(duplicate, 0, refinerExternalIds));
});

test("Refiner failures preserve inputs for funds, options, exhaustion and unrepresentable arithmetic", () => {
    for (const cash of [0, -1, "25000", null, NaN, Infinity, Number.MAX_VALUE]) {
        for (const owned of [false, true]) {
            const state = refinerCandidateFixture(cash); if (owned) state.factory.refiner = ownedRefinerFixture();
            const before = structuredClone(state);
            assert.throws(() => owned ? refinerCandidates.prepareTierUpgrade(state, 0, refinerExternalIds) :
                refinerCandidates.preparePurchase(state, refinerBuyOptions, refinerExternalIds));
            assert.deepEqual(state, before);
        }
    }
    for (const options of [null, {}, { ...refinerBuyOptions, extra: true }, { discountLevel: 11, preservationLevel: 0 },
        { discountLevel: 0, preservationLevel: 26 }, { discountLevel: 0, preservationLevel: -1 },
        { discountLevel: 0, preservationLevel: 0.5 }])
        assert.throws(() => refinerCandidates.preparePurchase(refinerCandidateFixture(), options, refinerExternalIds));
    const state = refinerCandidateFixture(); state.factory.refiner = ownedRefinerFixture();
    for (const discount of [-1, 11, 0.5, "0", null, undefined, Infinity]) {
        assert.throws(() => refinerCandidates.getPurchasePrice(discount));
        assert.throws(() => refinerCandidates.prepareTierUpgrade(state, discount, refinerExternalIds));
    }
    for (const paid of [Number.MAX_VALUE, 1e30]) {
        const candidate = structuredClone(state); candidate.factory.refiner.investment.entries[0].cashPaid = paid;
        const before = structuredClone(candidate);
        assert.throws(() => refinerCandidates.prepareTierUpgrade(candidate, 0, refinerExternalIds));
        assert.deepEqual(candidate, before);
    }
    const exhausted = refinerCandidateFixture(); exhausted.identity.nextEntitySequence = Number.MAX_SAFE_INTEGER;
    assert.throws(() => refinerCandidates.preparePurchase(exhausted, refinerBuyOptions, refinerExternalIds));
    assert.equal(exhausted.identity.nextEntitySequence, Number.MAX_SAFE_INTEGER);
    exhausted.factory.refiner = ownedRefinerFixture();
    assert.equal(refinerCandidates.prepareTierUpgrade(exhausted, 0, refinerExternalIds).identity.nextEntitySequence, Number.MAX_SAFE_INTEGER);
});

test("Refiner candidates leave schema-1 state, legacy gameplay and timers unchanged", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 }))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timers = app.intervals.length;
        app.run(`{
            const candidate = ${JSON.stringify(refinerCandidateFixture())};
            const bought = RefinerCandidateModel.preparePurchase(candidate,{discountLevel:0,preservationLevel:5},["miner:1","polisher:2","pickaxe:3"]);
            RefinerCandidateModel.prepareTierUpgrade(bought,10,["miner:1","polisher:2","pickaxe:3"]);
        }`);
        assert.deepEqual(app.state(), before); assert.equal(app.intervals.length, timers); assert.equal(app.writes.length, 0);
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state(); assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const polisherCandidates = vm.runInNewContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); }; PolisherCandidateModel;');
const polisherExternalIds = Object.freeze(["miner:1", "pickaxe:2", "refiner:3"]);
const polisherBuyOptions = Object.freeze({ discountLevel: 0, preservationLevel: 0 });
function polisherCandidateFixture(cash = 10000000) {
    return { cash, factory: { polishers: [] }, identity: { nextEntitySequence: 8, nextManualEquipSequence: 19 } };
}
function ownedPolisherFixture(slot = 1, tier = 1) {
    return { id: "polisher:4", slot, tier, selectedOreId: "ruby", queue: [], nextCycleSequence: 11, cycle: null,
        investment: { entries: [{ kind: "purchase", targetLevel: null, cashPaid: 5000.5, basis: "actual" }] } };
}

test("Polisher fixed slots can be purchased independently at catalogue prices without access ledgers", () => {
    const empty = polisherCandidateFixture();
    assert.doesNotThrow(() => polisherCandidates.validateCandidate(empty, polisherExternalIds));
    for (const [slot, raw] of [[1, 5000], [2, 100000], [3, 2000000]]) {
        for (const discount of [0, 1, 10]) {
            const price = polisherCandidates.getPurchasePrice(slot, discount);
            assert.equal(price, raw * (1 - 0.05 * discount));
            const result = polisherCandidates.preparePurchase(empty, slot,
                { discountLevel: discount, preservationLevel: 0 }, polisherExternalIds);
            assert.equal(result.cash, empty.cash - price);
            assert.deepEqual(structuredClone(result.factory.polishers[0]), {
                id: "polisher:8", slot, tier: 1, selectedOreId: null, queue: [], nextCycleSequence: 1, cycle: null,
                investment: { entries: [{ kind: "purchase", targetLevel: null, cashPaid: price, basis: "actual" }] }
            });
            assert.equal(result.identity.nextEntitySequence, 9);
            assert.equal(result.identity.nextManualEquipSequence, 19);
        }
    }
    const replacement = polisherCandidateFixture(); replacement.factory.polishers = [ownedPolisherFixture(2)];
    const result = polisherCandidates.preparePurchase(replacement, 3, polisherBuyOptions, polisherExternalIds);
    assert.equal(result.cash, replacement.cash - 2000000);
    assert.equal(result.factory.polishers[0].slot, 2);
    assert.deepEqual(empty.factory.polishers, []);
});

test("Polisher Preservation is applied once at creation with only the actual purchase payment", () => {
    for (const [level, tier] of [[0, 1], [1, 1], [5, 5], [10, 10], [25, 10]]) {
        const result = polisherCandidates.preparePurchase(polisherCandidateFixture(), 3,
            { discountLevel: 10, preservationLevel: level }, polisherExternalIds);
        assert.equal(result.factory.polishers[0].tier, tier);
        assert.equal(result.factory.polishers[0].investment.entries.length, 1);
        assert.equal(result.factory.polishers[0].investment.entries[0].cashPaid, 1000000);
    }
});

test("Polisher paid upgrades use immutable IDs and the same original tier curve across all slots", () => {
    const model = vm.runInNewContext(ores + '\nPolisherModel;');
    for (const tier of [1, 5, 9]) for (const slot of [1, 2, 3]) for (const discount of [0, 10]) {
        const price = model.getTierUpgradePrice(tier + 1, discount);
        const state = polisherCandidateFixture(price + 125.5);
        state.factory.polishers.push(ownedPolisherFixture(slot, tier));
        const before = structuredClone(state);
        const result = polisherCandidates.prepareTierUpgrade(state, "polisher:4", discount, polisherExternalIds);
        assert.equal(result.cash, 125.5);
        assert.equal(result.factory.polishers[0].tier, tier + 1);
        assert.deepEqual(structuredClone(result.factory.polishers[0].investment.entries), [before.factory.polishers[0].investment.entries[0],
            { kind: "tier", targetLevel: tier + 1, cashPaid: price, basis: "actual" }]);
        assert.equal(result.factory.polishers[0].selectedOreId, "ruby");
        assert.equal(result.factory.polishers[0].nextCycleSequence, 11);
        assert.deepEqual(structuredClone(result.identity), before.identity);
        assert.deepEqual(state, before);
    }
});

test("Polisher candidates reject invalid ownership, active work, ledger data and identity context", () => {
    const valid = polisherCandidateFixture(); valid.factory.polishers.push(ownedPolisherFixture());
    const ids = vm.runInNewContext(ores + '\nORE_KEYS;');
    for (const selectedOreId of [null, ...ids])
        assert.doesNotThrow(() => polisherCandidates.validateIdlePolisher({ ...ownedPolisherFixture(), selectedOreId }));
    for (const mutate of [s => { s.factory.polishers.push({ ...ownedPolisherFixture(2) }); },
        s => { s.factory.polishers.push({ ...ownedPolisherFixture(), id: "polisher:5" }); },
        s => { s.factory.polishers[0].id = "miner:4"; }, s => { s.factory.polishers[0].id = "polisher:04"; },
        s => { s.factory.polishers[0].selectedOreId = "stone"; }, s => { s.factory.polishers[0].selectedOreId = "unknown"; },
        s => { s.factory.polishers[0].queue = [{ lot: {} }]; }, s => { s.factory.polishers[0].cycle = { phase: "reserved" }; },
        s => { s.factory.polishers[0].cycle = { phase: "resolved" }; }, s => { s.factory.polishers[0].nextCycleSequence = 0; },
        s => { s.factory.polishers[0].investment.entries = []; },
        s => { s.factory.polishers[0].investment.entries.push({ ...s.factory.polishers[0].investment.entries[0] }); },
        s => { s.factory.polishers[0].investment.entries.push({ kind: "tier", targetLevel: 2, cashPaid: 50000, basis: "actual" }); },
        s => { s.factory.polishers[0].investment.entries.push({ kind: "oreLuck", targetLevel: 1, cashPaid: 1000, basis: "actual" }); },
        s => { s.identity.nextEntitySequence = 4; }, s => { s.extra = true; }, s => { s.factory.miners = []; }]) {
        const state = structuredClone(valid); mutate(state); const before = structuredClone(state);
        assert.throws(() => polisherCandidates.preparePurchase(state, 3, polisherBuyOptions, polisherExternalIds));
        assert.throws(() => polisherCandidates.prepareTierUpgrade(state, "polisher:4", 0, polisherExternalIds));
        assert.deepEqual(state, before);
    }
    for (const external of [undefined, ["miner:4"], ["miner:1", "pickaxe:1"], ["refiner:8"], ["polisher:7"], ["pickaxe:default"]])
        assert.throws(() => polisherCandidates.validateCandidate(valid, external));
    for (const slot of [0, 4, 1.5, "1", null, NaN]) assert.throws(() => polisherCandidates.getPurchasePrice(slot, 0));
    for (const tier of [0, 11, 1.5, "1", null, NaN])
        assert.throws(() => polisherCandidates.validateIdlePolisher({ ...ownedPolisherFixture(), tier }));
    const full = polisherCandidateFixture();
    full.factory.polishers = [1, 2, 3].map(slot => ({ ...ownedPolisherFixture(slot), id: "polisher:" + (slot + 3) }));
    assert.doesNotThrow(() => polisherCandidates.validateCandidate(full, polisherExternalIds));
    assert.throws(() => polisherCandidates.preparePurchase(full, 1, polisherBuyOptions, polisherExternalIds));
    full.factory.polishers.push({ ...ownedPolisherFixture(1), id: "polisher:7" });
    assert.throws(() => polisherCandidates.validateCandidate(full, polisherExternalIds));
});

test("Polisher failures preserve Cash and counters for invalid commands, funds, caps and precision", () => {
    for (const cash of [0, -1, "100000", null, NaN, Infinity, Number.MAX_VALUE]) {
        const state = polisherCandidateFixture(cash); const before = structuredClone(state);
        assert.throws(() => polisherCandidates.preparePurchase(state, 1, polisherBuyOptions, polisherExternalIds));
        assert.deepEqual(state, before);
    }
    const exhausted = polisherCandidateFixture(); exhausted.identity.nextEntitySequence = Number.MAX_SAFE_INTEGER;
    assert.throws(() => polisherCandidates.preparePurchase(exhausted, 1, polisherBuyOptions, polisherExternalIds));
    assert.equal(exhausted.identity.nextEntitySequence, Number.MAX_SAFE_INTEGER);
    for (const options of [null, {}, { ...polisherBuyOptions, extra: true }, { discountLevel: 11, preservationLevel: 0 },
        { discountLevel: 0, preservationLevel: 26 }, { discountLevel: 0, preservationLevel: 0.5 }])
        assert.throws(() => polisherCandidates.preparePurchase(polisherCandidateFixture(), 1, options, polisherExternalIds));
    const state = polisherCandidateFixture(); state.factory.polishers.push(ownedPolisherFixture());
    for (const cash of [0, Number.MAX_VALUE]) {
        const candidate = structuredClone(state); candidate.cash = cash;
        const before = structuredClone(candidate);
        assert.throws(() => polisherCandidates.prepareTierUpgrade(candidate, "polisher:4", 0, polisherExternalIds));
        assert.deepEqual(candidate, before);
    }
    assert.throws(() => polisherCandidates.preparePurchase(state, 1, polisherBuyOptions, polisherExternalIds));
    for (const id of ["polisher:99", "polisher:04", 4, null, undefined])
        assert.throws(() => polisherCandidates.prepareTierUpgrade(state, id, 0, polisherExternalIds));
    for (const discount of [-1, 11, 0.5, "0", null, undefined, Infinity])
        assert.throws(() => polisherCandidates.prepareTierUpgrade(state, "polisher:4", discount, polisherExternalIds));
    state.factory.polishers[0].tier = 10;
    assert.throws(() => polisherCandidates.prepareTierUpgrade(state, "polisher:4", 0, polisherExternalIds));
    state.factory.polishers[0].tier = 1;
    for (const paid of [Number.MAX_VALUE, 1e30]) {
        state.factory.polishers[0].investment.entries[0].cashPaid = paid;
        const before = structuredClone(state);
        assert.throws(() => polisherCandidates.prepareTierUpgrade(state, "polisher:4", 0, polisherExternalIds));
        assert.deepEqual(state, before);
    }
});

test("Polisher purchase and upgrade candidates independently preserve other entities and nested state", () => {
    const state = polisherCandidateFixture(); state.factory.polishers.push(ownedPolisherFixture(2));
    freezeCandidate(state);
    const a = polisherCandidates.preparePurchase(state, 3, polisherBuyOptions, polisherExternalIds);
    const b = polisherCandidates.preparePurchase(state, 3, polisherBuyOptions, polisherExternalIds);
    assert.deepEqual(structuredClone(a.factory.polishers[0]), state.factory.polishers[0]);
    const upgraded = polisherCandidates.prepareTierUpgrade(a, "polisher:8", 0, polisherExternalIds);
    assert.deepEqual(structuredClone(upgraded.factory.polishers[0]), state.factory.polishers[0]);
    assert.equal(upgraded.identity.nextEntitySequence, 9);
    for (const index of [0, 1]) {
        a.factory.polishers[index].investment.entries[0].cashPaid = 0;
        a.factory.polishers[index].queue.push("test");
        assert.notEqual(b.factory.polishers[index].investment.entries[0].cashPaid, 0);
        assert.equal(upgraded.factory.polishers[index].queue.length, 0);
        assert.equal(b.factory.polishers[index].queue.length, 0);
    }
    assert.equal(state.factory.polishers[0].investment.entries[0].cashPaid, 5000.5);
    assert.equal(state.identity.nextEntitySequence, 8);
});

test("Polisher candidates never change live schema-1 saves, legacy machines, inventory or timers", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 }))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timers = app.intervals.length;
        app.run(`{
            const candidate = ${JSON.stringify(polisherCandidateFixture(1000000000))};
            const bought = PolisherCandidateModel.preparePurchase(candidate,3,{discountLevel:0,preservationLevel:5},["miner:1","pickaxe:2","refiner:3"]);
            PolisherCandidateModel.prepareTierUpgrade(bought,"polisher:8",10,["miner:1","pickaxe:2","refiner:3"]);
        }`);
        assert.deepEqual(app.state(), before); assert.equal(app.intervals.length, timers); assert.equal(app.writes.length, 0);
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state(); assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const upgradeContext = vm.createContext({});
vm.runInContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); };', upgradeContext);
const minerUpgrades = vm.runInContext("MinerUpgradeCandidateModel", upgradeContext);
const upgradeOtherIds = Object.freeze(["pickaxe:7"]);
function upgradeFixture(tier = 1, oreLuckLevel = 0, cash = 1000000, paid = 100.5) {
    const miner = (id, slot) => ({ id, slot, tier, oreLuckLevel, nextCycleSequence: 17, cycle: null,
        investment: { entries: [{ kind: "purchase", targetLevel: null, cashPaid: paid, basis: "actual" }] } });
    return { cash, shop: { minerUnlocked: true }, identity: { nextEntitySequence: 9, nextManualEquipSequence: 4 },
        factory: { minerSlots: [true, false, false, false, true], miners: [miner("miner:2", 5), miner("miner:1", 1)] } };
}

test("Miner tier upgrade candidates use next owned tier, milestone prices and exact proposed payments", () => {
    const tiers = vm.runInContext("MinerTierModel", upgradeContext);
    for (const [current, discount] of [[1, 0], [1, 10], [5, 0], [6, 1], [24, 0]]) {
        const price = tiers.getTierUpgradePrice(current + 1, discount);
        const state = upgradeFixture(current, 3, price, current === 24 ? 0 : 100.5);
        const before = structuredClone(state);
        const result = minerUpgrades.prepareTierUpgrade(state, "miner:1", discount, upgradeOtherIds);
        assert.equal(result.cash, 0);
        const target = result.factory.miners.find(m => m.id === "miner:1");
        assert.equal(target.tier, current + 1); assert.equal(target.oreLuckLevel, 3);
        assert.deepEqual(structuredClone(target.investment.entries), [before.factory.miners[1].investment.entries[0],
            { kind: "tier", targetLevel: current + 1, cashPaid: price, basis: "actual" }]);
        assert.deepEqual(structuredClone(result.factory.miners[0]), before.factory.miners[0]);
        assert.deepEqual(state, before);
    }
    const preserved = upgradeFixture(5);
    assert.equal(minerUpgrades.prepareTierUpgrade(preserved, "miner:1", 0, upgradeOtherIds).cash, 808000);
    assert.equal(minerUpgrades.prepareTierUpgrade(upgradeFixture(6), "miner:1", 0, upgradeOtherIds).cash, 232000);
    assert.equal(minerUpgrades.prepareTierUpgrade(upgradeFixture(1), "miner:1", 10, upgradeOtherIds).cash, 999800);
});

test("Miner Ore Luck candidate upgrades round original prices without Discount or cross-Miner changes", () => {
    const luck = vm.runInContext("MinerOreLuckModel", upgradeContext);
    for (const current of [0, 2, 24, 49]) {
        const price = luck.getUpgradePrice(current + 1, 0);
        const state = upgradeFixture(7, current, price + 125.5);
        const before = structuredClone(state);
        const zero = minerUpgrades.prepareOreLuckUpgrade(state, "miner:2", 0, upgradeOtherIds);
        const discounted = minerUpgrades.prepareOreLuckUpgrade(state, "miner:2", 10, upgradeOtherIds);
        assert.deepEqual(structuredClone(zero), structuredClone(discounted));
        assert.equal(zero.cash, 125.5);
        assert.equal(zero.factory.miners[0].oreLuckLevel, current + 1);
        assert.equal(zero.factory.miners[0].tier, 7);
        assert.deepEqual(structuredClone(zero.factory.miners[0].investment.entries.at(-1)),
            { kind: "oreLuck", targetLevel: current + 1, cashPaid: price, basis: "actual" });
        assert.deepEqual(structuredClone(zero.factory.miners[1]), before.factory.miners[1]);
        assert.deepEqual(state, before);
    }
});

test("Miner upgrades independently clone the full supported projection without consuming identities", () => {
    const state = upgradeFixture(); state.identity.nextEntitySequence = Number.MAX_SAFE_INTEGER;
    freezeCandidate(state);
    const first = minerUpgrades.prepareTierUpgrade(state, "miner:1", 0, upgradeOtherIds);
    const second = minerUpgrades.prepareTierUpgrade(state, "miner:1", 0, upgradeOtherIds);
    assert.deepEqual(structuredClone(first.identity), state.identity);
    assert.deepEqual(structuredClone(first.factory.minerSlots), state.factory.minerSlots);
    assert.deepEqual(structuredClone(first.shop), state.shop);
    for (let i = 0; i < 2; i++) {
        assert.equal(first.factory.miners[i].nextCycleSequence, 17);
        assert.equal(first.factory.miners[i].cycle, null);
        assert.notEqual(first.factory.miners[i], second.factory.miners[i]);
        assert.notEqual(first.factory.miners[i].investment.entries, second.factory.miners[i].investment.entries);
        first.factory.miners[i].investment.entries[0].cashPaid = 0;
        assert.equal(second.factory.miners[i].investment.entries[0].cashPaid, 100.5);
        assert.equal(state.factory.miners[i].investment.entries[0].cashPaid, 100.5);
    }
    first.identity.nextManualEquipSequence = 999; first.shop.minerUnlocked = false;
    first.factory.minerSlots[4] = false;
    assert.equal(state.identity.nextManualEquipSequence, 4);
    assert.equal(second.shop.minerUnlocked, true); assert.equal(second.factory.minerSlots[4], true);
});

test("Miner upgrade failures preserve inputs for caps, malformed commands, ownership, cycles and ledgers", () => {
    const calls = [minerUpgrades.prepareTierUpgrade, minerUpgrades.prepareOreLuckUpgrade];
    function rejects(state, call, id = "miner:1", discount = 0, ids = upgradeOtherIds) {
        const before = structuredClone(state);
        assert.throws(() => call(state, id, discount, ids));
        assert.deepEqual(state, before);
    }
    rejects(upgradeFixture(25), calls[0]); rejects(upgradeFixture(1, 50), calls[1]);
    for (const call of calls) {
        for (const id of ["miner:999", "miner:01", "polisher:1", 1, null, {}]) rejects(upgradeFixture(), call, id);
        assert.throws(() => call(upgradeFixture(), undefined, 0, upgradeOtherIds));
        assert.throws(() => call(upgradeFixture(), "miner:1", undefined, upgradeOtherIds));
        for (const level of [-1, 11, 0.5, "0", null, NaN, Infinity]) rejects(upgradeFixture(), call, "miner:1", level);
        for (const cash of [0, -1, "1000", null, NaN, Infinity]) rejects(upgradeFixture(1, 0, cash), call);
        for (const mutate of [s => { s.factory.miners[0].id = "miner:1"; },
            s => { s.factory.miners[1].id = "miner:01"; }, s => { s.factory.minerSlots[4] = false; },
            s => { s.factory.miners[1].investment.entries = []; },
            s => { s.factory.miners[1].investment.entries.push({ ...s.factory.miners[1].investment.entries[0] }); },
            s => { s.factory.miners[1].tier = 0; }, s => { s.factory.miners[1].oreLuckLevel = 51; },
            s => { s.identity.nextEntitySequence = 2; }, s => { s.extension = { preserved: true }; },
            s => { s.factory.miners[0].extra = 1; }]) {
            const state = upgradeFixture(); mutate(state); rejects(state, call);
        }
        for (const phase of ["reserved", "resolved"]) for (const index of [0, 1]) {
            const state = upgradeFixture(); state.factory.miners[index].cycle = { phase };
            rejects(state, call); // All active cycles unsupported, including non-targets.
        }
        rejects(null, call); rejects({}, call);
        rejects(upgradeFixture(), call, "miner:1", 0, ["pickaxe:2"]);
        assert.throws(() => call(upgradeFixture(), "miner:1", 0)); // Required external ownership context.
    }
    for (const [call, kind, targetLevel] of [[calls[0], "tier", 2], [calls[1], "oreLuck", 1]]) {
        const state = upgradeFixture();
        state.factory.miners[1].investment.entries.push({ kind, targetLevel, cashPaid: 100, basis: "actual" });
        rejects(state, call); // Existing candidate validation rejects history above owned level before appending.
    }
});

test("Miner candidate upgrades reject unrepresentable debits and ledger sums without partial changes", () => {
    for (const call of [minerUpgrades.prepareTierUpgrade, minerUpgrades.prepareOreLuckUpgrade]) {
        for (const state of [upgradeFixture(1, 0, Number.MAX_VALUE),
            upgradeFixture(1, 0, 10000, Number.MAX_VALUE), upgradeFixture(1, 0, 10000, 1e30)]) {
            const before = structuredClone(state);
            assert.throws(() => call(state, "miner:1", 0, upgradeOtherIds));
            assert.deepEqual(state, before);
        }
    }
    const state = upgradeFixture(1, 0, 400.5);
    const result = minerUpgrades.prepareTierUpgrade(state, "miner:1", 0, upgradeOtherIds);
    assert.equal(result.cash, 0.5);
    assert.equal(result.factory.miners[1].investment.entries[0].cashPaid, 100.5);
});

test("Miner candidate upgrades compose deterministically without fabricated paid history", () => {
    const initial = upgradeFixture(5, 0, 1000000);
    const tiered = minerUpgrades.prepareTierUpgrade(initial, "miner:1", 0, upgradeOtherIds);
    const lucked = minerUpgrades.prepareOreLuckUpgrade(tiered, "miner:1", 10, upgradeOtherIds);
    assert.equal(lucked.cash, 807000);
    assert.equal(lucked.factory.miners[1].tier, 6); assert.equal(lucked.factory.miners[1].oreLuckLevel, 1);
    assert.deepEqual(Array.from(lucked.factory.miners[1].investment.entries, p => [p.kind, p.targetLevel, p.cashPaid]),
        [["purchase", null, 100.5], ["tier", 6, 192000], ["oreLuck", 1, 1000]]);
    assert.equal(initial.factory.miners[1].investment.entries.length, 1);
    assert.equal(tiered.factory.miners[1].investment.entries.length, 2);
    assert.deepEqual(structuredClone(lucked), structuredClone(minerUpgrades.prepareOreLuckUpgrade(
        minerUpgrades.prepareTierUpgrade(initial, "miner:1", 0, upgradeOtherIds), "miner:1", 10, upgradeOtherIds)));
});

test("Miner upgrade preparation never writes candidates to live schema-1 saves or changes legacy gameplay", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 }))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timers = app.intervals.length;
        app.run(`{
            const candidate = ${JSON.stringify(upgradeFixture())};
            const upgraded = MinerUpgradeCandidateModel.prepareTierUpgrade(candidate,"miner:1",0,["pickaxe:7"]);
            MinerUpgradeCandidateModel.prepareOreLuckUpgrade(upgraded,"miner:1",10,["pickaxe:7"]);
        }`);
        assert.deepEqual(app.state(), before); assert.equal(app.intervals.length, timers); assert.equal(app.writes.length, 0);
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state(); assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const furnaceContext = vm.createContext({});
vm.runInContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); };', furnaceContext);
const furnace = vm.runInContext("FurnaceModel", furnaceContext);

test("Furnace tiers have exact capacity, noncumulative value, full-precision speed and automation gates", () => {
    for (let tier = 1; tier <= 20; tier++) {
        assert.equal(furnace.getCapacity(tier), 50 * tier);
        assert.equal(furnace.getTierValueMultiplier(tier), 1 + 0.25 * (tier - 1));
        assert.equal(furnace.isAutoProcessingEligible(tier), tier >= 3);
        const normal = Math.max(1, 10 * 0.1 ** ((tier - 1) / 19));
        assert.equal(furnace.getNormalInterval(tier), normal);
        for (const speed of [0, 1, 25, 50]) {
            assert.equal(furnace.getFinalInterval(tier, speed), Math.max(0.5, normal * (1 - 0.01 * speed)));
            assert.ok(furnace.getFinalInterval(tier, speed) >= 0.5);
        }
    }
    assert.equal(furnace.getCapacity(1), 50); assert.equal(furnace.getCapacity(20), 1000);
    assert.equal(furnace.getTierValueMultiplier(20), 5.75);
    assert.equal(furnace.getNormalInterval(1), 10); assert.equal(furnace.getNormalInterval(20), 1);
    assert.equal(furnace.getFinalInterval(1, 50), 5); assert.equal(furnace.getFinalInterval(20, 50), 0.5);
    assert.notEqual(furnace.getNormalInterval(2), 8.8587);
});

test("Furnace sale values apply only tier and Rebirth factors to supplied historical values", () => {
    assert.equal(furnace.getRebirthValueMultiplier(0), 1);
    assert.equal(furnace.getRebirthValueMultiplier(5000), 6);
    for (const level of [0, 1, 2500, 5000]) {
        assert.equal(furnace.getRebirthValueMultiplier(level), 1 + 0.001 * level);
        assert.equal(furnace.calculateSaleValue(123.456789, 20, level), 123.456789 * 5.75 * (1 + 0.001 * level));
    }
    assert.equal(furnace.calculateSaleValue(0, 20, 5000), 0);
    assert.equal(furnace.calculateSaleValue(1, 1, 0), 1); // Explicit Stone basis, no modifier policy inferred.
    const models = vm.runInContext("({InventoryModel,PolisherModel,RefinerModel})", furnaceContext);
    const polished = models.PolisherModel.createPolishedLot("ruby", 2, 123.456789);
    const refined = models.RefinerModel.createRefinedLot(polished, 1, 0);
    const before = structuredClone({ polished, refined });
    assert.equal(furnace.calculateSaleValue(polished.polishedValue, 2, 0), 123.456789 * 1.25);
    const refinedValue = refined.preRefinerValue * (1 + refined.refineBonus);
    assert.equal(furnace.calculateSaleValue(refinedValue, 20, 5000), refinedValue * 5.75 * 6);
    models.PolisherModel.calculatePolishedValue(40000, 5000);
    models.RefinerModel.calculateRefinedValue(40000, 1, 5000);
    assert.deepEqual(structuredClone({ polished, refined }), before);
    assert.doesNotThrow(() => models.InventoryModel.validateLot(refined));
    assert.notEqual(furnace.calculateSaleValue(123.456789, 2, 0), Math.round(123.456789 * 1.25 * 100) / 100);
});

test("Furnace original upgrade curve keeps free Tier 1 separate and discounts before rounding", () => {
    const pricing = vm.runInContext("CashPricingModel", furnaceContext);
    for (const [tier, raw] of [[2, 100], [3, 1000], [4, 4000], [5, 16000], [20, 17179869184000]])
        assert.equal(furnace.getRawTierUpgradeCost(tier), raw);
    for (let tier = 2; tier <= 20; tier++) {
        const raw = tier === 2 ? 100 : 1000 * 4 ** (tier - 3);
        assert.equal(furnace.getRawTierUpgradeCost(tier), raw);
        for (const discount of [0, 1, 10])
            assert.equal(furnace.getTierUpgradePrice(tier, discount),
                pricing.calculateCashPrice(raw, { category: "furnaceTier", discountLevel: discount }));
    }
    assert.equal(furnace.getTierUpgradePrice(3, 1), 950);
    assert.equal(furnace.getTierUpgradePrice(2, 10), 50);
    assert.equal(furnace.getTierUpgradePrice(8, 1), 972800); // Discount crosses below the million band.
    assert.notEqual(furnace.getTierUpgradePrice(8, 1) * 4, furnace.getTierUpgradePrice(9, 1));
    assert.equal(furnace.getRawTierUpgradeCost(9), 4096000);
    assert.throws(() => furnace.getRawTierUpgradeCost(1));
    assert.throws(() => furnace.getTierUpgradePrice(1, 0));
});

test("Furnace rejects invalid tiers, perk levels, resource values and overflow", () => {
    const bad = [-1, 1.5, "1", null, true, undefined, NaN, Infinity, -Infinity];
    for (const tier of [...bad, 0, 21]) for (const call of [() => furnace.getCapacity(tier),
        () => furnace.getTierValueMultiplier(tier), () => furnace.getNormalInterval(tier),
        () => furnace.getFinalInterval(tier, 0), () => furnace.isAutoProcessingEligible(tier),
        () => furnace.calculateSaleValue(1, tier, 0), () => furnace.getRawTierUpgradeCost(tier),
        () => furnace.getTierUpgradePrice(tier, 0)]) assert.throws(call);
    for (const level of [...bad, 5001]) {
        assert.throws(() => furnace.getRebirthValueMultiplier(level));
        assert.throws(() => furnace.calculateSaleValue(1, 1, level));
    }
    for (const level of [...bad, 51]) assert.throws(() => furnace.getFinalInterval(1, level));
    for (const level of [...bad, 11]) assert.throws(() => furnace.getTierUpgradePrice(2, level));
    for (const value of [-1, "1", null, true, undefined, NaN, Infinity, -Infinity])
        assert.throws(() => furnace.calculateSaleValue(value, 1, 0));
    assert.throws(() => furnace.calculateSaleValue(Number.MAX_VALUE, 20, 5000), /sale value/);
    assert.equal(furnace.calculateSaleValue(Number.MAX_VALUE, 1, 0), Number.MAX_VALUE);
});

test("Furnace pure eligibility and quotes preserve preferences, live prototype behavior and schema 1", () => {
    for (const raw of [null, ...[undefined, 0, 1].flatMap(saveVersion => [false, true].map(autoFurnaceEnabled => JSON.stringify({
        saveVersion, cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0, autoFurnaceEnabled })))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timers = app.intervals.length;
        app.run(`for(let tier=1;tier<=20;tier++) {
            FurnaceModel.getCapacity(tier); FurnaceModel.isAutoProcessingEligible(tier);
            FurnaceModel.getFinalInterval(tier,50); FurnaceModel.calculateSaleValue(123.456789,tier,5000);
            if(tier>1) FurnaceModel.getTierUpgradePrice(tier,10);
        }`);
        assert.deepEqual(app.state(), before);
        assert.equal(app.intervals.length, timers); assert.equal(app.writes.length, 0);
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state(); assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const refiner = vm.runInNewContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); }; RefinerModel;');
const refinerPerks = Object.freeze({ dustChanceLevel: 0, stabilityLevel: 0, yieldLevel: 0, valueLevel: 0 });
function refinerInput(count = 0, amount = 1) {
    return { resourceId: "ruby", stage: count === 0 ? "polished" : "refined", refineCount: count, amount,
        polishedValue: count === 0 ? 123.456789 : null,
        preRefinerValue: count === 0 ? null : 123.456789, refineBonus: count === 0 ? null : 0.12345 };
}

test("Refiner throughput uses exact tier formulas and permits empty and partial batches", () => {
    assert.equal(refiner.getInterval(1), 15); assert.equal(refiner.getInterval(10), 3);
    assert.equal(refiner.getBatchSize(1), 1); assert.equal(refiner.getBatchSize(10), 10);
    assert.equal(refiner.getTierBaseDustChance(1), 0.02);
    assert.equal(refiner.getTierBaseDustChance(10), 0.1);
    for (let tier = 1; tier <= 10; tier++) {
        assert.equal(refiner.getInterval(tier), 15 * 0.2 ** ((tier - 1) / 9));
        const capacity = Math.floor(1 + 9 * ((tier - 1) / 9) ** 1.2 + 0.5);
        assert.equal(refiner.getBatchSize(tier), capacity);
        assert.equal(refiner.getTierBaseDustChance(tier), 0.02 + (0.08 / 9) * (tier - 1));
        for (const count of [0, 1, capacity - 1, capacity, capacity + 1, Number.MAX_VALUE])
            assert.equal(refiner.getProcessedAmount(tier, count), Math.min(capacity, count));
    }
    assert.equal(refiner.getProcessedAmount(10, 4), 4);
});

test("Refiner accepts canonical processed ore up to count 14 and rejects raw or terminal input", () => {
    const ids = vm.runInNewContext(ores + '\nORE_KEYS;');
    for (const resourceId of ids) for (let c = 0; c <= 14; c++) {
        assert.doesNotThrow(() => refiner.validateInputLot({ ...refinerInput(c), resourceId }));
        assert.equal(refiner.getNextPass(c), c + 1);
    }
    for (const invalid of [null, {}, refinerInput(15), { ...refinerInput(), stage: "raw", polishedValue: null },
        { ...refinerInput(), polishedValue: null }, { ...refinerInput(1), preRefinerValue: null },
        { ...refinerInput(1), polishedValue: 1 }, { ...refinerInput(), extra: true }, refinerInput(0, 0),
        ...["stone", "wood", "scrap", "metal", "missing"].map(resourceId => ({ ...refinerInput(), resourceId }))])
        assert.throws(() => refiner.validateInputLot(invalid));
});

test("Refiner Dust uses incoming count and destruction uses the next pass with Defined caps", () => {
    for (const tier of [1, 5, 10]) for (const level of [0, 1, 30]) for (let c = 0; c <= 14; c++) {
        const effective = Math.min(0.25, 0.02 + (0.08 / 9) * (tier - 1) + 0.005 * level);
        assert.equal(refiner.getEffectiveBaseDustChance(tier, level), effective);
        assert.equal(refiner.getDustChance(tier, c, level), Math.min(0.95, effective * 1.25 ** c));
    }
    assert.equal(refiner.getEffectiveBaseDustChance(10, 30), 0.25);
    assert.equal(refiner.getDustChance(1, 0, 0), 0.02);
    assert.equal(refiner.getDustChance(1, 1, 0), 0.025);
    assert.equal(refiner.getDustChance(10, 14, 30), 0.95);
    for (let c = 0; c <= 14; c++) for (const level of [0, 1, 20, 180])
        assert.equal(refiner.getDestructionChance(c, level), Math.max(0.05, Math.min(0.95, Math.min(0.95, 0.15 * (c + 1)) - 0.005 * level)));
    assert.equal(refiner.getDestructionChance(0, 0), 0.15);
    assert.equal(refiner.getDestructionChance(14, 0), 0.95);
    assert.equal(refiner.getDestructionChance(0, 180), 0.05);
    assert.equal(refiner.getDestructionChance(14, 180), 0.05);
});

test("Gem Dust yield uses independent fractional rolls and survives hypothetical destruction", () => {
    for (let level = 0; level <= 50; level++) {
        const expected = 1 + 0.05 * level, whole = Math.floor(expected), fraction = expected - whole;
        assert.equal(refiner.getExpectedDustYield(level), expected);
        assert.equal(refiner.getDustQuantity(level, false, 0), 0);
        assert.equal(refiner.getDustQuantity(level, true, fraction), whole);
        assert.equal(refiner.getDustQuantity(level, true, 0), whole + (fraction > 0 ? 1 : 0));
    }
    const input = Object.freeze(refinerInput()), perks = Object.freeze({ ...refinerPerks, yieldLevel: 50 });
    const wonDestroyed = refiner.evaluateItem(input, 1, perks, { dust: 0, fractionalYield: 0.499, destruction: 0 });
    assert.deepEqual(structuredClone(wonDestroyed), { dust: 4, destroyed: true, refinedLot: null });
    assert.equal(refiner.evaluateItem(input, 1, perks, { dust: 0, fractionalYield: 0.5, destruction: 0 }).dust, 3);
    const missed = refiner.evaluateItem(input, 1, perks, { dust: 0.02, fractionalYield: 0, destruction: 0.15 });
    assert.equal(missed.dust, 0); assert.equal(missed.destroyed, false); assert.equal(missed.refinedLot.amount, 1);
    const wonSurvived = refiner.evaluateItem(input, 1, perks, { dust: 0, fractionalYield: 0, destruction: 0.15 });
    assert.equal(wonSurvived.dust, 4); assert.equal(wonSurvived.destroyed, false);
    assert.throws(() => refiner.evaluateItem(refinerInput(0, 2), 1, perks, { dust: 0, fractionalYield: 0, destruction: 0 }), /amount 1/);
});

test("Refiner value follows all 15 passes without compounding or revaluing historical inputs", () => {
    const inventory = vm.runInNewContext(ores + '\nInventoryModel;');
    for (const level of [0, 1, 2500, 5000]) for (let n = 1; n <= 15; n++) {
        const bonus = n <= 5 ? (0.5 + 0.0014 * level) * (5 - n) / 4 : -0.09 * (n - 5);
        assert.equal(refiner.getRefineBonus(n, level), bonus);
        assert.equal(refiner.calculateRefinedValue(123.456789, n, level), 123.456789 * (1 + bonus));
    }
    assert.equal(refiner.getRefineBonus(1, 5000), 7.5);
    assert.equal(refiner.getRefineBonus(6, 5000), -0.09);
    assert.ok(Math.abs(refiner.getRefineBonus(15, 0) + 0.9) < Number.EPSILON);
    let input = refinerInput(); const original = structuredClone(input);
    for (let n = 1; n <= 15; n++) {
        const previous = structuredClone(input);
        const output = refiner.createRefinedLot(input, 1, 0);
        assert.deepEqual(input, previous);
        assert.equal(output.preRefinerValue, original.polishedValue);
        assert.equal(output.refineCount, n);
        assert.equal(output.polishedValue, null);
        assert.equal(output.refineBonus, refiner.getRefineBonus(n, 0));
        assert.doesNotThrow(() => inventory.validateLot(output));
        input = structuredClone(output);
    }
    assert.throws(() => refiner.createRefinedLot(input, 1, 0));
    const historical = Object.freeze(refinerInput(4, 3));
    const output = refiner.createRefinedLot(historical, 2, 5000);
    assert.equal(output.preRefinerValue, historical.preRefinerValue);
    assert.equal(output.refineBonus, 0); // Pass 5 ignores prior applied bonus.
    output.amount = 1;
    assert.equal(historical.amount, 3);
    assert.equal(refiner.calculateRefinedValue(0, 1, 5000), 0);
});

test("Refiner rejects invalid scalar inputs, explicit rolls, metadata and computed overflow", () => {
    const bad = [-1, 0.5, "1", null, true, undefined, NaN, Infinity, -Infinity];
    for (const tier of [...bad, 0, 11]) for (const fn of [() => refiner.getInterval(tier), () => refiner.getBatchSize(tier),
        () => refiner.getTierBaseDustChance(tier), () => refiner.getDustChance(tier, 0, 0)]) assert.throws(fn);
    for (const q of bad) assert.throws(() => refiner.getProcessedAmount(10, q));
    for (const c of [...bad, 15]) for (const fn of [() => refiner.getNextPass(c), () => refiner.getDustChance(1, c, 0),
        () => refiner.getDestructionChance(c, 0)]) assert.throws(fn);
    for (const [key, cap, call] of [["dustChanceLevel", 30, l => refiner.getDustChance(1, 0, l)],
        ["stabilityLevel", 180, l => refiner.getDestructionChance(0, l)],
        ["yieldLevel", 50, l => refiner.getExpectedDustYield(l)], ["valueLevel", 5000, l => refiner.getRefineBonus(1, l)]])
        for (const level of [...bad, cap + 1]) {
            assert.throws(() => call(level));
            assert.throws(() => refiner.evaluateItem(refinerInput(), 1, { ...refinerPerks, [key]: level },
                { dust: 0.9, fractionalYield: 0, destruction: 0 }));
        }
    for (const n of [...bad, 0, 16]) assert.throws(() => refiner.getRefineBonus(n, 0));
    for (const value of [-1, "1", null, true, undefined, NaN, Infinity])
        assert.throws(() => refiner.calculateRefinedValue(value, 1, 0));
    assert.throws(() => refiner.calculateRefinedValue(Number.MAX_VALUE, 1, 5000));
    assert.throws(() => refiner.createRefinedLot({ ...refinerInput(), polishedValue: Number.MAX_VALUE }, 1, 5000));
    for (const q of [...bad, 0, 2]) assert.throws(() => refiner.createRefinedLot(refinerInput(), q, 0));
    for (const r of [-1, 1, "0", null, true, undefined, NaN, Infinity]) {
        assert.throws(() => refiner.getDustQuantity(0, false, r));
        for (const key of ["dust", "fractionalYield", "destruction"])
            assert.throws(() => refiner.evaluateItem(refinerInput(), 1, refinerPerks,
                { dust: 0, fractionalYield: 0, destruction: 0, [key]: r }));
    }
    assert.throws(() => refiner.getDustQuantity(0, 1, 0));
    assert.throws(() => refiner.evaluateItem(refinerInput(), 1, null, {}));
});

test("Refiner per-item outcomes return independent Lots and do not mutate frozen inputs or options", () => {
    const input = Object.freeze(refinerInput(1));
    const before = structuredClone(input);
    const rolls = Object.freeze({ dust: 0, fractionalYield: 0, destruction: 0.999 });
    const a = refiner.evaluateItem(input, 1, refinerPerks, rolls);
    const b = refiner.evaluateItem(input, 1, refinerPerks, rolls);
    assert.deepEqual(structuredClone(a), structuredClone(b));
    assert.notEqual(a.refinedLot, b.refinedLot);
    a.refinedLot.preRefinerValue = 0;
    assert.equal(b.refinedLot.preRefinerValue, input.preRefinerValue);
    assert.deepEqual(input, before);
});

test("Refiner calculations and hypothetical outcomes preserve live saves, Dust, inventory and timers", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 }))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timers = app.intervals.length;
        app.run(`for(let tier=1;tier<=10;tier++) {
            RefinerModel.getInterval(tier); RefinerModel.getProcessedAmount(tier,7);
            RefinerModel.evaluateItem(PolisherModel.createPolishedLot("ruby",1,30000),tier,
                {dustChanceLevel:30,stabilityLevel:180,yieldLevel:50,valueLevel:5000},
                {dust:0,fractionalYield:0,destruction:0});
        }`);
        assert.deepEqual(app.state(), before);
        assert.equal(app.intervals.length, timers); assert.equal(app.writes.length, 0);
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state(); assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const polisherContext = vm.createContext({});
vm.runInContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); };', polisherContext);
const polisher = vm.runInContext("PolisherModel", polisherContext);
const polisherInventory = vm.runInContext("InventoryModel", polisherContext);
function polisherRaw(resourceId = "ruby", amount = 1) {
    return { resourceId, stage: "raw", refineCount: 0, amount,
        polishedValue: null, preRefinerValue: null, refineBonus: null };
}

test("Polisher tiers retain exact source coefficients, full-precision seconds and half-up capacities", () => {
    assert.equal(polisher.getCycleTime(1), 7.5);
    assert.equal(polisher.getBatchSize(1), 1);
    assert.equal(polisher.getBatchSize(10), 100);
    assert.ok(Math.abs(polisher.getCycleTime(10) - 1) < 0.0001);
    assert.notEqual(polisher.getCycleTime(10), 1); // Do not retune the coefficient to force an endpoint.
    for (let tier = 1; tier <= 10; tier++) {
        assert.equal(polisher.getCycleTime(tier), 7.5 * 0.799413 ** (tier - 1));
        assert.equal(polisher.getBatchSize(tier), Math.floor(1.668101 ** (tier - 1) + 0.5));
        const capacity = polisher.getBatchSize(tier);
        for (const available of [0, 1, capacity - 1, capacity, capacity + 1, Number.MAX_VALUE]) {
            const quantity = polisher.getProcessedAmount(tier, available);
            assert.equal(quantity, Math.min(capacity, available));
            assert.ok(quantity <= capacity && quantity <= available);
        }
    }
    assert.equal(polisher.getProcessedAmount(10, 37), 37);
    assert.equal(polisher.getProcessedAmount(10, 0), 0);
});

test("Polisher accepts every canonical raw ore but rejects Stone, materials and processed Lots", () => {
    const ids = vm.runInContext("ORE_KEYS", polisherContext);
    assert.equal(ids.length, 20);
    for (const id of ids) assert.doesNotThrow(() => polisher.validateInputLot(polisherRaw(id)));
    for (const id of ["stone", "wood", "scrap", "metal", "unknown", "toString", null, 1])
        assert.throws(() => polisher.validateInputLot(polisherRaw(id)));
    const polished = polisher.createPolishedLot("ruby", 1, 30000);
    const refined = { ...polisherRaw(), stage: "refined", refineCount: 1,
        preRefinerValue: 30000, refineBonus: -0.5 };
    assert.doesNotThrow(() => polisherInventory.validateLot(refined));
    for (const invalid of [polished, refined, null, {}, { ...polisherRaw(), stage: "queued" },
        { ...polisherRaw(), polishedValue: 10 }, { ...polisherRaw(), extra: true }, polisherRaw("ruby", 0)])
        assert.throws(() => polisher.validateInputLot(invalid));
});

test("Polisher uses the supplied adjusted value once and preserves historical Lot precision", () => {
    assert.equal(polisher.calculatePolishedValue(20000, 0), 30000);
    assert.equal(polisher.calculatePolishedValue(20000, 5000), 45000);
    assert.equal(polisher.calculatePolishedValue(0, 5000), 0);
    for (const level of [0, 1, 2500, 5000])
        assert.equal(polisher.calculatePolishedValue(123.456789, level), 123.456789 * 1.5 * (1 + 0.0001 * level));
    // Supplied Ruby basis already includes an external 2x modifier; do not reapply it.
    assert.equal(polisher.calculatePolishedValue(40000, 0), 60000);
    const value = polisher.calculatePolishedValue(123.456789, 1);
    const historical = polisher.createPolishedLot("ruby", 3, value);
    const before = structuredClone(historical);
    assert.deepEqual(before, { resourceId: "ruby", stage: "polished", refineCount: 0, amount: 3,
        polishedValue: value, preRefinerValue: null, refineBonus: null });
    assert.doesNotThrow(() => polisherInventory.validateLot(historical));
    assert.notEqual(value, Math.round(value * 100) / 100);
    polisher.calculatePolishedValue(40000, 5000);
    assert.deepEqual(structuredClone(historical), before);
    const other = polisher.createPolishedLot("ruby", 3, value);
    other.amount = 99;
    assert.equal(historical.amount, 3);
});

test("Polisher tier quotes use original formula independently of slot purchase prices", () => {
    const pricing = vm.runInContext("CashPricingModel", polisherContext);
    for (const [tier, expected] of [[2, 50000], [3, 500000], [4, 5000000], [10, 5000000000000]])
        assert.equal(polisher.getRawTierUpgradeCost(tier), expected);
    for (let tier = 2; tier <= 10; tier++) {
        const raw = 5000 * 10 ** (tier - 1);
        assert.equal(polisher.getRawTierUpgradeCost(tier), raw);
        for (const discount of [0, 1, 10]) {
            assert.equal(polisher.getTierUpgradePrice(tier, discount), pricing.roundCashPrice(raw * (1 - 0.05 * discount)));
            assert.equal(polisher.getTierUpgradePrice(tier, discount),
                pricing.calculateCashPrice(raw, { category: "polisherTier", discountLevel: discount }));
        }
    }
    assert.equal(polisher.getTierUpgradePrice(2, 10), 25000);
    for (const slotCost of [5000, 100000, 2000000]) {
        pricing.calculateCashPrice(slotCost, { category: "polisherPurchase", discountLevel: 10 });
        assert.equal(polisher.getRawTierUpgradeCost(2), 50000);
        assert.equal(polisher.getTierUpgradePrice(2, 1), 47500);
    }
});

test("Polisher rejects malformed tiers, quantities, values, perks, Lots and Discount levels", () => {
    const bad = [-1, 1.5, "1", null, true, undefined, NaN, Infinity, -Infinity];
    for (const tier of [...bad, 0, 11])
        for (const call of [() => polisher.getCycleTime(tier), () => polisher.getBatchSize(tier),
            () => polisher.getProcessedAmount(tier, 5)]) assert.throws(call, /tier/);
    for (const quantity of bad) {
        assert.throws(() => polisher.getProcessedAmount(10, quantity), /availableQuantity/);
        assert.throws(() => polisher.createPolishedLot("ruby", quantity, 10));
    }
    assert.throws(() => polisher.createPolishedLot("ruby", 0, 10));
    for (const value of [-1, "1", null, true, undefined, NaN, Infinity, -Infinity]) {
        assert.throws(() => polisher.calculatePolishedValue(value, 0), /currentOreValue/);
        assert.throws(() => polisher.createPolishedLot("ruby", 1, value));
    }
    assert.throws(() => polisher.calculatePolishedValue(Number.MAX_VALUE, 0), /polishedValue/);
    for (const level of [...bad, 5001])
        assert.throws(() => polisher.calculatePolishedValue(10, level), /rebirthValueLevel/);
    for (const tier of [...bad, 0, 1, 11]) {
        assert.throws(() => polisher.getRawTierUpgradeCost(tier), /targetTier/);
        assert.throws(() => polisher.getTierUpgradePrice(tier, 0), /targetTier/);
    }
    for (const level of [...bad, 11]) assert.throws(() => polisher.getTierUpgradePrice(2, level), /discountLevel/);
    for (const id of ["stone", "wood", "scrap", "metal", "unknown"])
        assert.throws(() => polisher.createPolishedLot(id, 1, 10));
});

test("Polisher helpers do not mutate input Lots or existing catalogue and Miner models", () => {
    const snapshot = () => vm.runInContext(`JSON.stringify({ ORES,
        tiers: Array.from({length:25},(_,i)=>MinerTierModel.getTierProbabilities(i+1,11)),
        ores: MinerOreLuckModel.getOreProbabilities(4,5000,50),
        candidate: MinerCandidateModel.createSlotAccess(),
        inventory: InventoryModel.createProcessedInventory() })`, polisherContext);
    const before = snapshot();
    const raw = Object.freeze(polisherRaw("ruby", 500));
    const original = structuredClone(raw);
    polisher.validateInputLot(raw);
    const value = polisher.calculatePolishedValue(20000, 5000);
    const output = polisher.createPolishedLot(raw.resourceId, polisher.getProcessedAmount(10, raw.amount), value);
    output.amount = 7;
    assert.deepEqual(raw, original);
    assert.equal(snapshot(), before);
});

test("pure Polisher calls leave schema-1 saves, inventory, Cash and legacy gameplay unchanged", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 }))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timers = app.intervals.length;
        app.run(`for(let tier=1;tier<=10;tier++) {
            PolisherModel.getCycleTime(tier); PolisherModel.getProcessedAmount(tier,37);
            PolisherModel.createPolishedLot("ruby",1,PolisherModel.calculatePolishedValue(20000,5000));
            if(tier>1) PolisherModel.getTierUpgradePrice(tier,10);
        }`);
        assert.deepEqual(app.state(), before);
        assert.equal(app.intervals.length, timers);
        assert.equal(app.writes.length, 0);
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state();
        assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const oreLuckContext = vm.createContext({});
vm.runInContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); };', oreLuckContext);
const minerOreLuck = vm.runInContext("MinerOreLuckModel", oreLuckContext);

test("Miner Ore Luck combines only the independently supplied Defined levels", () => {
    assert.equal(minerOreLuck.getFinalOreLuck(0, 0), 1);
    assert.equal(minerOreLuck.getFinalOreLuck(5000, 0), 11);
    assert.equal(minerOreLuck.getFinalOreLuck(0, 50), 2);
    assert.equal(minerOreLuck.getFinalOreLuck(5000, 50), 22);
    assert.equal(minerOreLuck.getFinalOreLuck(250, 25), 2.25);
    assert.equal(minerOreLuck.getFinalOreLuck(1, 1), 1.002 * 1.02);
});

test("within-tier weights and full-precision probabilities follow Reference B", () => {
    const display = [39.59, 25.74, 16.73, 10.87, 7.07];
    for (const [rebirth, local] of [[0, 0], [1, 1], [250, 25], [5000, 50]]) {
        const luck = (1 + 0.002 * rebirth) * (1 + 0.02 * local);
        const expected = Array.from({ length: 5 }, (_, i) => 0.65 ** i * luck ** (0.1 * i));
        assert.deepEqual(Array.from(minerOreLuck.getOreWeights(rebirth, local)), expected);
        for (let tier = 1; tier <= 4; tier++) {
            const p = minerOreLuck.getOreProbabilities(tier, rebirth, local).map(entry => entry.probability);
            assert.equal(p.length, 5);
            const total = expected.reduce((a, b) => a + b, 0);
            p.forEach((value, i) => {
                assert.ok(Number.isFinite(value) && value > 0 && value < 1);
                assert.equal(value, expected[i] / total);
                if (luck === 1) assert.ok(Math.abs(100 * value - display[i]) < 0.01);
            });
            assert.ok(Math.abs(p.reduce((a, b) => a + b, 0) - 1) <= 4 * Number.EPSILON);
        }
    }
    const base = minerOreLuck.getOreProbabilities(1, 0, 0), high = minerOreLuck.getOreProbabilities(1, 5000, 50);
    for (let i = 1; i < 5; i++)
        assert.ok(high[i].probability / high[0].probability > base[i].probability / base[0].probability);
});

test("explicit boundary rolls select only the five catalogue ores in the chosen tier", () => {
    const catalogues = [
        ["amber", "quartz", "topaz", "amethyst", "malachite"],
        ["citrine", "garnet", "peridot", "jade", "aquamarine"],
        ["spinel", "tourmaline", "sapphire", "ruby", "emerald"],
        ["onyx", "tanzanite", "alexandrite", "blackOpal", "diamond"]
    ];
    for (let tier = 1; tier <= 4; tier++) {
        for (const [rebirth, local] of [[0, 0], [250, 25], [5000, 50]]) {
            const distribution = minerOreLuck.getOreProbabilities(tier, rebirth, local);
            assert.deepEqual(Array.from(distribution, entry => entry.resourceId), catalogues[tier - 1]);
            assert.equal(minerOreLuck.selectOreId(tier, rebirth, local, 0), catalogues[tier - 1][0]);
            let boundary = 0;
            for (let i = 0; i < 4; i++) {
                boundary += distribution[i].probability;
                assert.equal(minerOreLuck.selectOreId(tier, rebirth, local, boundary - Number.EPSILON), catalogues[tier - 1][i]);
                assert.equal(minerOreLuck.selectOreId(tier, rebirth, local, boundary), catalogues[tier - 1][i + 1]);
                assert.equal(minerOreLuck.selectOreId(tier, rebirth, local, boundary + Number.EPSILON), catalogues[tier - 1][i + 1]);
            }
            assert.equal(minerOreLuck.selectOreId(tier, rebirth, local, 1 - Number.EPSILON / 2), catalogues[tier - 1][4]);
        }
    }
    // Stone is not an ore tier; the eventual caller must bypass this API.
    for (const stone of [0, "stone"])
        assert.throws(() => minerOreLuck.selectOreId(stone, 0, 0, 0), /oreTier/);
});

test("local Ore Luck prices use original target formula and rounding without Discount", () => {
    const pricing = vm.runInContext("CashPricingModel", oreLuckContext);
    assert.equal(minerOreLuck.getRawUpgradeCost(1), 1000);
    assert.equal(minerOreLuck.getRawUpgradeCost(2), 1250);
    assert.equal(minerOreLuck.getUpgradePrice(3, 10), 1560);
    for (let level = 1; level <= 50; level++) {
        const raw = 1000 * 1.25 ** (level - 1);
        assert.equal(minerOreLuck.getRawUpgradeCost(level), raw);
        for (const discount of [0, 1, 10]) {
            assert.equal(minerOreLuck.getUpgradePrice(level, discount), pricing.roundCashPrice(raw));
            assert.equal(minerOreLuck.getUpgradePrice(level, discount),
                pricing.calculateCashPrice(raw, { category: "minerOreLuck", discountLevel: discount }));
        }
    }
    assert.notEqual(minerOreLuck.getUpgradePrice(3, 0) * 1.25, minerOreLuck.getRawUpgradeCost(4));
});

test("Ore Luck rejects invalid levels, ore tiers, rolls, targets and Discount inputs", () => {
    const bad = [-1, 0.5, "1", null, true, undefined, NaN, Infinity, -Infinity];
    for (const value of [...bad, 5001]) {
        assert.throws(() => minerOreLuck.getFinalOreLuck(value, 0), /rebirthLevel/);
        assert.throws(() => minerOreLuck.getOreWeights(value, 0), /rebirthLevel/);
        assert.throws(() => minerOreLuck.getOreProbabilities(1, value, 0), /rebirthLevel/);
        assert.throws(() => minerOreLuck.selectOreId(1, value, 0, 0), /rebirthLevel/);
    }
    for (const value of [...bad, 51]) {
        assert.throws(() => minerOreLuck.getFinalOreLuck(0, value), /localLevel/);
        assert.throws(() => minerOreLuck.getOreWeights(0, value), /localLevel/);
        assert.throws(() => minerOreLuck.getOreProbabilities(1, 0, value), /localLevel/);
        assert.throws(() => minerOreLuck.selectOreId(1, 0, value, 0), /localLevel/);
    }
    for (const tier of [...bad, 0, 5, "tier1", "stone"]) {
        assert.throws(() => minerOreLuck.getOreProbabilities(tier, 0, 0), /oreTier/);
        assert.throws(() => minerOreLuck.selectOreId(tier, 0, 0, 0), /oreTier/);
    }
    for (const roll of [-1, 1, 1.5, "0", null, true, undefined, NaN, Infinity, -Infinity])
        assert.throws(() => minerOreLuck.selectOreId(1, 0, 0, roll), /roll/);
    for (const level of [...bad, 0, 51]) {
        assert.throws(() => minerOreLuck.getRawUpgradeCost(level), /targetLevel/);
        assert.throws(() => minerOreLuck.getUpgradePrice(level, 0), /targetLevel/);
    }
    for (const discount of [...bad, 11])
        assert.throws(() => minerOreLuck.getUpgradePrice(1, discount), /discountLevel/);
});

test("Ore Luck results are independent and preserve the catalogue and Overall Luck model", () => {
    const snapshot = () => vm.runInContext(`JSON.stringify({ ORES, TIER_1_ORES, TIER_2_ORES, TIER_3_ORES, TIER_4_ORES,
        tiers: Array.from({length:25}, (_,i)=>MinerTierModel.getTierProbabilities(i+1,11)) })`, oreLuckContext);
    const before = snapshot();
    const first = minerOreLuck.getOreProbabilities(4, 5000, 50);
    const expected = structuredClone(first);
    first[0].resourceId = "stone"; first[0].probability = 1; first.pop();
    const weights = minerOreLuck.getOreWeights(0, 0); weights[0] = 999;
    assert.equal(minerOreLuck.getOreWeights(0, 0)[0], 1);
    assert.deepEqual(structuredClone(minerOreLuck.getOreProbabilities(4, 5000, 50)), expected);
    assert.equal(snapshot(), before);
});

test("pure Ore Luck calls leave live saves, payments, legacy gameplay and timers unchanged", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 }))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timerCount = app.intervals.length;
        app.run(`for(let tier=1;tier<=4;tier++) {
            MinerOreLuckModel.getOreWeights(5000,50);
            MinerOreLuckModel.getOreProbabilities(tier,5000,50);
            MinerOreLuckModel.selectOreId(tier,5000,50,0.999);
            MinerOreLuckModel.getUpgradePrice(50,10);
        }`);
        assert.deepEqual(app.state(), before);
        assert.equal(app.intervals.length, timerCount);
        assert.equal(app.writes.length, 0);
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state();
        assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const minerTiers = vm.runInNewContext(ores + '\nMath.random = () => { throw Error("unexpected RNG"); }; MinerTierModel;');
const tierProbabilityKeys = ["stone", "tier1", "tier2", "tier3", "tier4"];
function closeProbability(actual, expected) {
    assert.ok(Math.abs(actual - expected) <= 8 * Number.EPSILON * Math.max(Math.abs(expected), Number.MIN_VALUE),
        `${actual} differs from ${expected}`);
}

test("Miner catalogue matches all 25 approved Reference B rows in both canonical documents", () => {
    for (const document of ["GAME_BIBLE.md", "TEFI_Consolidated_Development_Specification.md"]) {
        const section = fs.readFileSync(path.join(root, "docs", document), "utf8")
            .split("## Reference B Miner rarity costs and production")[1].split("### Exact normalization procedure")[0];
        const rows = section.split(/\r?\n/).filter(line => /^\| (?:\*\*)?\d/.test(line))
            .map(line => line.replace(/\*\*|%/g, "").split("|").slice(1, -1)
                .map(value => value.trim() === "—" ? 0 : Number(value.trim())));
        assert.equal(rows.length, 25);
        rows.forEach(([tier, ...weights], i) => {
            assert.equal(tier, i + 1);
            const source = minerTiers.getTierSource(tier);
            assert.deepEqual(Object.keys(source), tierProbabilityKeys);
            assert.deepEqual(Object.values(source), weights);
            assert.equal(Object.isFrozen(source), true);
            assert.throws(() => { source.stone = 0; }, TypeError);
            assert.equal(minerTiers.getTierSource(tier).stone, weights[0]);
            assert.equal(source.tier4 === 0, tier < 6);
        });
    }
});

test("Luck 1 preserves Stone anchors while normalizing imperfect ore source totals", () => {
    for (let tier = 1; tier <= 25; tier++) {
        const source = minerTiers.getTierSource(tier), p = minerTiers.getTierProbabilities(tier, 1);
        assert.equal(p.stone, source.stone / 100);
        const oreTotal = source.tier1 + source.tier2 + source.tier3 + source.tier4;
        for (const key of tierProbabilityKeys.slice(1))
            closeProbability(p[key], (1 - source.stone / 100) * source[key] / oreTotal);
    }
    // Tier 2's rounded columns sum to 100.005, so treating each as a percent is wrong.
    assert.notEqual(minerTiers.getTierProbabilities(2, 1).tier1, 4.726 / 100);
    assert.equal(minerTiers.getTierProbabilities(25, 1).stone, 0.25);
});

test("automated distributions stay finite, normalized and access-locked across positive finite Luck extremes", () => {
    for (let tier = 1; tier <= 25; tier++) {
        for (const luck of [Number.MIN_VALUE, 1e-200, 0.001, 0.5, 1, 2, 11, 1e100, Number.MAX_VALUE]) {
            const p = minerTiers.getTierProbabilities(tier, luck);
            assert.deepEqual(Object.keys(p), tierProbabilityKeys);
            for (const value of Object.values(p)) assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
            assert.ok(Math.abs(Object.values(p).reduce((a, b) => a + b, 0) - 1) <= 4 * Number.EPSILON);
            assert.ok(p.stone >= 0.25);
            for (const key of ["tier1", "tier2", "tier3"]) assert.ok(p[key] > 0);
            if (tier < 6) assert.equal(p.tier4, 0);
            else assert.ok(p.tier4 > 0);
        }
    }
});

test("Overall Luck applies the four exponents and the Stone floor preserves adjusted ore proportions", () => {
    for (const [tier, luck] of [[1, 2], [6, 11], [25, 11]]) {
        const source = minerTiers.getTierSource(tier), stone = source.stone / 100;
        const columns = [source.tier1, source.tier2, source.tier3, source.tier4];
        const sourceTotal = columns.reduce((a, b) => a + b, 0);
        const weights = columns.map((v, i) => (1 - stone) * v / sourceTotal * luck ** [0.2, 0.4, 0.6, 0.8][i]);
        const oreWeight = weights.reduce((a, b) => a + b, 0);
        const unboundedStone = stone / (stone + oreWeight);
        const p = minerTiers.getTierProbabilities(tier, luck);
        closeProbability(p.stone, Math.max(0.25, unboundedStone));
        for (let i = 0; i < 4; i++) closeProbability(p[tierProbabilityKeys[i + 1]],
            unboundedStone < 0.25 ? 0.75 * weights[i] / oreWeight : weights[i] / (stone + oreWeight));
        closeProbability(p.tier3 / p.tier1, source.tier3 / source.tier1 * luck ** 0.4);
        assert.ok(p.tier3 / p.tier1 > source.tier3 / source.tier1);
    }
    assert.ok(minerTiers.getTierProbabilities(1, 2).stone > 0.25); // No unnecessary clamp.
    assert.equal(minerTiers.getTierProbabilities(25, 11).stone, 0.25);
    assert.equal(minerTiers.getTierProbabilities(5, Number.MAX_VALUE).tier4, 0);
    assert.ok(minerTiers.getTierProbabilities(6, Number.MAX_VALUE).tier4 > 0);
});

test("probability result objects are independent and cannot mutate source data", () => {
    const first = minerTiers.getTierProbabilities(6, 11), expected = structuredClone(first);
    const second = minerTiers.getTierProbabilities(6, 11);
    assert.notEqual(first, second);
    first.stone = 0; first.tier4 = 100;
    assert.deepEqual(structuredClone(second), expected);
    assert.deepEqual(structuredClone(minerTiers.getTierProbabilities(6, 11)), expected);
    assert.equal(minerTiers.getTierSource(6).tier4, 0.0004);
});

test("raw Miner upgrade costs use original recurrence with only the Tier 6 exception", () => {
    for (const [tier, cost] of [[2, 400], [3, 1600], [5, 25600], [6, 192000], [7, 768000], [25, 52776558133248000]])
        assert.equal(minerTiers.getRawTierUpgradeCost(tier), cost);
    for (let tier = 3; tier <= 25; tier++)
        assert.equal(minerTiers.getRawTierUpgradeCost(tier), minerTiers.getRawTierUpgradeCost(tier - 1) * (tier === 6 ? 7.5 : 4));
    const pricing = vm.runInNewContext(ores + "\nCashPricingModel;");
    for (const discountLevel of [0, 1, 10]) {
        for (let tier = 2; tier <= 25; tier++)
            assert.equal(minerTiers.getTierUpgradePrice(tier, discountLevel),
                pricing.calculateCashPrice(minerTiers.getRawTierUpgradeCost(tier), { category: "minerTier", discountLevel }));
    }
    assert.equal(minerTiers.getTierUpgradePrice(2, 1), 380);
    assert.equal(minerTiers.getTierUpgradePrice(3, 10), 800); // Discount crosses below $1,000 before band selection.
    assert.equal(minerTiers.getTierUpgradePrice(6, 10), 96000);
    const roundedEarlier = minerTiers.getTierUpgradePrice(7, 1);
    assert.notEqual(roundedEarlier * 4, minerTiers.getTierUpgradePrice(8, 1));
    assert.equal(minerTiers.getRawTierUpgradeCost(8), 3072000);
});

test("Miner intervals use full-precision seconds, independent speed levels and one base output", () => {
    assert.equal(minerTiers.getProductionInterval(1, 0), 5);
    assert.equal(minerTiers.getProductionInterval(1, 50), 2.5);
    for (let tier = 1; tier <= 25; tier++) {
        for (const speed of [0, 1, 25, 50]) {
            const normal = Math.max(0.1, 5 * 0.96 ** (tier - 1));
            const interval = minerTiers.getProductionInterval(tier, speed);
            assert.equal(interval, Math.max(0.1, normal * (1 - 0.01 * speed)));
            assert.ok(interval >= 0.1);
            assert.equal(minerTiers.BASE_OUTPUT_PER_CYCLE, 1);
        }
    }
    assert.notEqual(minerTiers.getProductionInterval(25, 0), 1.8771); // Display approximation is not the formula.
    assert.ok(minerTiers.getProductionInterval(25, 50) > 0.1); // Floor cannot bind at Defined V1 caps.
    assert.throws(() => { minerTiers.BASE_OUTPUT_PER_CYCLE = 2; }, TypeError);
});

test("Miner tier mathematics rejects invalid tiers, Luck, speed and Discount rather than clamping", () => {
    for (const tier of [0, -1, 26, 2.5, "1", null, true, undefined, NaN, Infinity, -Infinity]) {
        for (const call of [() => minerTiers.getTierSource(tier), () => minerTiers.getTierProbabilities(tier, 1),
            () => minerTiers.getProductionInterval(tier, 0), () => minerTiers.getRawTierUpgradeCost(tier),
            () => minerTiers.getTierUpgradePrice(tier, 0)]) assert.throws(call, /Invalid Miner tier model/);
    }
    assert.throws(() => minerTiers.getRawTierUpgradeCost(1));
    assert.throws(() => minerTiers.getTierUpgradePrice(1, 0));
    for (const luck of [0, -1, "1", null, true, undefined, NaN, Infinity, -Infinity])
        assert.throws(() => minerTiers.getTierProbabilities(1, luck), /Overall Luck/);
    for (const speed of [-1, 51, 1.5, "0", null, true, undefined, NaN, Infinity])
        assert.throws(() => minerTiers.getProductionInterval(1, speed), /rebirthSpeedLevel/);
    for (const discount of [-1, 11, 1.5, "0", null, true, undefined, NaN, Infinity])
        assert.throws(() => minerTiers.getTierUpgradePrice(2, discount), /discountLevel/);
});

test("unused Miner tier calculations preserve production saves, timers, manual mining and legacy purchases", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 }))]) {
        const app = ready(raw), control = ready(raw), before = app.state(), timerCount = app.intervals.length;
        app.run(`for(let tier=1;tier<=25;tier++) {
            MinerTierModel.getTierSource(tier); MinerTierModel.getTierProbabilities(tier,11);
            MinerTierModel.getProductionInterval(tier,50);
            if(tier>1) MinerTierModel.getTierUpgradePrice(tier,10);
        }`);
        assert.deepEqual(app.state(), before);
        assert.equal(app.intervals.length, timerCount);
        assert.equal(app.writes.length, 0);
        // Existing controlled manual pipeline and legacy production remain the only active paths.
        for (const instance of [app, control]) {
            instance.elements.get("mineButton").onclick();
            if (raw !== null) for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                instance.elements.get(id).onclick();
            instance.tick(1000);
        }
        assert.deepEqual(app.state(), control.state());
        const after = app.state();
        assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

// Candidate models execute without gameplay, DOM, storage, clocks or RNG.
const minerModel = vm.runInNewContext(ores + "\nMinerCandidateModel;");
const minerOptions = Object.freeze({ discountLevel: 0, preservationLevel: 0 });
function minerCandidateFixture() {
    return { cash: 1000, shop: { minerUnlocked: true },
        factory: { minerSlots: [true, false, false, false, false], miners: [] },
        identity: { nextEntitySequence: 1, nextManualEquipSequence: 7 } };
}
function idleMinerFixture(overrides = {}) {
    return { id: "miner:1", slot: 1, tier: 1, oreLuckLevel: 0,
        investment: { entries: [{ kind: "purchase", targetLevel: null, cashPaid: 100, basis: "actual" }] },
        nextCycleSequence: 1, cycle: null, ...overrides };
}
function freezeCandidate(value) {
    if (value && typeof value === "object") { Object.values(value).forEach(freezeCandidate); Object.freeze(value); }
    return value;
}

test("Miner slots require five own Booleans and permanent first access; fresh arrays are independent", () => {
    const first = minerModel.createSlotAccess(), second = minerModel.createSlotAccess();
    assert.deepEqual(structuredClone(first), [true, false, false, false, false]);
    first[4] = true;
    assert.equal(second[4], false);
    assert.doesNotThrow(() => minerModel.validateSlots(first));
    for (const invalid of [null, {}, [], [true], Array(5), [false, true, true, true, true],
        [true, false, false, false, 1], [true, false, false, false, null],
        [true, true, true, true, true, true], Object.assign([true, false, false, false, false], { extra: 1 })])
        assert.throws(() => minerModel.validateSlots(invalid), /Invalid Miner candidate/);
});

test("slot quotes use fixed identity prices without Discount; unlock candidates do not buy Miners", () => {
    for (const discount of [0, 1, 10]) {
        for (const [index, expected] of [0, 10000, 1000000, 10000000000, 1000000000000].entries())
            assert.equal(minerModel.getSlotPrice(index + 1, discount), expected);
    }
    const state = minerCandidateFixture(); state.cash = 1000000000025.5; state.shop.minerUnlocked = false;
    const before = structuredClone(state);
    const next = minerModel.prepareSlotUnlock(state, 5, 10, []);
    assert.equal(next.cash, 25.5);
    assert.deepEqual(structuredClone(next.factory.minerSlots), [true, false, false, false, true]);
    assert.deepEqual(structuredClone(next.factory.miners), []);
    assert.deepEqual(structuredClone(next.identity), state.identity);
    assert.equal(next.shop.minerUnlocked, false);
    assert.deepEqual(state, before);
    assert.deepEqual(structuredClone(minerModel.getSlotState([], next.factory.minerSlots, 5)),
        { unlocked: true, occupied: false });
    assert.deepEqual(structuredClone(minerModel.getSlotState([], next.factory.minerSlots, 2)),
        { unlocked: false, occupied: false });
});

test("slot unlock rejects repeated access, malformed options, insufficient Cash and unsafe debits without mutation", () => {
    for (const [slot, discount, cash] of [[1, 0, 10000], [2, 0, 9999], [0, 0, 10000],
        [6, 0, 10000], [2.5, 0, 10000], ["2", 0, 10000], [2, 11, 10000], [2, "0", 10000],
        [2, 0, 1e30], [2, 0, Infinity]]) {
        const state = minerCandidateFixture(); state.cash = cash;
        const before = structuredClone(state);
        assert.throws(() => minerModel.prepareSlotUnlock(state, slot, discount, []));
        assert.deepEqual(state, before);
    }
    let state = minerCandidateFixture(); state.cash = 20000;
    state = minerModel.prepareSlotUnlock(state, 2, 0, []);
    assert.throws(() => minerModel.prepareSlotUnlock(state, 2, 0, []), /already unlocked/);
    assert.equal(state.cash, 10000);
});

test("idle Miner validation permits preserved tiers and historical ledgers without inventing payments", () => {
    for (const [tier, oreLuckLevel] of [[1, 0], [6, 15], [25, 50]]) {
        const miner = idleMinerFixture({ tier, oreLuckLevel, nextCycleSequence: 25 });
        miner.investment.entries[0].cashPaid = 137.5;
        miner.investment.entries[0].basis = "legacyEquivalentV1";
        const before = structuredClone(miner);
        minerModel.validateIdleMiner(miner);
        assert.deepEqual(miner, before);
        assert.equal(miner.investment.entries.length, 1);
    }
    minerModel.validateCollection([], minerModel.createSlotAccess());
});

test("idle Miner validation rejects malformed fields and explicitly refuses uncertified active cycles", () => {
    const cases = [null, [], {}, idleMinerFixture({ extra: 1 })];
    for (const key of Object.keys(idleMinerFixture())) {
        const miner = idleMinerFixture(); delete miner[key]; cases.push(miner);
    }
    for (const id of ["miner:0", "miner:01", "miner:1e2", "miner:-1", "miner:9007199254740992",
        "polisher:1", "miner:default", null]) cases.push(idleMinerFixture({ id }));
    for (const [key, values] of Object.entries({ slot: [0, 6, 1.5, "1"], tier: [0, 26, 1.5, "1", Infinity],
        oreLuckLevel: [-1, 51, 0.5, "0", NaN], nextCycleSequence: [0, -1, 1.5, "1", Infinity, 2 ** 53] }))
        for (const value of values) cases.push(idleMinerFixture({ [key]: value }));
    for (const miner of cases) assert.throws(() => minerModel.validateIdleMiner(miner), /Invalid Miner candidate/);
    for (const cycle of [{}, false, [], { phase: "reserved" }, { phase: "resolved", result: {} }])
        assert.throws(() => minerModel.validateIdleMiner(idleMinerFixture({ cycle })), /active-cycle validation is not supported/);
});

test("Miner ledger validation reuses investment rules and rejects payments beyond the owned upgrade", () => {
    for (const entries of [[], [paymentFixture(), paymentFixture()],
        [paymentFixture(), paymentFixture({ kind: "tier", targetLevel: 2 })],
        [paymentFixture(), paymentFixture({ kind: "oreLuck", targetLevel: 1 })],
        [paymentFixture({ cashPaid: Infinity })], [paymentFixture({ kind: "slot" })]]) {
        assert.throws(() => minerModel.validateIdleMiner(idleMinerFixture({ investment: { entries } })));
    }
    const miner = idleMinerFixture({ tier: 6, oreLuckLevel: 2 });
    miner.investment.entries.push(paymentFixture({ kind: "tier", targetLevel: 2, cashPaid: 400 }),
        paymentFixture({ kind: "oreLuck", targetLevel: 2, cashPaid: 1250 }));
    minerModel.validateIdleMiner(miner); // Gaps do not fabricate a payment history.
});

test("Miner collections enforce caps, unique identities, unique slots and slot access", () => {
    const slots = [true, true, true, true, true];
    const miners = slots.map((_, index) => idleMinerFixture({ id: "miner:" + (index + 1), slot: index + 1 }));
    minerModel.validateCollection(miners, slots);
    assert.deepEqual(structuredClone(minerModel.getSlotState(miners, slots, 4)), { unlocked: true, occupied: true });
    for (const bad of [[...miners, idleMinerFixture({ id: "miner:6" })],
        [miners[0], idleMinerFixture({ slot: 2 })], [miners[0], idleMinerFixture({ id: "miner:2" })]])
        assert.throws(() => minerModel.validateCollection(bad, slots));
    assert.throws(() => minerModel.validateCollection(miners, minerModel.createSlotAccess()), /locked slot/);
});

test("candidate identity checks supplied non-Miner sequences and preserves the independent equip counter", () => {
    const state = minerCandidateFixture(); state.identity.nextEntitySequence = 40;
    const ids = Object.freeze(["pickaxe:3", "polisher:8", "refiner:11"]);
    const next = minerModel.preparePurchase(state, 1, minerOptions, ids);
    assert.equal(next.factory.miners[0].id, "miner:40");
    assert.equal(next.identity.nextEntitySequence, 41);
    assert.equal(next.identity.nextManualEquipSequence, 7);
    assert.equal(state.identity.nextEntitySequence, 40);
    for (const otherIds of [undefined, null, ["miner:2"], ["pickaxe:default"], ["furnace:permanent"],
        ["pickaxe:40"], ["refiner:41"], ["pickaxe:3", "polisher:3"], ["pickaxe:03"], ["pickaxe:3", "pickaxe:3"]])
        assert.throws(() => minerModel.validateCandidate(state, otherIds));
    const collision = structuredClone(next); collision.identity.nextEntitySequence = 50;
    assert.throws(() => minerModel.validateCandidate(collision, ["pickaxe:40"]), /reused entity sequence/);
    assert.throws(() => minerModel.validateCandidate(next, ["pickaxe:41"]), /must exceed/);
});

test("Miner purchase uses canonical quote, explicit unlock and one actual purchase Payment", () => {
    for (const [discountLevel, price] of [[0, 100], [1, 95], [10, 50]]) {
        const state = minerCandidateFixture(); state.cash = price + 0.5;
        const next = minerModel.preparePurchase(state, 1, { discountLevel, preservationLevel: 0 }, []);
        assert.equal(minerModel.getMinerPrice(discountLevel), price);
        assert.equal(next.cash, 0.5);
        assert.deepEqual(structuredClone(next.factory.miners[0]), idleMinerFixture({
            investment: { entries: [{ kind: "purchase", targetLevel: null, cashPaid: price, basis: "actual" }] }
        }));
        assert.equal(next.identity.nextEntitySequence, 2);
        assert.deepEqual(state.factory.miners, []);
    }
    const state = minerCandidateFixture(); state.shop.minerUnlocked = false;
    assert.throws(() => minerModel.preparePurchase(state, 1, minerOptions, []), /Unlock Miner purchase/);
    const missing = minerCandidateFixture(); delete missing.shop.minerUnlocked;
    assert.throws(() => minerModel.preparePurchase(missing, 1, minerOptions, []));
});

test("Preservation applies only at creation and purchases retain independent entity and ledger state", () => {
    const state = minerCandidateFixture(); state.factory.minerSlots[4] = true;
    let first = minerModel.preparePurchase(state, 1, { discountLevel: 1, preservationLevel: 6 }, []);
    first.factory.miners[0].oreLuckLevel = 3;
    first.factory.miners[0].nextCycleSequence = 9;
    const before = structuredClone(first);
    freezeCandidate(first);
    const options = Object.freeze({ discountLevel: 10, preservationLevel: 25 });
    const second = minerModel.preparePurchase(first, 5, options, Object.freeze([]));
    assert.deepEqual(structuredClone(second.factory.miners[0]), before.factory.miners[0]);
    assert.equal(second.factory.miners[1].tier, 25);
    assert.equal(second.factory.miners[1].oreLuckLevel, 0);
    assert.equal(second.factory.miners[1].investment.entries.length, 1);
    assert.equal(second.cash, 855);
    assert.notEqual(second.factory.miners[0].investment, second.factory.miners[1].investment);
    second.factory.miners[0].investment.entries[0].cashPaid = 0;
    assert.equal(second.factory.miners[1].investment.entries[0].cashPaid, 50);
    assert.deepEqual(structuredClone(first), before);
    const another = minerModel.preparePurchase(state, 1, minerOptions, []);
    another.factory.minerSlots[4] = false;
    another.factory.miners[0].investment.entries[0].cashPaid = 1;
    assert.equal(first.factory.miners[0].investment.entries[0].cashPaid, 95);
    assert.equal(state.factory.minerSlots[4], true);
    for (const preservationLevel of [0, 1, 25]) {
        const next = minerModel.preparePurchase(state, 1, { discountLevel: 0, preservationLevel }, []);
        assert.equal(next.factory.miners[0].tier, Math.max(1, preservationLevel));
        assert.equal(next.factory.miners[0].investment.entries.length, 1);
    }
});

test("candidate purchases reject invalid state, slots and perks without partial Cash, ownership or ID changes", () => {
    const badStates = [];
    for (const cash of [99, -1, "100", null, NaN, Infinity, 1e30]) { const s = minerCandidateFixture(); s.cash = cash; badStates.push(s); }
    for (const n of [0, -1, 1.5, "1", 2 ** 53, Number.MAX_SAFE_INTEGER]) {
        const s = minerCandidateFixture(); s.identity.nextEntitySequence = n; badStates.push(s);
    }
    for (const n of [0, "7", 2 ** 53]) { const s = minerCandidateFixture(); s.identity.nextManualEquipSequence = n; badStates.push(s); }
    const occupied = minerModel.preparePurchase(minerCandidateFixture(), 1, minerOptions, []);
    badStates.push(occupied);
    const invalidLedger = structuredClone(occupied); invalidLedger.factory.miners[0].investment.entries = [];
    badStates.push(invalidLedger);
    const malformed = structuredClone(occupied); delete malformed.factory.miners[0].tier; badStates.push(malformed);
    const extra = minerCandidateFixture(); extra.saveVersion = 2; badStates.push(extra); // Projection, not a full save.
    const getter = Object.defineProperty(minerCandidateFixture(), "cash", { get() { throw Error("getter called"); } });
    assert.throws(() => minerModel.preparePurchase(getter, 1, minerOptions, []), /own data field/);
    for (const state of badStates) {
        const before = structuredClone(state);
        assert.throws(() => minerModel.preparePurchase(state, 1, minerOptions, []));
        assert.deepEqual(structuredClone(state), before);
    }
    const state = minerCandidateFixture(), before = structuredClone(state);
    for (const slot of [0, 2, 6, 1.5, "1", null]) assert.throws(() => minerModel.preparePurchase(state, slot, minerOptions, []));
    for (const bad of [-1, 26, 1.5, "1", null, NaN, Infinity])
        assert.throws(() => minerModel.preparePurchase(state, 1, { discountLevel: 0, preservationLevel: bad }, []));
    for (const bad of [-1, 11, 0.5, "0", null, NaN, Infinity])
        assert.throws(() => minerModel.preparePurchase(state, 1, { discountLevel: bad, preservationLevel: 0 }, []));
    for (const options of [null, {}, { ...minerOptions, price: 0 }, { discountLevel: 0 }])
        assert.throws(() => minerModel.preparePurchase(state, 1, options, []));
    assert.deepEqual(state, before);
});

test("five sequential candidate purchases allocate once each and an exhausted or full candidate cannot buy", () => {
    let state = minerCandidateFixture(); state.factory.minerSlots.fill(true);
    for (const slot of [5, 2, 4, 1, 3]) state = minerModel.preparePurchase(state, slot, minerOptions, []);
    assert.deepEqual(Array.from(state.factory.miners, miner => miner.id), ["miner:1", "miner:2", "miner:3", "miner:4", "miner:5"]);
    assert.equal(state.identity.nextEntitySequence, 6);
    assert.equal(state.cash, 500);
    const before = structuredClone(state);
    assert.throws(() => minerModel.preparePurchase(state, 1, minerOptions, []), /already owns five/);
    assert.deepEqual(structuredClone(state), before);
    const edge = minerCandidateFixture(); edge.identity.nextEntitySequence = Number.MAX_SAFE_INTEGER - 1;
    const last = minerModel.preparePurchase(edge, 1, minerOptions, []);
    assert.equal(last.identity.nextEntitySequence, Number.MAX_SAFE_INTEGER);
    last.factory.minerSlots[1] = true;
    assert.throws(() => minerModel.preparePurchase(last, 2, minerOptions, []), /exhausted/);
});

test("candidate helpers never attach machine entities to fresh or legacy/current production saves", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0, unknown: { retained: true } }))]) {
        let app = ready(raw);
        const before = app.state();
        app.run(`MinerCandidateModel.preparePurchase({cash:100,shop:{minerUnlocked:true},
            factory:{minerSlots:[true,false,false,false,false],miners:[]},
            identity:{nextEntitySequence:1,nextManualEquipSequence:1}},1,{discountLevel:0,preservationLevel:0},[]);`);
        assert.deepEqual(app.state(), before);
        assert.equal(app.writes.length, 0);
        app = saveAndReload(app);
        assert.deepEqual(app.state(), before);
        if (raw !== null) {
            for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"]) app.elements.get(id).onclick();
            assert.equal(app.state().cash, 390);
            for (const key of ["droppers", "adders", "multipliers", "furnaceTier"]) assert.equal(app.state()[key], 1);
        }
        const after = app.state();
        assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        for (const field of ["factory", "identity", "shop", "investment", "miners", "minerSlots"])
            assert.equal(Object.hasOwn(after, field), false);
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

const investmentModel = vm.runInNewContext(ores + "\nInvestmentModel;");
function paymentFixture(overrides = {}) {
    return { kind: "purchase", targetLevel: null, cashPaid: 100.25, basis: "actual", ...overrides };
}
function investmentContext(machineType = "miner", owned = true) {
    return { machineType, owned };
}

test("actual Payment records retain exact Cash, zero purchases and machine-specific targets", () => {
    for (const [machineType, cap] of [["miner", 25], ["polisher", 10], ["refiner", 10]]) {
        for (const input of [paymentFixture(), paymentFixture({ cashPaid: 0 }),
            paymentFixture({ kind: "tier", targetLevel: 2 }), paymentFixture({ kind: "tier", targetLevel: cap })]) {
            Object.freeze(input);
            const result = investmentModel.createActualPayment(input, machineType);
            assert.notEqual(result, input);
            assert.deepEqual(structuredClone(result), input);
        }
    }
    for (const targetLevel of [1, 50])
        assert.doesNotThrow(() => investmentModel.validatePayment(paymentFixture({ kind: "oreLuck", targetLevel }), "miner"));
    // Validation does not round even fractional historical actual payments.
    assert.equal(investmentModel.createActualPayment(paymentFixture({ cashPaid: 0.1 }), "miner").cashPaid, 0.1);
});

test("Payment validation rejects malformed fields, nonqualifying kinds and invalid machines", () => {
    const invalid = [null, [], {}, paymentFixture({ extra: 1 }), Object.create(paymentFixture()),
        Object.defineProperty(paymentFixture(), "cashPaid", { get() { throw Error("getter executed"); } })];
    for (const key of Object.keys(paymentFixture())) {
        const partial = paymentFixture(); delete partial[key]; invalid.push(partial);
    }
    for (const kind of ["minerSlot", "unlockMiner", "normalShop", "pickaxeCrafting", "pickaxeRepair",
        "materials", "stardust", "rebirthPerk", "inscription", "preservation", "furnaceTier", "unknown", null])
        invalid.push(paymentFixture({ kind }));
    for (const basis of ["migration", "Actual", "", null, true]) invalid.push(paymentFixture({ basis }));
    for (const cashPaid of [-1, "100", null, undefined, false, NaN, Infinity, -Infinity])
        invalid.push(paymentFixture({ cashPaid }));
    for (const value of invalid)
        assert.throws(() => investmentModel.validatePayment(value, "miner"), /Invalid investment model/);
    for (const machineType of ["furnace", "dropper", "Miner", "toString", "__proto__", null, 1])
        assert.throws(() => investmentModel.validatePayment(paymentFixture(), machineType), /machineType/);
});

test("Payment targets enforce null purchase, machine tier caps and Miner-only Ore Luck", () => {
    for (const targetLevel of [0, 1, 2, "null", undefined, NaN])
        assert.throws(() => investmentModel.validatePayment(paymentFixture({ targetLevel }), "miner"), /targetLevel/);
    for (const [machineType, cap] of [["miner", 25], ["polisher", 10], ["refiner", 10]]) {
        for (const targetLevel of [null, 0, 1, cap + 1, 2.5, "2", NaN, Infinity])
            assert.throws(() => investmentModel.validatePayment(paymentFixture({ kind: "tier", targetLevel }), machineType), /targetLevel/);
    }
    for (const targetLevel of [null, 0, 51, 1.5, "1", NaN, Infinity])
        assert.throws(() => investmentModel.validatePayment(paymentFixture({ kind: "oreLuck", targetLevel }), "miner"), /targetLevel/);
    for (const machineType of ["polisher", "refiner"])
        assert.throws(() => investmentModel.validatePayment(paymentFixture({ kind: "oreLuck", targetLevel: 1 }), machineType), /Miner-only/);
});

test("migration candidates validate structurally but cannot be created or appended as new runtime payments", () => {
    const historical = Object.freeze(paymentFixture({ cashPaid: 137.5, basis: "legacyEquivalentV1" }));
    const ledger = { entries: [historical] };
    const context = investmentContext();
    investmentModel.validatePayment(historical, "miner");
    investmentModel.validateInvestment(ledger, context);
    assert.equal(investmentModel.sumInvestment(ledger, context), 137.5);
    assert.equal(investmentModel.calculateRefund(ledger, context), 68);
    assert.throws(() => investmentModel.createActualPayment(historical, "miner"), /must be actual/);
    assert.throws(() => investmentModel.appendActualPayment(investmentModel.createInvestment(), historical,
        investmentContext("miner", false)), /must be actual/);
    assert.throws(() => investmentModel.appendActualPayment(ledger,
        paymentFixture({ kind: "tier", targetLevel: 2, basis: "legacyEquivalentV1" }), context), /must be actual/);
    const updated = investmentModel.appendActualPayment(ledger,
        paymentFixture({ kind: "tier", targetLevel: 2, cashPaid: 12.5 }), context);
    assert.deepEqual(structuredClone(updated.entries[0]), historical);
    assert.equal(investmentModel.calculateRefund(updated, context), 75);
    assert.equal(ledger.entries.length, 1);
});

test("investment ownership context distinguishes empty candidates from complete purchased ledgers", () => {
    const empty = investmentModel.createInvestment();
    const second = investmentModel.createInvestment();
    assert.notEqual(empty.entries, second.entries);
    const candidate = investmentContext("miner", false);
    investmentModel.validateInvestment(empty, candidate);
    assert.equal(investmentModel.sumInvestment(empty, candidate), 0);
    assert.equal(investmentModel.calculateRefund(empty, candidate), 0);
    assert.throws(() => investmentModel.validateInvestment(empty, investmentContext()), /exactly one purchase/);
    const purchased = investmentModel.appendActualPayment(empty, paymentFixture({ cashPaid: 0 }), candidate);
    investmentModel.validateInvestment(purchased, investmentContext());
    assert.equal(investmentModel.calculateRefund(purchased, investmentContext()), 0);
    assert.deepEqual(structuredClone(empty), { entries: [] });
    assert.throws(() => investmentModel.validateInvestment(purchased, candidate), /unowned candidate/);
    assert.throws(() => investmentModel.appendActualPayment(empty,
        paymentFixture({ kind: "tier", targetLevel: 2 }), candidate), /exactly one purchase/);
    assert.throws(() => investmentModel.validateInvestment({ entries: [paymentFixture({ kind: "tier", targetLevel: 2 })] },
        investmentContext()), /exactly one purchase/);
});

test("investment duplicates reject by kind and target regardless of amount or basis", () => {
    const purchase = paymentFixture();
    const tier = paymentFixture({ kind: "tier", targetLevel: 2, cashPaid: 10 });
    const luck = paymentFixture({ kind: "oreLuck", targetLevel: 2, cashPaid: 5 });
    const context = investmentContext();
    const valid = { entries: [purchase, tier, luck] };
    investmentModel.validateInvestment(valid, context);
    assert.equal(investmentModel.sumInvestment(valid, context), 115.25);
    for (const duplicate of [purchase, tier, luck]) {
        const changed = { ...duplicate, cashPaid: 0, basis: "legacyEquivalentV1" };
        assert.throws(() => investmentModel.validateInvestment({ entries: [...valid.entries, changed] }, context), /duplicate/);
        assert.throws(() => investmentModel.appendActualPayment(valid, duplicate, context), /duplicate/);
    }
    assert.equal(valid.entries.length, 3);
});

test("actual payment append returns independent records without mutating historical amounts or context", () => {
    const existing = Object.freeze(paymentFixture());
    const original = Object.freeze({ entries: Object.freeze([existing]) });
    const input = Object.freeze(paymentFixture({ kind: "tier", targetLevel: 25, cashPaid: 25.5 }));
    const context = Object.freeze(investmentContext());
    const result = investmentModel.appendActualPayment(original, input, context);
    assert.deepEqual(structuredClone(result), { entries: [existing, input] });
    result.entries[0].cashPaid = 0;
    result.entries[1].targetLevel = 2;
    assert.equal(existing.cashPaid, 100.25);
    assert.equal(input.targetLevel, 25);
    assert.equal(original.entries.length, 1);
    assert.deepEqual(context, investmentContext());
    assert.throws(() => investmentModel.appendActualPayment({ entries: [] }, input, context), /exactly one purchase/);
});

test("investment records and validation contexts reject incomplete or malformed structures", () => {
    for (const investment of [null, [], {}, { entries: null }, { entries: {} }, { entries: Array(1) },
        { entries: [paymentFixture()], refund: 50 }, { entries: [null] }])
        assert.throws(() => investmentModel.validateInvestment(investment, investmentContext()), /Invalid investment model/);
    for (const context of [null, {}, [], { machineType: "miner" }, { owned: true },
        { machineType: "miner", owned: 1 }, { machineType: "miner", owned: true, tier: 25 },
        Object.create(investmentContext()), investmentContext("furnace")])
        assert.throws(() => investmentModel.validateInvestment({ entries: [paymentFixture()] }, context), /Invalid investment model/);
});

test("recorded refund floors half the exact total and retains fractional Cash unchanged", () => {
    const ledger = { entries: [paymentFixture({ cashPaid: 100.25 }),
        paymentFixture({ kind: "tier", targetLevel: 7, cashPaid: 25.5 }),
        paymentFixture({ kind: "oreLuck", targetLevel: 1, cashPaid: 3.75 })] };
    const before = structuredClone(ledger);
    assert.equal(investmentModel.sumInvestment(ledger, investmentContext()), 129.5);
    assert.equal(investmentModel.calculateRefund(ledger, investmentContext()), 64);
    for (const [cashPaid, expected] of [[0, 0], [1, 0], [2, 1], [3.5, 1], [0.1, 0], [2 ** 54, 2 ** 53]])
        assert.equal(investmentModel.calculateRefund({ entries: [paymentFixture({ cashPaid })] }, investmentContext()), expected);
    assert.deepEqual(ledger, before);
    assert.deepEqual(Object.keys(ledger), ["entries"]);
});

test("investment arithmetic rejects overflow, absorbed payments and non-representable sums", () => {
    for (const [first, next] of [[Number.MAX_VALUE, Number.MAX_VALUE], [1e30, 1], [1, 1e30],
        [2 ** 53, 3], [0.1, 0.2]]) {
        const ledger = { entries: [paymentFixture({ cashPaid: first })] };
        const payment = paymentFixture({ kind: "tier", targetLevel: 2, cashPaid: next });
        const before = structuredClone(ledger);
        assert.throws(() => investmentModel.appendActualPayment(ledger, payment, investmentContext()), /total/);
        const combined = { entries: [...ledger.entries, payment] };
        assert.throws(() => investmentModel.validateInvestment(combined, investmentContext()), /total/);
        assert.throws(() => investmentModel.sumInvestment(combined, investmentContext()), /total/);
        assert.throws(() => investmentModel.calculateRefund(combined, investmentContext()), /total/);
        assert.deepEqual(ledger, before);
    }
    const huge = { entries: [paymentFixture({ cashPaid: 2 ** 54 })] };
    const valid = investmentModel.appendActualPayment(huge,
        paymentFixture({ kind: "tier", targetLevel: 2, cashPaid: 2 ** 54 }), investmentContext());
    assert.equal(investmentModel.sumInvestment(valid, investmentContext()), 2 ** 55);
    assert.equal(investmentModel.calculateRefund(valid, investmentContext()), 2 ** 54);
});

test("free Preservation tiers and new Discount quotes never change recorded investment", () => {
    const machine = { tier: 1, investment: { entries: [paymentFixture({ cashPaid: 95 })] } };
    const context = investmentContext();
    const original = structuredClone(machine.investment);
    const pricing = vm.runInNewContext(ores + "\nCashPricingModel;");
    assert.equal(pricing.calculateCashPrice(100, { category: "minerPurchase", discountLevel: 1 }), 95);
    for (const tier of [1, 6, 25]) {
        machine.tier = tier;
        for (const discountLevel of [0, 10]) {
            pricing.calculateCashPrice(100, { category: "minerPurchase", discountLevel });
            investmentModel.validateInvestment(machine.investment, context);
            assert.equal(investmentModel.calculateRefund(machine.investment, context), 47);
        }
    }
    assert.deepEqual(machine.investment, original);
    assert.equal(machine.investment.entries.length, 1); // No free tier or Ore Luck entries.
});

test("candidate investment operations leave live schema-1 saves and legacy transactions untouched", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({ saveVersion,
        cash: 6000, factoryXP: 100, droppers: 0, adders: 0, multipliers: 0, unknown: { keep: true } }))]) {
        let app = ready(raw);
        const before = app.state();
        app.run(`InvestmentModel.appendActualPayment(InvestmentModel.createInvestment(),
            {kind:"purchase",targetLevel:null,cashPaid:50,basis:"actual"}, {machineType:"miner",owned:false});`);
        assert.deepEqual(app.state(), before);
        assert.equal(app.writes.length, 0);
        app = saveAndReload(app);
        assert.deepEqual(app.state(), before);
        if(raw !== null) {
            for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                app.elements.get(id).onclick();
            assert.equal(app.state().cash, 390);
            assert.equal(app.state().droppers, 1);
            assert.equal(app.state().adders, 1);
            assert.equal(app.state().multipliers, 1);
            assert.equal(app.state().furnaceTier, 1);
        }
        const after = app.state();
        assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        for (const field of ["investment", "entries", "payments", "refund", "factory", "shop", "identity", "compatibility"])
            assert.equal(Object.hasOwn(after, field), false, field);
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

// Pricing executes with no game, DOM, storage, RNG or timer context.
const cashPricingModel = vm.runInNewContext(ores + "\nCashPricingModel;");

test("Cash rounding selects all four bands from the unrounded amount", () => {
    for (const [amount, step] of [[0, 1], [10.5, 1], [999.75, 1],
        [1000, 10], [1000.25, 10], [999999.75, 10],
        [1000000, 1000], [1000000.25, 1000], [999999999.75, 1000],
        [1000000000, 1000000], [1000000000.25, 1000000], [1e15, 1000000]])
        assert.equal(cashPricingModel.getCashRoundingStep(amount), step, String(amount));
    for (const [amount, rounded] of [[999.75, 1000], [1000, 1000],
        [999999.75, 1000000], [1000000, 1000000],
        [999999999.75, 1000000000], [1000000000, 1000000000]])
        assert.equal(cashPricingModel.roundCashPrice(amount), rounded);
});

test("Cash rounding uses positive half-up on every band without epsilon adjustments", () => {
    // Binary-exact quarter offsets on both sides of each half-step.
    for (const [half, down, up] of [[10.5, 10, 11], [1005, 1000, 1010],
        [1000500, 1000000, 1001000], [1000500000, 1000000000, 1001000000]]) {
        assert.equal(cashPricingModel.roundCashPrice(half - 0.25), down);
        assert.equal(cashPricingModel.roundCashPrice(half), up);
        assert.equal(cashPricingModel.roundCashPrice(half + 0.25), up);
    }
    assert.equal(cashPricingModel.roundCashPrice(10.49), 10);
    assert.equal(cashPricingModel.roundCashPrice(1004), 1000);
    assert.equal(cashPricingModel.roundCashPrice(0), 0);
});

test("Factory Purchase Discount accepts only Defined levels and factors", () => {
    for (const [level, factor] of [[0, 1], [1, 0.95], [2, 0.9], [5, 0.75], [8, 0.6], [10, 0.5]])
        assert.equal(cashPricingModel.getDiscountFactor(level), factor);
    for (const discountLevel of [-1, 11, 0.5, "1", null, undefined, true, NaN, Infinity, -Infinity]) {
        assert.throws(() => cashPricingModel.getDiscountFactor(discountLevel), /discountLevel/);
        for (const category of ["minerPurchase", "unlockMiner"])
            assert.throws(() => cashPricingModel.calculateCashPrice(100, { category, discountLevel }), /discountLevel/);
    }
});

test("Cash categories enforce Discount eligibility independently of Cash rounding", () => {
    for (const category of ["minerPurchase", "minerTier", "polisherPurchase", "polisherTier",
        "refinerPurchase", "refinerTier", "furnaceTier"]) {
        assert.equal(cashPricingModel.calculateCashPrice(1005, { category, discountLevel: 10 }), 503, category);
        assert.equal(cashPricingModel.calculateCashPrice(1005, { category, discountLevel: 0 }), 1010);
    }
    for (const category of ["unlockMiner", "minerSlot", "minerOreLuck", "oreValue", "miningPower",
        "miningLuck", "miningDuplication"]) {
        assert.equal(cashPricingModel.calculateCashPrice(1005, { category, discountLevel: 10 }), 1010, category);
        assert.equal(cashPricingModel.calculateCashPrice(1005, { category, discountLevel: 0 }), 1010);
    }
});

test("Discount crosses each rounding band before step selection and before rounding", () => {
    for (const [rawPrice, expected] of [[1997, 999], [1998990, 999500],
        [1999001000, 999501000], [2009, 1000]]) {
        assert.equal(cashPricingModel.calculateCashPrice(rawPrice,
            { category: "minerTier", discountLevel: 10 }), expected);
    }
    // 2009 rounds to 2010 first under the WRONG order, then discounts to 1005 -> 1010.
    // Correct order is 2009 * 0.5 = 1004.5 -> 1000.
    assert.equal(cashPricingModel.calculateCashPrice(1000,
        { category: "furnaceTier", discountLevel: 1 }), 950);
});

test("Defined purchase examples use explicit categories without implementing transactions", () => {
    for (const [category, rawPrice, discountLevel, expected] of [
        ["unlockMiner", 100, 10, 100], ["minerPurchase", 100, 10, 50],
        ["polisherPurchase", 5000, 10, 2500], ["polisherPurchase", 100000, 10, 50000],
        ["polisherPurchase", 2000000, 10, 1000000], ["refinerPurchase", 25000, 1, 23750],
        ["furnaceTier", 100, 1, 95], ["miningPower", 250, 10, 250],
        ["minerOreLuck", 1000 * 1.25 ** 3, 10, 1950]]) {
        assert.equal(cashPricingModel.calculateCashPrice(rawPrice, { category, discountLevel }), expected);
    }
});

test("original target formulas give prices independent of previous rounded quotes", () => {
    const options = Object.freeze({ category: "minerOreLuck", discountLevel: 10 });
    const rawCost = level => 1000 * 1.25 ** (level - 1);
    const eighth = cashPricingModel.calculateCashPrice(rawCost(8), options);
    assert.equal(eighth, 4770);
    const seventh = cashPricingModel.calculateCashPrice(rawCost(7), options);
    assert.equal(seventh, 3810);
    assert.equal(cashPricingModel.calculateCashPrice(rawCost(8), options), eighth);
    // Document why the caller must supply its original formula, not lastPaid * growth.
    assert.equal(cashPricingModel.calculateCashPrice(seventh * 1.25, options), 4760);
    assert.deepEqual(options, { category: "minerOreLuck", discountLevel: 10 });
});

test("Cash pricing rejects malformed amounts and calculation overflow while allowing free quotes", () => {
    const options = { category: "minerPurchase", discountLevel: 0 };
    for (const value of [-1, -0.1, "100", null, undefined, false, {}, [], NaN, Infinity, -Infinity]) {
        assert.throws(() => cashPricingModel.getCashRoundingStep(value), /Invalid Cash pricing/);
        assert.throws(() => cashPricingModel.roundCashPrice(value), /Invalid Cash pricing/);
        assert.throws(() => cashPricingModel.calculateCashPrice(value, options), /Invalid Cash pricing/);
    }
    assert.throws(() => cashPricingModel.roundCashPrice(Number.MAX_VALUE), /rounded price/);
    assert.throws(() => cashPricingModel.calculateCashPrice(Number.MAX_VALUE, options), /rounded price/);
    assert.throws(() => cashPricingModel.calculateCashPrice(1000 * 4 ** 512, options), /rawPrice/);
    assert.ok(Number.isFinite(cashPricingModel.calculateCashPrice(Number.MAX_VALUE,
        { category: "minerPurchase", discountLevel: 10 })));
    for (const category of ["minerPurchase", "unlockMiner"])
        assert.equal(cashPricingModel.calculateCashPrice(0, { category, discountLevel: 10 }), 0);
});

test("Cash pricing rejects category overrides, non-Cash costs and missing explicit options", () => {
    for (const category of ["pickaxeCrafting", "pickaxeRepair", "materials", "stardustPerk", "rebirthPerk",
        "inscription", "unknown", "toString", "__proto__", "minerPurchase\n", true, null, 1])
        assert.throws(() => cashPricingModel.calculateCashPrice(100, { category, discountLevel: 10 }), /category/);
    for (const options of [undefined, null, [], {}, { category: "minerPurchase" }, { discountLevel: 0 },
        { category: "unlockMiner", discountLevel: 10, discountEligible: true },
        Object.create({ category: "minerPurchase", discountLevel: 0 }),
        { get category() { throw Error("getter executed"); }, discountLevel: 0 }])
        assert.throws(() => cashPricingModel.calculateCashPrice(100, options), /Invalid Cash pricing/);
});

test("pure Cash quotes preserve schema-1 state and legacy purchase behavior", () => {
    for (const raw of [null, JSON.stringify({ cash: 6000, factoryXP: 100, droppers: 0, adders: 0,
        multipliers: 0, retained: { unknown: true } }), JSON.stringify({ saveVersion: 1, cash: 6000,
        factoryXP: 100, droppers: 0, adders: 0, multipliers: 0 })]) {
        let app = ready(raw);
        const before = app.state();
        app.run("CashPricingModel.calculateCashPrice(100, {category:'minerPurchase',discountLevel:10});");
        assert.deepEqual(app.state(), before);
        assert.equal(app.writes.length, 0);
        assert.equal(app.run("getDropperCost()"), 10);
        assert.equal(app.run("getAdderCost()"), 100);
        assert.equal(app.run("getMultiplierCost()"), 5000);
        app = saveAndReload(app);
        assert.deepEqual(app.state(), before);
        if(raw !== null) {
            for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                app.elements.get(id).onclick();
            assert.equal(app.state().cash, 390);
            assert.equal(app.state().droppers, 1);
            assert.equal(app.state().adders, 1);
            assert.equal(app.state().multipliers, 1);
            assert.equal(app.state().furnaceTier, 1);
        }
        const after = app.state();
        assert.equal(after.saveVersion, 1);
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        for (const key of ["shop", "investment", "payments", "discountLevel", "factoryPurchaseDiscount", "factory"])
            assert.equal(Object.hasOwn(after, key), false, key);
        assert.deepEqual(saveAndReload(app).state(), after);
    }
});

// Load the model with only its catalogue: no game, DOM, storage, clock or RNG harness.
const inventoryModel = vm.runInNewContext(ores + "\nInventoryModel;");
function lotFixture(overrides = {}) {
    return { resourceId: "ruby", stage: "raw", refineCount: 0, amount: 7,
        polishedValue: null, preRefinerValue: null, refineBonus: null, ...overrides };
}
function polishedFixture(overrides = {}) {
    return lotFixture({ stage: "polished", polishedValue: 27500, ...overrides });
}
function refinedFixture(overrides = {}) {
    return lotFixture({ stage: "refined", refineCount: 4, preRefinerValue: 27500,
        refineBonus: 0.125, ...overrides });
}
function pickaxeFixture(overrides = {}) {
    return { id: "pickaxe:1", tier: 1, remainingDurability: 500, lastManualEquipOrder: 0, ...overrides };
}

test("pure Lot constructors accept raw resources and preserve supplied processed snapshots", () => {
    for (const resourceId of ["stone", ...vm.runInNewContext(ores + "\nORE_KEYS;")]) {
        const input = Object.freeze(lotFixture({ resourceId }));
        const result = inventoryModel.createLot(input);
        assert.notEqual(result, input);
        assert.deepEqual(structuredClone(result), input);
    }
    for (const input of [polishedFixture({ polishedValue: 0 }), polishedFixture(),
        refinedFixture(), refinedFixture({ refineCount: 15, refineBonus: -0.9 }),
        refinedFixture({ refineCount: 1, refineBonus: 7.5 })]) {
        assert.deepEqual(structuredClone(inventoryModel.createLot(input)), input);
        assert.equal(inventoryModel.validateLot(input), undefined);
    }
});

test("Lot validation rejects malformed records, quantities, resource IDs and stages", () => {
    for (const value of [null, [], false, "lot", {}, Object.create(lotFixture()),
        lotFixture({ extra: 1 }), Object.assign(new Date(), lotFixture()),
        Object.defineProperty(lotFixture(), "amount", { get() { throw Error("getter executed"); } })])
        assert.throws(() => inventoryModel.validateLot(value), /Invalid inventory model/);
    for (const field of Object.keys(lotFixture())) {
        const partial = lotFixture(); delete partial[field];
        assert.throws(() => inventoryModel.validateLot(partial), /Invalid inventory model/);
    }
    for (const amount of [0, -1, 1.5, "7", null, undefined, NaN, Infinity, -Infinity])
        assert.throws(() => inventoryModel.validateLot(lotFixture({ amount })), /amount/);
    for (const resourceId of ["wood", "unknown", "toString", "__proto__", 1, null])
        assert.throws(() => inventoryModel.validateLot(lotFixture({ resourceId })), /resourceId/);
    for (const stage of ["Raw", "mutated", "", 0, null])
        assert.throws(() => inventoryModel.validateLot(lotFixture({ stage })), /stage/);
});

test("Lot stage metadata is required and cannot be mixed or silently defaulted", () => {
    const invalid = [
        polishedFixture({ resourceId: "stone" }), refinedFixture({ resourceId: "stone" }),
        lotFixture({ refineCount: 1 }), polishedFixture({ refineCount: 1 }),
        lotFixture({ polishedValue: 0 }), lotFixture({ preRefinerValue: 0 }),
        lotFixture({ refineBonus: 0 }), polishedFixture({ preRefinerValue: 0 }),
        polishedFixture({ refineBonus: 0 }), refinedFixture({ polishedValue: 0 })
    ];
    for (const refineCount of [0, -1, 16, 1.1, "4", null, NaN, Infinity])
        invalid.push(refinedFixture({ refineCount }));
    for (const value of [null, undefined, "1", true, -1, NaN, Infinity]) {
        invalid.push(polishedFixture({ polishedValue: value }));
        invalid.push(refinedFixture({ preRefinerValue: value }));
    }
    for (const refineBonus of [null, undefined, "0.5", true, -1.01, NaN, Infinity])
        invalid.push(refinedFixture({ refineBonus }));
    invalid.push(refinedFixture({ preRefinerValue: Number.MAX_VALUE, refineBonus: 1 }));
    for (const value of invalid)
        assert.throws(() => inventoryModel.validateLot(value), /Invalid inventory model/);
    for (let refineCount = 1; refineCount <= 15; refineCount++) {
        const refineBonus = refineCount <= 5 ? 0.5 * (5 - refineCount) / 4 : -0.09 * (refineCount - 5);
        assert.doesNotThrow(() => inventoryModel.validateLot(refinedFixture({ refineCount, refineBonus })));
    }
});

test("cohort compatibility uses every exact identity field and ignores only amount", () => {
    for (const input of [lotFixture(), polishedFixture(), refinedFixture()])
        assert.equal(inventoryModel.lotsCompatible(input, { ...input, amount: 99 }), true);
    for (const [a, b] of [
        [lotFixture(), lotFixture({ resourceId: "amber" })],
        [lotFixture(), polishedFixture()],
        [polishedFixture(), polishedFixture({ polishedValue: 27500.01 })],
        [refinedFixture(), refinedFixture({ refineCount: 5 })],
        [refinedFixture(), refinedFixture({ preRefinerValue: 27500.01 })],
        [refinedFixture(), refinedFixture({ refineBonus: 0.12501 })],
        // Identical final Cash values still describe different cohorts.
        [refinedFixture({ preRefinerValue: 100, refineBonus: 0.5 }),
            refinedFixture({ preRefinerValue: 150, refineBonus: 0 })]
    ]) {
        assert.equal(inventoryModel.lotsCompatible(a, b), false);
        assert.equal(inventoryModel.lotsCompatible(b, a), false);
        assert.throws(() => inventoryModel.mergeLots(a, b), /compatible/);
    }
    assert.throws(() => inventoryModel.lotsCompatible(lotFixture(), lotFixture({ amount: 0 })), /amount/);
});

test("merge and split preserve snapshots, conserve quantity and never mutate inputs", () => {
    for (const template of [lotFixture(), polishedFixture(), refinedFixture({ refineCount: 15, refineBonus: -0.9 })]) {
        const a = Object.freeze({ ...template, amount: 7 });
        const b = Object.freeze({ ...template, amount: 5 });
        const merged = inventoryModel.mergeLots(a, b);
        assert.deepEqual(structuredClone(merged), { ...template, amount: 12 });
        const split = inventoryModel.splitLot(merged, 5);
        assert.deepEqual(structuredClone(split), { taken: b, remaining: a });
        assert.notEqual(split.taken, split.remaining);
        assert.notEqual(split.taken, merged);
        assert.deepEqual(structuredClone(inventoryModel.splitLot(a, 7)), { taken: a, remaining: null });
        merged.amount = 100;
        split.taken.preRefinerValue = 1;
        assert.deepEqual(a, { ...template, amount: 7 });
        assert.deepEqual(b, { ...template, amount: 5 });
        assert.deepEqual(structuredClone(split.remaining), a);
    }
});

test("quantity operations reject invalid splits, overflow and unrepresentable transfers", () => {
    for (const quantity of [0, -1, 0.1, 8, "2", null, undefined, NaN, Infinity])
        assert.throws(() => inventoryModel.splitLot(lotFixture(), quantity), /split quantity/);
    const huge = lotFixture({ amount: Number.MAX_VALUE });
    assert.doesNotThrow(() => inventoryModel.validateLot(huge)); // Count is not a safe-integer cap.
    assert.throws(() => inventoryModel.mergeLots(huge, huge), /merged amount/);
    assert.throws(() => inventoryModel.mergeLots(huge, lotFixture({ amount: 1 })), /quantity loss/);
    assert.throws(() => inventoryModel.splitLot(huge, 1), /quantity loss/);
    const large = lotFixture({ amount: 2 ** 54 });
    assert.equal(inventoryModel.mergeLots(large, large).amount, 2 ** 55);
    assert.equal(inventoryModel.splitLot(large, 2 ** 53).remaining.amount, 2 ** 53);
});

test("processed inventory creation is isolated and stage validation is strict", () => {
    const a = inventoryModel.createProcessedInventory();
    const b = inventoryModel.createProcessedInventory();
    a.polished.push(polishedFixture());
    assert.deepEqual(structuredClone(b), { polished: [], refined: [] });
    assert.doesNotThrow(() => inventoryModel.validateProcessedInventory(a));
    for (const value of [null, [], {}, { polished: [], refined: [], raw: [] },
        { polished: null, refined: [] }, { polished: [], refined: {} },
        { polished: [lotFixture()], refined: [] }, { polished: [refinedFixture()], refined: [] },
        { polished: [], refined: [polishedFixture()] }, { polished: Array(1), refined: [] },
        { polished: [], refined: [refinedFixture({ amount: 0 })] }])
        assert.throws(() => inventoryModel.validateProcessedInventory(value), /Invalid inventory model/);
    assert.throws(() => inventoryModel.addProcessedLot(b, lotFixture()), /raw lots/);
});

test("processed additions coalesce exact cohorts and return independent records and arrays", () => {
    const polished = Object.freeze(polishedFixture());
    const refined = Object.freeze(refinedFixture());
    const original = Object.freeze({ polished: Object.freeze([polished]), refined: Object.freeze([refined]) });
    const added = inventoryModel.addProcessedLot(original, polished);
    assert.equal(added.polished.length, 1);
    assert.equal(added.polished[0].amount, 14);
    assert.equal(added.refined[0].amount, 7);
    added.refined[0].amount = 42;
    added.polished[0].polishedValue = 0;
    assert.equal(original.refined[0].amount, 7);
    assert.equal(original.polished[0].polishedValue, 27500);
    const other = inventoryModel.addProcessedLot(original, polishedFixture({ polishedValue: 27500.01 }));
    assert.equal(other.polished.length, 2);
    const withRefined = inventoryModel.addProcessedLot(other, refinedFixture({ refineCount: 5, refineBonus: 0 }));
    assert.equal(withRefined.refined.length, 2);
    const coalesced = inventoryModel.addProcessedLot({ polished: [polished, polished], refined: [] }, polished);
    assert.equal(coalesced.polished.length, 1);
    assert.equal(coalesced.polished[0].amount, 21);
    const refinedAdded = inventoryModel.addProcessedLot(original, refined);
    assert.equal(refinedAdded.refined.length, 1);
    assert.equal(refinedAdded.refined[0].amount, 14);
    assert.deepEqual(structuredClone(original), { polished: [polishedFixture()], refined: [refinedFixture()] });
});

test("invalid processed additions fail without changing the original inventory", () => {
    const input = { polished: [polishedFixture()], refined: [refinedFixture()] };
    const before = structuredClone(input);
    for (const lot of [lotFixture(), polishedFixture({ polishedValue: null }), refinedFixture({ amount: 0 })])
        assert.throws(() => inventoryModel.addProcessedLot(input, lot), /Invalid inventory model/);
    assert.deepEqual(input, before);
    const huge = { polished: [polishedFixture({ amount: Number.MAX_VALUE })], refined: [] };
    assert.throws(() => inventoryModel.addProcessedLot(huge, polishedFixture({ amount: Number.MAX_VALUE })), /merged amount/);
    assert.equal(huge.polished[0].amount, Number.MAX_VALUE);
});

test("material models are independent and require only the three canonical counts", () => {
    const a = inventoryModel.createMaterials();
    const b = inventoryModel.createMaterials();
    a.wood = 5;
    assert.deepEqual(structuredClone(b), { wood: 0, scrap: 0, metal: 0 });
    inventoryModel.validateMaterials({ wood: 5, scrap: 10, metal: 2 ** 54 });
    for (const value of [null, [], {}, { wood: 0, scrap: 0 }, { wood: 0, scrap: 0, metal: 0, stone: 0 }])
        assert.throws(() => inventoryModel.validateMaterials(value), /Invalid inventory model/);
    for (const key of ["wood", "scrap", "metal"])
        for (const value of [-1, 0.5, "1", null, undefined, NaN, Infinity])
            assert.throws(() => inventoryModel.validateMaterials({ wood: 0, scrap: 0, metal: 0, [key]: value }), /materials/);
});

test("crafted Pickaxe models accept tiers 1–8, broken copies and supplied maximums", () => {
    for (let tier = 1; tier <= 8; tier++) {
        for (const remainingDurability of [0, 1, 500 * tier]) {
            const original = Object.freeze(pickaxeFixture({ tier, id: "pickaxe:" + tier, remainingDurability }));
            const result = inventoryModel.createPickaxeCopy(original, 500 * tier);
            assert.deepEqual(structuredClone(result), original);
            assert.notEqual(result, original);
            result.remainingDurability = 0;
            assert.equal(original.remainingDurability, remainingDurability);
        }
    }
    assert.doesNotThrow(() => inventoryModel.validatePickaxeCopy(pickaxeFixture({ remainingDurability: 3000,
        id: "pickaxe:9007199254740991", lastManualEquipOrder: Number.MAX_SAFE_INTEGER }), 3000));
});

test("crafted Pickaxe validation rejects reserved IDs, malformed fields and invalid maxima", () => {
    const invalid = [null, [], {}, pickaxeFixture({ extra: 1 }), Object.create(pickaxeFixture())];
    for (const key of Object.keys(pickaxeFixture())) {
        const partial = pickaxeFixture(); delete partial[key]; invalid.push(partial);
    }
    for (const id of ["pickaxe:default", "miner:1", "pickaxe:0", "pickaxe:01", "pickaxe:-1",
        "pickaxe:1.0", "pickaxe:1e2", "pickaxe:1\n", "pickaxe:9007199254740992", "", null, 1])
        invalid.push(pickaxeFixture({ id }));
    for (const tier of [0, 9, 1.5, "1", null, NaN, Infinity]) invalid.push(pickaxeFixture({ tier }));
    for (const remainingDurability of [-1, 501, 0.1, "0", null, NaN, Infinity])
        invalid.push(pickaxeFixture({ remainingDurability }));
    for (const lastManualEquipOrder of [-1, 0.1, "0", null, NaN, Infinity, 2 ** 53])
        invalid.push(pickaxeFixture({ lastManualEquipOrder }));
    for (const value of invalid)
        assert.throws(() => inventoryModel.validatePickaxeCopy(value, 500), /Invalid inventory model/);
    for (const maximum of [undefined, null, -1, 0.1, "500", NaN, Infinity])
        assert.throws(() => inventoryModel.validatePickaxeCopy(pickaxeFixture(), maximum), /maximumDurability/);
});

test("unused candidate models leave fresh and existing schema-1 saves and gameplay unchanged", () => {
    const legacy = JSON.stringify({ cash: 100, factoryXP: 0, droppers: 1, adders: 0, multipliers: 0,
        inventory: { diamond: 3 }, extension: { keep: [1, 2] } });
    for (const raw of [null, legacy, JSON.stringify({ ...JSON.parse(legacy), saveVersion: 1 })]) {
        let app = ready(raw);
        const before = app.state();
        app.run(`InventoryModel.createMaterials(); InventoryModel.createProcessedInventory();
            InventoryModel.createPickaxeCopy({id:"pickaxe:1",tier:1,remainingDurability:500,lastManualEquipOrder:0},500);`);
        assert.deepEqual(app.state(), before);
        app = saveAndReload(app);
        assert.deepEqual(app.state(), before);
        app.run("mineOre(); produceStone(); saveGame();");
        const after = app.state();
        assert.deepEqual(Object.keys(after).sort(), Object.keys(before).sort());
        assert.equal(after.saveVersion, 1);
        assert.ok(Object.values(after.inventory).every(Number.isInteger));
        for (const key of ["manual", "manualProgress", "pickaxes", "materials", "processedInventory", "identity", "factory", "compatibility"])
            assert.equal(Object.hasOwn(after, key), false, key);
        app = saveAndReload(app);
        assert.deepEqual(app.state(), after);
    }
});

test("Default Pickaxe is unconditional runtime state for fresh and legacy/current saves", () => {
    for (const raw of [null, ...[undefined, 0, 1].map(saveVersion => JSON.stringify({
        cash: 137, factoryXP: 400, droppers: 2, adders: 1, multipliers: 1, saveVersion,
        inventory: { diamond: 7 }, extra: { keep: true }
    }))]) {
        let app = ready(raw);
        const before = app.state();
        for (let cycle = 0; cycle < 3; cycle++) {
            assert.deepEqual(JSON.parse(app.run(`JSON.stringify((({name, tier, rawPower, luck}) =>
                ({name, tier, rawPower, luck}))(getManualPickaxe()))`)),
                { name: "Default", tier: 0, rawPower: 4, luck: 1 });
            assert.equal(app.run("getManualPickaxe().durability"), Infinity);
            assert.equal(app.run("getMaxManualOreTier()"), 2);
            app = saveAndReload(app);
            assert.deepEqual(app.state(), before);
            assert.equal(app.state().saveVersion, 1);
            for (const key of ["manualProgress", "manual", "firstActionCompleted", "pickaxes",
                "pickaxeId", "equippedPickaxeId", "durability", "identity", "materials"])
                assert.equal(Object.hasOwn(app.state(), key), false, key);
        }
    }
});

test("Default weights remove locked tiers before normalization without a manual Stone clamp", () => {
    const app = ready();
    const weights = JSON.parse(app.run("JSON.stringify(getAccessibleManualTierWeights())"));
    assert.deepEqual(weights, [239744, 10000, 250, 0, 0]);
    const probabilities = JSON.parse(app.run("JSON.stringify(normalizeManualTierWeights(getAccessibleManualTierWeights()))"));
    assert.deepEqual(probabilities, weights.map(w => w / 249994));
    assert.ok(Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) < 1e-15);
    // Synthetic weights test the reusable boundary, not an implemented Luck formula.
    const adjusted = JSON.parse(app.run(`JSON.stringify(normalizeManualTierWeights(
        getAccessibleManualTierWeights(getManualPickaxe(), [1, 100, 100, 1e12, 1e12])))`));
    assert.deepEqual(adjusted, [1 / 201, 100 / 201, 100 / 201, 0, 0]);
    assert.ok(adjusted[0] < 0.25);
});

test("Default manual boundary rolls select only Stone, T1 or T2 including former rare-tier rolls", () => {
    const app = ready();
    const t2End = 250 / 249994;
    const oreEnd = t2End + 10000 / 249994;
    const cases = [[0, 2], [Number.MIN_VALUE, 2], [0.000004, 2], [0.000024, 2],
        [t2End - Number.EPSILON, 2], [t2End, 1], [t2End + Number.EPSILON, 1],
        [oreEnd - Number.EPSILON, 1], [oreEnd, 0], [oreEnd + Number.EPSILON, 0],
        [0.5, 0], [1 - Number.EPSILON, 0]];
    for (const [roll, tier] of cases) {
        assert.equal(app.run(`rollManualTier(${roll})`), tier, String(roll));
        app.run(`Math.random = () => ${roll};`);
        app.elements.get("mineButton").onclick();
    }
    const state = app.state();
    assert.equal(state.stoneOres, cases.filter(c => c[1] === 0).length);
    assert.equal(state.tier1Ores, cases.filter(c => c[1] === 1).length);
    assert.equal(state.tier2Ores, cases.filter(c => c[1] === 2).length);
    assert.equal(state.tier3Ores, 0);
    assert.equal(state.tier4Ores, 0);
    assert.equal(state.totalOres, cases.length);
    assert.equal(state.achievementStats.totalOresMined, cases.length);
    assert.equal(app.run("[...TIER_3_ORES, ...TIER_4_ORES].every(key => save.inventory[key] === 0 && save.oreCollection[key] === 0)"), true);
});

test("accessible T2 award retains quantity, discovery, XP, achievements and reload", () => {
    let app = ready();
    // First action still rolls normally; no first-Stone lifecycle is introduced.
    app.run("Math.random = () => 0; mineOre(); updateUI();");
    assert.equal(app.state().inventory.citrine, 1);
    assert.equal(app.state().oreCollection.citrine, 1);
    assert.equal(app.state().factoryXP, 25);
    assert.equal(app.state().achievementStats.oresDiscovered, 1);
    assert.equal(app.state().achievements.firstDiscovery.unlocked, true);
    assert.equal(app.elements.get("discoveryPopup").style.display, "block");
    for (let i = 0; i < 3; i++) app.run("mineOre(); updateUI();");
    assert.equal(app.state().inventory.citrine, 4);
    assert.equal(app.state().oreCollection.citrine, 4);
    assert.equal(app.state().achievementStats.oresDiscovered, 1);
    assert.equal(app.state().factoryXP, 100);
    assert.equal(app.state().factoryLevel, 1);
    const before = app.state();
    app = saveAndReload(app);
    assert.deepEqual(app.state(), before);
});

test("manual access does not change automated Stone production or duplication", () => {
    const app = ready(JSON.stringify({ cash: 100, factoryXP: 0, droppers: 2, adders: 0, multipliers: 1 }));
    app.run("Math.random = () => 0; produceStone();");
    assert.equal(app.state().inventory.stone, 4);
    app.run("Math.random = () => 0.5; produceStone();");
    assert.equal(app.state().inventory.stone, 6);
    assert.equal(app.state().totalOres, 6);
    assert.equal(app.state().factoryXP, 6);
    assert.equal(app.state().achievementStats.totalOresMined, 0);
    assert.equal(app.state().achievementStats.oresDiscovered, 0);
    assert.equal(app.run("ORE_KEYS.every(key => save.inventory[key] === 0)"), true);
});

test("canonical factory creates the complete fresh state and a valid round trip", () => {
    const app = ready();
    const defaults = JSON.parse(app.run("JSON.stringify(createDefaultSave())"));
    assert.deepEqual(app.state(), defaults);
    app.run("validateSaveData(createDefaultSave()); saveGame();");
    assert.deepEqual(ready(app.stored()).state(), defaults);
});

test("canonical saves own every mutable nested value independently", () => {
    const app = ready();
    const before = app.state();
    app.run(`
        const isolated = createDefaultSave();
        isolated.inventory.stone = 99;
        isolated.oreCollection.diamond = 2;
        isolated.factoryMilestones[10] = true;
        isolated.achievementStats.oresSmelted = 10;
        isolated.achievements.firstSwing = true;
        isolated.permanentBonuses.oreValue = 7;
        isolated.cycleBonuses.factoryXP = 9;
        isolated.cosmetics.unlocked.default = false;
        isolated.cosmetics.equipped.furnace = "test";
        isolated.autoFurnaceBatch.push({ test: true });
    `);
    assert.deepEqual(JSON.parse(app.run("JSON.stringify(createDefaultSave())")), before);
    assert.deepEqual(app.state(), before);
    assert.equal(app.run("isolated.cycleBonuses.oreValue"), 0);
});

test("each missing optional top-level field uses canonical defaults with the preserved XP exception", () => {
    const defaults = ready().state();
    for (const key of Object.keys(defaults)) {
        if (["saveVersion", "cash", "droppers", "adders", "multipliers"].includes(key)) continue;
        const partial = structuredClone(defaults);
        delete partial[key];
        const expected = structuredClone(defaults);
        if (key === "factoryXP") {
            expected.factoryXP = 100;
            expected.factoryLevel = 1;
        }
        assert.deepEqual(ready(JSON.stringify(partial)).state(), expected, key);
    }
});

test("every missing nested default is restored without replacing its populated siblings", () => {
    const defaults = ready().state();
    const paths = [];
    function leaves(value, prefix = []) {
        for (const [key, child] of Object.entries(value)) {
            const next = [...prefix, key];
            if (child && typeof child === "object" && !Array.isArray(child)) leaves(child, next);
            else if (next.length > 1) paths.push(next);
        }
    }
    leaves(defaults);
    for (const keys of paths) {
        const partial = structuredClone(defaults);
        partial.cash = 4321;
        let parent = partial;
        for (const key of keys.slice(0, -1)) parent = parent[key];
        delete parent[keys.at(-1)];
        assert.deepEqual(ready(JSON.stringify(partial)).state(), { ...defaults, cash: 4321 }, keys.join("."));
    }
});

test("completion is deterministic and never mutates the validated input or retained unknown data", () => {
    const app = ready();
    app.run(`
        const completionInput = readVersionedSave(JSON.stringify({
            cash: 12, droppers: 0, adders: 0, multipliers: 0,
            inventory: { stone: 4 }, achievements: { firstSwing: true },
            extra: { list: [1, { kept: true }] }
        }));
        const inputBefore = JSON.stringify(completionInput);
        const completedOne = completeValidatedSave(completionInput);
        const completedTwo = completeValidatedSave(completionInput);
    `);
    assert.equal(app.run("JSON.stringify(completedOne)"), app.run("JSON.stringify(completedTwo)"));
    app.run("completedOne.extra.list[1].kept = false; completedOne.inventory.stone = 9;");
    assert.equal(app.run("JSON.stringify(completionInput)"), app.run("inputBefore"));
    assert.equal(app.run("completedTwo.extra.list[1].kept"), true);
    assert.equal(app.run("completedTwo.achievements.firstSwing.claimed"), false);
});

for (const version of [undefined, 0, 1]) {
    test("consolidated defaults preserve all progress over repeated schema " + version + " loads", () => {
        const data = legacyFixture();
        if (version !== undefined) data.saveVersion = version;
        let raw = JSON.stringify(data);
        const expected = { ...data, saveVersion: 1 };
        for (let round = 0; round < 3; round++) {
            const app = ready(raw);
            assert.deepEqual(app.state(), expected);
            assert.equal(app.run("autoFurnaceState.processing"), true);
            assert.equal(app.run("recoveryState.active"), false);
            app.run("validateSaveData(save); saveGame();");
            raw = app.stored();
        }
    });
}

test("required fields and invalid optional values still fail before canonical defaults", () => {
    const defaults = ready().state();
    for (const key of ["cash", "droppers", "adders", "multipliers"]) {
        const data = { ...defaults };
        delete data[key];
        const raw = JSON.stringify(data);
        const app = boot(raw);
        assertRecovery(app, raw, "VALIDATION_ERROR");
        assert.equal(app.run("getRecoveryRawSave()"), raw);
    }
    const raw = JSON.stringify({ ...defaults, inventory: null });
    assertRecovery(boot(raw), raw, "VALIDATION_ERROR");
});

test("furnace upgrades preserve canonical and player-selected automation modes", () => {
    for (const [mode, batchMode] of [["oresStone", "available"], ["stoneOnly", "full"]]) {
        const data = ready().state();
        Object.assign(data, { cash: 10000, autoFurnaceMode: mode, autoFurnaceBatchMode: batchMode });
        const app = ready(JSON.stringify(data));
        app.run("upgradeFurnace(); upgradeFurnace();");
        assert.equal(app.state().furnaceTier, 2);
        assert.equal(app.run("getAutoFurnaceMode()"), mode);
        assert.equal(app.run("getAutoFurnaceBatchMode()"), batchMode);
        app.run("saveGame()");
        assert.deepEqual(ready(app.stored()).state(), app.state());
    }
});

test("download failure leaves recovery data intact and shows a concise message", () => {
    const app = boot("{bad");
    app.run("exportRecoverySave()"); // Node adapter deliberately has no browser download API.
    assert.equal(app.elements.get("recoveryStatus").textContent.includes("could not start"), true);
    assertRecovery(app, "{bad", "PARSE_ERROR");
});

test("non-Error validation failures are classified without an uncaught exception", () => {
    const raw = JSON.stringify(legacyFixture());
    const app = boot(raw, "validateSaveData = () => { throw null; };");
    assertRecovery(app, raw, "VALIDATION_ERROR");
});

function assertRecovery(app, raw, category) {
    assert.equal(app.uncaught(), undefined);
    assert.equal(app.run("recoveryState.active"), true);
    assert.equal(app.error.code, category);
    assert.equal(app.elements.get("saveRecovery").hidden, false);
    assert.equal(app.elements.get("gameRoot").hidden, true);
    assert.equal(app.elements.get("gameRoot").inert, true);
    assert.equal(app.stored(), raw);
    assert.equal(app.intervals.length, 0);
    assert.equal(app.elements.get("mineButton").onclick, undefined);
    app.run("saveGame()");
    app.tick(5000);
    assert.equal(app.storageCalls.write, 0);
}

for (const [name, raw, code, setup] of [
    ["parse", " \r\n{ broken 🪨", "PARSE_ERROR", ""],
    ["structure", "[]", "VALIDATION_ERROR", ""],
    ["validation", JSON.stringify({ cash: -1 }), "VALIDATION_ERROR", ""],
    ["future", JSON.stringify({ saveVersion: 2 }), "VERSION_ERROR", ""],
    ["invalid version", JSON.stringify({ saveVersion: "1" }), "VERSION_ERROR", ""],
    ["migration", JSON.stringify({ cash: 100, droppers: 0, adders: 0, multipliers: 0 }),
        "MIGRATION_ERROR", "delete SAVE_MIGRATIONS[0];"]
]) {
    test("recovery categorises " + name + " and prevents writes/timers", () => {
        const app = boot(raw, setup);
        assertRecovery(app, raw, code);
        assert.equal(app.run("getRecoveryRawSave()"), raw);
    });
}

test("retry reprocesses preserved bytes without changing storage", () => {
    const raw = "\r\n { broken \t ";
    const app = boot(raw);
    assert.equal(app.run("attemptSaveLoad()"), false);
    assertRecovery(app, raw, "PARSE_ERROR");
    assert.equal(app.storageCalls.remove, 0);
    assert.equal(app.run("getRecoveryRawSave()"), raw);
});

test("fixed migration permits retry, registers timers once and retains raw until normal save", () => {
    const raw = JSON.stringify(legacyFixture(), null, 2);
    const app = boot(raw, "const retainedMigration = SAVE_MIGRATIONS[0]; delete SAVE_MIGRATIONS[0];");
    assertRecovery(app, raw, "MIGRATION_ERROR");
    app.run("SAVE_MIGRATIONS[0] = retainedMigration;");
    assert.equal(app.run("attemptSaveLoad()"), true);
    assert.equal(app.error, undefined);
    assert.equal(app.elements.get("saveRecovery").hidden, true);
    assert.equal(app.elements.get("gameRoot").hidden, false);
    assert.equal(app.elements.get("gameRoot").inert, false);
    assert.equal(app.intervals.length, 3);
    assert.equal(app.stored(), raw);
    app.run("attemptSaveLoad(); attemptSaveLoad();");
    assert.equal(app.intervals.length, 3);
    app.tick(5000);
    assert.equal(JSON.parse(app.stored()).saveVersion, 1);
});

test("export returns exact raw text including CRLF, whitespace and unsafe-looking markup", () => {
    const raw = '\r\n  {"x":"🪨","text":"<script>alert(1)</script>"}\t\r\n';
    const app = boot(raw);
    assert.equal(app.run("getRecoveryRawSave()"), raw);
    assert.equal(app.elements.get("exportRawSave").disabled, false);
    assert.equal(app.elements.get("recoveryReason").textContent.includes("<script>"), false);
    assert.equal(app.storageCalls.write, 0);
});

test("empty stored string can be exported without treating it as no save", () => {
    const app = boot("");
    assertRecovery(app, "", "PARSE_ERROR");
    assert.equal(app.run("getRecoveryRawSave()"), "");
    assert.equal(app.elements.get("exportRawSave").disabled, false);
});

test("cancelled reset preserves snapshot and storage", () => {
    const app = boot("{bad");
    app.confirmReset(false);
    assert.equal(app.run("resetRecoverySave()"), false);
    assertRecovery(app, "{bad", "PARSE_ERROR");
    assert.equal(app.storageCalls.remove, 0);
});

test("confirmed reset removes once, creates the current fresh state and saves a valid version 1", () => {
    const app = boot("{bad");
    app.confirmReset(true);
    assert.equal(app.run("resetRecoverySave()"), true);
    assert.equal(app.storageCalls.remove, 1);
    assert.equal(app.stored(), null);
    assert.equal(app.intervals.length, 3);
    assert.equal(app.state().saveVersion, 1);
    assert.equal(app.state().cash, 0);
    assert.equal(app.state().factoryXP, 0);
    assert.equal(app.state().factoryLevel, 0);
    app.run("validateSaveData(save)");
    app.tick(5000);
    assert.deepEqual(ready(app.stored()).state(), app.state());
});

test("read failure offers retry without falsely claiming export availability", () => {
    const raw = JSON.stringify(legacyFixture());
    const app = boot(raw, "", { read: true });
    assertRecovery(app, raw, "STORAGE_READ_ERROR");
    assert.equal(app.run("getRecoveryRawSave()"), null);
    assert.equal(app.elements.get("exportRawSave").disabled, true);
    assert.equal(app.elements.get("resetRecoverySave").disabled, true);
    app.confirmReset(true);
    assert.equal(app.run("resetRecoverySave()"), false);
    assert.equal(app.storageCalls.remove, 0);
    app.faults.read = false;
    assert.equal(app.run("attemptSaveLoad()"), true);
    assert.equal(app.state().cash, 12345);
    assert.equal(app.stored(), raw);
});

test("read failure during retry retains the previously captured export", () => {
    const app = boot("{bad");
    app.faults.read = true;
    assert.equal(app.run("attemptSaveLoad()"), false);
    assertRecovery(app, "{bad", "STORAGE_READ_ERROR");
    assert.equal(app.run("getRecoveryRawSave()"), "{bad");
    assert.equal(app.elements.get("exportRawSave").disabled, false);
});

test("failed remove retains recovery and permits another confirmed reset", () => {
    const app = boot("{bad", "", { remove: true });
    app.confirmReset(true);
    assert.equal(app.run("resetRecoverySave()"), false);
    assertRecovery(app, "{bad", "STORAGE_REMOVE_ERROR");
    assert.equal(app.run("getRecoveryRawSave()"), "{bad");
    app.faults.remove = false;
    assert.equal(app.run("resetRecoverySave()"), true);
    assert.equal(app.state().saveVersion, 1);
});

test("recovery/reset never calls setItem; denied writes cannot replace the original", () => {
    const app = boot("{bad", "", { write: true });
    app.run("saveGame(); attemptSaveLoad();");
    assert.equal(app.storageCalls.write, 0);
    assert.equal(app.stored(), "{bad");
    app.confirmReset(true);
    assert.equal(app.run("resetRecoverySave()"), true);
    assert.equal(app.storageCalls.write, 0);
});

for (const action of ["attemptSaveLoad()", "resetRecoverySave()"]) {
    test("changed storage is preserved during " + action, () => {
        const app = boot("{bad");
        const newer = JSON.stringify(legacyFixture());
        app.replaceStored(newer);
        app.confirmReset(true);
        assert.equal(app.run(action), false);
        assertRecovery(app, newer, "STORAGE_CHANGED");
        assert.equal(app.run("getRecoveryRawSave()"), "{bad");
        assert.equal(app.storageCalls.remove, 0);
    });
}

test("fresh and valid legacy/current saves bypass recovery", () => {
    for (const raw of [null, JSON.stringify(legacyFixture()),
        JSON.stringify({ ...legacyFixture(), saveVersion: 0 }),
        JSON.stringify({ ...legacyFixture(), saveVersion: 1 })]) {
        const app = ready(raw);
        assert.equal(app.run("recoveryState.active"), false);
        assert.equal(app.elements.get("saveRecovery").hidden, true);
        assert.equal(app.elements.get("gameRoot").hidden, false);
        assert.equal(app.intervals.length, 3);
    }
});


test("migration registry contains only real 0 -> 1; current production schema remains 1", () => {
    const app = ready();
    assert.equal(app.run("SAVE_VERSION"), 1);
    assert.equal(app.run("Object.keys(SAVE_MIGRATIONS).join(',')"), "0");
});

for (const version of [undefined, 0, 1]) {
    test("migration preserves all fields for " + (version === undefined ? "unversioned" : "version " + version), () => {
        const data = legacyFixture();
        if (version !== undefined) data.saveVersion = version;
        const app = ready();
        app.run("var migrationInput = " + JSON.stringify(data) + "; var migrationResult = migrateSaveData(migrationInput);");
        assert.deepEqual(JSON.parse(app.run("JSON.stringify(migrationResult)")), { ...data, saveVersion: 1 });
        assert.deepEqual(JSON.parse(app.run("JSON.stringify(migrationInput)")), data);
        assert.equal(app.run("migrationResult !== migrationInput && migrationResult.inventory !== migrationInput.inventory"), true);
        app.run("validateSaveData(migrationResult)");
    });
}

test("fresh load skips migration and current load skips registry transforms", () => {
    for (const raw of [null, JSON.stringify({ ...legacyFixture(), saveVersion: 1 })]) {
        const app = boot(raw, 'SAVE_MIGRATIONS[0] = () => { throw new Error("must not run"); };');
        assert.equal(app.error, undefined);
        assert.equal(app.state().saveVersion, 1);
        assert.equal(app.writes.length, 0);
    }
});

test("artificial chain runs each adjacent step in order, independently of registry insertion order", () => {
    const app = ready();
    app.run(`
        var calls = [];
        var sourceData = { saveVersion: 0, nested: { values: [5] }, retained: "yes" };
        var chain = {
            2: data => { calls.push(2); data.nested.values.push(8); return { ...data, saveVersion: 3 }; },
            0: data => { calls.push(0); data.nested.values.push(6); return { ...data, saveVersion: 1 }; },
            1: data => { calls.push(1); data.nested.values.push(7); return { ...data, saveVersion: 2 }; }
        };
        var firstResult = migrateSaveData(sourceData, 3, chain);
        var firstCalls = calls.slice();
        calls = [];
        var secondResult = migrateSaveData(sourceData, 3, chain);
    `);
    assert.deepEqual(JSON.parse(app.run("JSON.stringify(firstCalls)")), [0, 1, 2]);
    assert.deepEqual(JSON.parse(app.run("JSON.stringify(calls)")), [0, 1, 2]);
    assert.deepEqual(JSON.parse(app.run("JSON.stringify(firstResult)")),
        { saveVersion: 3, nested: { values: [5, 6, 7, 8] }, retained: "yes" });
    assert.equal(app.run("JSON.stringify(firstResult) === JSON.stringify(secondResult)"), true);
    assert.deepEqual(JSON.parse(app.run("JSON.stringify(sourceData)")),
        { saveVersion: 0, nested: { values: [5] }, retained: "yes" });
    assert.equal(app.run("SAVE_VERSION"), 1);
});

test("chain starts at the stored version and never reruns earlier steps", () => {
    const app = ready();
    assert.equal(app.run(`migrateSaveData({ saveVersion: 1 }, 2, {
        0: () => { throw new Error("already migrated"); },
        1: data => ({ ...data, saveVersion: 2 })
    }).saveVersion`), 2);
});

test("missing intermediate path fails instead of skipping ahead", () => {
    const app = ready();
    app.run("var laterCalled = false;");
    assert.throws(() => app.run(`migrateSaveData({ saveVersion: 0 }, 3, {
        0: data => ({ ...data, saveVersion: 1 }),
        2: data => { laterCalled = true; return { ...data, saveVersion: 3 }; }
    })`), /Missing save migration 1 -> 2/);
    assert.equal(app.run("laterCalled"), false);
});

for (const output of ["null", "[]", "undefined", "7", "{}", "{ saveVersion: 0 }",
    "{ saveVersion: 2 }", '{ saveVersion: "1" }', 'Object.create({ saveVersion: 1 })']) {
    test("reject migration step with wrong result: " + output, () => {
        const app = ready();
        assert.throws(() => app.run("migrateSaveData({ saveVersion: 0 }, 1, { 0: () => (" + output + ") })"),
            /migration 0 -> 1 must return an object with saveVersion 1/);
    });
}

test("failed later step leaves the original nested source intact", () => {
    const app = ready();
    app.run("var original = { saveVersion: 0, inventory: { stone: 4 } };");
    assert.throws(() => app.run(`migrateSaveData(original, 2, {
        0: data => { data.inventory.stone = 99; return { ...data, saveVersion: 1 }; },
        1: data => { data.inventory.stone = 0; throw new Error("test failure"); }
    })`), /migration 1 -> 2 failed: test failure/);
    assert.equal(app.run("original.inventory.stone"), 4);
    assert.equal(app.run("original.saveVersion"), 0);
});

for (const [label, setup, diagnostic] of [
    ["missing step", "delete SAVE_MIGRATIONS[0];", /Missing save migration 0 -> 1/],
    ["non-function step", "SAVE_MIGRATIONS[0] = null;", /Missing save migration 0 -> 1/],
    ["exception", 'SAVE_MIGRATIONS[0] = data => { data.inventory.stone = 0; throw new Error("fixture failure"); };', /migration 0 -> 1 failed: fixture failure/],
    ["skipped version", "SAVE_MIGRATIONS[0] = data => ({ ...data, saveVersion: 2 });", /must return an object with saveVersion 1/],
    ["invalid migrated fields", "SAVE_MIGRATIONS[0] = data => ({ ...data, saveVersion: 1, cash: -1 });", /Invalid save: cash/]
]) {
    test("startup failure preserves raw bytes and blocks timers: " + label, () => {
        const raw = "\n  " + JSON.stringify(legacyFixture(), null, 2) + "\n";
        const app = boot(raw, setup);
        assert.match(app.error?.message || "", diagnostic);
        assert.equal(app.stored(), raw);
        assert.equal(app.writes.length, 0);
        assert.equal(app.intervals.length, 0);
        assert.equal(app.elements.get("mineButton").onclick, undefined);
    });
}

test("migration occurs before validation, then existing defaults and Boolean conversion apply", () => {
    const data = { cash: 5, droppers: 0, adders: 0, multipliers: 0, achievements: { firstSwing: true } };
    const app = boot(JSON.stringify(data), `
        var loadOrder = [];
        const actualMigration = SAVE_MIGRATIONS[0];
        SAVE_MIGRATIONS[0] = data => { loadOrder.push("migrate"); return actualMigration(data); };
        const actualValidation = validateSaveData;
        validateSaveData = data => {
            loadOrder.push("validate");
            if(data.saveVersion !== 1 || "factoryXP" in data || data.achievements.firstSwing !== true)
                throw new Error("incorrect pipeline order");
            actualValidation(data);
        };
    `);
    assert.equal(app.error, undefined);
    assert.deepEqual(JSON.parse(app.run("JSON.stringify(loadOrder)")), ["migrate", "validate"]);
    assert.equal(app.state().factoryXP, 100);
    assert.deepEqual(app.state().achievements.firstSwing, { unlocked: true, claimed: false });
    assert.equal(app.writes.length, 0);
});

test("migration copying preserves unknown data, own __proto__ keys and non-finite values for validation", () => {
    const app = ready();
    app.run(`
        var source = JSON.parse('{"saveVersion":0,"__proto__":{"keep":true},"unknown":{"nested":[null,false,{"n":7}]}}');
        var result = migrateSaveData(source);
        result.unknown.nested[2].n = 8;
        result.__proto__.keep = false;
    `);
    assert.equal(app.run("source.unknown.nested[2].n"), 7);
    assert.equal(app.run("source.__proto__.keep"), true);
    assert.equal(app.run("Object.prototype.keep"), undefined);
    assert.equal(app.run("migrateSaveData({ saveVersion: 0, cash: Infinity }).cash"), Infinity);
    assert.throws(() => app.run("validateSaveData(migrateSaveData({ saveVersion: 0, cash: Infinity }))"), /cash/);
});

test("invalid/future versions are rejected before any migration executes", () => {
    const app = ready();
    app.run("var ranMigration = false; var testRegistry = { 0: data => { ranMigration = true; return data; } };");
    for (const version of ["2", "-1", "1.5", '"1"', "null", "NaN", "Infinity"]) {
        assert.throws(() => app.run("migrateSaveData({ saveVersion: " + version + " }, 1, testRegistry)"),
            /saveVersion|newer game version/);
    }
    assert.equal(app.run("ranMigration"), false);
    assert.throws(() => app.run("migrateSaveData({ saveVersion: 1 }, 0, testRegistry)"), /newer game version/);
});

test("inherited registry entries cannot supply a required migration", () => {
    const app = ready();
    assert.throws(() => app.run(`migrateSaveData({ saveVersion: 0 }, 1,
        Object.create({ 0: data => ({ ...data, saveVersion: 1 }) }))`), /Missing save migration/);
});

test("production migration is deterministic, preserves invalid fields and never repairs corruption", () => {
    const app = ready();
    app.run('var corruptSource = { saveVersion: 0, cash: -5, inventory: null };');
    assert.equal(app.run("JSON.stringify(migrateSaveData(corruptSource)) === JSON.stringify(migrateSaveData(corruptSource))"), true);
    assert.equal(app.run("migrateSaveData(corruptSource).cash"), -5);
    assert.equal(app.run("migrateSaveData(corruptSource).inventory"), null);
    assert.throws(() => app.run("validateSaveData(migrateSaveData(corruptSource))"), /cash/);
});


function assertRejected(raw, expectedPath) {
    const app = boot(raw);
    assert.match(app.error?.message || "", /Invalid save|saveVersion|newer game version/);
    if (expectedPath) assert.ok(app.error.message.includes(expectedPath), app.error.message);
    assert.equal(app.stored(), raw, "original bytes must survive rejection");
    assert.equal(app.writes.length, 0);
    assert.equal(app.intervals.length, 0);
    assert.equal(app.elements.get("mineButton").onclick, undefined);
    assert.equal(app.uncaught(), undefined);
    assert.equal(app.elements.get("saveRecovery").hidden, false);
    assert.equal(app.elements.get("gameRoot").hidden, true);
    assert.equal(app.elements.get("gameRoot").inert, true);
    assert.equal(app.run("getRecoveryRawSave()"), raw);
    app.run("saveGame()");
    app.tick(5000);
    assert.equal(app.storageCalls.write, 0);
}

const invalidFields = [
    ["cash", "100"], ["cash", -1], ["cash", null], ["cash", true],
    ["factoryXP", -1], ["factoryXP", 0.5], ["factoryXP", "100"], ["factoryXP", null],
    ["factoryLevel", -1], ["factoryLevel", 1.5], ["factoryLevel", "1"],
    ["furnaceTier", -1], ["furnaceTier", 3], ["furnaceTier", 1.5], ["furnaceTier", "2"],
    ["inventory", null], ["inventory", []], ["inventory", "items"],
    ["oreCollection", []], ["oreCollection", null],
    ["factoryMilestones", []], ["achievements", []], ["achievements", null],
    ["achievementStats", []], ["permanentBonuses", []], ["cycleBonuses", null],
    ["cosmetics", []], ["cosmetics", null],
    ["lastOre", 1], ["lastOre", ""], ["lastOreValue", -1], ["stoneValue", "1"],
    ["autoFurnaceEnabled", 1], ["autoFurnaceEnabled", null],
    ["autoFurnaceMode", "anything"], ["autoFurnaceMode", null],
    ["autoFurnaceBatchMode", false], ["autoFurnaceBatchMode", "partial"],
    ["autoFurnaceStartTime", -1], ["autoFurnaceStartTime", 0.5],
    ["autoFurnaceStartTime", "1000"], ["autoFurnaceStartTime", 8640000000000001],
    ["autoFurnaceBatch", {}], ["autoFurnaceBatch", null]
];
for (const key of ["droppers", "adders", "multipliers"]) {
    for (const value of [-1, 1.5, "1", null, false]) invalidFields.push([key, value]);
}
for (const key of ["totalOres", "stoneOres", "tier1Ores", "tier2Ores", "tier3Ores", "tier4Ores"]) {
    invalidFields.push([key, -1], [key, 0.5], [key, "0"]);
}
for (const [key, value] of invalidFields) {
    test("validation rejects " + key + " = " + JSON.stringify(value), () => {
        assertRejected(JSON.stringify({ ...legacyFixture(), [key]: value }), key);
    });
}

for (const key of ["cash", "droppers", "adders", "multipliers"]) {
    test("missing required legacy field " + key + " is not reset", () => {
        const data = legacyFixture();
        delete data[key];
        assertRejected(JSON.stringify(data), key);
    });
}

const invalidNested = [
    ["inventory.amber", data => { data.inventory.amber = -1; }],
    ["inventory.stone", data => { data.inventory.stone = 1.2; }],
    ["inventory.diamond", data => { data.inventory.diamond = null; }],
    ["inventory.unobtainium", data => { data.inventory.unobtainium = 1; }],
    ["inventory.constructor", data => { data.inventory.constructor = 1; }],
    ["oreCollection.amber", data => { data.oreCollection.amber = "1"; }],
    ["oreCollection.stone", data => { data.oreCollection.stone = 1; }],
    ["factoryMilestones.10", data => { data.factoryMilestones["10"] = 1; }],
    ["factoryMilestones.11", data => { data.factoryMilestones["11"] = true; }],
    ["achievements.unknown", data => { data.achievements.unknown = true; }],
    ["achievements.constructor", data => { data.achievements.constructor = true; }],
    ["achievements.firstSwing", data => { data.achievements.firstSwing = []; }],
    ["achievements.firstSwing", data => { data.achievements.firstSwing = null; }],
    ["achievements.firstSwing.unlocked", data => { data.achievements.firstSwing.unlocked = "true"; }],
    ["achievements.firstSwing.claimed", data => { delete data.achievements.firstSwing.claimed; }],
    ["achievements.firstSwing", data => { data.achievements.firstSwing.unlocked = false; }],
    ["achievementStats.oresSmelted", data => { data.achievementStats.oresSmelted = -1; }],
    ["achievementStats.totalOresMined", data => { data.achievementStats.totalOresMined = 0.5; }],
    ["achievementStats.oresDiscovered", data => { data.achievementStats.oresDiscovered = 21; }],
    ["permanentBonuses.oreValue", data => { data.permanentBonuses.oreValue = "0.5"; }],
    ["cycleBonuses.factoryXP", data => { data.cycleBonuses.factoryXP = null; }],
    ["cosmetics.unlocked", data => { data.cosmetics.unlocked = []; }],
    ["cosmetics.unlocked.default", data => { data.cosmetics.unlocked.default = 1; }],
    ["cosmetics.equipped", data => { data.cosmetics.equipped = null; }],
    ["cosmetics.equipped.dropper", data => { data.cosmetics.equipped.dropper = 0; }],
    ["cosmetics.equipped.dropper", data => { data.cosmetics.equipped.dropper = ""; }],
    ["autoFurnaceBatch[0]", data => { data.autoFurnaceBatch[0] = null; }],
    ["autoFurnaceBatch[0].key", data => { data.autoFurnaceBatch[0].key = "unknown"; }],
    ["autoFurnaceBatch[0].amount", data => { data.autoFurnaceBatch[0].amount = 0; }],
    ["autoFurnaceBatch[0].amount", data => { data.autoFurnaceBatch[0].amount = 1.5; }],
    ["autoFurnaceBatch[0].amount", data => { data.autoFurnaceBatch[0].amount = "1"; }],
    ["autoFurnaceBatch[0].value", data => { data.autoFurnaceBatch[0].value = -1; }],
    ["autoFurnaceBatch[0].value", data => { delete data.autoFurnaceBatch[0].value; }],
    ["autoFurnaceBatch[0].name", data => { data.autoFurnaceBatch[0].name = "<img src=x onerror=alert(1)>"; }],
    ["autoFurnaceBatch[0].emoji", data => { delete data.autoFurnaceBatch[0].emoji; }],
    ["autoFurnaceBatch[1].key", data => { data.autoFurnaceBatch.push({ ...data.autoFurnaceBatch[0] }); }],
    ["autoFurnaceBatch", data => { data.autoFurnaceBatch[0].amount = 101; }],
    ["autoFurnaceBatch", data => { data.autoFurnaceBatch[0].value = 1e308; }],
    ["autoFurnaceBatch", data => { data.autoFurnaceBatch[0].amount = 1; data.autoFurnaceBatch[0].value = 1e308; data.cash = 1e308; }],
    ["autoFurnaceBatch", data => { data.furnaceTier = 1; }],
    ["autoFurnaceBatch", data => { data.autoFurnaceStartTime = 0; }],
    ["autoFurnaceBatch", data => { delete data.autoFurnaceStartTime; }],
    ["autoFurnaceStartTime", data => { data.autoFurnaceBatch = []; }]
];
for (const [name, change] of invalidNested) {
    test("reject invalid nested state: " + name + " / " + invalidNested.findIndex(row => row[1] === change), () => {
        const data = legacyFixture();
        change(data);
        assertRejected(JSON.stringify(data), name);
    });
}

for (const token of ["1e400", "-1e400", "null"]) {
    test("JSON overflow/non-finite serialisation token " + token + " is rejected", () => {
        const raw = JSON.stringify(legacyFixture()).replace('"cash":12345', '"cash":' + token);
        assertRejected(raw, "cash");
    });
}
test("direct validator rejects actual NaN and infinities without mutating its input", () => {
    const app = ready();
    for (const value of ["NaN", "Infinity", "-Infinity"]) {
        assert.throws(() => app.run("validateSaveData({ ...save, cash: " + value + " })"), /cash/);
    }
    const before = app.state();
    app.run("validateSaveData(save)");
    assert.deepEqual(app.state(), before);
});

test("all established missing optional defaults still produce loadable version 1 state", () => {
    const data = { cash: 456, droppers: 0, adders: 0, multipliers: 0 };
    const app = ready(JSON.stringify(data));
    const state = app.state();
    assert.equal(state.cash, 456);
    assert.equal(state.factoryXP, 100);
    assert.equal(state.factoryLevel, 1);
    assert.equal(state.inventory.amber, 0);
    assert.equal(state.autoFurnaceEnabled, true);
    assert.equal(state.autoFurnaceMode, "oresStone");
    assert.equal(state.autoFurnaceBatchMode, "available");
    assert.equal(state.autoFurnaceStartTime, 0);
    assert.deepEqual(state.autoFurnaceBatch, []);
    app.run("saveGame()");
    assert.deepEqual(ready(app.stored()).state(), state);
});

test("partial nested objects default missing entries without replacing retained values", () => {
    const data = { cash: 5, droppers: 0, adders: 0, multipliers: 0,
        inventory: { amber: 7 }, oreCollection: { amber: 11 },
        factoryMilestones: { 10: true }, achievementStats: { oresSmelted: 3 },
        permanentBonuses: { oreValue: 0.2 }, cycleBonuses: {},
        cosmetics: { unlocked: { other: true }, equipped: { adder: "other" } } };
    const app = ready(JSON.stringify(data));
    const state = app.state();
    assert.equal(state.inventory.amber, 7);
    assert.equal(state.inventory.stone, 0);
    assert.equal(state.oreCollection.amber, 11);
    assert.equal(state.factoryMilestones["10"], true);
    assert.equal(state.factoryMilestones["25"], false);
    assert.equal(state.achievementStats.oresSmelted, 3);
    assert.equal(state.achievementStats.totalOresMined, 0);
    assert.equal(state.permanentBonuses.oreValue, 0.2);
    assert.equal(state.permanentBonuses.factoryXP, 0);
    assert.equal(state.cosmetics.equipped.adder, "other");
    assert.equal(state.cosmetics.equipped.dropper, "default");
});

test("unknown top-level JSON data and inert scaffold IDs survive repeated round trips", () => {
    const data = legacyFixture();
    data.unknown = { nested: [null, false, "text", { n: 123 }] };
    Object.defineProperty(data, "__proto__", { value: { preserved: true }, enumerable: true });
    data.permanentBonuses.unapproved = -0.25;
    data.cosmetics.equipped.dropper = "historic-skin";
    data.cash = 12345.25;
    let app = ready(JSON.stringify(data));
    const expected = app.state();
    for (let i = 0; i < 3; i++) {
        app.run("saveGame()");
        app = ready(app.stored());
        assert.deepEqual(app.state(), expected);
    }
});

test("batch snapshot survives changed modes/upgrades and a future timestamp", () => {
    const data = legacyFixture();
    data.autoFurnaceStartTime = ready().now() + 86400000;
    data.autoFurnaceMode = "stoneOnly"; // A player may change this while the ore batch runs.
    data.autoFurnaceBatchMode = "full";
    data.autoFurnaceBatch[0].value = 12.5; // Reserved value is not recalculated on load.
    const app = ready(JSON.stringify(data));
    assert.deepEqual(app.state().autoFurnaceBatch, data.autoFurnaceBatch);
    assert.equal(app.state().autoFurnaceStartTime, data.autoFurnaceStartTime);
});

test("valid mixed batch at capacity survives reload and pays exactly once", () => {
    const data = legacyFixture();
    data.autoFurnaceBatch = [
        { key: "diamond", amount: 40, value: 250000, name: "Diamond", emoji: "💎" },
        { key: "stone", amount: 60, value: 2, name: "Stone", emoji: "🪨" }
    ];
    const app = ready(JSON.stringify(data));
    app.tick(100);
    assert.equal(app.state().cash, data.cash + 10000120);
    const reloaded = ready(app.stored());
    reloaded.tick(100);
    assert.equal(reloaded.state().cash, app.state().cash);
});

test("large finite progression is preserved without inventing precision or balance caps", () => {
    const data = ready().state();
    data.cash = 1e100;
    data.factoryXP = 1e40;
    data.factoryLevel = Math.floor(Math.sqrt(data.factoryXP / 100));
    data.inventory.stone = 1e30;
    const app = ready(JSON.stringify(data));
    assert.equal(app.state().cash, data.cash);
    assert.equal(app.state().inventory.stone, data.inventory.stone);
});

test("every existing resource and legacy Boolean achievement remains accepted", () => {
    const app = ready();
    app.run("ORE_KEYS.forEach(key => { save.inventory[key] = 2; save.oreCollection[key] = 3; }); " +
        "Object.keys(ACHIEVEMENTS).forEach(key => { save.achievements[key] = false; }); saveGame();");
    const reloaded = ready(app.stored());
    assert.equal(Object.keys(reloaded.state().inventory).length, 21);
    for (const entry of Object.values(reloaded.state().achievements))
        assert.deepEqual(entry, { unlocked: false, claimed: false });
});


// Small DOM adapter for state regression tests; browser checks are separate.
function saveAndReload(app) {
    const expected = app.state();
    app.tick(5000);
    assert.deepEqual(JSON.parse(app.stored()), expected);
    const next = boot(app.stored(), "", {}, app.now());
    assert.equal(next.error, undefined, next.error?.stack);
    assert.deepEqual(next.state(), expected);
    return next;
}

test("fully populated progress, scaffolding and mixed achievement states survive real persistence cycles", () => {
    const data = legacyFixture();
    Object.assign(data, {
        totalOres: 321, stoneOres: 201, tier1Ores: 60, tier2Ores: 30, tier3Ores: 20, tier4Ores: 10,
        lastOre: "Diamond", lastOreValue: 250000,
        achievementStats: { totalOresMined: 321, oresDiscovered: 20, oresSmelted: 123 },
        autoFurnaceMode: "oresOnly", autoFurnaceBatchMode: "full",
        unknown: { history: [null, false, "🪨", { amount: 42 }] }
    });
    Object.keys(data.inventory).forEach((key, i) => { data.inventory[key] = i * 2; });
    Object.keys(data.oreCollection).forEach((key, i) => { data.oreCollection[key] = i + 3; });
    Object.keys(data.permanentBonuses).forEach((key, i) => { data.permanentBonuses[key] = (i + 1) / 100; });
    Object.keys(data.cycleBonuses).forEach((key, i) => { data.cycleBonuses[key] = (i + 2) / 100; });
    Object.keys(data.cosmetics.equipped).forEach(key => { data.cosmetics.equipped[key] = key + "-historic"; });
    data.achievements.firstDiscovery = true;
    data.achievements.firstSmelt = false;
    delete data.factoryMilestones["25"];
    let app = ready(JSON.stringify(data));
    assert.deepEqual(app.state().achievements.firstDiscovery, { unlocked: true, claimed: false });
    assert.deepEqual(app.state().achievements.firstSmelt, { unlocked: false, claimed: false });
    assert.equal(app.state().factoryMilestones["25"], false);
    const expected = app.state();
    for (let cycle = 0; cycle < 5; cycle++) app = saveAndReload(app);
    assert.deepEqual(app.state(), expected);
});

test("saving mid-cycle preserves reservations and stop-after-current across the exact completion boundary", () => {
    const data = ready().state();
    Object.assign(data, { furnaceTier: 2, cash: 1000 });
    data.inventory.stone = 3;
    data.inventory.amber = 2;
    let app = ready(JSON.stringify(data));
    app.tick(100);
    const started = app.state();
    assert.equal(started.autoFurnaceStartTime, app.now());
    assert.equal(started.inventory.stone, 0);
    assert.equal(started.inventory.amber, 0);
    assert.equal(started.autoFurnaceBatch.reduce((n, item) => n + item.amount, 0), 5);
    app.advance(4000);
    app = saveAndReload(app);
    app.run('setAutoFurnaceMode("stoneOnly"); setAutoFurnaceBatchMode("full"); stopAutoFurnace();');
    assert.deepEqual(app.state().autoFurnaceBatch, started.autoFurnaceBatch);
    app = saveAndReload(app);
    app.advance(5999);
    app.tick(100);
    assert.equal(app.state().cash, 1000);
    assert.equal(app.state().autoFurnaceStartTime, started.autoFurnaceStartTime);
    app.advance(1);
    app.tick(100);
    assert.equal(app.state().cash, 1023);
    assert.equal(app.state().factoryXP, 5);
    assert.equal(app.state().achievementStats.oresSmelted, 5);
    assert.equal(app.state().autoFurnaceStartTime, 0);
    assert.deepEqual(app.state().autoFurnaceBatch, []);
    for (let cycle = 0; cycle < 3; cycle++) {
        app = saveAndReload(app);
        app.advance(20000);
        app.tick(100);
        assert.equal(app.state().cash, 1023);
        assert.equal(app.state().achievementStats.oresSmelted, 5);
    }
});

test("enabled furnace reload completes one batch then reserves the next without duplicating payout", () => {
    const data = ready().state();
    data.cash = 100; // Retain this populated-save payout fixture independently of fresh Cash.
    data.furnaceTier = 2;
    data.inventory.stone = 150;
    let app = ready(JSON.stringify(data));
    app.tick(100);
    assert.equal(app.state().inventory.stone, 50);
    app.advance(10000);
    app = saveAndReload(app);
    app.tick(100);
    assert.equal(app.state().cash, 200);
    assert.equal(app.state().inventory.stone, 0);
    assert.equal(app.state().autoFurnaceBatch[0].amount, 50);
    assert.equal(app.state().autoFurnaceStartTime, app.now());
    app = saveAndReload(app);
    app.tick(100);
    assert.equal(app.state().cash, 200);
    app.advance(10000);
    app.tick(100);
    assert.equal(app.state().cash, 250);
    assert.equal(app.state().achievementStats.oresSmelted, 150);
    app = saveAndReload(app);
    app.advance(10000);
    app.tick(100);
    assert.equal(app.state().cash, 250);
    assert.deepEqual(app.state().autoFurnaceBatch, []);
});

test("full-batch mode survives idle reload and starts only when enough resources exist", () => {
    const data = ready().state();
    data.furnaceTier = 2;
    data.inventory.stone = 99;
    let app = ready(JSON.stringify(data));
    app.run('setAutoFurnaceMode("stoneOnly"); setAutoFurnaceBatchMode("full");');
    app = saveAndReload(app);
    app.tick(100);
    assert.deepEqual(app.state().autoFurnaceBatch, []);
    assert.equal(app.state().inventory.stone, 99);
    app.elements.get("mineButton").onclick();
    app.tick(100);
    assert.equal(app.state().autoFurnaceBatch[0].amount, 100);
    assert.equal(app.state().inventory.stone, 0);
    app = saveAndReload(app);
    assert.equal(app.state().autoFurnaceBatchMode, "full");
});

test("deterministic 100-mine sequence preserves purchases, discoveries, smelting and milestones through 20 reloads", () => {
    // Existing progress retains higher-tier inventory; Default can no longer mine it.
    let app = ready(JSON.stringify({ cash: 6000, factoryXP: 9000, droppers: 0, adders: 0,
        multipliers: 0, inventory: { spinel: 20, onyx: 20 } }));
    app.run('save.regressionMetadata = { retained: ["sequence", 1] };');
    for (let cycle = 0; cycle < 20; cycle++) {
        // Three T2, one T1 and one Stone with the Default-accessible pool.
        for (const roll of [0, 0.00001, 0.0005, 0.01, 0.5]) {
            app.run("Math.random = () => " + roll);
            app.elements.get("mineButton").onclick();
        }
        app.run("Math.random = () => 0.5;");
        app.tick(1000);
        app.run(`
            for(const key of ["stone", ...ORE_KEYS]){
                if(save.inventory[key] > 0){
                    prepareSmelt(key, key === "stone" ? save.stoneValue : ORES[key].value, 1);
                    confirmSmelt();
                }
            }
        `);
        if (cycle === 0) {
            for (const id of ["buyDropper", "buyAdder", "buyMultiplier", "upgradeFurnace"])
                app.elements.get(id).onclick();
            assert.equal(app.state().droppers, 1);
            assert.equal(app.state().adders, 1);
            assert.equal(app.state().multipliers, 1);
            assert.equal(app.state().furnaceTier, 1);
            app.run('claimAchievement("firstDiscovery");');
        }
        const state = app.state();
        assert.equal(state.achievementStats.totalOresMined, (cycle + 1) * 5);
        assert.equal(state.tier1Ores, cycle + 1);
        assert.equal(state.tier2Ores, (cycle + 1) * 3);
        assert.equal(state.tier3Ores, 0);
        assert.equal(state.tier4Ores, 0);
        assert.equal(state.achievementStats.oresDiscovered, 2);
        assert.equal(state.achievements.firstDiscovery.claimed, true);
        app = saveAndReload(app);
    }
    assert.equal(app.state().factoryMilestones["10"], true);
    assert.equal(app.state().achievementStats.oresSmelted, 159);
    assert.equal(app.state().inventory.stone, 0);
    assert.deepEqual(app.state().regressionMetadata, { retained: ["sequence", 1] });
    app.run("validateSaveData(save)");
});

function boot(raw = null, beforeLoad = "", storageFaults = {}, now = 1700000000000) {
    const elements = new Map();
    function element() {
        const el = {
            style: {}, dataset: {}, parentElement: {}, children: [],
            classList: { add() {}, remove() {} },
            appendChild(child) { this.children.push(child); },
            focus() {}
        };
        let markup = "";
        Object.defineProperty(el, "innerHTML", {
            get: () => markup,
            set(value) { markup = value; register(value); }
        });
        return el;
    }
    function register(markup) {
        for (const match of markup.matchAll(/id="([^"]+)"/g)) {
            if (!elements.has(match[1])) elements.set(match[1], element());
        }
    }
    register(html);
    const writes = [];
    const intervals = [];
    let stored = raw;
    let reloaded = false;
    let confirmation = false;
    const faults = { ...storageFaults };
    const storageCalls = { read: 0, write: 0, remove: 0 };
    const context = vm.createContext({
        console,
        testClockNow: () => now,
        document: {
            getElementById: id => elements.get(id) || null,
            createElement: () => element()
        },
        localStorage: {
            getItem(key) { assert.equal(key, KEY); storageCalls.read++; if(faults.read) throw new Error("storage read denied"); return stored; },
            setItem(key, value) { assert.equal(key, KEY); storageCalls.write++; if(faults.write) throw new Error("storage write denied"); writes.push(value); stored = value; },
            removeItem(key) { assert.equal(key, KEY); storageCalls.remove++; if(faults.remove) throw new Error("storage remove denied"); stored = null; }
        },
        setInterval(fn, ms) { intervals.push({ fn, ms }); },
        setTimeout() {},
        confirm: () => confirmation,
        location: { reload() { reloaded = true; } }
    });
    const run = code => vm.runInContext(code, context);
    run("Math.random = () => 0.5; Date.now = () => testClockNow();");
    vm.runInContext(ores, context, { filename: "ores.js" });
    let error;
    // Optional test-only fault injection after declarations, before startup.
    const marker = "\nattemptSaveLoad();";
    assert.ok(game.includes(marker));
    const source = beforeLoad ? game.replace(marker, beforeLoad + "\n" + marker) : game;
    try { vm.runInContext(source, context, { filename: "game.js" }); }
    catch (caught) { error = caught; }
    return {
        run, writes, intervals, elements, faults, storageCalls,
        now: () => now,
        advance: ms => { now += ms; },
        get error() { return error || run("recoveryState.error") || undefined; },
        uncaught: () => error,
        replaceStored: value => { stored = value; },
        state: () => JSON.parse(run("JSON.stringify(save)")),
        stored: () => stored,
        tick: ms => intervals.filter(t => t.ms === ms).forEach(t => t.fn()),
        confirmReset: value => { confirmation = value; },
        reloaded: () => reloaded
    };
}

function ready(raw) {
    const app = boot(raw);
    assert.equal(app.error, undefined, app.error?.stack);
    return app;
}

function legacyFixture() {
    const data = ready().state();
    delete data.saveVersion;
    Object.assign(data, { cash: 12345, droppers: 4, adders: 2, multipliers: 1,
        stoneValue: 3, factoryXP: 1234, factoryLevel: 3, furnaceTier: 2,
        autoFurnaceEnabled: false, autoFurnaceStartTime: 1000,
        autoFurnaceBatch: [{ key: "amber", amount: 7, value: 10, name: "Amber", emoji: "🟠" }],
        extraFutureMetadata: { kept: true } });
    data.inventory.stone = 21;
    data.inventory.diamond = 2;
    data.oreCollection.diamond = 6;
    data.achievements.firstSwing = { unlocked: true, claimed: true };
    data.factoryMilestones["10"] = true;
    data.permanentBonuses.oreValue = 0.2;
    data.cycleBonuses.factoryXP = 0.1;
    data.cosmetics.unlocked.testSkin = true;
    return data;
}

test("new save has version 1 and zero Cash/XP/Level; autosave/reload round trip", () => {
    const app = ready();
    assert.equal(app.state().saveVersion, 1);
    assert.equal(app.state().cash, 0);
    assert.equal(app.state().factoryXP, 0);
    assert.equal(app.state().factoryLevel, 0);
    assert.equal(app.state().droppers, 0);
    assert.equal(app.writes.length, 0);
    app.tick(5000);
    assert.equal(app.writes.length, 1);
    assert.deepEqual(ready(app.stored()).state(), app.state());
});

test("Factory Level boundaries and progress follow total XP from Level 0 upward", () => {
    const app = ready();
    for (const [xp, level, progress] of [
        [0, 0, 0], [99, 0, 99], [100, 1, 0], [250, 1, 50],
        [399, 1, 299 / 300 * 100], [400, 2, 0], [899, 2, 499 / 500 * 100],
        [900, 3, 0], [1599, 3, 699 / 700 * 100], [1600, 4, 0],
        [9999, 9, 1899 / 1900 * 100], [10000, 10, 0]
    ]) {
        app.run(`save.factoryXP = ${xp}; updateFactoryLevel(); updateUI();`);
        assert.equal(app.state().factoryLevel, level, "XP " + xp);
        assert.equal(Number(app.elements.get("factoryLevel").textContent), level);
        const width = Number.parseFloat(app.elements.get("xpBar").style.width);
        assert.ok(Number.isFinite(width) && width >= 0 && width <= 100);
        assert.ok(Math.abs(width - progress) < 1e-10, "progress at XP " + xp);
        assert.equal(app.run(`getXPForLevel(${level + 1}) - getXPForLevel(${level})`),
            100 * (2 * level + 1));
    }
    // Existing validation accepts large finite XP: subtraction must not create a zero span/NaN.
    for (const xp of [1e40, Number.MAX_VALUE]) {
        app.run(`save.factoryXP = ${xp}; updateUI();`);
        const width = Number.parseFloat(app.elements.get("xpBar").style.width);
        assert.ok(Number.isFinite(width) && width >= 0 && width <= 100);
    }
});

test("legacy/current Cash and XP survive load while stale or absent Level is derived", () => {
    for (const version of [undefined, 0, 1]) {
        for (const [xp, storedLevel, expectedLevel] of [[0, 1, 0], [99, 20, 0],
            [400, 1, 2], [10000, undefined, 10], [undefined, 0, 1]]) {
            const data = { cash: 137.5, droppers: 2, adders: 0, multipliers: 0,
                saveVersion: version, factoryXP: xp, factoryLevel: storedLevel,
                extra: { keep: true } };
            const raw = JSON.stringify(data);
            let app = ready(raw);
            assert.equal(app.stored(), raw, "loading must not rewrite bytes");
            for (let round = 0; round < 3; round++) {
                assert.equal(app.state().cash, 137.5);
                assert.equal(app.state().factoryXP, xp ?? 100);
                assert.equal(app.state().factoryLevel, expectedLevel);
                assert.equal(app.state().droppers, 2);
                assert.deepEqual(app.state().extra, { keep: true });
                app.run("validateSaveData(save); saveGame();");
                app = ready(app.stored());
            }
        }
    }
});

test("Level 0 crosses into Level 1 through mining and persists a derived Level", () => {
    let app = ready(JSON.stringify({ cash: 0, factoryXP: 99, factoryLevel: 0,
        droppers: 0, adders: 0, multipliers: 0 }));
    app.elements.get("mineButton").onclick();
    assert.equal(app.state().factoryXP, 100);
    assert.equal(app.state().factoryLevel, 1);
    assert.equal(app.elements.get("xpBar").style.width, "0%");
    app = saveAndReload(app);
    assert.equal(app.state().cash, 0);
    assert.equal(app.state().factoryLevel, 1);
    // A save between XP updates and rendering also uses authoritative XP.
    app.run("addFactoryXP(300); saveGame();");
    assert.equal(JSON.parse(app.stored()).factoryLevel, 2);
    assert.equal(ready(app.stored()).state().factoryXP, 400);
});

test("unversioned populated save preserves every existing field, including active batch", () => {
    const before = legacyFixture();
    const raw = JSON.stringify(before);
    const app = ready(raw);
    assert.deepEqual(app.state(), { ...before, saveVersion: 1 });
    assert.equal(app.stored(), raw, "read must not write");
    assert.equal(app.run("autoFurnaceState.processing"), true);
    app.run("saveGame()");
    assert.deepEqual(ready(app.stored()).state(), app.state());
});

test("explicit legacy version 0 is upgraded without losing data", () => {
    const before = { ...legacyFixture(), saveVersion: 0 };
    assert.deepEqual(ready(JSON.stringify(before)).state(), { ...before, saveVersion: 1 });
});

test("current version is idempotent over repeated loads", () => {
    const data = { ...legacyFixture(), saveVersion: 1 };
    const first = ready(JSON.stringify(data));
    first.run("saveGame()");
    const second = ready(first.stored());
    second.run("saveGame()");
    assert.deepEqual(second.state(), data);
    assert.equal(first.stored(), second.stored());
});

test("existing optional defaults and Boolean achievement conversion still apply", () => {
    const data = legacyFixture();
    for (const key of ["inventory", "oreCollection", "factoryMilestones", "factoryXP",
        "achievementStats", "permanentBonuses", "cycleBonuses", "cosmetics",
        "autoFurnaceBatch", "autoFurnaceStartTime", "autoFurnaceEnabled"]) delete data[key];
    data.achievements = { firstSwing: true, firstDiscovery: false };
    const app = ready(JSON.stringify(data));
    const state = app.state();
    assert.equal(state.saveVersion, 1);
    assert.equal(state.factoryXP, 100, "preserve legacy missing-XP default");
    assert.equal(state.inventory.stone, 0);
    assert.equal(state.inventory.diamond, 0);
    assert.equal(state.oreCollection.amber, 0);
    assert.equal(state.factoryMilestones["10"], false);
    assert.equal(state.permanentBonuses.oreValue, 0);
    assert.equal(state.cosmetics.equipped.dropper, "default");
    assert.deepEqual(state.achievements.firstSwing, { unlocked: true, claimed: false });
    assert.deepEqual(state.achievements.firstDiscovery, { unlocked: false, claimed: false });
    app.run("saveGame()");
    assert.deepEqual(ready(app.stored()).state(), state);
});

for (const version of [2, 999, -1, 1.5, "1", null, true, 9007199254740992]) {
    test("reject unsupported/invalid version " + JSON.stringify(version) + " without overwriting", () => {
        const raw = JSON.stringify({ ...legacyFixture(), saveVersion: version });
        const app = boot(raw);
        assert.match(app.error?.message || "", /saveVersion|newer game version/);
        assert.equal(app.stored(), raw);
        assert.equal(app.writes.length, 0);
        assert.equal(app.intervals.length, 0, "reject before gameplay/autosave timers");
    });
}

for (const raw of ["{broken", "null", "[]", "false", "0", '"text"']) {
    test("malformed save " + raw + " is preserved and startup stops", () => {
        const app = boot(raw);
        assert.ok(app.error);
        assert.equal(app.stored(), raw);
        assert.equal(app.writes.length, 0);
        assert.equal(app.intervals.length, 0);
    });
}

test("mine, buy Dropper, produce, manually smelt and reload preserve the normal loop", () => {
    // Existing funded saves retain the same purchase/production behavior.
    const app = ready(JSON.stringify({ cash: 100, factoryXP: 0, factoryLevel: 1,
        droppers: 0, adders: 0, multipliers: 0 }));
    app.elements.get("mineButton").onclick();
    app.elements.get("buyDropper").onclick();
    app.tick(1000);
    assert.equal(app.state().inventory.stone, 2);
    assert.equal(app.state().cash, 90);
    assert.equal(app.state().factoryXP, 2);
    app.run('prepareSmelt("stone", save.stoneValue, 1); confirmSmelt();');
    assert.equal(app.state().inventory.stone, 0);
    assert.equal(app.state().cash, 92);
    assert.equal(app.state().factoryXP, 4);
    assert.equal(app.state().achievementStats.oresSmelted, 2);
    app.tick(5000);
    assert.deepEqual(ready(app.stored()).state(), app.state());
});

test("ore discovery, achievements, milestones, costs and furnace tiers retain current behavior", () => {
    const app = ready();
    app.run("Math.random = () => 0.01; mineOre(); updateUI();");
    assert.equal(app.state().inventory.amber, 1);
    assert.equal(app.state().oreCollection.amber, 1);
    assert.equal(app.state().achievementStats.oresDiscovered, 1);
    assert.equal(app.state().factoryXP, 5);
    assert.equal(app.state().achievements.firstDiscovery.unlocked, true);
    app.run('claimAchievement("firstDiscovery"); save.factoryXP = 10000; updateFactoryLevel();');
    assert.equal(app.state().achievements.firstDiscovery.claimed, true);
    assert.equal(app.state().factoryLevel, 10);
    assert.equal(app.state().factoryMilestones["10"], true);
    assert.equal(app.run("getDropperCost()"), 10);
    assert.equal(app.run("getAdderCost()"), 100);
    assert.equal(app.run("getMultiplierCost()"), 5000);
    app.run("save.cash = 3000; upgradeFurnace();");
    assert.equal(app.state().furnaceTier, 1);
    assert.equal(app.state().cash, 2500);
    app.run("upgradeFurnace();");
    assert.equal(app.state().furnaceTier, 2);
    assert.equal(app.state().cash, 0);
});

test("active legacy furnace batch pays once after reload, preserving stop-after-current", () => {
    const app = ready(JSON.stringify(legacyFixture()));
    const before = app.state();
    app.tick(100);
    assert.equal(app.state().cash, before.cash + 70);
    assert.equal(app.state().factoryXP, before.factoryXP + 7);
    assert.equal(app.state().achievementStats.oresSmelted, before.achievementStats.oresSmelted + 7);
    assert.deepEqual(app.state().autoFurnaceBatch, []);
    assert.equal(app.state().autoFurnaceEnabled, false);
    const reloaded = ready(app.stored());
    reloaded.tick(100);
    assert.equal(reloaded.state().cash, app.state().cash);
});

test("Reset Save still requires confirmation and creates a versioned fresh save on reload", () => {
    const app = ready(JSON.stringify(legacyFixture()));
    const before = app.stored();
    app.run("resetSave()");
    assert.equal(app.stored(), before);
    assert.equal(app.reloaded(), false);
    app.confirmReset(true);
    app.run("resetSave()");
    assert.equal(app.stored(), null);
    assert.equal(app.reloaded(), true);
    assert.equal(ready(app.stored()).state().saveVersion, 1);
});
