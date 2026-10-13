"use strict";
// Optional real-browser regression check. Requires Playwright and its Chromium browser.
const { chromium } = require(process.env.TEFI_PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const root = path.resolve(__dirname, "../..");
const files = new Map(["index.html", "game.js", "ores.js", "style.css"].map(name =>
    ["/" + name, fs.readFileSync(path.join(root, name))]));
const server = http.createServer((req, res) => {
    if (req.url === "/favicon.ico") { res.writeHead(204); return res.end(); }
    const name = req.url === "/" ? "/index.html" : req.url;
    if (!files.has(name)) { res.writeHead(404); return res.end(); }
    res.setHeader("Content-Type", name.endsWith(".js") ? "text/javascript; charset=utf-8" :
        name.endsWith(".css") ? "text/css; charset=utf-8" : "text/html; charset=utf-8");
    res.end(files.get(name));
});

(async () => {
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    let browser;
    try {
        browser = await chromium.launch({ headless: true,
            ...(process.env.TEFI_BROWSER_CHANNEL ? { channel: process.env.TEFI_BROWSER_CHANNEL } : {}) });
        const url = "http://127.0.0.1:" + server.address().port;
        async function session(raw) {
            const context = await browser.newContext();
            await context.addInitScript(raw => {
                if (raw !== null && !sessionStorage.getItem("seeded")) {
                    localStorage.setItem("ef_incremental", raw);
                    sessionStorage.setItem("seeded", "yes");
                }
                Math.random = () => 0.5;
                window.testNow = 1700000000000;
                Date.now = () => window.testNow;
                window.testIntervals = [];
                window.setInterval = (callback, ms) => {
                    window.testIntervals.push({ callback, ms });
                    return window.testIntervals.length;
                };
            }, raw);
            const page = await context.newPage();
            const errors = [];
            page.on("pageerror", error => errors.push(error.message));
            page.on("console", message => {
                if (message.type() === "error") errors.push(message.text());
            });
            await page.goto(url);
            return { context, page, errors };
        }
        async function normalLoop(legacyBaseline = false) {
            // Seed an existing funded save to compare unchanged gameplay outside the new baseline.
            const app = await session(JSON.stringify({ cash: 100, factoryXP: 100, factoryLevel: 1,
                droppers: 0, adders: 0, multipliers: 0 }));
            const { page } = app;
            // Older baseline scripts predate the gated game wrapper.
            if (legacyBaseline) await page.evaluate(() => {
                document.getElementById("gameRoot").hidden = false;
                document.getElementById("gameRoot").inert = false;
            });
            await page.locator("#mineButton").click();
            await page.locator("#buyDropper").click();
            await page.evaluate(() => testIntervals.find(t => t.ms === 1000).callback());
            await page.getByRole("button", { name: "🔥 Open Furnace", exact: true }).click();
            await page.getByRole("button", { name: "Select", exact: true }).click();
            await page.getByRole("button", { name: "100%", exact: true }).click();
            await page.getByRole("button", { name: "Confirm", exact: true }).click();
            await page.evaluate(() => testIntervals.find(t => t.ms === 5000).callback());
            const before = await page.evaluate(() => JSON.parse(localStorage.getItem("ef_incremental")));
            assert.equal(before.cash, 92);
            assert.equal(before.inventory.stone, 0);
            assert.equal(before.factoryXP, 104);
            await page.reload();
            const after = await page.evaluate(() => JSON.parse(JSON.stringify(save)));
            assert.deepEqual(after, before);
            for (const [open, close] of [["openInventory", "closeInventory"], ["openCollection", "closeCollection"],
                ["openStats", "closeStats"], ["openAchievements", "closeAchievements"],
                ["openMilestones", "closeMilestones"]]) {
                await page.evaluate(([a, b]) => { window[a](); window[b](); }, [open, close]);
            }
            assert.deepEqual(app.errors, []);
            await app.context.close();
            return before;
        }
        for(const [width,height] of [[1920,1080],[1366,768],[390,844]]) {
            const app=await session(null), {page}=app;
            await page.setViewportSize({width,height});
            assert.equal(await page.locator('#buyMiningPower').isDisabled(),true);
            assert.equal(await page.evaluate(()=>unlockDevelopmentMiner()),false);
            assert.equal(await page.evaluate(()=>buyDevelopmentMiner()),false);
            // Real clicks through the real entry point; deterministic Stone, no injected Cash.
            await page.evaluate(()=>{ for(let i=0;i<450;i++) document.getElementById('mineButton').click(); });
            assert.equal(await page.evaluate(()=>save.inventory.stone),450);
            await page.getByRole('button',{name:'🔥 Open Furnace',exact:true}).click();
            for(let batch=0;batch<45;batch++) {
                await page.getByRole('button',{name:'Select',exact:true}).click();
                await page.getByRole('button',{name:'100%',exact:true}).click();
                await page.getByRole('button',{name:'Confirm',exact:true}).click();
            }
            await page.evaluate(()=>closeFurnace());
            assert.equal(await page.evaluate(()=>save.cash),450);
            await page.locator('#buyMiningPower').click();
            assert.equal(await page.locator('#buyMiningPower').textContent(),'Purchased');
            assert.match(await page.locator('#manualPowerLink').textContent(),/Mining Power I owned/);
            await page.locator('#unlockMiner').click();
            assert.equal(await page.evaluate(()=>save.factory.miners.length),0);
            assert.equal(await page.evaluate(()=>unlockDevelopmentMiner()),false);
            await page.locator('#buyMiner').click();
            assert.equal(await page.evaluate(()=>buyDevelopmentMiner()),false);
            assert.equal(await page.evaluate(()=>save.cash),0);
            assert.equal(await page.locator('#dropperCard').isVisible(),false);
            assert.equal(await page.locator('#legacyDropperOverview').isVisible(),false);
            await page.evaluate(()=>testIntervals.find(t=>t.ms===100).callback());
            const reserved=await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.miners[0])));
            assert.equal(reserved.cycle.durationMs,5000);
            await page.evaluate(()=>{ testNow+=5000; testIntervals.find(t=>t.ms===100).callback(); });
            assert.equal(await page.evaluate(()=>save.inventory.stone),1);
            assert.equal(await page.evaluate(()=>save.achievementStats.totalOresMined),450);
            const id=await page.evaluate(()=>save.factory.miners[0].id);
            await page.reload();
            assert.equal(await page.evaluate(()=>save.factory.miners[0].id),id);
            await page.evaluate(()=>{ testNow=save.factory.miners[0].cycle.startedAtMs+3600000; testIntervals.find(t=>t.ms===100).callback(); });
            assert.equal(await page.evaluate(()=>save.inventory.stone),2);
            await page.evaluate(()=>{ for(let i=0;i<10;i++) testIntervals.find(t=>t.ms===100).callback(); testIntervals.find(t=>t.ms===1000).callback(); });
            assert.equal(await page.evaluate(()=>save.inventory.stone),2);
            assert.equal(await page.evaluate(()=>save.droppers),0);
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
            await page.evaluate(()=>{testNow+=2500;testIntervals.find(t=>t.ms===100).callback();scrollTo(0,0);});
            if(process.env.TEFI_UI_SCREENSHOTS){
                fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});
                await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,`miner-${width}.png`),fullPage:true});
            }
            assert.deepEqual(app.errors,[]); await app.context.close();
            console.log(`PASS Chromium: playable Miner opening, 450 mined/smelted Stone, purchases, cycle, reload and no double output at ${width}x${height}.`);
        }
        {
            const app=await session(null),{page}=app;
            await page.evaluate(()=>{save.cash=450;buyMiningPower();unlockDevelopmentMiner();window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
            const before=await page.evaluate(()=>JSON.stringify(save));
            await page.locator('#buyMiner').click();
            assert.equal(await page.evaluate(()=>JSON.stringify(save)),before);
            assert.equal(await page.locator('#developmentWriteRecovery').isVisible(),true);
            await page.evaluate(()=>{Storage.prototype.setItem=realSetItem;});
            await page.locator('#retryDevelopmentWrite').click();
            assert.equal(await page.evaluate(()=>save.factory.miners.length),1);
            assert.equal(await page.evaluate(()=>save.cash),0);
            await page.evaluate(()=>{const bad=JSON.parse(localStorage.getItem('ef_incremental'));bad.developmentProfile='miner-unsupported';localStorage.setItem('ef_incremental',JSON.stringify(bad));});
            const raw=await page.evaluate(()=>localStorage.getItem('ef_incremental'));
            await page.reload();
            assert.equal(await page.locator('#saveRecovery').isVisible(),true);
            assert.match(await page.locator('#recoveryReason').textContent(),/incompatible development save/i);
            const download=page.waitForEvent('download');await page.locator('#exportRawSave').click();await download;
            page.once('dialog',dialog=>dialog.dismiss()); await page.locator('#resetRecoverySave').click();
            assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),raw);
            page.once('dialog',dialog=>dialog.accept()); await page.locator('#resetRecoverySave').click();
            assert.equal(await page.evaluate(()=>save.developmentProfile),'miner-1');
            assert.equal(await page.evaluate(()=>save.factory.miners.length),0);
            assert.deepEqual(app.errors,[]); await app.context.close();
            console.log('PASS Chromium: failed Miner purchase retry and incompatible development export/confirmed reset.');
        }

        for (const [width, height] of [[1920, 1080], [1366, 768], [768, 1024], [390, 844]]) {
            const app = await session(JSON.stringify({ cash: 10000, factoryXP: 2500, droppers: 0, adders: 0, multipliers: 0 }));
            const { page } = app;
            await page.setViewportSize({ width, height });
            assert.equal(await page.locator('.game-layout > section').count(), 3);
            const geometry = await page.evaluate(() => {
                const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
                const panels = [...document.querySelectorAll('.game-layout > section')].map(el => {
                    const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, right:r.right };
                });
                return { duplicate: ids.length !== new Set(ids).size, overflow: document.documentElement.scrollWidth > innerWidth, panels };
            });
            assert.equal(geometry.duplicate, false); assert.equal(geometry.overflow, false);
            if (width >= 1100) assert.equal(geometry.panels[0].y, geometry.panels[2].y);
            if (width < 700) assert.ok(geometry.panels[1].y > geometry.panels[0].y);
            await page.locator('#mineButton').click();
            assert.equal(await page.locator('#lastOre').textContent(), '🪨 Stone');
            assert.equal(await page.locator('#factoryXP').textContent(), await page.evaluate(() => formatXP(2501) + ' / ' + formatXP(3600)));
            for (const [button, modal] of [['Inventory','inventoryModal'], ['Collection Book','collectionModal'], ['Statistics','statsModal'], ['Milestones','milestonesModal'], ['Achievements','achievementsModal']]) {
                await page.getByRole('button', { name:new RegExp(button) }).click();
                assert.equal(await page.locator('#'+modal).isVisible(), true);
                const bounds = await page.locator('#'+modal+' .modal-content').boundingBox();
                assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
                await page.locator('#'+modal).getByRole('button', { name:'Close', exact:true }).click();
                assert.equal(await page.locator('#'+modal).isVisible(), false);
            }
            const purchaseTotal = await page.evaluate(() => getDropperCost() + getAdderCost() + getMultiplierCost());
            for (const name of ['Dropper','Adder','Multiplier']) await page.locator('#buy'+name).click();
            assert.deepEqual(await page.evaluate(() => [save.droppers,save.adders,save.multipliers]), [1,1,1]);
            assert.equal(await page.evaluate(() => save.cash), 10000 - purchaseTotal);
            assert.equal(await page.locator('#cash').textContent(), await page.evaluate(() => '$' + formatCash(save.cash)));
            assert.notEqual(await page.locator('#dropperCost').textContent(), '10');
            await page.evaluate(() => testIntervals.find(t => t.ms === 1000).callback());
            assert.equal(await page.evaluate(() => save.inventory.stone), 2);
            await page.getByRole('button', { name:'🔥 Open Furnace', exact:true }).click();
            await page.getByRole('button', { name:'Select', exact:true }).click();
            await page.getByRole('button', { name:'100%', exact:true }).click();
            await page.getByRole('button', { name:'Confirm', exact:true }).click();
            await page.locator('#furnaceModal').getByRole('button', { name:'Close', exact:true }).click();
            assert.equal(await page.evaluate(() => save.inventory.stone), 0);
            await page.evaluate(() => { save.furnaceTier = 2; updateUI(); updateAutoFurnaceUI(); });
            assert.equal(await page.locator('#autoFurnaceModeSelect').isVisible(), true);
            await page.locator('#autoFurnaceModeSelect').selectOption('stoneOnly');
            await page.locator('#autoFurnaceBatchModeSelect').selectOption('full');
            assert.equal(await page.evaluate(() => save.autoFurnaceMode), 'stoneOnly');
            await page.locator('#autoFurnaceToggle').click();
            assert.equal(await page.evaluate(() => autoFurnaceState.enabled), false);
            await page.locator('#autoFurnaceToggle').click();
            assert.equal(await page.evaluate(() => autoFurnaceState.enabled), true);
            await page.locator('#autoFurnaceBatchModeSelect').selectOption('available');
            await page.keyboard.press('Tab');
            await page.locator('#mineButton').focus();
            assert.equal(await page.locator('#mineButton').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
            await page.evaluate(() => window.scrollTo(0,0));
            if (process.env.TEFI_UI_SCREENSHOTS) {
                fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS, { recursive:true });
                await page.screenshot({ path:path.join(process.env.TEFI_UI_SCREENSHOTS, 'tefi-'+width+'.png'), fullPage:true });
            }
            await page.locator('.dev-tools summary').click();
            page.once('dialog', dialog => dialog.dismiss());
            await page.getByRole('button', { name:'⚠ Reset Save', exact:true }).click();
            assert.equal(await page.evaluate(() => save.droppers), 1);
            page.once('dialog', dialog => dialog.accept());
            await page.getByRole('button', { name:'⚠ Reset Save', exact:true }).click();
            await page.waitForFunction(() => save.cash === 0);
            assert.equal(await page.locator('#buyDropper').isDisabled(), true);
            assert.deepEqual(app.errors, []);
            await app.context.close();
            console.log('PASS Chromium: earthy layout, controls, purchases, reset and no overflow at '+width+'×'+height+'.');
        }
        const fresh = await session(null);
        async function assertProgress(page, cash, xp, level, width) {
            assert.deepEqual(await page.evaluate(() => [save.cash, save.factoryXP, save.factoryLevel]),
                [cash, xp, level]);
            assert.equal(await page.locator("#factoryLevel").textContent(), String(level));
            assert.equal(await page.locator("#cash").textContent(), "$" + cash);
            assert.equal(await page.locator("#xpBar").evaluate(el => el.style.width), width + "%");
        }
        await assertProgress(fresh.page, 0, 0, 0, 0);
        await fresh.page.evaluate(() => saveGame());
        await fresh.page.reload();
        await assertProgress(fresh.page, 0, 0, 0, 0);
        await fresh.page.evaluate(() => { save.factoryXP = 99; updateUI(); });
        await assertProgress(fresh.page, 0, 99, 0, 99);
        await fresh.page.locator("#mineButton").click();
        await assertProgress(fresh.page, 0, 100, 1, 0);
        await fresh.page.evaluate(() => saveGame());
        await fresh.page.reload();
        await assertProgress(fresh.page, 0, 100, 1, 0);
        assert.deepEqual(fresh.errors, []);
        await fresh.context.close();
        console.log("PASS Chromium: fresh $0/XP 0/Level 0, progress boundary, mining and reload.");

        const manual = await session(JSON.stringify({cash:0,factoryXP:0,droppers:0,adders:0,multipliers:0}));
        // This roll formerly selected T4; Default access must redirect it into T2.
        await manual.page.evaluate(() => { Math.random = () => 0; });
        await manual.page.locator("#mineButton").click();
        assert.equal(await manual.page.locator("#discoveryPopup").isVisible(), true);
        const mined = await manual.page.evaluate(() => {
            saveGame();
            return JSON.parse(localStorage.getItem("ef_incremental"));
        });
        assert.equal(mined.inventory.citrine, 1);
        assert.equal(mined.oreCollection.citrine, 1);
        assert.equal(mined.factoryXP, 25);
        assert.equal(mined.tier3Ores, 0);
        assert.equal(mined.tier4Ores, 0);
        assert.equal(mined.saveVersion, 1);
        assert.equal(Object.hasOwn(mined, "manualProgress"), false);
        await manual.page.reload();
        assert.deepEqual(await manual.page.evaluate(() => JSON.parse(JSON.stringify(save))), mined);
        assert.deepEqual(manual.errors, []);
        await manual.context.close();
        console.log("PASS Chromium: Default manual T2 discovery, T3/T4 lock and schema-1 reload.");

        const current = await normalLoop();
        assert.equal(current.saveVersion, 1);
        console.log("PASS Chromium: real mining/purchase/furnace clicks, autosave, reload and menus; no console errors.");

        const legacy = { ...current, cash: 456, extraMetadata: { keep: true } };
        delete legacy.saveVersion;
        const app = await session(JSON.stringify(legacy));
        const legacyDownload = app.page.waitForEvent("download");
        await app.page.locator("#exportLegacySave").click();
        await legacyDownload;
        const loaded = await app.page.evaluate(() => JSON.parse(JSON.stringify(save)));
        assert.deepEqual(loaded, { ...legacy, saveVersion: 1 });
        await app.page.evaluate(() => saveGame());
        await app.page.reload();
        assert.deepEqual(await app.page.evaluate(() => JSON.parse(JSON.stringify(save))), loaded);
        assert.deepEqual(app.errors, []);
        await app.context.close();
        console.log("PASS Chromium: populated unversioned save and reload; no console errors.");

        // Browser integration gap: restored furnace runtime, not only stored batch data.
        const furnaceSave = { ...current, furnaceTier: 2, cash: 1000,
            inventory: { ...current.inventory, stone: 3, amber: 2 } };
        const furnace = await session(JSON.stringify(furnaceSave));
        await furnace.page.evaluate(() => {
            setAutoFurnaceMode("oresStone");
            startAutoFurnace();
            stopAutoFurnace();
        });
        const active = await furnace.page.evaluate(() => JSON.parse(JSON.stringify(save)));
        assert.equal(active.inventory.stone, 0);
        assert.equal(active.inventory.amber, 0);
        assert.equal(active.autoFurnaceBatch.reduce((n, item) => n + item.amount, 0), 5);
        await furnace.page.reload();
        assert.deepEqual(await furnace.page.evaluate(() => JSON.parse(JSON.stringify(save))), active);
        await furnace.page.evaluate(() => {
            window.testNow = save.autoFurnaceStartTime + 9999;
            testIntervals.find(t => t.ms === 100).callback();
        });
        assert.equal(await furnace.page.evaluate(() => save.cash), 1000);
        await furnace.page.evaluate(() => {
            window.testNow++;
            testIntervals.find(t => t.ms === 100).callback();
        });
        const completed = await furnace.page.evaluate(() => JSON.parse(JSON.stringify(save)));
        assert.equal(completed.cash, 1023);
        assert.deepEqual(completed.autoFurnaceBatch, []);
        await furnace.page.reload();
        await furnace.page.evaluate(() => {
            window.testNow += 100000;
            testIntervals.find(t => t.ms === 100).callback();
        });
        assert.deepEqual(await furnace.page.evaluate(() => JSON.parse(JSON.stringify(save))), completed);
        assert.deepEqual(furnace.errors, []);
        await furnace.context.close();
        console.log("PASS Chromium: active furnace reload, timed completion, single payout and completed reload.");

        for (const raw of ["{broken", JSON.stringify({ ...current, saveVersion: 2 }),
            JSON.stringify({ ...current, cash: -1 }),
            JSON.stringify({ ...current, inventory: { stone: "2" } }),
            JSON.stringify({ ...current, autoFurnaceBatch: null })]) {
            const rejected = await session(raw);
            assert.equal(await rejected.page.evaluate(() => localStorage.getItem("ef_incremental")), raw);
            assert.equal(await rejected.page.evaluate(() => testIntervals.length), 0);
            assert.equal(await rejected.page.locator("#saveRecovery").isVisible(), true);
            assert.equal(await rejected.page.locator("#gameRoot").isVisible(), false);
            assert.equal(await rejected.page.locator("#gameRoot").evaluate(el => el.inert), true);
            await rejected.page.locator("#retrySaveLoad").click();
            assert.equal(await rejected.page.evaluate(() => localStorage.getItem("ef_incremental")), raw);
            assert.equal(await rejected.page.evaluate(() => testIntervals.length), 0);
            assert.deepEqual(rejected.errors, []);
            console.log("PASS Chromium: recovery shown, gameplay blocked, retry preserves save; no console errors.");
            await rejected.context.close();
        }

        const rawExport = '\r\n  {broken 🪨 <script>alert(1)</script>}\t\r\n';
        const recovering = await session(rawExport);
        const downloadEvent = recovering.page.waitForEvent("download");
        await recovering.page.locator("#exportRawSave").click();
        const download = await downloadEvent;
        const stream = await download.createReadStream();
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        assert.equal(Buffer.concat(chunks).toString("utf8"), rawExport);
        assert.equal(await recovering.page.evaluate(() => localStorage.getItem("ef_incremental")), rawExport);
        recovering.page.once("dialog", dialog => dialog.dismiss());
        await recovering.page.locator("#resetRecoverySave").click();
        assert.equal(await recovering.page.evaluate(() => localStorage.getItem("ef_incremental")), rawExport);
        assert.equal(await recovering.page.locator("#saveRecovery").isVisible(), true);
        if (process.env.TEFI_RECOVERY_SCREENSHOT) {
            await recovering.page.screenshot({ path: process.env.TEFI_RECOVERY_SCREENSHOT, fullPage: true });
        }
        recovering.page.once("dialog", async dialog => {
            assert.match(dialog.message(), /removes.*progress.*Download/s);
            await dialog.accept();
        });
        await recovering.page.locator("#resetRecoverySave").click();
        assert.equal(await recovering.page.locator("#saveRecovery").isVisible(), false);
        assert.equal(await recovering.page.locator("#mineButton").isVisible(), true);
        assert.equal(await recovering.page.evaluate(() => save.saveVersion), 1);
        await assertProgress(recovering.page, 0, 0, 0, 0);
        assert.equal(await recovering.page.evaluate(() => localStorage.getItem("ef_incremental")), null);
        await recovering.page.evaluate(() => testIntervals.find(t => t.ms === 5000).callback());
        await recovering.page.reload();
        assert.equal(await recovering.page.evaluate(() => save.saveVersion), 1);
        assert.deepEqual(recovering.errors, []);
        await recovering.context.close();
        console.log("PASS Chromium: exact raw download, reset cancellation/confirmation, fresh save and reload.");

        // Simulate temporary read access loss without changing the saved bytes.
        const storageContext = await browser.newContext();
        await storageContext.addInitScript(raw => {
            localStorage.setItem("ef_incremental", raw);
            window.testReadBlocked = true;
            const getItem = Storage.prototype.getItem;
            Storage.prototype.getItem = function(key) {
                if (window.testReadBlocked && key === "ef_incremental") throw new Error("test storage denial");
                return getItem.call(this, key);
            };
        }, JSON.stringify(legacy));
        const storagePage = await storageContext.newPage();
        const storageErrors = [];
        storagePage.on("pageerror", error => storageErrors.push(error.message));
        await storagePage.goto(url);
        assert.equal(await storagePage.locator("#saveRecovery").isVisible(), true);
        assert.equal(await storagePage.locator("#exportRawSave").isDisabled(), true);
        assert.equal(await storagePage.locator("#resetRecoverySave").isDisabled(), true);
        await storagePage.evaluate(() => { window.testReadBlocked = false; });
        await storagePage.locator("#retrySaveLoad").click();
        assert.equal(await storagePage.locator("#saveRecovery").isVisible(), false);
        assert.equal(await storagePage.evaluate(() => save.cash), legacy.cash);
        assert.deepEqual(storageErrors, []);
        await storageContext.close();
        console.log("PASS Chromium: storage read failure and successful retry.");

        // Optional before/after check against the audited source, with identical actions.
        if (process.env.TEFI_BASELINE_GAME) {
            files.set("/game.js", fs.readFileSync(process.env.TEFI_BASELINE_GAME));
            const baseline = await normalLoop(true);
            const { saveVersion, ...rest } = current;
            const { saveVersion: baselineVersion, ...baselineRest } = baseline;
            assert.deepEqual(rest, baselineRest);
            console.log("PASS Chromium: all saved gameplay fields match the pre-change source after identical actions.");
        }
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });

