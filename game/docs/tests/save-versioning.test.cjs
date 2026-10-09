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
