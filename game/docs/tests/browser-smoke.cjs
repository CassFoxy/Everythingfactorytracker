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
        // Prior-ticket scenarios deliberately exercise supported pre-GAME13 private saves.
const inheritedFurnaceFixtureScript = `const currentFreshSave=createMinerDevelopmentSave;
createMinerDevelopmentSave=function(){const state=currentFreshSave();delete state.factory.furnace;
const defaults=createDefaultSave();for(const key of furnaceLegacyKeys())state[key]=defaults[key];return state;};`;
        async function session(raw, canonical = false) {
            const context = await browser.newContext();
            if(raw === null && !canonical) await context.route("**/game.js", route => route.fulfill({contentType:"text/javascript",body:files.get("/game.js").toString().replace("\nattemptSaveLoad();", "\n"+inheritedFurnaceFixtureScript+"\nattemptSaveLoad();")}));
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
        // GAME13 uses the actual fresh canonical entry point, not the inherited fixtures below.
        for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]){
            const app=await session(null,true),{page}=app;await page.setViewportSize({width,height});
            await page.locator('#mineButton').click();
            await page.getByRole('button',{name:'🔥 Open Furnace',exact:true}).click();
            await page.locator('#furnaceItems .furnace-cohort').first().getByRole('button',{name:'100%',exact:true}).click();
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game13-confirm-'+width+'.png')});}
            await page.getByRole('button',{name:'Confirm',exact:true}).click();
            assert.equal(await page.evaluate(()=>save.cash),0);
            await page.evaluate(()=>{closeFurnace();testNow+=10000;updateDevelopmentMiner()});assert.equal(await page.evaluate(()=>save.cash),1);
            await page.evaluate(()=>{addDeveloperCash(50000);Math.random=()=>0});
            for(let n=0;n<8;n++){await page.locator('#mineButton').click();if(await page.locator('#discoveryPopup').isVisible())await page.locator('#discoveryPopup button').click();}
            const ore=await page.evaluate(()=>ORE_KEYS.find(id=>save.inventory[id]>0));
            await page.locator('#polisherAction1').click();await page.locator('#polisherOre').selectOption(ore);
            await page.evaluate(()=>{updateDevelopmentMiner();testNow+=7500;updateDevelopmentMiner();setDevelopmentPolisherOre(save.factory.polishers[0].id,null)});
            await page.locator('#buyRefiner').click();
            const selection=await page.evaluate(()=>JSON.stringify(processedSelection(save.processedInventory.polished[0])));
            await page.locator('#refinerSelection').selectOption(selection);
            await page.evaluate(()=>{updateDevelopmentMiner();testNow+=15000;window.refineRoll=0;Math.random=()=>[0,0.5,0.99][refineRoll++%3];updateDevelopmentMiner();setDevelopmentRefinerSelection(save.factory.refiner.id,null)});
            assert.ok(await page.evaluate(()=>save.processedInventory.refined.length)>0);
            await page.locator('#upgradeFurnace').click();await page.locator('#upgradeFurnace').click();
            await page.evaluate(()=>updateDevelopmentMiner());
            const cycle=await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.furnace.cycle)));
            assert.equal(cycle.effectContext.tier,3);assert.equal(cycle.inputs[0].stage,'refined');
            await page.locator('#canonicalFurnaceAuto').uncheck();
            const cash=await page.evaluate(()=>save.cash);
            await page.reload();assert.equal(await page.evaluate(()=>save.factory.furnace.cycle.id),cycle.id);
            await page.evaluate(()=>{testNow=save.factory.furnace.cycle.startedAtMs+save.factory.furnace.cycle.durationMs;updateDevelopmentMiner()});
            assert.ok(await page.evaluate(()=>save.cash)>cash);assert.equal(await page.evaluate(()=>save.factory.furnace.cycle),null);
            for(let tier=4;tier<=20;tier++){await page.evaluate(t=>addDeveloperCash(FurnaceModel.getTierUpgradePrice(t,0)),tier);await page.locator('#upgradeFurnace').click();}
            assert.equal(await page.locator('#upgradeFurnace').textContent(),'Max Level');
            assert.match(await page.locator('#furnaceName').textContent(),/20.*20/);
            await page.locator('#furnaceCard').scrollIntoViewIfNeeded();
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game13-furnace-'+width+'.png')});}
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
            assert.equal(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return new Set(ids).size===ids.length}),true);
            assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS GAME13 canonical player flow '+width+'x'+height);
        }
        {
            const app=await session(null),{page}=app;
            await page.evaluate(()=>{save.furnaceTier=2;save.autoFurnaceEnabled=false;save.autoFurnaceStartTime=Date.now();save.autoFurnaceBatch=[{key:'stone',amount:10000,value:2,name:'Stone',emoji:'S'}];saveGame();updateUI()});
            await page.locator('#moderniseFurnace').click();
            assert.equal(await page.evaluate(()=>save.factory.furnace.tier),3);
            assert.equal(await page.evaluate(()=>save.factory.furnace.cycle.inputs[0].amount),10000);
            await page.reload();await page.evaluate(()=>{testNow+=10000;updateDevelopmentMiner()});
            assert.equal(await page.evaluate(()=>save.cash),20000);assert.equal(await page.locator('#furnaceCapacity').textContent(),'150');
            assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS GAME13 historical conversion and completion');
        }
        {
            const app=await session(null,true),{page}=app;
            await page.evaluate(()=>{addDeveloperCash(10000);save.inventory.amber=2;buyDevelopmentPolisher(1);setDevelopmentPolisherOre(save.factory.polishers[0].id,'amber');updateDevelopmentMiner();setDevelopmentPolisherOre(save.factory.polishers[0].id,null);testNow+=7500;updateDevelopmentMiner();upgradeFurnace();upgradeFurnace();updateDevelopmentMiner()});
            assert.equal(await page.evaluate(()=>save.factory.furnace.cycle.inputs[0].stage),'polished');
            await page.evaluate(()=>{setCanonicalFurnacePreference('autoEnabled',false);testNow+=10000;advanceCanonicalFurnace(Date.now());window.originalStorageWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('test denied')};advanceCanonicalFurnace(Date.now())});
            const before=await page.evaluate(()=>({cash:save.cash,bytes:pendingDevelopmentWrite.serialized}));
            assert.equal(await page.locator('#developmentWriteRecovery').isVisible(),true);
            await page.evaluate(()=>{Storage.prototype.setItem=window.originalStorageWrite;retryDevelopmentWrite()});
            assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),before.bytes);
            assert.ok(await page.evaluate(()=>save.cash)>before.cash);
            const paid=await page.evaluate(()=>save.cash);await page.reload();assert.equal(await page.evaluate(()=>save.cash),paid);
            assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS GAME13 Polished automatic output and exact failed-commit retry');
        }
        if(process.env.TEFI_BROWSER_SCOPE==='game13') return;
        // GAME12: playable manual ore -> Polisher -> Refiner -> Furnace, using real controls.
        for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]){
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.evaluate(()=>{Math.random=()=>0;addDeveloperCash(30000)});
            for(let i=0;i<8;i++){await page.locator('#mineButton').click();if(await page.locator('#discoveryPopup').isVisible())await page.locator('#discoveryPopup button').click();}
            const ore=await page.evaluate(()=>ORE_KEYS.find(id=>save.inventory[id]>0));await page.locator('#polisherAction1').click();await page.locator('#polisherOre').selectOption(ore);
            await page.evaluate(()=>{updateDevelopmentMiner();testNow+=7500;updateDevelopmentMiner()});await page.locator('#buyRefiner').click();
            const selection=await page.evaluate(()=>JSON.stringify(processedSelection(save.processedInventory.polished[0])));await page.locator('#refinerSelection').selectOption(selection);await page.evaluate(()=>updateDevelopmentMiner());
            const cycle=await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.refiner.cycle)));assert.equal(cycle.inputs[0].amount,1);assert.equal(cycle.durationMs,15000);
            await page.reload();assert.equal(await page.evaluate(()=>save.factory.refiner.cycle.id),cycle.id);
            await page.evaluate(()=>{testNow=save.factory.refiner.cycle.startedAtMs+15000;window.refineRoll=0;Math.random=()=>[0,0.5,0.99][refineRoll++%3];updateDevelopmentMiner()});
            const output=await page.evaluate(()=>JSON.parse(JSON.stringify(save.processedInventory.refined[0])));assert.equal(output.refineCount,1);assert.equal(output.refineBonus,0.5);assert.equal(await page.locator('#gemDustBalance').textContent(),'1');
            await page.evaluate(()=>{setDevelopmentPolisherOre(save.factory.polishers[0].id,null);setDevelopmentRefinerSelection(save.factory.refiner.id,null)});
            // Upgrade all levels through the same visible control, keeping active work untouched.
            for(let tier=2;tier<=10;tier++){await page.evaluate(t=>addDeveloperCash(RefinerModel.getTierUpgradePrice(t,0)),tier);await page.locator('#upgradeRefiner').click();}
            assert.equal(await page.locator('#upgradeRefiner').textContent(),'Max Tier');assert.equal(await page.evaluate(()=>save.factory.refiner.tier),10);
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.locator('#refinerPanel').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game12-refiner-'+width+'.png')});}
            await page.evaluate(()=>openInventory());assert.match(await page.locator('#refinedInventoryList').textContent(),/Refined 1/);if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game12-inventory-'+width+'.png')});await page.evaluate(()=>closeInventory());
            await page.getByRole('button',{name:'🔥 Open Furnace',exact:true}).click();const row=page.locator('#polishedFurnaceItems .furnace-cohort').filter({hasText:'Refined 1'});await row.getByRole('button',{name:'Select',exact:true}).click();await row.getByRole('button',{name:'100%',exact:true}).click();assert.equal(await page.evaluate(()=>pendingSmelt.quote.total),output.preRefinerValue*1.5);assert.match(await page.locator('#confirmOre').textContent(),/Refined 1/);
            if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game12-sale-'+width+'.png')});const cash=await page.evaluate(()=>save.cash);await page.getByRole('button',{name:'Confirm',exact:true}).click();assert.equal(await page.evaluate(()=>save.cash),cash+output.preRefinerValue*1.5);assert.equal(await page.evaluate(()=>save.processedInventory.refined.length),0);
            await page.reload();assert.equal(await page.evaluate(()=>save.gemDust),1);assert.equal(await page.evaluate(()=>save.factory.refiner.tier),10);assert.equal(await page.evaluate(()=>save.processedInventory.refined.length),0);
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length!==new Set(ids).size}),false);assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS Chromium: GAME12 Refiner full economy, Tier 10, Dust, historical sale and reload '+width+'x'+height+'.');
        }
        {
            const app=await session(null),{page}=app;await page.evaluate(()=>{addDeveloperCash(25000);buyDevelopmentRefiner();developmentCommand(n=>{const l=PolisherModel.createPolishedLot('ruby',1,100);n.processedInventory.polished.push(l);n.factory.refiner.selection=processedSelection(l)});updateDevelopmentMiner();testNow+=15000;Math.random=()=>0;advanceDevelopmentRefiner(save.factory.refiner.id,testNow)});
            assert.equal(await page.evaluate(()=>save.factory.refiner.cycle.result.gemDustDelta),1);assert.equal(await page.evaluate(()=>save.factory.refiner.cycle.result.outputs.length),0);assert.equal(await page.evaluate(()=>save.gemDust),0);
            await page.evaluate(()=>{window.originalWrite=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota')};advanceDevelopmentRefiner(save.factory.refiner.id,testNow)});const bytes=await page.evaluate(()=>pendingDevelopmentWrite.serialized);assert.equal(await page.evaluate(()=>save.gemDust),0);await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>save.gemDust),0);await page.evaluate(()=>{Storage.prototype.setItem=originalWrite;Math.random=()=>{throw Error('reroll')}});await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),bytes);assert.equal(await page.evaluate(()=>save.gemDust),1);assert.equal(await page.evaluate(()=>save.processedInventory.refined.length),0);await page.reload();assert.equal(await page.evaluate(()=>save.gemDust),1);assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS Chromium: GAME12 destroyed-only Dust, saved outcomes and exact failed-write retry.');
        }

        if(process.env.TEFI_BROWSER_SCOPE === "game12") return;
        // GAME11: all three slots, explicit queue ownership, completed stock and replacement.
        for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]){
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.evaluate(()=>{addDeveloperCash(2105000);developmentCommand(n=>{n.inventory.ruby=30})});
            for(let slot=1;slot<=3;slot++){
                await page.locator('#polisherAction'+slot).click();if(slot>1)await page.locator('#polisherAction'+slot).click();await page.locator('#polisherOre').selectOption('ruby');
                if(!await page.locator('#polisherQueueAmount').isVisible())await page.getByText('Queue owned raw input',{exact:true}).click();
                await page.locator('#polisherQueueAmount').fill('5');await page.locator('#queuePolisher').click();await page.locator('#polisherQueue').getByRole('button',{name:'Process batch',exact:true}).click();
            }
            await page.evaluate(()=>{testNow+=7500;updateDevelopmentMiner()});
            assert.equal(await page.evaluate(()=>save.statistics.lifetime.polishedOutput.ruby),3);const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            await page.locator('#polisherAction2').click();await page.locator('#sellPolisher').click();
            assert.equal(await page.locator('#polisherSaleTitle').textContent(),'Sell Slot 2 Polisher?');assert.equal(await page.locator('#polisherSaleRefund').textContent(),'$50,000');assert.equal(await page.locator('#polisherSaleQueued').textContent(),'4 Ruby');assert.equal(await page.locator('#polisherSaleReserved').textContent(),'None');
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game11-confirm-'+width+'.png')});}
            await page.locator('#cancelPolisherSale').click();assert.equal(await page.evaluate(()=>save.factory.polishers.length),3);await page.locator('#sellPolisher').click();await page.locator('#confirmPolisherSale').click();
            const after=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));assert.equal(after.factory.polishers.length,2);assert.equal(after.cash,before.cash+50000);assert.equal(after.inventory.ruby,before.inventory.ruby+4);assert.deepEqual(after.processedInventory,before.processedInventory);assert.deepEqual(after.statistics,before.statistics);assert.match(await page.locator('#polisherSlotStatus2').textContent(),/Empty/);assert.match(await page.locator('#polisherDetailTitle').textContent(),/polisher:1/);
            await page.reload();assert.equal(await page.evaluate(()=>save.factory.polishers.length),2);await page.evaluate(()=>addDeveloperCash(50000));await page.locator('#polisherAction2').click();await page.locator('#polisherAction2').click();
            assert.equal(await page.evaluate(()=>save.factory.polishers.find(p=>p.slot===2).id),'polisher:4');assert.equal(await page.locator('#polisherOre').inputValue(),'');await page.locator('#polisherOre').selectOption('ruby');await page.evaluate(()=>updateDevelopmentMiner());
            assert.equal(await page.evaluate(()=>save.factory.polishers.find(p=>p.slot===2).cycle.id),'polisher:4/cycle:1');
            if(process.env.TEFI_UI_SCREENSHOTS){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game11-replacement-'+width+'.png'),fullPage:true});}
            await page.reload();assert.equal(await page.evaluate(()=>save.factory.polishers.find(p=>p.slot===2).cycle.id),'polisher:4/cycle:1');
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length!==new Set(ids).size}),false);assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS Chromium: GAME11 three-slot queued resale, retained output, replacement and reload '+width+'x'+height+'.');
        }
        {
            const app=await session(null),{page}=app;await page.evaluate(()=>{addDeveloperCash(5000);buyDevelopmentPolisher(1);developmentCommand(n=>{n.inventory.ruby=5});setDevelopmentPolisherOre('polisher:1','ruby');queueDevelopmentPolisher('polisher:1',5);reserveDevelopmentPolisher('polisher:1',{kind:'queue',queueId:'polisher:1/queue:1'},testNow);testNow+=7500;});
            // A due reservation returns raw without resolving, even on exact failed-write retry.
            await page.locator('#sellPolisher').click();assert.equal(await page.locator('#polisherSaleReserved').textContent(),'1 Ruby');
            await page.evaluate(()=>{window.realWrite=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota')};});await page.locator('#confirmPolisherSale').click();const bytes=await page.evaluate(()=>pendingDevelopmentWrite.serialized);assert.equal(await page.evaluate(()=>save.inventory.ruby),0);assert.equal(await page.evaluate(()=>save.cash),0);await page.locator('#retryDevelopmentWrite').click();
            await page.evaluate(()=>{Storage.prototype.setItem=realWrite});await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),bytes);assert.equal(await page.evaluate(()=>save.inventory.ruby),5);assert.equal(await page.evaluate(()=>save.statistics.lifetime.polishedOutput.ruby),0);
            await page.evaluate(()=>{addDeveloperCash(2500);buyDevelopmentPolisher(1);setDevelopmentPolisherOre('polisher:2','ruby');advanceDevelopmentPolisher('polisher:2',testNow);testNow+=7500;advanceDevelopmentPolisher('polisher:2',testNow);});
            const resolved=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('quota')};});await page.locator('#sellPolisher').click();assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save))),resolved);assert.equal(await page.locator('#polisherSaleModal').isVisible(),false);
            await page.evaluate(()=>{Storage.prototype.setItem=realWrite});await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>save.factory.polishers.length),1);assert.equal(await page.evaluate(()=>save.statistics.lifetime.polishedOutput.ruby),1);assert.match(await page.locator('#polisherFeedback').textContent(),/delivered/);
            await page.locator('#sellPolisher').click();await page.locator('#confirmPolisherSale').click();assert.equal(await page.evaluate(()=>save.inventory.ruby),4);assert.equal(await page.evaluate(()=>save.processedInventory.polished[0].amount),1);assert.equal(await page.evaluate(()=>save.cash),2500);
            await page.reload();assert.equal(await page.evaluate(()=>save.factory.polishers.length),0);assert.equal(await page.evaluate(()=>save.statistics.lifetime.polishedOutput.ruby),1);assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS Chromium: GAME11 due-reserved return, resolved commit-before-sale and exact failed-write recovery.');
        }

        // GAME10: real manual ore -> Polisher -> selected historical cohort -> Furnace -> reload.
        for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]){
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.evaluate(()=>{Math.random=()=>0;addDeveloperCash(5000)});
            for(let i=0;i<8;i++){await page.locator('#mineButton').click();if(await page.locator('#discoveryPopup').isVisible())await page.locator('#discoveryPopup button').click();}
            const ore=await page.evaluate(()=>ORE_KEYS.find(id=>save.inventory[id]>0));await page.locator('#polisherAction1').click();await page.locator('#polisherOre').selectOption(ore);
            await page.evaluate(()=>{updateDevelopmentMiner();for(let i=0;i<3;i++){testNow+=7500;updateDevelopmentMiner();}});
            const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save))),lot=before.processedInventory.polished[0];assert.equal(lot.amount,3);
            await page.getByRole('button',{name:'🔥 Open Furnace',exact:true}).click();
            const row=page.locator('#polishedFurnaceItems .furnace-cohort');assert.equal(await row.count(),1);assert.match(await row.textContent(),/Captured unit value/);
            await row.getByRole('button',{name:'Select',exact:true}).click();await row.getByRole('button',{name:'50%',exact:true}).click();
            assert.equal(await page.locator('#confirmAmount').textContent(),'1');assert.equal(await page.evaluate(()=>pendingSmelt.quote.total),lot.polishedValue);assert.match(await page.locator('#confirmOre').textContent(),/Polished/);
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.waitForTimeout(7200);await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game10-confirm-'+width+'.png')});}
            await page.getByRole('button',{name:'Confirm',exact:true}).click();
            const after=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));assert.equal(after.cash,before.cash+lot.polishedValue);assert.equal(after.processedInventory.polished[0].amount,2);assert.deepEqual(after.statistics,before.statistics);assert.deepEqual(after.inventory,before.inventory);assert.equal(after.factoryXP,before.factoryXP+1);
            if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game10-cohorts-'+width+'.png')});
            await page.reload();assert.equal(await page.evaluate(()=>save.cash),after.cash);assert.deepEqual(await page.evaluate(()=>save.processedInventory),after.processedInventory);
            await page.getByRole('button',{name:'🔥 Open Furnace',exact:true}).click();await page.locator('#polishedFurnaceItems').getByRole('button',{name:'Select',exact:true}).click();await page.locator('#polishedFurnaceItems').getByRole('button',{name:'100%',exact:true}).click();await page.getByRole('button',{name:'Confirm',exact:true}).click();
            assert.equal(await page.evaluate(()=>save.processedInventory.polished.length),0);assert.equal(await page.evaluate(()=>save.cash),before.cash+3*lot.polishedValue);assert.equal(await page.evaluate(()=>confirmSmelt()),false);
            await page.reload();assert.equal(await page.evaluate(()=>save.processedInventory.polished.length),0);
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length!==new Set(ids).size}),false);
            assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS Chromium: GAME10 Polisher-to-Furnace player flow, partial/full sale and reload '+width+'x'+height+'.');
        }
        {
            const app=await session(null),{page}=app;
            await page.evaluate(()=>developmentCommand(n=>{n.processedInventory.polished=[30,33].map(polishedValue=>InventoryModel.createLot({resourceId:'ruby',stage:'polished',refineCount:0,amount:100,polishedValue,preRefinerValue:null,refineBonus:null}))}));
            await page.locator('summary').filter({hasText:'Dev tools'}).click();await page.locator('#enableDeveloperFurnace').click();await page.getByRole('button',{name:'🔥 Open Furnace',exact:true}).click();
            const rows=page.locator('#polishedFurnaceItems .furnace-cohort');assert.equal(await rows.count(),2);await rows.nth(1).getByRole('button',{name:'Select',exact:true}).click();await rows.nth(1).getByRole('button',{name:'100%',exact:true}).click();assert.equal(await page.locator('#confirmTotal').textContent(),'3,300,000');
            await page.evaluate(()=>developmentCommand(n=>{n.processedInventory.polished.reverse()}));
            await page.evaluate(()=>{window.originalWrite=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota')};});await page.getByRole('button',{name:'Confirm',exact:true}).click();
            const bytes=await page.evaluate(()=>pendingDevelopmentWrite.serialized);assert.equal(await page.evaluate(()=>save.cash),0);assert.equal(await page.evaluate(()=>save.processedInventory.polished.length),2);await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>save.cash),0);
            await page.evaluate(()=>{Storage.prototype.setItem=originalWrite});await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),bytes);assert.equal(await page.evaluate(()=>save.cash),3300000);assert.equal(await page.evaluate(()=>save.processedInventory.polished[0].polishedValue),30);
            await page.evaluate(()=>{closeFurnace();setDeveloperFurnace(false);openFurnace()});await rows.getByRole('button',{name:'Select',exact:true}).click();await rows.getByRole('button',{name:'100%',exact:true}).click();assert.equal(await page.locator('#confirmAmount').textContent(),'10');assert.equal(await page.locator('#confirmTotal').textContent(),'300');
            await page.evaluate(()=>developmentCommand(n=>{n.processedInventory.polished[0].amount++}));await page.getByRole('button',{name:'Confirm',exact:true}).click();assert.match(await page.locator('#smeltFeedback').textContent(),/changed/);assert.equal(await page.evaluate(()=>save.cash),3300000);
            assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS Chromium: GAME10 distinct cohorts, Developer Furnace, authoritative stale rejection and exact sale retry.');
        }

        // GAME09: actual manual ore -> three independent Polishers -> atomic stock/statistics -> reload.
        for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]){
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.evaluate(()=>{Math.random=()=>0;addDeveloperCash(2105000);});
            for(let i=0;i<8;i++){await page.locator('#mineButton').click();if(await page.locator('#discoveryPopup').isVisible())await page.locator('#discoveryPopup button').click();}
            const ore=await page.evaluate(()=>ORE_KEYS.find(id=>save.inventory[id]>0));assert.ok(ore);
            for(let slot=1;slot<=3;slot++){await page.locator('#polisherAction'+slot).click();if(slot>1)await page.locator('#polisherAction'+slot).click();await page.locator('#polisherOre').selectOption(ore);}
            const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));assert.equal(before.factory.polishers.length,3);
            await page.evaluate(()=>updateDevelopmentMiner());
            const reserved=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));assert.equal(reserved.inventory[ore],before.inventory[ore]-3);
            assert.equal(reserved.statistics.lifetime.polishedOutput[ore],0);
            await page.evaluate(()=>{testNow+=7500;updateDevelopmentMiner();});
            const after=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));assert.equal(after.processedInventory.polished[0].amount,3);assert.equal(after.statistics.lifetime.polishedOutput[ore],3);assert.equal(after.statistics.thisRebirth.polishedOutput[ore],3);
            for(const key of ['factoryXP','totalOres','achievementStats','oreCollection','cash'])assert.deepEqual(after[key],before[key]);
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.waitForTimeout(7200);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,`game09-factory-${width}.png`),fullPage:true});}
            await page.getByRole('button',{name:/Inventory/,exact:false}).first().click();assert.match(await page.locator('#polishedInventoryList').textContent(),/Polished ×3/);
            if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,`game09-inventory-${width}.png`)});
            await page.reload();assert.equal(await page.evaluate(()=>save.processedInventory.polished[0].amount),3);
            await page.evaluate(()=>addDeveloperCash(50000));await page.locator('#upgradePolisher').click();assert.equal(await page.evaluate(()=>save.factory.polishers[0].tier),2);assert.equal(await page.evaluate(()=>save.factory.polishers[0].cycle.effectContext.tier),1);
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
            assert.equal(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return new Set(ids).size!==ids.length;}),false);
            assert.deepEqual(app.errors,[]);await app.context.close();console.log(`PASS Chromium: GAME09 three Polisher player flow, atomic statistics, historical effects and reload ${width}x${height}.`);
        }
        {
            const app=await session(null),{page}=app;
            await page.evaluate(()=>{addDeveloperCash(5000);buyDevelopmentPolisher(1);developmentCommand(n=>{n.inventory.ruby=10});setDevelopmentPolisherOre('polisher:1','ruby');queueDevelopmentPolisher('polisher:1',5);});
            await page.getByText('Queue owned raw input',{exact:true}).click();await page.getByRole('button',{name:'Process batch',exact:true}).click();
            assert.equal(await page.evaluate(()=>save.inventory.ruby),5);assert.equal(await page.evaluate(()=>save.factory.polishers[0].queue[0].lot.amount),4);
            await page.evaluate(()=>{testNow+=7500;advanceDevelopmentPolisher('polisher:1',testNow);});
            const resolved=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));await page.evaluate(()=>{window.realWrite=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota')};advanceDevelopmentPolisher('polisher:1',testNow);});
            assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save))),resolved);const bytes=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
            await page.locator('#retryDevelopmentWrite').click();assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save))),resolved);
            await page.evaluate(()=>{Storage.prototype.setItem=realWrite;});await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),bytes);
            await page.reload();assert.equal(await page.evaluate(()=>save.processedInventory.polished[0].amount),1);assert.equal(await page.evaluate(()=>save.statistics.lifetime.polishedOutput.ruby),1);assert.equal(await page.evaluate(()=>save.factory.polishers[0].queue[0].lot.amount),4);
            assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS Chromium: GAME09 queue partial transfer and exact atomic output/statistics retry.');
        }

        // GAME08: actual selected-Miner resale confirmation and replacement.
        for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]){
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.evaluate(()=>{
                addDeveloperCash(450);buyMiningPower();unlockDevelopmentMiner();buyDevelopmentMiner();
                for(const slot of [2,3,4,5]){addDeveloperCash(MinerCandidateModel.getSlotPrice(slot,0));unlockDevelopmentMinerSlot(slot);addDeveloperCash(100);buyDevelopmentMiner(slot);}
                updateDevelopmentMiner();addDeveloperCash(400);upgradeDevelopmentMiner('miner:3');addDeveloperCash(1000);upgradeDevelopmentMinerOreLuck('miner:3');
            });
            await page.locator('#minerSlotAction3').click();
            const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.match(await page.locator('#minerResaleStatus').textContent(),/Refund: \$750/);
            await page.locator('#sellMiner').click();assert.equal(await page.locator('#minerSaleModal').isVisible(),true);
            assert.match(await page.locator('#minerSaleIdentity').textContent(),/miner:3/);
            assert.equal(await page.locator('#minerSaleRefund').textContent(),'$750');
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,`game08-confirm-${width}.png`)});}
            await page.locator('#cancelMinerSale').click();assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save))),before);
            await page.locator('#sellMiner').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#minerSaleModal').isVisible(),false);
            // Due but still reserved: clicking Confirm does not force an outcome.
            await page.evaluate(()=>{testNow+=5000;});await page.locator('#sellMiner').click();await page.locator('#confirmMinerSale').click();
            const sold=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.equal(sold.cash,before.cash+750);assert.deepEqual(sold.inventory,before.inventory);
            assert.deepEqual(sold.factory.miners,before.factory.miners.filter(m=>m.id!=='miner:3'));
            assert.deepEqual(sold.factory.minerSlots,before.factory.minerSlots);assert.deepEqual(sold.identity,before.identity);
            assert.match(await page.locator('#minerSlotStatus3').textContent(),/Vacant/);
            await page.locator('#minerSlotAction3').click();const replacement=await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.miners.find(m=>m.slot===3))));
            assert.equal(replacement.id,'miner:6');assert.equal(replacement.tier,1);assert.equal(replacement.oreLuckLevel,0);assert.equal(replacement.cycle,null);assert.equal(replacement.investment.entries.length,1);
            await page.locator('#minerSlotAction3').click();assert.equal(await page.locator('#upgradeMiner').getAttribute('data-miner-id'),'miner:6');
            await page.locator('#upgradeMiner').click();assert.equal(await page.evaluate(()=>save.factory.miners.find(m=>m.id==='miner:6').tier),2);
            await page.evaluate(()=>{Math.random=()=>0;updateDevelopmentMiner();});
            assert.equal(await page.evaluate(()=>save.totalOres),before.totalOres+4); // removed due work never paid
            const raw=await page.evaluate(()=>localStorage.getItem('ef_incremental'));await page.reload();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),raw);
            assert.equal(await page.evaluate(()=>save.factory.miners.find(m=>m.slot===3).id),'miner:6');
            await page.locator('#minerSlotAction3').click();
            if(process.env.TEFI_UI_SCREENSHOTS){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,`game08-replacement-${width}.png`),fullPage:true});}
            // A saved resolved result must commit before a fresh confirmation.
            await page.evaluate(()=>developmentCommand(next=>{const m=next.factory.miners.find(m=>m.id==='miner:2');m.cycle.phase='resolved';m.cycle.result=minerResult('stone');}));
            const stone=await page.evaluate(()=>save.inventory.stone);await page.locator('#minerSlotAction2').click();await page.locator('#sellMiner').click();
            assert.equal(await page.locator('#minerSaleModal').isVisible(),false);assert.equal(await page.evaluate(()=>save.inventory.stone),stone+1);
            assert.equal(await page.evaluate(()=>save.factory.miners.some(m=>m.id==='miner:2')),true);
            await page.locator('#sellMiner').click();await page.locator('#confirmMinerSale').click();assert.equal(await page.evaluate(()=>save.inventory.stone),stone+1);
            assert.equal(await page.evaluate(()=>new Set([...document.querySelectorAll('[id]')].map(e=>e.id)).size===document.querySelectorAll('[id]').length),true);
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
            assert.deepEqual(app.errors,[]);await app.context.close();console.log(`PASS Chromium: GAME08 confirmed resale, reserved/resolved disposition and replacement ${width}x${height}.`);
        }
        {
            const app=await session(null),{page}=app;
            await page.evaluate(()=>{addDeveloperCash(450);buyMiningPower();unlockDevelopmentMiner();buyDevelopmentMiner();updateDevelopmentMiner();});
            for(const resolved of [true,false]){
                if(resolved)await page.evaluate(()=>developmentCommand(next=>{const m=next.factory.miners[0];m.cycle.phase='resolved';m.cycle.result=minerResult('stone');}));
                else await page.locator('#sellMiner').click();
                const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
                await page.evaluate(()=>{window.realWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
                await page.locator(resolved?'#sellMiner':'#confirmMinerSale').click();
                assert.equal(await page.locator('#developmentWriteRecovery').isVisible(),true);assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save))),before);
                const bytes=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
                await page.evaluate(()=>{confirmDevelopmentMinerSale();buyDevelopmentMiner();updateDevelopmentMiner();Storage.prototype.setItem=realWrite;});
                await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),bytes);
                assert.equal(await page.evaluate(()=>save.factory.miners.length),resolved?1:0);
            }
            await page.reload();assert.equal(await page.evaluate(()=>save.factory.miners.length),0);
            await page.evaluate(()=>{addDeveloperCash(50);buyDevelopmentMiner();});
            // Upgrade the replacement with exact quotes, then verify the known Number boundary.
            await page.evaluate(()=>{while(save.factory.miners[0].tier<25){const m=save.factory.miners[0];if(!addDeveloperCash(MinerTierModel.getTierUpgradePrice(m.tier+1,0))||!upgradeDevelopmentMiner(m.id))throw Error('upgrade');}});
            assert.equal(await page.locator('#sellMiner').isDisabled(),true);assert.match(await page.locator('#minerResaleStatus').textContent(),/cannot be represented exactly/);
            const blocked=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));assert.equal(await page.evaluate(()=>prepareDevelopmentMinerSale(save.factory.miners[0].id)),false);
            assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save))),blocked);
            // Local level 7 makes this particular ledger refund exactly representable.
            await page.evaluate(()=>{while(save.factory.miners[0].oreLuckLevel<7){const m=save.factory.miners[0];addDeveloperCash(MinerOreLuckModel.getUpgradePrice(m.oreLuckLevel+1,0));upgradeDevelopmentMinerOreLuck(m.id);}});
            const expected=await page.evaluate(()=>String(save.factory.miners[0].investment.entries.reduce((s,p)=>s+BigInt(p.cashPaid),0n)/2n));
            assert.equal(await page.locator('#sellMiner').isDisabled(),false);await page.locator('#sellMiner').click();await page.locator('#confirmMinerSale').click();
            assert.equal(await page.evaluate(()=>String(BigInt(save.cash))),expected);assert.equal(await page.evaluate(()=>save.factory.miners.length),0);
            await page.reload();assert.equal(await page.evaluate(()=>save.factory.miners.length),0);assert.deepEqual(app.errors,[]);
            await app.context.close();console.log('PASS Chromium: GAME08 result/sale write retry, zero-owner reload and exact high-value refund boundaries.');
        }

        // GAME07: the actual five-slot interface and one shared production writer.
        for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844]]) {
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.locator('.dev-tools summary').click();await page.locator('#devCashAmount').fill('450');await page.locator('#devAddCash').click();
            await page.locator('.dev-tools summary').click();await page.locator('#buyMiningPower').click();await page.locator('#unlockMiner').click();await page.locator('#buyMiner').click();
            await page.evaluate(()=>updateDevelopmentMiner());
            const first=await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.miners[0])));
            for(const slot of [5,3,2,4]) {
                await page.evaluate(slot=>{if(!addDeveloperCash(MinerCandidateModel.getSlotPrice(slot,0)))throw Error('fund');},slot);
                const button=page.locator('#minerSlotAction'+slot);await button.click();
                assert.equal(await page.evaluate(slot=>save.factory.minerSlots[slot-1],slot),true);
                assert.equal(await page.evaluate(slot=>save.factory.miners.some(m=>m.slot===slot),slot),false);
                assert.equal(await page.evaluate(slot=>unlockDevelopmentMinerSlot(slot),slot),false);
                await page.evaluate(()=>addDeveloperCash(100));await button.click();
                assert.equal(await page.evaluate(slot=>buyDevelopmentMiner(slot),slot),false);
                assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.miners.find(m=>m.slot===1)))),first);
            }
            await page.evaluate(()=>updateDevelopmentMiner());
            const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            await page.locator('#minerSlotAction5').click();
            assert.equal(await page.locator('#upgradeMiner').getAttribute('data-miner-id'),'miner:2');
            for(const kind of ['tier','oreLuck']) {
                await page.evaluate(kind=>addDeveloperCash(kind==='tier'?MinerTierModel.getTierUpgradePrice(2,0):MinerOreLuckModel.getUpgradePrice(1,0)),kind);
                await page.locator(kind==='tier'?'#upgradeMiner':'#upgradeMinerOreLuck').click();
            }
            const upgraded=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            const m=upgraded.factory.miners.find(m=>m.id==='miner:2');assert.equal(m.tier,2);assert.equal(m.oreLuckLevel,1);
            assert.deepEqual(m.cycle,before.factory.miners.find(m=>m.id==='miner:2').cycle);
            assert.deepEqual(upgraded.factory.miners.filter(m=>m.id!=='miner:2'),before.factory.miners.filter(m=>m.id!=='miner:2'));
            const bytes=await page.evaluate(()=>localStorage.getItem('ef_incremental'));
            await page.locator('#minerSlotAction3').click();await page.locator('#minerSlotAction5').click();
            assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),bytes);
            await page.evaluate(()=>{testNow+=5000;Math.random=()=>0;updateDevelopmentMiner();});
            assert.equal(await page.evaluate(()=>save.inventory.stone),before.inventory.stone+5);
            assert.equal(await page.evaluate(()=>save.factoryXP),before.factoryXP+5);
            const fresh=await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.miners.find(m=>m.id==='miner:2').cycle)));
            assert.equal(fresh.effectContext.tier,2);assert.equal(fresh.effectContext.localOreLuckLevel,1);assert.equal(fresh.durationMs,4800);
            await page.reload();assert.equal(await page.evaluate(()=>save.factory.miners.length),5);
            // Reopen clock is earlier: valid future reservations must not reset.
            assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.miners.find(m=>m.id==='miner:2').cycle))),fresh);
            await page.locator('#minerSlotAction5').click();
            assert.equal(await page.locator('#minerDetailTitle').textContent(),'Slot 5 · miner:2');
            assert.equal(await page.evaluate(()=>new Set([...document.querySelectorAll('[id]')].map(e=>e.id)).size===document.querySelectorAll('[id]').length),true);
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
            for(const selector of ['#upgradeMiner','#upgradeMinerOreLuck','#minerSlotAction2','#minerSlotAction5']) assert.equal(await page.locator(selector).isVisible(),true);
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,`game07-five-${width}.png`),fullPage:true});}
            // Mixed reserved/resolved reload: exactly one original output per owner.
            await page.evaluate(()=>{developmentCommand(next=>{for(const m of next.factory.miners){m.cycle.startedAtMs=0;if(m.slot%2===0){m.cycle.phase='resolved';m.cycle.result=minerResult('stone');}}});});
            const inventory=await page.evaluate(()=>save.inventory.stone);await page.reload();
            assert.equal(await page.evaluate(()=>save.inventory.stone),inventory+5);
            await page.evaluate(()=>updateDevelopmentMiner());assert.equal(await page.evaluate(()=>save.inventory.stone),inventory+5);
            assert.equal(await page.evaluate(()=>save.identity.nextEntitySequence),6);
            assert.deepEqual(app.errors,[]);await app.context.close();
            console.log(`PASS Chromium: GAME07 five slots, targeted upgrades, independent cycles and reload ${width}x${height}.`);
        }
        {
            const app=await session(null),{page}=app;
            await page.evaluate(()=>{addDeveloperCash(450);buyMiningPower();unlockDevelopmentMiner();buyDevelopmentMiner();updateDevelopmentMiner();});
            for(const operation of ['slot','purchase','upgrade','commit']) {
                await page.evaluate(operation=>{
                    if(operation==='slot')addDeveloperCash(10000);
                    if(operation==='purchase')addDeveloperCash(100);
                    if(operation==='upgrade')addDeveloperCash(400);
                    if(operation==='commit')developmentCommand(next=>{const m=next.factory.miners.find(m=>m.id==='miner:2');m.cycle.phase='resolved';m.cycle.result=minerResult('stone');});
                    window.realWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};
                },operation);
                const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
                if(operation==='slot'||operation==='purchase')await page.locator('#minerSlotAction2').click();
                else if(operation==='upgrade'){await page.locator('#minerSlotAction2').click();await page.locator('#upgradeMiner').click();}
                else await page.evaluate(()=>updateDevelopmentMiner());
                assert.equal(await page.locator('#developmentWriteRecovery').isVisible(),true);
                assert.deepEqual(await page.evaluate(()=>JSON.parse(JSON.stringify(save))),before);
                const pending=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
                await page.evaluate(()=>{unlockDevelopmentMinerSlot(3);buyDevelopmentMiner(3);upgradeDevelopmentMiner('miner:1');updateDevelopmentMiner();Storage.prototype.setItem=realWrite;});
                await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),pending);
                await page.evaluate(()=>updateDevelopmentMiner());
            }
            const correct=await page.evaluate(()=>localStorage.getItem('ef_incremental'));
            await page.evaluate(()=>{const bad=JSON.parse(localStorage.getItem('ef_incremental'));bad.factory.miners[1].id=bad.factory.miners[0].id;localStorage.setItem('ef_incremental',JSON.stringify(bad));});
            await page.reload();assert.equal(await page.locator('#saveRecovery').isVisible(),true);
            await page.evaluate(raw=>localStorage.setItem('ef_incremental',raw),correct);await page.reload();
            assert.equal(await page.locator('#saveRecovery').isVisible(),false);assert.equal(await page.evaluate(()=>save.factory.miners.length),2);
            assert.deepEqual(app.errors,[]);await app.context.close();console.log('PASS Chromium: GAME07 multi-Miner exact failed-write retry and corrupt identity recovery.');
        }

        // GAME06: complete progression through the real controls, funded by DEV01.
        for(const [width,height,order] of [[1920,1080,'tiers'],[1366,768,'luck'],[390,844,'mixed']]) {
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.locator('.dev-tools summary').click();await page.locator('#devCashAmount').fill('450');await page.locator('#devAddCash').click();
            await page.locator('.dev-tools summary').click();await page.locator('#buyMiningPower').click();await page.locator('#unlockMiner').click();await page.locator('#buyMiner').click();
            await page.evaluate(()=>updateDevelopmentMiner());
            const original=await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.miners[0])));
            const steps=order==='tiers'?[...Array(24).fill('tier'),...Array(50).fill('oreLuck')]:order==='luck'?
                [...Array(50).fill('oreLuck'),...Array(24).fill('tier')]:[...Array.from({length:24},()=>['oreLuck','tier']).flat(),...Array(26).fill('oreLuck')];
            for(const kind of steps){
                const quote=await page.evaluate(kind=>{
                    const m=save.factory.miners[0],target=(kind==='tier'?m.tier:m.oreLuckLevel)+1;
                    const price=kind==='tier'?MinerTierModel.getTierUpgradePrice(target,0):MinerOreLuckModel.getUpgradePrice(target,0);
                    if(!addDeveloperCash(price))throw Error('Funding failed');return {target,price};
                },kind);
                const control=page.locator(kind==='tier'?'#upgradeMiner':'#upgradeMinerOreLuck');
                assert.equal(await control.isDisabled(),false);
                const fail=width===390&&kind==='tier'&&quote.target===25;
                if(fail)await page.evaluate(()=>{window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
                await control.click();
                if(fail){
                    assert.equal(await page.evaluate(()=>save.factory.miners[0].tier),24);
                    assert.equal(await page.evaluate(()=>save.cash),quote.price);
                    const bytes=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
                    await page.evaluate(()=>{upgradeDevelopmentMiner('miner:1');upgradeDevelopmentMinerOreLuck('miner:1');updateDevelopmentMiner();Storage.prototype.setItem=realSetItem;});
                    await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),bytes);
                }
                const state=await page.evaluate(()=>JSON.parse(JSON.stringify(save))),m=state.factory.miners[0];
                assert.equal(state.cash,0);assert.equal(m[kind==='tier'?'tier':'oreLuckLevel'],quote.target);
                assert.deepEqual(m.investment.entries.at(-1),{kind,targetLevel:quote.target,cashPaid:quote.price,basis:'actual'});
                assert.equal(m.id,original.id);assert.equal(m.slot,1);assert.equal(m.nextCycleSequence,original.nextCycleSequence);assert.deepEqual(m.cycle,original.cycle);
                if([6,20,25,50].includes(quote.target)){
                    await page.reload();assert.deepEqual(await page.evaluate(()=>save.factory.miners[0]),m);
                }
            }
            assert.equal(await page.locator('#upgradeMiner').isDisabled(),true);assert.equal(await page.locator('#upgradeMinerOreLuck').isDisabled(),true);
            assert.match(await page.locator('#minerStatus').textContent(),/25 \/ 25/);
            assert.match(await page.locator('#minerOreLuckStatus').textContent(),/50 \/ 50 \(2.00×\)/);
            assert.match(await page.locator('#upgradeMiner').textContent(),/Max Level/);
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMiner('miner:1')),false);assert.equal(await page.evaluate(()=>upgradeDevelopmentMinerOreLuck('miner:1')),false);
            await page.evaluate(()=>{testNow+=2500;renderDevelopmentMiner();scrollTo(0,0);});
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game06-old-cycle-'+width+'.png'),fullPage:true});}
            // Old Tier 1/Luck 0 resolves once; the following operation captures 25/50.
            await page.evaluate(()=>{Math.random=()=>0;const c=save.factory.miners[0].cycle;testNow=Math.ceil(c.startedAtMs+c.durationMs);updateDevelopmentMiner();});
            assert.equal(await page.evaluate(()=>save.inventory.stone),1);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.effectContext.tier),25);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.effectContext.localOreLuckLevel),50);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.durationMs),await page.evaluate(()=>MinerTierModel.getProductionInterval(25,0)*1000));
            await page.reload();
            const expectedId=await page.evaluate(()=>MinerOreLuckModel.selectOreId(4,0,50,0.4));
            await page.evaluate(()=>{let calls=0;Math.random=()=>++calls%2?0.999:0.4;const c=save.factory.miners[0].cycle;testNow=Math.ceil(c.startedAtMs+c.durationMs);updateDevelopmentMiner();});
            assert.equal(await page.evaluate(id=>save.inventory[id],expectedId),1);assert.equal(await page.evaluate(()=>save.tier4Ores),1);
            await page.reload();assert.equal(await page.evaluate(id=>save.inventory[id],expectedId),1);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+3600000;updateDevelopmentMiner();});
            const total=await page.evaluate(()=>save.totalOres);await page.evaluate(()=>{for(let i=0;i<10;i++)updateDevelopmentMiner();});assert.equal(await page.evaluate(()=>save.totalOres),total);
            if(await page.locator('#discoveryPopup').isVisible())await page.locator('#discoveryPopup').getByRole('button',{name:'Awesome!',exact:true}).click();
            await page.evaluate(()=>{renderDevelopmentMiner();scrollTo(0,0);});
            const layout=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {overflow:document.documentElement.scrollWidth>innerWidth,duplicate:ids.length!==new Set(ids).size};});
            assert.deepEqual(layout,{overflow:false,duplicate:false});assert.deepEqual(app.errors,[]);
            if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'game06-max-'+width+'.png'),fullPage:true});
            await app.context.close();console.log('PASS Chromium: GAME06 all tiers and Luck, active binding, T4 output, reload/retry and UI at '+width+'x'+height+'.');
        }
        for(const [width,height] of [[1920,1080],[1366,768],[390,844]]) {
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.locator('.dev-tools summary').click();
            let cash=0;
            for(const [label,amount] of [['Add $1,000',1000],['Add $1,000,000',1000000],['Add $1,000,000,000',1000000000]]){
                await page.getByRole('button',{name:label,exact:true}).click();cash+=amount;
                assert.equal(await page.evaluate(()=>save.cash),cash);
            }
            await page.locator('#devCashAmount').fill('2500000');await page.locator('#devAddCash').click();cash+=2500000;
            assert.equal(await page.evaluate(()=>save.cash),cash);assert.equal(await page.locator('#buyMiningPower').isDisabled(),false);
            for(const invalid of ['0','-1','1.5','NaN','Infinity','abc','9007199254740993']){
                await page.locator('#devCashAmount').fill(invalid);await page.locator('#devAddCash').click();assert.equal(await page.evaluate(()=>save.cash),cash);
            }
            if(width===390){
                await page.evaluate(()=>{window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
                await page.locator('#devCashAmount').fill('1000');await page.locator('#devAddCash').click();
                assert.equal(await page.evaluate(()=>save.cash),cash);const pending=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
                await page.evaluate(()=>{addDeveloperCash(1000);setDeveloperFurnace(true);Storage.prototype.setItem=realSetItem;});
                await page.locator('#retryDevelopmentWrite').click();cash+=1000;
                assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),pending);assert.equal(await page.evaluate(()=>save.cash),cash);
            }
            await page.locator('#enableDeveloperFurnace').click();assert.equal(await page.locator('#furnaceCapacity').textContent(),'Unlimited');
            assert.equal(await page.locator('#furnaceName').textContent(),'Developer Furnace');assert.equal(await page.evaluate(()=>save.furnaceTier),0);
            await page.reload();assert.equal(await page.evaluate(()=>save.cash),cash);assert.equal(await page.evaluate(()=>save.developerTools.furnaceEnabled),true);
            await page.locator('.dev-tools summary').click();
            await page.evaluate(()=>{for(let i=0;i<120;i++)document.getElementById('mineButton').click();});
            const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            await page.getByRole('button',{name:'🔥 Open Furnace',exact:true}).click();
            await page.locator('#furnaceItems').getByRole('button',{name:'Select',exact:true}).click();
            await page.locator('#furnaceItems').getByRole('button',{name:'100%',exact:true}).click();
            assert.equal(await page.locator('#confirmAmount').textContent(),'120');assert.equal(await page.locator('#confirmValue').textContent(),'1,000');assert.equal(await page.locator('#confirmTotal').textContent(),'120,000');
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'dev-furnace-confirm-'+width+'.png'),fullPage:true});}
            if(width===390)await page.evaluate(()=>{window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
            await page.locator('#smeltConfirmModal').getByRole('button',{name:'Confirm',exact:true}).click();
            if(width===390){
                assert.deepEqual(await page.evaluate(()=>save),before);const pending=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
                await page.evaluate(()=>{confirmSmelt();addDeveloperCash(1000);Storage.prototype.setItem=realSetItem;});
                await page.locator('#retryDevelopmentWrite').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),pending);
            }
            cash+=120000;assert.equal(await page.evaluate(()=>save.cash),cash);assert.equal(await page.evaluate(()=>save.inventory.stone),0);
            assert.equal(await page.evaluate(()=>save.factoryXP),before.factoryXP+120);assert.equal(await page.evaluate(()=>save.achievementStats.oresSmelted),120);
            assert.equal(await page.evaluate(()=>confirmSmelt()),false);assert.equal(await page.locator('#smeltConfirmModal').isVisible(),false);
            await page.locator('#furnaceModal .close-button').click();
            await page.evaluate(()=>{save.furnaceTier=2;save.inventory.stone=25;saveGame();updateUI();testIntervals.find(t=>t.ms===100).callback();});
            assert.equal(await page.evaluate(()=>save.inventory.stone),25);assert.match(await page.locator('#autoFurnaceControls').textContent(),/paused/);
            await page.locator('#restoreNormalFurnace').click();assert.equal(await page.locator('#furnaceName').textContent(),'Auto Furnace');assert.equal(await page.locator('#furnaceCapacity').textContent(),'10000');
            await page.evaluate(()=>testIntervals.find(t=>t.ms===100).callback());assert.equal(await page.evaluate(()=>save.autoFurnaceBatch[0].amount),25);
            assert.equal(await page.evaluate(()=>setDeveloperFurnace(true)),false);
            await page.evaluate(()=>{testNow+=10000;testIntervals.find(t=>t.ms===100).callback();});cash+=25;
            assert.equal(await page.evaluate(()=>save.cash),cash);
            await page.locator('#enableDeveloperFurnace').click();await page.reload();assert.equal(await page.evaluate(()=>save.furnaceTier),2);
            await page.locator('.dev-tools summary').click();await page.locator('#devCashAmount').fill('2500000');
            const layout=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id),input=document.getElementById('devCashAmount').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,duplicate:ids.length!==new Set(ids).size,inputFits:input.left>=0&&input.right<=innerWidth};});
            assert.deepEqual(layout,{overflow:false,duplicate:false,inputFits:true});
            await page.evaluate(()=>scrollTo(0,0));
            if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'dev-panel-'+width+'.png'),fullPage:true});
            const valid=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));assert.deepEqual(app.errors,[]);await app.context.close();
            if(width===390){const bad={...valid,developerTools:{furnaceEnabled:'yes'}},raw=JSON.stringify(bad),invalid=await session(raw);assert.equal(await invalid.page.locator('#saveRecovery').isVisible(),true);assert.equal(await invalid.page.evaluate(()=>localStorage.getItem('ef_incremental')),raw);assert.deepEqual(invalid.errors,[]);await invalid.context.close();}
            console.log('PASS Chromium: developer Cash, Furnace, reload/retry, normal Auto restoration and panel at '+width+'x'+height+'.');
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

            // GAME02: earn the upgrade through manual mining/Furnace, not a Cash fixture.
            assert.equal(await page.locator('#upgradeMiner').isDisabled(),true);
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMiner(save.factory.miners[0].id)),false);
            await page.evaluate(()=>{for(let i=0;i<400;i++) document.getElementById('mineButton').click();});
            await page.getByRole('button',{name:'🔥 Open Furnace',exact:true}).click();
            for(let batch=0;batch<40;batch++){
                await page.getByRole('button',{name:'Select',exact:true}).click();
                await page.getByRole('button',{name:'100%',exact:true}).click();
                await page.getByRole('button',{name:'Confirm',exact:true}).click();
            }
            await page.evaluate(()=>closeFurnace());
            assert.equal(await page.evaluate(()=>save.cash),400);
            const beforeUpgrade=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMiner('miner:999')),false);
            await page.locator('#upgradeMiner').click();
            const upgraded=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.equal(upgraded.cash,0); assert.equal(upgraded.factory.miners[0].tier,2);
            assert.deepEqual(upgraded.factory.miners[0].cycle,beforeUpgrade.factory.miners[0].cycle);
            assert.deepEqual(upgraded.identity,beforeUpgrade.identity);
            assert.equal(upgraded.factory.miners[0].id,id);
            assert.deepEqual(upgraded.factory.miners[0].investment.entries[1],{kind:'tier',targetLevel:2,cashPaid:400,basis:'actual'});
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMiner(save.factory.miners[0].id)),false);
            assert.equal(await page.locator('#upgradeMiner').isDisabled(),true);
            assert.match(await page.locator('#minerStatus').textContent(),/Owned Tier 2.*Next cycle: Tier 2/);
            assert.match(await page.locator('#minerCycleStatus').textContent(),/Current cycle: Tier 1.*5s/);
            await page.reload();
            assert.deepEqual(await page.evaluate(()=>save.factory.miners[0]),upgraded.factory.miners[0]);
            await page.evaluate(()=>{
                const c=save.factory.miners[0].cycle; testNow=c.startedAtMs+2500; Math.random=()=>0.955;
                testIntervals.find(t=>t.ms===100).callback();scrollTo(0,0);
            });
            if(process.env.TEFI_UI_SCREENSHOTS){
                fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});
                await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'miner-upgraded-old-cycle-'+width+'.png'),fullPage:true});
            }
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+5000;testIntervals.find(t=>t.ms===100).callback();});
            assert.equal(await page.evaluate(()=>save.inventory.stone),3,'old Tier 1 produces Stone at roll 0.955');
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.effectContext.tier),2);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.durationMs),4800);
            const tier2=await page.evaluate(()=>JSON.parse(JSON.stringify(save.factory.miners[0])));
            await page.reload();
            assert.deepEqual(await page.evaluate(()=>save.factory.miners[0]),tier2);
            await page.evaluate(()=>{
                Math.random=()=>0.955;testNow=save.factory.miners[0].cycle.startedAtMs+4800;
                testIntervals.find(t=>t.ms===100).callback();
            });
            assert.equal(await page.evaluate(()=>save.tier1Ores),1,'Tier 2 same roll produces an ore');
            assert.equal(await page.evaluate(()=>save.tier4Ores),0);
            assert.equal(await page.evaluate(()=>save.inventory[MinerOreLuckModel.selectOreId(1,0,0,0.955)]),1);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].investment.entries.length),2);
            // A persisted resolved result recovers without RNG or duplicate delivery.
            await page.evaluate(()=>{
                const c=save.factory.miners[0].cycle;c.phase='resolved';c.result=minerResult('amber');saveGame();
            });
            const amberBefore=await page.evaluate(()=>save.inventory.amber);
            await page.reload();
            assert.equal(await page.evaluate(()=>save.inventory.amber),amberBefore+1);
            await page.reload();
            assert.equal(await page.evaluate(()=>save.inventory.amber),amberBefore+1);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+2400;testIntervals.find(t=>t.ms===100).callback();scrollTo(0,0);});
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
            if(process.env.TEFI_UI_SCREENSHOTS){
                fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});
                await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,`miner-${width}.png`),fullPage:true});
            }
            assert.deepEqual(app.errors,[]); await app.context.close();
            console.log(`PASS Chromium: playable Miner opening and Tier 2 upgrade, earned Cash, active binding, resolved reload and no double output at ${width}x${height}.`);
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


        {
            const app=await session(null),{page}=app;
            await page.evaluate(()=>{
                save.cash=850;buyMiningPower();unlockDevelopmentMiner();buyDevelopmentMiner();updateDevelopmentMiner();
                window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};
            });
            const before=await page.evaluate(()=>JSON.stringify(save));
            const durable=await page.evaluate(()=>localStorage.getItem('ef_incremental'));
            await page.locator('#upgradeMiner').click();
            assert.equal(await page.evaluate(()=>JSON.stringify(save)),before);
            assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),durable);
            assert.equal(await page.locator('#developmentWriteRecovery').isVisible(),true);
            const pending=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
            await page.evaluate(()=>{testNow+=10000;testIntervals.find(t=>t.ms===100).callback();upgradeDevelopmentMiner('miner:1');});
            assert.equal(await page.evaluate(()=>pendingDevelopmentWrite.serialized),pending);
            await page.evaluate(()=>{Storage.prototype.setItem=realSetItem;});
            await page.locator('#retryDevelopmentWrite').click();
            assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),pending);
            assert.equal(await page.evaluate(()=>save.cash),0);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].investment.entries.length),2);
            const valid=JSON.parse(pending);
            await page.reload();
            assert.equal(await page.evaluate(()=>save.factory.miners[0].tier),2);
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMiner('miner:1')),false);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+3600000;testIntervals.find(t=>t.ms===100).callback();});
            const total=await page.evaluate(()=>save.totalOres);
            await page.evaluate(()=>{for(let i=0;i<10;i++)testIntervals.find(t=>t.ms===100).callback();});
            assert.equal(await page.evaluate(()=>save.totalOres),total);
            assert.deepEqual(app.errors,[]);await app.context.close();
            for(const mutate of [
                s=>s.factory.miners[0].investment.entries.pop(),
                s=>s.factory.miners[0].investment.entries[1].cashPaid=1,
                s=>s.factory.miners[0].cycle.effectContext.tier=2,
                s=>s.factory.miners[0].cycle.id='miner:999/cycle:1'
            ]){
                const bad=structuredClone(valid);mutate(bad);const raw=JSON.stringify(bad);
                const invalid=await session(raw);
                assert.equal(await invalid.page.locator('#saveRecovery').isVisible(),true);
                assert.equal(await invalid.page.evaluate(()=>localStorage.getItem('ef_incremental')),raw);
                assert.equal(await invalid.page.evaluate(()=>testIntervals.length),0);
                assert.deepEqual(invalid.errors,[]);await invalid.context.close();
            }
            console.log('PASS Chromium: Tier 2 exact failed-write retry, no duplicate/offline payout and forged investment/cycle recovery.');
        }


        // GAME03: controlled owning fixtures, but earn the Luck price by mining/smelting.
        for(const [width,height,tier] of [[1920,1080,1],[1366,768,2],[390,844,2]]){
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMinerOreLuck('miner:1')),false);
            await page.evaluate(tier=>{
                save.cash=tier===1?450:850;buyMiningPower();unlockDevelopmentMiner();buyDevelopmentMiner();
                if(tier===2)upgradeDevelopmentMiner('miner:1');updateDevelopmentMiner();
            },tier);
            assert.equal(await page.locator('#upgradeMinerOreLuck').isDisabled(),true);
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMinerOreLuck('miner:1')),false);
            await page.evaluate(()=>{
                for(let i=0;i<1000;i++)document.getElementById('mineButton').click();
                for(let i=0;i<100;i++){prepareSmelt('stone',save.stoneValue,1);confirmSmelt();}
            });
            assert.equal(await page.evaluate(()=>save.cash),1000);
            assert.equal(await page.evaluate(()=>save.inventory.stone),0);
            const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            if(width===390){
                await page.evaluate(()=>{window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
                await page.locator('#upgradeMinerOreLuck').click();
                assert.equal(await page.locator('#developmentWriteRecovery').isVisible(),true);
                assert.deepEqual(await page.evaluate(()=>save),before);
                const pending=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
                await page.evaluate(()=>{upgradeDevelopmentMinerOreLuck('miner:1');upgradeDevelopmentMiner('miner:1');testIntervals.find(t=>t.ms===100).callback();});
                assert.equal(await page.evaluate(()=>pendingDevelopmentWrite.serialized),pending);
                await page.evaluate(()=>{Storage.prototype.setItem=realSetItem;});
                await page.locator('#retryDevelopmentWrite').click();
                assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),pending);
            }else await page.locator('#upgradeMinerOreLuck').click();
            const after=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.equal(after.cash,0);assert.equal(after.factory.miners[0].oreLuckLevel,1);
            assert.deepEqual(after.identity,before.identity);
            assert.deepEqual(after.factory.miners[0].cycle,before.factory.miners[0].cycle);
            assert.equal(after.factory.miners[0].tier,tier);
            assert.deepEqual(after.factory.miners[0].investment.entries.at(-1),{kind:'oreLuck',targetLevel:1,cashPaid:1000,basis:'actual'});
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMinerOreLuck('miner:1')),false);
            assert.equal(await page.locator('#upgradeMinerOreLuck').isDisabled(),true);
            assert.match(await page.locator('#minerOreLuckStatus').textContent(),/1.*50.*1.02×.*Current cycle: Level 0/);
            await page.reload();
            assert.deepEqual(await page.evaluate(()=>save.factory.miners[0]),after.factory.miners[0]);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+2000;renderDevelopmentMiner();scrollTo(0,0);});
            if(process.env.TEFI_UI_SCREENSHOTS){
                fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});
                await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'ore-luck-old-cycle-'+width+'.png'),fullPage:true});
            }
            const ids=await page.evaluate(()=>{
                const roll=(MinerOreLuckModel.getOreProbabilities(1,0,0)[0].probability+MinerOreLuckModel.getOreProbabilities(1,0,1)[0].probability)/2;
                return [MinerOreLuckModel.selectOreId(1,0,0,roll),MinerOreLuckModel.selectOreId(1,0,1,roll)];
            });assert.notEqual(ids[0],ids[1]);
            async function completeOreCycle(){
                await page.evaluate(()=>{
                    const c=save.factory.miners[0].cycle,p=MinerTierModel.getTierProbabilities(c.effectContext.tier,1);
                    const oreRoll=(MinerOreLuckModel.getOreProbabilities(1,0,0)[0].probability+MinerOreLuckModel.getOreProbabilities(1,0,1)[0].probability)/2;
                    let call=0;Math.random=()=>++call%2?p.stone+p.tier1/2:oreRoll;
                    testNow=c.startedAtMs+c.durationMs;testIntervals.find(t=>t.ms===100).callback();
                });
            }
            await completeOreCycle();
            assert.equal(await page.evaluate(id=>save.inventory[id],ids[0]),1);
            assert.equal(await page.evaluate(id=>save.inventory[id],ids[1]),0);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.effectContext.localOreLuckLevel),1);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.durationMs),before.factory.miners[0].cycle.durationMs);
            await page.reload();await completeOreCycle();
            assert.equal(await page.evaluate(id=>save.inventory[id],ids[1]),1);
            assert.equal(await page.evaluate(()=>save.totalOres),1002);
            assert.equal(await page.evaluate(()=>save.tier4Ores),0);
            assert.equal(await page.evaluate(()=>save.achievementStats.totalOresMined),1000);
            // Resolved saved output recovers verbatim even with Level 0 context and Level 1 owner.
            await page.evaluate(()=>{
                const c=save.factory.miners[0].cycle;c.effectContext.localOreLuckLevel=0;c.phase='resolved';c.result=minerResult('ruby');saveGame();
            });
            await page.reload();assert.equal(await page.evaluate(()=>save.inventory.ruby),1);
            await page.reload();assert.equal(await page.evaluate(()=>save.inventory.ruby),1);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+3600000;testIntervals.find(t=>t.ms===100).callback();});
            const total=await page.evaluate(()=>save.totalOres);
            await page.evaluate(()=>{for(let i=0;i<10;i++)testIntervals.find(t=>t.ms===100).callback();});
            assert.equal(await page.evaluate(()=>save.totalOres),total);
            await page.evaluate(()=>{testNow+=2000;renderDevelopmentMiner();scrollTo(0,0);});
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
            if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'ore-luck-'+width+'.png'),fullPage:true});
            const valid=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.deepEqual(app.errors,[]);await app.context.close();
            if(width===390)for(const mutate of [
                s=>s.factory.miners[0].investment.entries.pop(),
                s=>s.factory.miners[0].investment.entries.at(-1).cashPaid=999,
                s=>s.factory.miners[0].cycle.effectContext.localOreLuckLevel=2
            ]){
                const bad=structuredClone(valid);mutate(bad);const raw=JSON.stringify(bad),invalid=await session(raw);
                assert.equal(await invalid.page.locator('#saveRecovery').isVisible(),true);
                assert.equal(await invalid.page.evaluate(()=>localStorage.getItem('ef_incremental')),raw);
                assert.deepEqual(invalid.errors,[]);await invalid.context.close();
            }
            console.log('PASS Chromium: Local Ore Luck I on Tier '+tier+', earned Cash, active binding, deterministic ore change, reload/retry at '+width+'x'+height+'.');
        }


        // GAME05: use real purchase handlers for ownership; earn the full Luck II price by mining/smelting.
        for(const [width,height,tier] of [[1920,1080,1],[1366,768,2],[390,844,3]]){
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.evaluate(tier=>{
                save.cash=1450+(tier>=2?400:0)+(tier>=3?1600:0);
                buyMiningPower();unlockDevelopmentMiner();buyDevelopmentMiner();upgradeDevelopmentMinerOreLuck('miner:1');
                for(let t=1;t<tier;t++)upgradeDevelopmentMiner('miner:1');updateDevelopmentMiner();
            },tier);
            assert.equal(await page.locator('#upgradeMinerOreLuck').textContent(),'Upgrade Local Ore Luck II · $1,250');
            assert.equal(await page.locator('#upgradeMinerOreLuck').isDisabled(),true);
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMinerOreLuck('miner:1')),false);
            await page.evaluate(()=>{
                for(let i=0;i<1250;i++)document.getElementById('mineButton').click();
                for(let i=0;i<125;i++){prepareSmelt('stone',save.stoneValue,1);confirmSmelt();}
            });
            assert.equal(await page.evaluate(()=>save.cash),1250);
            const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMinerOreLuck('miner:999')),false);
            if(width===390){
                await page.evaluate(()=>{window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
                await page.locator('#upgradeMinerOreLuck').click();assert.equal(await page.locator('#developmentWriteRecovery').isVisible(),true);
                const pending=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
                await page.evaluate(()=>{mineOre();upgradeDevelopmentMinerOreLuck('miner:1');upgradeDevelopmentMiner('miner:1');testIntervals.find(t=>t.ms===100).callback();});
                assert.deepEqual(await page.evaluate(()=>save),before);assert.equal(await page.evaluate(()=>pendingDevelopmentWrite.serialized),pending);
                await page.evaluate(()=>{Storage.prototype.setItem=realSetItem;});await page.locator('#retryDevelopmentWrite').click();
                assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),pending);
            }else await page.locator('#upgradeMinerOreLuck').click();
            const after=await page.evaluate(()=>JSON.parse(JSON.stringify(save))),expected=structuredClone(before);
            expected.cash-=1250;expected.factory.miners[0].oreLuckLevel=2;
            expected.factory.miners[0].investment.entries.push({kind:'oreLuck',targetLevel:2,cashPaid:1250,basis:'actual'});
            assert.deepEqual(after,expected);
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMinerOreLuck('miner:1')),false);
            assert.equal(await page.locator('#upgradeMinerOreLuck').isDisabled(),true);
            assert.match(await page.locator('#minerOreLuckStatus').textContent(),/2 \/ 50 \(1.04×\).*Current cycle: Level 1/);
            await page.reload();assert.deepEqual(await page.evaluate(()=>save.factory.miners[0]),after.factory.miners[0]);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+2000;renderDevelopmentMiner();scrollTo(0,0);});
            if(process.env.TEFI_UI_SCREENSHOTS){fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'luck2-old-cycle-'+width+'.png'),fullPage:true});}
            const ids=await page.evaluate(()=>{
                const roll=(MinerOreLuckModel.getOreProbabilities(1,0,1)[0].probability+MinerOreLuckModel.getOreProbabilities(1,0,2)[0].probability)/2;
                return [MinerOreLuckModel.selectOreId(1,0,1,roll),MinerOreLuckModel.selectOreId(1,0,2,roll)];
            });assert.notEqual(ids[0],ids[1]);
            async function completeLuckCycle(){
                await page.evaluate(()=>{
                    const c=save.factory.miners[0].cycle,p=MinerTierModel.getTierProbabilities(c.effectContext.tier,1);
                    const roll=(MinerOreLuckModel.getOreProbabilities(1,0,1)[0].probability+MinerOreLuckModel.getOreProbabilities(1,0,2)[0].probability)/2;
                    window.rngCalls=0;Math.random=()=>++rngCalls%2?p.stone+p.tier1/2:roll;
                    testNow=c.startedAtMs+c.durationMs;testIntervals.find(t=>t.ms===100).callback();
                });assert.equal(await page.evaluate(()=>rngCalls),2);
            }
            await completeLuckCycle();assert.equal(await page.evaluate(id=>save.inventory[id],ids[0]),1);assert.equal(await page.evaluate(id=>save.inventory[id],ids[1]),0);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.effectContext.localOreLuckLevel),2);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.durationMs),before.factory.miners[0].cycle.durationMs);
            await page.reload();await completeLuckCycle();assert.equal(await page.evaluate(id=>save.inventory[id],ids[1]),1);
            assert.equal(await page.evaluate(()=>save.totalOres),1252);assert.equal(await page.evaluate(()=>save.achievementStats.totalOresMined),1250);
            assert.equal(await page.evaluate(()=>save.tier4Ores),0);
            await page.evaluate(()=>{const c=save.factory.miners[0].cycle;c.effectContext.localOreLuckLevel=0;c.phase='resolved';c.result=minerResult('ruby');saveGame();});
            await page.reload();assert.equal(await page.evaluate(()=>save.inventory.ruby),1);await page.reload();assert.equal(await page.evaluate(()=>save.inventory.ruby),1);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+3600000;testIntervals.find(t=>t.ms===100).callback();});
            const total=await page.evaluate(()=>save.totalOres);
            await page.evaluate(()=>{for(let i=0;i<10;i++)testIntervals.find(t=>t.ms===100).callback();testNow+=2000;renderDevelopmentMiner();scrollTo(0,0);});
            assert.equal(await page.evaluate(()=>save.totalOres),total);
            assert.match(await page.locator('#minerOreLuckStatus').textContent(),/2 \/ 50 \(1.04×\)/);
            assert.match(await page.locator('#upgradeMinerOreLuck').textContent(),/Upgrade Local Ore Luck 3/);
            const layout=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {overflow:document.documentElement.scrollWidth>innerWidth,duplicate:ids.length!==new Set(ids).size};});
            assert.deepEqual(layout,{overflow:false,duplicate:false});assert.deepEqual(app.errors,[]);
            if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'luck2-'+width+'.png'),fullPage:true});
            const valid=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));await app.context.close();
            if(width===390)for(const mutate of [
                s=>s.factory.miners[0].investment.entries.splice(1,1),
                s=>{const e=s.factory.miners[0].investment.entries;[e[1],e[4]]=[e[4],e[1]];},
                s=>s.factory.miners[0].investment.entries.at(-1).cashPaid=1249,
                s=>s.factory.miners[0].oreLuckLevel=3
            ]){const bad=structuredClone(valid);mutate(bad);const raw=JSON.stringify(bad),invalid=await session(raw);assert.equal(await invalid.page.locator('#saveRecovery').isVisible(),true);assert.equal(await invalid.page.evaluate(()=>localStorage.getItem('ef_incremental')),raw);assert.deepEqual(invalid.errors,[]);await invalid.context.close();}
            console.log('PASS Chromium: Luck II on Tier '+tier+', earned Cash, bound ore selection, reload/retry and UI at '+width+'x'+height+'.');
        }

        // GAME04: an owned Tier 2 fixture, then earn the entire Tier 3 price through gameplay.
        for(const [width,height,luck] of [[1920,1080,0],[1366,768,1],[390,844,1]]){
            const app=await session(null),{page}=app;await page.setViewportSize({width,height});
            await page.evaluate(luck=>{
                save.cash=850+1000*luck;buyMiningPower();unlockDevelopmentMiner();buyDevelopmentMiner();
                upgradeDevelopmentMiner('miner:1');if(luck)upgradeDevelopmentMinerOreLuck('miner:1');
                updateDevelopmentMiner();
            },luck);
            assert.match(await page.locator('#upgradeMiner').textContent(),/Upgrade to Tier 3/);
            assert.equal(await page.locator('#upgradeMiner').textContent(),await page.evaluate(()=>'Upgrade to Tier 3 · $'+formatCash(MinerTierModel.getTierUpgradePrice(3,0))));
            assert.equal(await page.locator('#upgradeMiner').isDisabled(),true);
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMiner('miner:1')),false);
            await page.evaluate(()=>{
                for(let i=0;i<1600;i++)document.getElementById('mineButton').click();
                for(let i=0;i<160;i++){prepareSmelt('stone',save.stoneValue,1);confirmSmelt();}
            });
            assert.equal(await page.evaluate(()=>save.cash),1600);
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMiner('miner:999')),false);
            const before=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            if(width===390){
                await page.evaluate(()=>{window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
                await page.locator('#upgradeMiner').click();
                assert.deepEqual(await page.evaluate(()=>save),before);
                assert.equal(await page.locator('#developmentWriteRecovery').isVisible(),true);
                const pending=await page.evaluate(()=>pendingDevelopmentWrite.serialized);
                await page.evaluate(()=>{upgradeDevelopmentMiner('miner:1');upgradeDevelopmentMinerOreLuck('miner:1');testIntervals.find(t=>t.ms===100).callback();});
                assert.equal(await page.evaluate(()=>pendingDevelopmentWrite.serialized),pending);
                await page.evaluate(()=>{Storage.prototype.setItem=realSetItem;});
                await page.locator('#retryDevelopmentWrite').click();
                assert.equal(await page.evaluate(()=>localStorage.getItem('ef_incremental')),pending);
            }else await page.locator('#upgradeMiner').click();
            const after=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.equal(after.cash,0);assert.equal(after.factory.miners[0].tier,3);
            assert.equal(after.factory.miners[0].oreLuckLevel,luck);
            assert.deepEqual(after.identity,before.identity);
            assert.equal(after.factory.miners[0].id,before.factory.miners[0].id);
            assert.equal(after.factory.miners[0].slot,1);
            assert.deepEqual(after.factory.miners[0].cycle,before.factory.miners[0].cycle);
            assert.equal(after.factory.miners[0].nextCycleSequence,before.factory.miners[0].nextCycleSequence);
            assert.deepEqual(after.factory.miners[0].investment.entries.at(-1),{kind:'tier',targetLevel:3,cashPaid:1600,basis:'actual'});
            assert.equal(await page.evaluate(()=>upgradeDevelopmentMiner('miner:1')),false);
            assert.match(await page.locator('#upgradeMiner').textContent(),/Upgrade to Tier 4/);
            assert.equal(await page.locator('#upgradeMiner').isDisabled(),true);
            await page.reload();
            assert.deepEqual(await page.evaluate(()=>save.factory.miners[0]),after.factory.miners[0]);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+2400;renderDevelopmentMiner();scrollTo(0,0);});
            assert.match(await page.locator('#minerCycleStatus').textContent(),/Tier 2.*4.8s/);
            if(process.env.TEFI_UI_SCREENSHOTS){
                fs.mkdirSync(process.env.TEFI_UI_SCREENSHOTS,{recursive:true});
                await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'tier3-old-cycle-'+width+'.png'),fullPage:true});
            }
            await page.evaluate(()=>{
                Math.random=()=>0.94;const c=save.factory.miners[0].cycle;testNow=c.startedAtMs+c.durationMs;
                testIntervals.find(t=>t.ms===100).callback();
            });
            assert.equal(await page.evaluate(()=>save.inventory.stone),1);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.effectContext.tier),3);
            assert.equal(await page.evaluate(()=>save.factory.miners[0].cycle.durationMs),4608);
            await page.reload();
            await page.evaluate(()=>{Math.random=()=>0.94;testNow=save.factory.miners[0].cycle.startedAtMs+4607;testIntervals.find(t=>t.ms===100).callback();});
            assert.equal(await page.evaluate(()=>save.totalOres),1601);
            await page.evaluate(()=>{testNow++;testIntervals.find(t=>t.ms===100).callback();});
            assert.equal(await page.evaluate(()=>save.inventory[MinerOreLuckModel.selectOreId(1,0,save.factory.miners[0].oreLuckLevel,0.94)]),1);
            assert.equal(await page.evaluate(()=>save.totalOres),1602);
            assert.equal(await page.evaluate(()=>save.tier4Ores),0);
            assert.equal(await page.evaluate(()=>save.achievementStats.totalOresMined),1600);
            await page.evaluate(()=>{
                const c=save.factory.miners[0].cycle;c.phase='resolved';c.result=minerResult('ruby');saveGame();
            });
            await page.reload();assert.equal(await page.evaluate(()=>save.inventory.ruby),1);
            await page.reload();assert.equal(await page.evaluate(()=>save.inventory.ruby),1);
            await page.evaluate(()=>{testNow=save.factory.miners[0].cycle.startedAtMs+3600000;testIntervals.find(t=>t.ms===100).callback();});
            const total=await page.evaluate(()=>save.totalOres);
            await page.evaluate(()=>{for(let i=0;i<10;i++)testIntervals.find(t=>t.ms===100).callback();testNow+=2304;renderDevelopmentMiner();scrollTo(0,0);});
            assert.equal(await page.evaluate(()=>save.totalOres),total);
            const layout=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {overflow:document.documentElement.scrollWidth>innerWidth,duplicate:ids.length!==new Set(ids).size};});
            assert.deepEqual(layout,{overflow:false,duplicate:false});
            assert.match(await page.locator('#minerCycleStatus').textContent(),/Tier 3.*4.608s/);
            if(process.env.TEFI_UI_SCREENSHOTS)await page.screenshot({path:path.join(process.env.TEFI_UI_SCREENSHOTS,'tier3-'+width+'.png'),fullPage:true});
            const valid=await page.evaluate(()=>JSON.parse(JSON.stringify(save)));
            assert.deepEqual(app.errors,[]);await app.context.close();
            if(width===390)for(const mutate of [
                s=>s.factory.miners[0].investment.entries.splice(1,1),
                s=>s.factory.miners[0].investment.entries.at(-1).cashPaid=1599,
                s=>s.factory.miners[0].tier=4
            ]){
                const bad=structuredClone(valid);mutate(bad);const raw=JSON.stringify(bad),invalid=await session(raw);
                assert.equal(await invalid.page.locator('#saveRecovery').isVisible(),true);
                assert.equal(await invalid.page.evaluate(()=>localStorage.getItem('ef_incremental')),raw);
                assert.deepEqual(invalid.errors,[]);await invalid.context.close();
            }
            console.log('PASS Chromium: Tier 3 with Luck '+luck+', earned Cash, preserved Tier 2, model output, reload/retry at '+width+'x'+height+'.');
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
            await page.waitForFunction(() => typeof save !== 'undefined' && save.cash === 0);
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

