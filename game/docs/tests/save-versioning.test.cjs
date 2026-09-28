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

function assertRejected(raw, expectedPath) {
    const app = boot(raw);
    assert.match(app.error?.message || "", /Invalid save|saveVersion|newer game version/);
    if (expectedPath) assert.ok(app.error.message.includes(expectedPath), app.error.message);
    assert.equal(app.stored(), raw, "original bytes must survive rejection");
    assert.equal(app.writes.length, 0);
    assert.equal(app.intervals.length, 0);
    assert.equal(app.elements.get("mineButton").onclick, undefined);
}

const invalidFields = [
    ["cash", "100"], ["cash", -1], ["cash", null], ["cash", true],
    ["factoryXP", -1], ["factoryXP", 0.5], ["factoryXP", "100"], ["factoryXP", null],
    ["factoryLevel", 0], ["factoryLevel", 1.5], ["factoryLevel", "1"],
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
    data.autoFurnaceStartTime = Date.now() + 86400000;
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
function boot(raw = null) {
    const elements = new Map();
    function element() {
        const el = {
            style: {}, dataset: {}, parentElement: {}, children: [],
            classList: { add() {}, remove() {} },
            appendChild(child) { this.children.push(child); }
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
    const context = vm.createContext({
        console,
        document: {
            getElementById: id => elements.get(id) || null,
            createElement: () => element()
        },
        localStorage: {
            getItem(key) { assert.equal(key, KEY); return stored; },
            setItem(key, value) { assert.equal(key, KEY); writes.push(value); stored = value; },
            removeItem(key) { assert.equal(key, KEY); stored = null; }
        },
        setInterval(fn, ms) { intervals.push({ fn, ms }); },
        setTimeout() {},
        confirm: () => confirmation,
        location: { reload() { reloaded = true; } }
    });
    const run = code => vm.runInContext(code, context);
    run("Math.random = () => 0.5;");
    vm.runInContext(ores, context, { filename: "ores.js" });
    let error;
    try { vm.runInContext(game, context, { filename: "game.js" }); }
    catch (caught) { error = caught; }
    return {
        run, error, writes, intervals, elements,
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

test("new save has version 1 and unchanged starting state; autosave/reload round trip", () => {
    const app = ready();
    assert.equal(app.state().saveVersion, 1);
    assert.equal(app.state().cash, 100);
    assert.equal(app.state().factoryXP, 0);
    assert.equal(app.state().factoryLevel, 1);
    assert.equal(app.state().droppers, 0);
    assert.equal(app.writes.length, 0);
    app.tick(5000);
    assert.equal(app.writes.length, 1);
    assert.deepEqual(ready(app.stored()).state(), app.state());
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
    const app = ready();
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
