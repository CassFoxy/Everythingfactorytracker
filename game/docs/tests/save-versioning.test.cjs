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
    let app = ready();
    app.run('save.regressionMetadata = { retained: ["sequence", 1] };');
    for (let cycle = 0; cycle < 20; cycle++) {
        // One resource from each existing tier plus Stone, without changing production rules.
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
        for (const tier of [1, 2, 3, 4]) assert.equal(state["tier" + tier + "Ores"], cycle + 1);
        assert.equal(state.achievementStats.oresDiscovered, 4);
        assert.equal(state.achievements.firstDiscovery.claimed, true);
        app = saveAndReload(app);
    }
    assert.equal(app.state().factoryMilestones["10"], true);
    assert.equal(app.state().achievementStats.oresSmelted, 119);
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
