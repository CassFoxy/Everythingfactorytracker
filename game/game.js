function generateMilestones(){

    const milestones = [];

    // Early Game

    milestones.push(
        10,
        25,
        50,
        75,
        100
    );

    // Mid Game

    for(
        let level = 150;
        level <= 1000;
        level += 50
    ){

        milestones.push(level);

    }

    // Late Game

    for(
        let level = 1100;
        level <= 10000;
        level += 100
    ){

        milestones.push(level);

    }

    return milestones;

}

const FACTORY_MILESTONES =
    generateMilestones();

const ACHIEVEMENTS = {

firstSwing: {

    category: "⛏ Mining",

    name: "First Swing",

    description: "Mine your first stone.",

    type: "stat",

stat: "totalOresMined",

    target: 1,

reward:{
    type:null,
    value:0
}

},

stoneMiner: {

    category: "⛏ Mining",

name: "Ore Miner",
    
description: "Mine 100 ores.",

    type: "stat",

stat: "totalOresMined",

    target: 100,

reward:{
    type:null,
    value:0
}

},

dedicatedMiner: {

    category: "⛏ Mining",

name: "Dedicated Miner",
    
description: "Mine 1,000 ores.",

    type: "stat",

stat: "totalOresMined",

    target: 1000,

reward:{
    type:null,
    value:0
}

},
firstDiscovery: {

    category: "📖 Collection",

    name: "Shiny!",

    description: "Discover your first ore.",

    type: "stat",

    stat: "oresDiscovered",

    target: 1,

reward:{
    type:null,
    value:0
}

},

firstSmelt: {

    category: "🔥 Furnace",

    name: "First Smelt",

    description: "Smelt an ore.",

    type: "stat",

    stat: "oresSmelted",

    target: 1,

reward:{
    type:null,
    value:0
}

},

factoryOwner: {

    category: "🏭 Factory",

    name: "Factory Owner",

    description: "Reach Factory Level 10.",

    type: "level",

    target: 10,

reward:{
    type:null,
    value:0
}

},

};

function createDefaultMilestones(){

    const milestones = {};

    FACTORY_MILESTONES.forEach(level => {

        milestones[level] = false;

    });

    return milestones;

}
// Save schema versions are independent of game and design versions.
// Version 0 is the legacy unversioned format. Schema 1 also hosts the explicit
// private miner-1 profile; this is not the complete V2 state.
const SAVE_VERSION = 1;
const SAVE_KEY = "ef_incremental";
let save;
let gameStarted = false;
const recoveryState = { active: false, hasRaw: false, raw: null, error: null };

function saveLoadError(code, message, cause){
    const error = new Error(message);
    error.code = code;
    error.cause = cause;
    return error;
}

function showSaveRecovery(error){
    recoveryState.active = true;
    recoveryState.error = error;
    document.getElementById("gameRoot").hidden = true;
    document.getElementById("gameRoot").inert = true;
    document.getElementById("saveRecovery").hidden = false;

    const reasons = {
        DEVELOPMENT_INCOMPATIBLE: "This is an incompatible development save. Export it below, or confirm Start Fresh to use this build.",
        PARSE_ERROR: "The saved text could not be read.",
        VERSION_ERROR: "This save version is not supported by this game.",
        MIGRATION_ERROR: "The save could not be upgraded safely.",
        VALIDATION_ERROR: "The save contains missing or invalid data.",
        STORAGE_READ_ERROR: "Browser storage could not be accessed.",
        STORAGE_REMOVE_ERROR: "The browser could not remove the save. It has not been reset.",
        STORAGE_CHANGED: "The stored save has changed. Export this copy, then reload the page to use the latest save.",
        LOAD_ERROR: "The save could not be loaded safely."
    };
    document.getElementById("recoveryReason").textContent =
        reasons[error.code] || reasons.LOAD_ERROR;
    document.getElementById("recoveryPreserved").textContent = recoveryState.hasRaw
        ? "Your original save has been preserved. Gameplay and autosave are stopped."
        : "No save data has been changed. Retry when browser storage is available.";
    const canExport = recoveryState.hasRaw && recoveryState.raw !== null;
    document.getElementById("exportRawSave").disabled = !canExport;
    document.getElementById("resetRecoverySave").disabled = !recoveryState.hasRaw;
    document.getElementById("recoveryStatus").textContent = "";
    document.getElementById("recoveryTitle").focus();
}

function readRecoveryStorage(){
    try{
        return localStorage.getItem(SAVE_KEY);
    }catch(error){
        throw saveLoadError("STORAGE_READ_ERROR", "Unable to read browser storage.", error);
    }
}

function checkPreservedSave(){
    const raw = readRecoveryStorage();
    if(recoveryState.hasRaw && raw !== recoveryState.raw){
        throw saveLoadError("STORAGE_CHANGED", "Stored save changed during recovery.");
    }
    return raw;
}

function attemptSaveLoad(){
    if(gameStarted) return true;
    let loaded;
    try{
        const raw = checkPreservedSave();
        if(!recoveryState.hasRaw){
            recoveryState.raw = raw;
            recoveryState.hasRaw = true;
        }
        loaded = readVersionedSave(recoveryState.raw);
    }catch(error){
        showSaveRecovery(error?.code ? error : saveLoadError("LOAD_ERROR", "Save loading failed.", error));
        return false;
    }

    return startLoadedGame(loaded);
}

function startLoadedGame(loaded){
    if(gameStarted) return true;
    // Only successful loading or a confirmed reset may activate the game.
    initializeGameState(loaded);
    restoreAutoFurnace();
    updateUI();
    recoveryState.active = false;
    recoveryState.error = null;
    gameStarted = true;
    document.getElementById("saveRecovery").hidden = true;
    document.getElementById("gameRoot").hidden = false;
    document.getElementById("gameRoot").inert = false;
    startGameplay();
    if(isMinerDevelopment()) updateDevelopmentMiner();
    return true;
}

function getRecoveryRawSave(){
    return recoveryState.hasRaw ? recoveryState.raw : null;
}

function exportRecoverySave(){
    if(!recoveryState.active && !gameStarted) return;
    const statusId = recoveryState.active ? "recoveryStatus" : isMinerDevelopment() ? "devFeedback" : "legacyExportStatus";
    let url;
    try{
        const raw = recoveryState.active ? getRecoveryRawSave() : localStorage.getItem(SAVE_KEY);
        if(raw === null) return;
        url = URL.createObjectURL(new Blob([raw], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "tefi-original-save.txt";
        document.body.appendChild(link);
        link.click();
        link.remove();
        // Allow the browser to begin the download before releasing its URL.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        document.getElementById(statusId).textContent =
            "Download requested. Keep the file before choosing Start fresh.";
    }catch(error){
        if(url) URL.revokeObjectURL(url);
        document.getElementById(statusId).textContent =
            "The download could not start. Your save is unchanged. Please try again.";
    }
}

function resetRecoverySave(){
    if(!recoveryState.active || !recoveryState.hasRaw) return false;
    if(!confirm("Start fresh? This removes your stored save and all its progress. Download the original save first. Continue?")){
        return false;
    }
    try{
        // Recheck after confirmation: another tab may have saved in the meantime.
        checkPreservedSave();
        try{
            localStorage.removeItem(SAVE_KEY);
        }catch(error){
            throw saveLoadError("STORAGE_REMOVE_ERROR", "Unable to remove browser save.", error);
        }
    }catch(error){
        showSaveRecovery(error);
        return false;
    }
    return startLoadedGame(null);
}



// Definitions must be available before validating a stored furnace tier/batch.
const FURNACES = [

{
    name: "Starter Furnace",
    capacity: 10,
    cost: 0
},

{
    name: "Basic Furnace",
    capacity: 50,
    cost: 500
},

{
    name: "Auto Furnace",
    capacity: 10000,
    cost: 2500
}

];


function validateSaveData(data){

    function invalid(path, requirement){
        throw saveLoadError("VALIDATION_ERROR", "Invalid save: " + path + " " + requirement + ". Stored data was not changed.");
    }

    const owns = (object, key) =>
        Object.prototype.hasOwnProperty.call(object, key);

    function record(value, path){
        if(value === null || typeof value !== "object" || Array.isArray(value))
            invalid(path, "must be an object");
    }

    function number(value, path, minimum = 0, integer = false){
        if(typeof value !== "number" || !Number.isFinite(value) ||
            value < minimum || (integer && !Number.isInteger(value)))
            invalid(path, "must be a finite " + (integer ? "integer " : "number ") + ">= " + minimum);
    }

    function boolean(value, path){
        if(typeof value !== "boolean")
            invalid(path, "must be a Boolean");
    }

    function string(value, path){
        if(typeof value !== "string" || value.length === 0)
            invalid(path, "must be a nonempty string");
    }

    // Only absence uses the established defaults below. Explicit null is invalid:
    // JSON serialisation also turns NaN/Infinity into null.
    function optional(object, key, check, path = key){
        if(owns(object, key)) check(object[key], path);
    }

    record(data, "save");
    if(data.saveVersion !== SAVE_VERSION)
        invalid("saveVersion", "must be the supported version");

    // These fields have no established legacy missing-field default.
    for(const key of ["cash", "droppers", "adders", "multipliers"]){
        number(data[key], key, 0, key !== "cash");
    }

    for(const key of ["factoryXP", "totalOres", "stoneOres",
        "tier1Ores", "tier2Ores", "tier3Ores", "tier4Ores"]){
        optional(data, key, (value, path) => number(value, path, 0, true));
    }
    optional(data, "factoryLevel", (value, path) => number(value, path, 0, true));
    for(const key of ["lastOreValue", "stoneValue"])
        optional(data, key, number);
    optional(data, "lastOre", string);
    optional(data, "furnaceTier", (value, path) => {
        number(value, path, 0, true);
        if(value >= FURNACES.length) invalid(path, "must identify an existing furnace");
    });

    function countMap(key, ids){
        optional(data, key, (value, path) => {
            record(value, path);
            for(const [id, count] of Object.entries(value)){
                if(!ids.includes(id)) invalid(path + "." + id, "has an unknown resource ID");
                number(count, path + "." + id, 0, true);
            }
        });
    }
    countMap("inventory", ["stone", ...ORE_KEYS]);
    countMap("oreCollection", ORE_KEYS);

    optional(data, "factoryMilestones", (value, path) => {
        record(value, path);
        const ids = FACTORY_MILESTONES.map(String);
        for(const [id, unlocked] of Object.entries(value)){
            if(!ids.includes(id)) invalid(path + "." + id, "has an unknown milestone ID");
            boolean(unlocked, path + "." + id);
        }
    });

    optional(data, "achievements", (value, path) => {
        record(value, path);
        for(const [id, achievement] of Object.entries(value)){
            const entryPath = path + "." + id;
            if(!owns(ACHIEVEMENTS, id)) invalid(entryPath, "has an unknown achievement ID");
            if(typeof achievement === "boolean") continue; // Existing legacy conversion.
            record(achievement, entryPath);
            boolean(achievement.unlocked, entryPath + ".unlocked");
            boolean(achievement.claimed, entryPath + ".claimed");
            if(achievement.claimed && !achievement.unlocked)
                invalid(entryPath, "cannot be claimed while locked");
        }
    });

    optional(data, "achievementStats", (value, path) => {
        record(value, path);
        for(const [id, count] of Object.entries(value))
            number(count, path + "." + id, 0, true);
        if(value.oresDiscovered > ORE_KEYS.length)
            invalid(path + ".oresDiscovered", "exceeds the base ore catalogue");
    });

    for(const key of ["permanentBonuses", "cycleBonuses"]){
        optional(data, key, (value, path) => {
            record(value, path);
            for(const [id, bonus] of Object.entries(value)){
                // Scaffolding has no approved caps/sign rules. Do not invent them.
                if(typeof bonus !== "number" || !Number.isFinite(bonus))
                    invalid(path + "." + id, "must be a finite number");
            }
        });
    }

    optional(data, "cosmetics", (value, path) => {
        record(value, path);
        optional(value, "unlocked", (unlocked, nestedPath) => {
            record(unlocked, nestedPath);
            for(const [id, flag] of Object.entries(unlocked)){
                string(id, nestedPath + " ID");
                boolean(flag, nestedPath + "." + id);
            }
        }, path + ".unlocked");
        optional(value, "equipped", (equipped, nestedPath) => {
            record(equipped, nestedPath);
            for(const [slot, id] of Object.entries(equipped)){
                string(slot, nestedPath + " slot");
                string(id, nestedPath + "." + slot);
            }
        }, path + ".equipped");
        // No cosmetic catalogue/equip policy exists yet; preserve string IDs.
    });

    optional(data, "autoFurnaceEnabled", boolean);
    optional(data, "autoFurnaceMode", (value, path) => {
        if(!["stoneOnly", "oresOnly", "oresStone"].includes(value))
            invalid(path, "must be an existing smelting mode");
    });
    optional(data, "autoFurnaceBatchMode", (value, path) => {
        if(!["available", "full"].includes(value))
            invalid(path, "must be an existing batch mode");
    });
    optional(data, "autoFurnaceStartTime", (value, path) => {
        number(value, path, 0, true);
        if(!Number.isSafeInteger(value) || value > 8640000000000000)
            invalid(path, "must be a representable timestamp");
    });

    const batch = owns(data, "autoFurnaceBatch") ? data.autoFurnaceBatch : [];
    if(!Array.isArray(batch)) invalid("autoFurnaceBatch", "must be an array");
    let amount = 0;
    let payout = 0;
    const seen = new Set();
    for(const [index, item] of batch.entries()){
        const path = "autoFurnaceBatch[" + index + "]";
        record(item, path);
        if(item.key !== "stone" && !ORE_KEYS.includes(item.key))
            invalid(path + ".key", "must identify an existing resource");
        if(seen.has(item.key)) invalid(path + ".key", "duplicates a batch resource");
        seen.add(item.key);
        number(item.amount, path + ".amount", 1, true);
        number(item.value, path + ".value");
        for(const label of ["name", "emoji"]){
            string(item[label], path + "." + label);
            // Current batch labels enter innerHTML; reject markup, not player progress.
            if(item[label].includes("<")) invalid(path + "." + label, "must be plain text");
        }
        amount += item.amount;
        payout += item.amount * item.value;
    }
    if(amount > FURNACES[2].capacity)
        invalid("autoFurnaceBatch", "exceeds Auto Furnace capacity");
    const startTime = data.autoFurnaceStartTime ?? 0;
    if(batch.length > 0){
        if((data.furnaceTier ?? 0) !== 2 || startTime <= 0)
            invalid("autoFurnaceBatch", "requires an Auto Furnace and a positive start timestamp");
        if(!Number.isFinite(payout) || !Number.isFinite(data.cash + payout))
            invalid("autoFurnaceBatch", "would produce a non-finite payout");
    }else if(startTime !== 0){
        invalid("autoFurnaceStartTime", "must be zero for an empty batch");
    }
    // Do not compare batch values/modes to current inventory or upgrades:
    // resources were reserved earlier, and modes/upgrades may change mid-cycle.
}


// Each key is the source version. A step must return the next version only.
const SAVE_MIGRATIONS = {
    0: data => ({ ...data, saveVersion: 1 })
};

// Parsed saves contain only JSON values. Unlike stringify/parse, this preserves
// non-finite parsed numbers for the validator to reject, rather than coercing them.
function copySaveData(value){
    if(value === null || typeof value !== "object") return value;
    if(Array.isArray(value)) return value.map(copySaveData);
    return Object.fromEntries(
        Object.entries(value).map(([key, child]) => [key, copySaveData(child)])
    );
}

function migrateSaveData(data, targetVersion = SAVE_VERSION, migrations = SAVE_MIGRATIONS){

    if(data === null || typeof data !== "object" || Array.isArray(data)){
        throw saveLoadError("VALIDATION_ERROR", "Invalid save: expected a player-state object. Stored data was not changed.");
    }

    let version = Object.prototype.hasOwnProperty.call(data, "saveVersion")
        ? data.saveVersion
        : 0;

    if(!Number.isSafeInteger(version) || version < 0){
        throw saveLoadError("VERSION_ERROR", "Invalid saveVersion. Stored data was not changed.");
    }
    if(!Number.isSafeInteger(targetVersion) || targetVersion < 0){
        throw saveLoadError("MIGRATION_ERROR", "Invalid migration target version. Stored data was not changed.");
    }
    if(version > targetVersion){
        throw saveLoadError("VERSION_ERROR", "This save requires a newer game version. Stored data was not changed.");
    }

    // Even an in-place migration must not mutate the caller's parsed object.
    let migrated = copySaveData(data);
    while(version < targetVersion){
        const nextVersion = version + 1;
        const step = Object.prototype.hasOwnProperty.call(migrations, version)
            ? migrations[version]
            : undefined;
        if(typeof step !== "function"){
            throw saveLoadError("MIGRATION_ERROR", "Missing save migration " + version + " -> " + nextVersion +
                ". Stored data was not changed.");
        }

        let result;
        try{
            result = step(migrated);
        }catch(error){
            throw saveLoadError("MIGRATION_ERROR", "Save migration " + version + " -> " + nextVersion +
                " failed: " + (error instanceof Error ? error.message : String(error)) +
                ". Stored data was not changed.");
        }
        if(result === null || typeof result !== "object" || Array.isArray(result) ||
            !Object.prototype.hasOwnProperty.call(result, "saveVersion") ||
            result.saveVersion !== nextVersion){
            throw saveLoadError("MIGRATION_ERROR", "Save migration " + version + " -> " + nextVersion +
                " must return an object with saveVersion " + nextVersion +
                ". Stored data was not changed.");
        }
        migrated = result;
        version = nextVersion;
    }
    return migrated;
}

function readVersionedSave(serializedSave){

    if(serializedSave === null)
        return null;

    let parsed;
    try{
        parsed = JSON.parse(serializedSave);
    }catch(error){
        throw saveLoadError("PARSE_ERROR", "Invalid save JSON. Stored data was not changed.", error);
    }
    let migrated;
    try{
        migrated = migrateSaveData(parsed);
    }catch(error){
        throw error?.code ? error : saveLoadError("MIGRATION_ERROR", "Save migration failed. Stored data was not changed.", error);
    }
    try{
        validateSaveData(migrated);
        completeDevelopmentPolisherFields(migrated);
        validateDevelopmentSave(migrated);
    }catch(error){
        throw error?.code ? error : saveLoadError("VALIDATION_ERROR", "Save validation failed. Stored data was not changed.", error);
    }
    return migrated;

}

// Canonical current-schema state. Every call owns its nested objects and arrays.
// Resource and milestone maps follow their existing catalogues.
function createDefaultSave(){
    function createBonuses(){
        return {
            oreValue: 0, dropperSpeed: 0, adderPower: 0, multiplierPower: 0,
            duplicateChance: 0, furnaceCapacity: 0, factoryXP: 0, miningLuck: 0,
            allLuck: 0, allIncome: 0, smeltSpeed: 0
        };
    }
    return {
        saveVersion: SAVE_VERSION,
        cash: 0,
        factoryLevel: 0,
        factoryXP: 0,
        droppers: 0,
        adders: 0,
        multipliers: 0,
        furnaceTier: 0,
        totalOres: 0,
        stoneOres: 0,
        tier1Ores: 0,
        tier2Ores: 0,
        tier3Ores: 0,
        tier4Ores: 0,
        lastOre: "None",
        lastOreValue: 0,
        stoneValue: 1,
        inventory: createDefaultInventory(),
        oreCollection: createDefaultCollection(),
        factoryMilestones: createDefaultMilestones(),
        achievementStats: { totalOresMined: 0, oresDiscovered: 0, oresSmelted: 0 },
        achievements: {},
        permanentBonuses: createBonuses(),
        cycleBonuses: createBonuses(),
        cosmetics: {
            unlocked: { default: true },
            equipped: { dropper: "default", adder: "default", multiplier: "default", furnace: "default" }
        },
        autoFurnaceBatch: [],
        autoFurnaceEnabled: true,
        autoFurnaceStartTime: 0,
        autoFurnaceMode: "oresStone",
        autoFurnaceBatchMode: "available"
    };
}

// Internal post-validation step: never use defaults to repair invalid values.
// Required cash/machine fields have already passed validateSaveData.
function completeValidatedSave(validatedSave){
    const completed = copySaveData(validatedSave);
    const defaults = createDefaultSave();
    // Existing saves missing XP retain their established fallback, distinct from fresh XP 0.
    defaults.factoryXP = 100;

    function fillMissing(target, source){
        for(const [key, value] of Object.entries(source)){
            if(!Object.prototype.hasOwnProperty.call(target, key)){
                target[key] = copySaveData(value);
            }else if(value !== null && typeof value === "object" && !Array.isArray(value)){
                fillMissing(target[key], value);
            }
        }
    }
    fillMissing(completed, defaults);
    // DEV01: only an absent optional setting defaults off after validation.
    if(isMinerDevelopment(completed) && !Object.hasOwn(completed, "developerTools"))
        completed.developerTools = { furnaceEnabled: false };
    // Existing Boolean achievement compatibility, after validation and default completion.
    for(const [id, progress] of Object.entries(completed.achievements)){
        if(typeof progress === "boolean"){
            completed.achievements[id] = { unlocked: progress, claimed: false };
        }
    }
    return completed;
}

function initializeGameState(loadedSave){
    save = loadedSave === null ? createMinerDevelopmentSave() : completeValidatedSave(loadedSave);
    // XP is authoritative; preserve existing Cash/XP, including the legacy XP fallback.
    save.factoryLevel = getFactoryLevelFromXP(save.factoryXP);
}

          let pendingSmelt = {

    key: "",
    value: 0,
    amount: 0,
    oreName: ""

};

let pendingMilestone = null;
let pendingAchievement = null;


          function getXPForLevel(level){

    return level * level * 100;

}

function checkFactoryMilestones(){

    FACTORY_MILESTONES.forEach(level => {

if(
    save.factoryLevel >= level &&
    !save.factoryMilestones[level]
){

    save.factoryMilestones[
        level
    ] = true;

    pendingMilestone =
        level;

}

    });

}

function updateFactoryLevel(){

    save.factoryLevel = getFactoryLevelFromXP(save.factoryXP);

checkFactoryMilestones();
    checkAchievements();
}

function getFactoryLevelFromXP(totalXP){
    return Math.floor(Math.sqrt(totalXP / 100));
}

function unlockAchievement(id){

    if(
        save.achievements[id]?.unlocked
    )
        return;

    save.achievements[id] = {

        unlocked:true,

        claimed:false

    };

    pendingAchievement =
        ACHIEVEMENTS[id];

    saveGame();

}

function checkAchievements(){

    Object.entries(
        ACHIEVEMENTS
    ).forEach(([id, achievement]) => {

if(
    save.achievements[id]?.unlocked
)
    return;

        if(
            achievement.type === "stat"
        ){

            const value =

                save.achievementStats[
                    achievement.stat
                ] || 0;

            if(
                value >=
                achievement.target
            ){

                unlockAchievement(id);

            }

        }

        if(
            achievement.type === "level"
        ){

            if(
                save.factoryLevel >=
                achievement.target
            ){

                unlockAchievement(id);

            }

        }

    });

}

function claimAchievement(id){

    const achievement =
        save.achievements[id];

    if(
        !achievement ||
        !achievement.unlocked ||
        achievement.claimed
    ){
        return;
    }

    achievement.claimed = true;

    // Reward system goes here later

    saveGame();

    buildAchievementsMenu();

    updateUI();

}

function saveGame(){
        if(!gameStarted || recoveryState.active || pendingDevelopmentWrite) return;
        if(isMinerDevelopment()) { commitDevelopmentState(copySaveData(save)); return; }
        save.factoryLevel = getFactoryLevelFromXP(save.factoryXP);
        localStorage.setItem(
            "ef_incremental",
            JSON.stringify(save)
        );
    }

function upgradeFurnace(){

    if(
        save.furnaceTier >=
        FURNACES.length - 1
    ){
        return;
    }

    const nextTier =
        FURNACES[
            save.furnaceTier + 1
        ];

    if(
        save.cash <
        nextTier.cost
    ){
        return;
    }

    save.cash -=
        nextTier.cost;

    save.furnaceTier++;

    saveGame();
    updateUI();

}

const AUTO_FURNACE_CYCLE_MS = 10000;

let autoFurnaceState = {
    enabled: true,
    processing: false,
    startTime: 0,
    batch: []
};
function restoreAutoFurnace(){
autoFurnaceState.enabled =
    save.autoFurnaceEnabled;
if(
    save.autoFurnaceBatch.length > 0
){

    autoFurnaceState.batch =
        save.autoFurnaceBatch;


    if(
        save.autoFurnaceStartTime > 0
    ){

        autoFurnaceState.processing =
            true;

        autoFurnaceState.startTime =
            save.autoFurnaceStartTime;

    }

}
}


function getAutoFurnaceMode(){

    return save.autoFurnaceMode;

}


function getAutoFurnaceBatchMode(){

    return save.autoFurnaceBatchMode;

}


function getAutoFurnaceAvailableCount(){

    const mode =
        getAutoFurnaceMode();

    if(mode === "stoneOnly"){

        return save.inventory.stone;

    }

    let totalOres = 0;

    ORE_KEYS.forEach(key => {

        totalOres +=
            save.inventory[key];

    });

    if(mode === "oresOnly"){

        return totalOres;

    }

    return (
        totalOres +
        save.inventory.stone
    );

}


function getAutoFurnaceBatch(){

    if(save.furnaceTier < 2)
        return [];

    const capacity =
        FURNACES[2].capacity;

    const available =
        getAutoFurnaceAvailableCount();

    if(available <= 0)
        return [];

    if(
        getAutoFurnaceBatchMode() === "full" &&
        available < capacity
    ){

        return [];

    }

    const mode =
        getAutoFurnaceMode();

    let remaining =
        capacity;

    const batch = [];


    /*
        ORES

        Always select ores from
        highest value to lowest value.
    */

    if(mode !== "stoneOnly"){

        const sortedOres =
            [...ORE_KEYS].sort(
                (a, b) =>
                    ORES[b].value -
                    ORES[a].value
            );

        for(
            const key of sortedOres
        ){

            if(remaining <= 0)
                break;

            const amount =
                Math.min(
                    save.inventory[key],
                    remaining
                );

            if(amount <= 0)
                continue;

            batch.push({

                key: key,

                amount: amount,

                value:
                    ORES[key].value,

                name:
                    ORES[key].name,

                emoji:
                    ORES[key].emoji

            });

            remaining -= amount;

        }

    }


    /*
        STONE

        Stone is always filler.

        It is only selected after
        all eligible ores have been
        selected.
    */

    if(
        mode !== "oresOnly" &&
        remaining > 0 &&
        save.inventory.stone > 0
    ){

        const amount =
            Math.min(
                save.inventory.stone,
                remaining
            );

        batch.push({

            key: "stone",

            amount: amount,

            value:
                save.stoneValue,

            name: "Stone",

            emoji: "🪨"

        });

    }

    return batch;

}


function getAutoFurnaceBatchTotal(
    batch
){

    return batch.reduce(

        (total, item) =>
            total + item.amount,

        0

    );

}


function getAutoFurnaceBatchValue(
    batch
){

    return batch.reduce(

        (total, item) =>
            total +
            item.amount *
            item.value,

        0

    );

}


function startAutoFurnaceCycle(){
    if(developerFurnaceEnabled()) return;

    if(
        !autoFurnaceState.enabled ||
        save.furnaceTier < 2 ||
        autoFurnaceState.processing
    ){

        return;

    }


    const batch =
        getAutoFurnaceBatch();


    if(batch.length === 0){

        updateAutoFurnaceUI();

        return;

    }


    /*
        Move the selected resources
        out of the player's inventory.

        They now physically belong
        to the Auto Furnace.
    */

    batch.forEach(item => {

        save.inventory[item.key] =
            Math.max(
                0,
                save.inventory[item.key] -
                item.amount
            );

    });


    /*
        Save the batch inside the furnace.

        This prevents the items from being
        available to mutations, manual
        smelting, or other systems.
    */

    save.autoFurnaceBatch =
        batch.map(item => ({
            key: item.key,
            amount: item.amount,
            value: item.value,
            name: item.name,
            emoji: item.emoji
        }));


    autoFurnaceState.processing =
        true;

    autoFurnaceState.startTime =
        Date.now();

    autoFurnaceState.batch =
        save.autoFurnaceBatch;


    save.autoFurnaceStartTime =
        autoFurnaceState.startTime;


    saveGame();

    updateUI();

    updateAutoFurnaceUI();

}


function finishAutoFurnaceCycle(){

    if(
        !autoFurnaceState.processing
    ){

        return;

    }


    const batch =
        autoFurnaceState.batch;


    const totalItems =
        getAutoFurnaceBatchTotal(
            batch
        );


    const totalValue =
        getAutoFurnaceBatchValue(
            batch
        );


    /*
        The items were already removed
        from the player's inventory when
        the batch started.

        Completing the cycle now permanently
        consumes the furnace contents.
    */

    save.cash +=
        totalValue;


    save.achievementStats
        .oresSmelted +=
        totalItems;

addFactoryXP(
    totalItems
);


    checkAchievements();

    updateFactoryLevel();


    /*
        Empty the temporary furnace inventory.
    */

    save.autoFurnaceBatch = [];

    save.autoFurnaceStartTime = 0;


    autoFurnaceState.processing =
        false;

    autoFurnaceState.startTime =
        0;

    autoFurnaceState.batch =
        [];


    saveGame();

    updateUI();


    /*
        Only begin another batch if
        Auto Furnace is still enabled.

        If the player pressed Stop while
        this batch was running, this batch
        finishes normally and then the
        furnace stops.
    */

    if(
        autoFurnaceState.enabled
    ){

        startAutoFurnaceCycle();

    }
    else{

        updateAutoFurnaceUI();

    }

}

function stopAutoFurnace(){

    /*
        Disable the creation of new batches.
    */

    autoFurnaceState.enabled =
        false;


    /*
        If a batch is currently processing,
        allow it to finish normally.

        We do NOT return the items.
        We do NOT interrupt the cycle.
    */

    if(
        autoFurnaceState.processing
    ){

        save.autoFurnaceEnabled =
            false;

        saveGame();

        updateAutoFurnaceUI();

        return;

    }


    /*
        If the furnace is idle, it stops
        immediately.
    */

    save.autoFurnaceEnabled =
        false;

    saveGame();

    updateAutoFurnaceUI();

}

function startAutoFurnace(){
    if(developerFurnaceEnabled()) return;

    autoFurnaceState.enabled =
        true;

    save.autoFurnaceEnabled =
        true;

    saveGame();

    updateAutoFurnaceUI();

    startAutoFurnaceCycle();

}


function updateAutoFurnace(){
    if(developerFurnaceEnabled()){ updateAutoFurnaceUI(); return; }

    if(save.furnaceTier < 2)
        return;


    /*
        If Auto Furnace has been stopped,
        do not start another batch.

        If a batch is already processing,
        we still allow it to finish.
    */

    if(
        !autoFurnaceState.enabled
    ){

        if(
            autoFurnaceState.processing
        ){

            const elapsed =
                Date.now() -
                autoFurnaceState.startTime;


            if(
                elapsed >=
                AUTO_FURNACE_CYCLE_MS
            ){

                finishAutoFurnaceCycle();

                return;

            }

        }


        updateAutoFurnaceUI();

        return;

    }


    if(autoFurnaceState.processing){

        const elapsed =
            Date.now() -
            autoFurnaceState.startTime;


        if(
            elapsed >=
            AUTO_FURNACE_CYCLE_MS
        ){

            finishAutoFurnaceCycle();

            return;

        }

    }
    else{

        startAutoFurnaceCycle();

    }


    updateAutoFurnaceUI();

}


function setAutoFurnaceMode(mode){

    if(
        ![
            "stoneOnly",
            "oresOnly",
            "oresStone"
        ].includes(mode)
    ){

        return;

    }

    save.autoFurnaceMode =
        mode;

    saveGame();

    updateAutoFurnaceUI();

}


function setAutoFurnaceBatchMode(
    mode
){

    if(
        ![
            "available",
            "full"
        ].includes(mode)
    ){

        return;

    }

    save.autoFurnaceBatchMode =
        mode;

    saveGame();

    updateAutoFurnaceUI();

}


function formatAutoFurnaceTime(
    milliseconds
){

    return Math.max(
        0,
        milliseconds / 1000
    ).toFixed(1) + "s";

}


function updateAutoFurnaceUI(){

    const container =
        document.getElementById(
            "autoFurnaceControls"
        );


    if(!container)
        return;

    if(developerFurnaceEnabled()){
        container.innerHTML = "<p>Auto Furnace paused while Developer Furnace is enabled. Restore Normal Furnace to resume its saved preference.</p>";
        return;
    }


    if(save.furnaceTier < 2){

        container.innerHTML =
            "";

        return;

    }


    /*
        Build the controls only once.

        The live update loop changes
        the progress elements rather
        than rebuilding the dropdowns
        every 100ms.
    */

    if(
        !document.getElementById(
            "autoFurnaceStatus"
        )
    ){

        container.innerHTML = `

            <hr>

            <h3>⚙️ Auto Furnace</h3>


            <div
                style="
                    margin-bottom:10px;
                "
            >

                <strong>
                    Smelting Mode
                </strong>

                <br>

                <select
                    id="autoFurnaceModeSelect"
                    onchange="
                        setAutoFurnaceMode(
                            this.value
                        )
                    "
                    style="
                        width:100%;
                        margin-top:5px;
                        padding:6px;
                    "
                >

                    <option value="oresStone">
                        Ores → Stone
                    </option>

                    <option value="oresOnly">
                        Ores Only
                    </option>

                    <option value="stoneOnly">
                        Stone Only
                    </option>

                </select>

            </div>


            <div
                style="
                    margin-bottom:10px;
                "
            >

                <strong>
                    Batch Mode
                </strong>

                <br>

                <select
                    id="autoFurnaceBatchModeSelect"
                    onchange="
                        setAutoFurnaceBatchMode(
                            this.value
                        )
                    "
                    style="
                        width:100%;
                        margin-top:5px;
                        padding:6px;
                    "
                >

                    <option value="available">
                        Smelt Available
                    </option>

                    <option value="full">
                        Wait for 100 Items
                    </option>

                </select>

            </div>


            <div id="autoFurnaceStatus">
                Waiting for resources.
            </div>


            <div
                id="autoFurnaceProcessing"
                style="
                    display:none;
                    margin-top:12px;
                "
            >

                <strong>
                    🔥 Currently Smelting
                </strong>


                <div
                    id="autoFurnaceBatch"
                    style="margin-top:6px;"
                ></div>


                <div
                    id="autoFurnaceBatchCount"
                    style="margin-top:8px;"
                ></div>


                <div
                    style="
                        width:100%;
                        height:16px;
                        background:#ddd;
                        border-radius:8px;
                        overflow:hidden;
                        margin-top:6px;
                    "
                >

                    <div
                        id="autoFurnaceProgress"
                        style="
                            width:0%;
                            height:100%;
                            background:#f39c12;
                        "
                    ></div>

                </div>


                <div
                    id="autoFurnaceTime"
                    style="margin-top:6px;"
                ></div>


                <div
                    id="autoFurnaceRemaining"
                ></div>


<div
    id="autoFurnaceValue"
></div>

</div>

<div
    style="
        margin-top:10px;
    "
>
<button
    id="autoFurnaceToggle"
    onclick="
        autoFurnaceState.enabled
            ? stopAutoFurnace()
            : startAutoFurnace()
    "
>
</button>
</div>

        `;

    }


    const modeSelect =
        document.getElementById(
            "autoFurnaceModeSelect"
        );

    const batchModeSelect =
        document.getElementById(
            "autoFurnaceBatchModeSelect"
        );


    if(modeSelect){

        modeSelect.value =
            getAutoFurnaceMode();

    }


    if(batchModeSelect){

        batchModeSelect.value =
            getAutoFurnaceBatchMode();

    }


    const status =
        document.getElementById(
            "autoFurnaceStatus"
        );

    const processing =
        document.getElementById(
            "autoFurnaceProcessing"
        );

    const toggleButton =
    document.getElementById(
        "autoFurnaceToggle"
    );


if(toggleButton){

    if(
        autoFurnaceState.processing &&
        !autoFurnaceState.enabled
    ){

        toggleButton.textContent =
            "Finishing Current Batch...";

        toggleButton.disabled =
            true;

    }
    else{

        toggleButton.disabled =
            false;

        toggleButton.textContent =
            autoFurnaceState.enabled
                ? "Stop Auto Furnace"
                : "Start Auto Furnace";

    }

}


    if(
        autoFurnaceState.processing
    ){

        const elapsed =
            Date.now() -
            autoFurnaceState.startTime;


        const progress =
            Math.min(
                100,
                (
                    elapsed /
                    AUTO_FURNACE_CYCLE_MS
                ) * 100
            );


        const remaining =
            Math.max(
                0,
                AUTO_FURNACE_CYCLE_MS -
                elapsed
            );


        const batchTotal =
            getAutoFurnaceBatchTotal(
                autoFurnaceState.batch
            );


        const batchValue =
            getAutoFurnaceBatchValue(
                autoFurnaceState.batch
            );


        const batchDescription =
            autoFurnaceState.batch
                .map(item =>
                    `${item.emoji} ${item.name} ×${item.amount.toLocaleString()}`
                )
                .join("<br>");

if(status){

    status.textContent =
        autoFurnaceState.enabled
            ? "Processing current batch..."
            : "Finishing current batch — Auto Furnace will stop when complete.";

}


        if(processing){

            processing.style.display =
                "block";

        }


        document.getElementById(
            "autoFurnaceBatch"
        ).innerHTML =
            batchDescription;


        document.getElementById(
            "autoFurnaceBatchCount"
        ).textContent =
            `${batchTotal.toLocaleString()} / 100 items`;


        document.getElementById(
            "autoFurnaceProgress"
        ).style.width =
            progress + "%";


        document.getElementById(
            "autoFurnaceTime"
        ).textContent =
            `${formatAutoFurnaceTime(elapsed)} / 10.0s`;


        document.getElementById(
            "autoFurnaceRemaining"
        ).textContent =
            `Time remaining: ${formatAutoFurnaceTime(remaining)}`;


        document.getElementById(
            "autoFurnaceValue"
        ).textContent =
`Batch value: $${formatNumber(batchValue, 2)}`

    }
else{

    if(processing){

        processing.style.display =
            "none";

    }


    /*
        Auto Furnace is manually stopped.
    */

    if(
        !autoFurnaceState.enabled
    ){

        if(status){

            status.textContent =
                "Auto Furnace stopped.";

        }

        return;

    }


    const available =
        getAutoFurnaceAvailableCount();


    const canStart =
        getAutoFurnaceBatch()
            .length > 0;


    if(status){

        status.textContent =
            canStart

            ? `Ready — ${available.toLocaleString()} eligible item${available === 1 ? "" : "s"} available.`

            : getAutoFurnaceBatchMode() === "full"

                ? "Waiting for 100 eligible items."

                : "Waiting for resources.";

    }

}

}

          
function getDropperCost(){

    return Math.floor(
        10 *
        Math.pow(
            1.25,
            save.droppers
        )
    );

}
function getAdderCost(){

    return Math.floor(
        100 *
        Math.pow(
            1.30,
            save.adders
        )
    );

}

function getMultiplierCost(){

    return Math.floor(
        5000 *
        Math.pow(
            1.45,
            save.multipliers
        )
    );

}


function produceStone(){
    if(isMinerDevelopment() || pendingDevelopmentWrite) return;

    let amount =
        save.droppers;

    if(amount <= 0)
        return;

    let duplicateChance =

        save.multipliers *

        0.001;

    for(let i = 0; i < amount; i++){

save.inventory.stone++;

save.stoneOres++;

save.totalOres++;

addFactoryXP(1);
        
        if(
            Math.random() <
            duplicateChance
        ){
save.inventory.stone++;

save.stoneOres++;

save.totalOres++;

addFactoryXP(1);

        }

    }

    updateFactoryLevel();

}


// Unconditional runtime definition: no owned/equipped Pickaxe state in schema 1.
const DEFAULT_PICKAXE = Object.freeze({
    name: "Default",
    tier: 0,
    rawPower: 4,
    luck: 1,
    durability: Infinity
});
const MANUAL_BASE_TIER_WEIGHTS = Object.freeze([239744, 10000, 250, 5, 1]);

function getManualPickaxe(){
    return DEFAULT_PICKAXE;
}

function getMaxManualOreTier(pickaxe = getManualPickaxe()){
    return Math.min(4, pickaxe.tier + 2);
}

function getAccessibleManualTierWeights(pickaxe = getManualPickaxe(), weights = MANUAL_BASE_TIER_WEIGHTS){
    const maxTier = getMaxManualOreTier(pickaxe);
    return weights.map((weight, tier) => tier <= maxTier ? weight : 0);
}

function normalizeManualTierWeights(weights){
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    // Manual mining has no automated Stone floor. V1-029 owns Luck adjustments.
    return weights.map(weight => weight / total);
}

function rollManualTier(roll = Math.random()){
    const probabilities = normalizeManualTierWeights(getAccessibleManualTierWeights());
    let cumulative = 0;
    // Keep rare-to-common roll order; within-tier selection remains unchanged.
    for(let tier = probabilities.length - 1; tier >= 0; tier--){
        cumulative += probabilities[tier];
        if(probabilities[tier] > 0 && roll < cumulative) return tier;
    }
    return 0; // Floating-point remainder belongs to the final Stone bucket.
}

function mineOre(){
    if(isMinerDevelopment()) return mineDevelopmentOre();

    const tier = rollManualTier();

// Tier 4

if(tier === 4){

const ore =
    getRandomOre(
        TIER_4_ORES
    );

save.lastOre =
    `${ore.emoji} ${ore.name}`;
save.lastOreValue = ore.value;

save.oreCollection[
    ore.key
]++;
    save.inventory[
    ore.key
]++;
if(
    save.oreCollection[
        ore.key
    ] === 1
){

showDiscoveryPopup(
    `${ore.emoji} ${ore.name}`,
    ore.value
);

save.achievementStats
    .oresDiscovered++;

checkAchievements();

}

save.tier4Ores++;

addFactoryXP(
    ore.xp
);

    }

// Tier 3

else if(tier === 3){

const ore =
    getRandomOre(
        TIER_3_ORES
    );

save.lastOre =
    `${ore.emoji} ${ore.name}`;
save.lastOreValue = ore.value;

save.oreCollection[
    ore.key
]++;
    save.inventory[
    ore.key
]++;

if(
    save.oreCollection[
        ore.key
    ] === 1
){

showDiscoveryPopup(
    `${ore.emoji} ${ore.name}`,
    ore.value
);

save.achievementStats
    .oresDiscovered++;

checkAchievements();

}

save.tier3Ores++;

addFactoryXP(
    ore.xp
);

    }

// Tier 2

else if(tier === 2){

const ore =
    getRandomOre(
        TIER_2_ORES
    );

save.lastOre =
    `${ore.emoji} ${ore.name}`;
save.lastOreValue = ore.value;

save.oreCollection[
    ore.key
]++;
    save.inventory[
    ore.key
]++;

if(
    save.oreCollection[
        ore.key
    ] === 1
){

showDiscoveryPopup(
    `${ore.emoji} ${ore.name}`,
    ore.value
);

save.achievementStats
    .oresDiscovered++;

checkAchievements();

}

save.tier2Ores++;
addFactoryXP(
    ore.xp
);

    }

// Tier 1

else if(tier === 1){

const ore =
    getRandomOre(
        TIER_1_ORES
    );

save.lastOre =
    `${ore.emoji} ${ore.name}`;
save.lastOreValue = ore.value;

save.oreCollection[
    ore.key
]++;
    save.inventory[
    ore.key
]++;

if(
    save.oreCollection[
        ore.key
    ] === 1
){

showDiscoveryPopup(
    `${ore.emoji} ${ore.name}`,
    ore.value
);

save.achievementStats
    .oresDiscovered++;

checkAchievements();

}

save.tier1Ores++;

addFactoryXP(
    ore.xp
);

    }

// Stone

    else{

    save.lastOre = "🪨 Stone";

    save.lastOreValue = 1;

save.stoneOres++;

save.inventory.stone++;

addFactoryXP(1);

}

save.totalOres++;

save.achievementStats.totalOresMined++;

checkAchievements();

updateFactoryLevel();

}


function updateOreDisplay(
    labelId,
    countId,
    oreName,
    amount
){

    document.getElementById(
        labelId
    ).textContent =
        amount > 0
        ? oreName
        : "?????";

document.getElementById(
    countId
).textContent =
    amount > 0
    ? formatNumber(amount)
    : "???";

}

          function updateInventoryTooltip(
    id,
    amount,
    value
){

    const element =
        document.getElementById(id);

    if(!element)
        return;

    element.textContent =
        formatNumber(amount);

    element.parentElement.title =

        "Amount: " +

        amount.toLocaleString()

        +

        "\nValue: $" +

        value.toLocaleString()

        +

        "\nTotal Value: $" +

        (
            amount * value
        ).toLocaleString();

}

function updateUI(){
    renderDevelopmentMiner();
    renderDevelopmentPolishers();

    // Presentation only: reuse existing ownership/costs, without parallel state.
    document.getElementById("dropperProduction").textContent =
        formatNumber(save.droppers, 0) + (save.droppers === 1 ? " Dropper running" : " Droppers running");
    for(const [id, cost] of [["buyDropper", getDropperCost()], ["buyAdder", getAdderCost()], ["buyMultiplier", getMultiplierCost()]]){
        document.getElementById(id).disabled = save.cash < cost;
    }

    save.factoryLevel = getFactoryLevelFromXP(save.factoryXP);
    document.getElementById("factoryLevel").textContent =
    save.factoryLevel;

const nextLevelXP =

    getXPForLevel(
        save.factoryLevel + 1
    );

    const currentLevelXP =
    getXPForLevel(
        save.factoryLevel
    );

const xpIntoLevel =
    save.factoryXP -
    currentLevelXP;

const xpNeeded =
    100 * (2 * save.factoryLevel + 1);

const xpPercent =
    Math.max(0, Math.min(
        100,
        (xpIntoLevel / xpNeeded) * 100
    ));

    document.getElementById(
    "xpBar"
).style.width =
    xpPercent + "%";

document.getElementById("xpBar").ariaValueNow = String(xpPercent);

document.getElementById(
    "factoryXP"
).textContent =

    formatXP(
        save.factoryXP
    )

    +
    " / "

    +

    formatXP(
        nextLevelXP
    );

document.getElementById(
    "nextLevelXP"
).textContent =

    formatXP(
        Math.max(
            0,
            nextLevelXP -
            save.factoryXP
        )
    );

const cashElement =
    document.getElementById("cash");

cashElement.textContent =
    "$" +
    formatCash(save.cash);

cashElement.title =
    "$" +
    formatFullCashValue(
        save.cash
    );

    document.getElementById("droppers").textContent =
        save.droppers;

document.getElementById("dropperCost").textContent =
    formatCash(getDropperCost());

    document.getElementById("adders").textContent =
        save.adders;
    save.stoneValue =

    1 +

    save.adders;

    document.getElementById("multipliers").textContent =
        save.multipliers;

    const furnace =

    FURNACES[
        save.furnaceTier
    ];

document.getElementById(
    "furnaceName"
).textContent =
    developerFurnaceEnabled() ? "Developer Furnace" : furnace.name;

document.getElementById(
    "furnaceCapacity"
).textContent =
    developerFurnaceEnabled() ? "Unlimited" : furnace.capacity;
    renderDeveloperTools();

    const upgradeButton =

    document.getElementById(
        "upgradeFurnace"
    );

if(save.furnaceTier >=
   FURNACES.length - 1){

    upgradeButton.textContent =
        "MAX FURNACE";

}
else{

    upgradeButton.textContent =
"Upgrade Furnace ($" +
formatCash(
    FURNACES[
        save.furnaceTier + 1
    ].cost
) +
")";

}
    

    document.getElementById("adderCost").textContent =
        formatCash(getAdderCost());

    document.getElementById("multiplierCost").textContent =
        formatCash(getMultiplierCost());


    document.getElementById("lastOre").textContent =
    save.lastOre;

document.getElementById("lastOreValue").textContent =
    "$" +
    formatNumber(
        save.lastOreValue,
        2
    );

document.getElementById("totalOres").textContent =
    formatNumber(save.totalOres);

document.getElementById("statsTotalOres").textContent =
    formatNumber(save.totalOres);

    document.getElementById("stoneOres").textContent =
    formatNumber(save.stoneOres);

document.getElementById("tier1Ores").textContent =
    formatNumber(save.tier1Ores);

document.getElementById("tier2Ores").textContent =
    formatNumber(save.tier2Ores);

document.getElementById("tier3Ores").textContent =
    formatNumber(save.tier3Ores);

document.getElementById("tier4Ores").textContent =
    formatNumber(save.tier4Ores);

    document.getElementById("adderCard")
.style.display =
    save.factoryLevel >= 2
    ? "block"
    : "none";

document.getElementById("multiplierCard")
.style.display =
    save.factoryLevel >= 5
    ? "block"
    : "none";

document.getElementById("furnaceCard")
.style.display =
    "block";

ORE_KEYS.forEach(key => {

    updateOreDisplay(
        key + "Label",
        key + "Count",
        ORES[key].name,
        save.oreCollection[key]
    );

});

updateInventoryTooltip(
    "invStone",
    save.inventory.stone,
    save.stoneValue
);

ORE_KEYS.forEach(key => {

    updateInventoryTooltip(
        "inv" +
        key.charAt(0).toUpperCase() +
        key.slice(1),

        save.inventory[key],

        ORES[key].value
    );

});
    
    const discovered = Object.values(
    save.oreCollection
).filter(
    count => count > 0
).length;

document.getElementById(
    "discoveredCount"
).textContent = discovered;

    const completedMilestones =
    Object.values(
        save.factoryMilestones
    ).filter(
        unlocked => unlocked
    ).length;

document.getElementById(
    "milestoneCount"
).textContent =
    completedMilestones;

    const completedAchievements =

    Object.keys(
        save.achievements
    ).length;

document.getElementById(
    "achievementCount"
).textContent =
    completedAchievements;

document.getElementById(
    "achievementTotal"
).textContent =
    Object.keys(
        ACHIEVEMENTS
    ).length;

if(
    pendingMilestone !== null
){

    showMilestonePopup(
        pendingMilestone
    );

    pendingMilestone =
        null;

}

if(
    pendingAchievement !== null
){

    showAchievementPopup(
        pendingAchievement
    );

    pendingAchievement =
        null;

}

}

function startGameplay(){
 document.getElementById("buyMiningPower").onclick = buyMiningPower;
 document.getElementById("unlockMiner").onclick = unlockDevelopmentMiner;
 // Slot actions are bound by renderDevelopmentMinerSlots.
 document.getElementById("sellMiner").onclick = () => prepareDevelopmentMinerSale(document.getElementById("sellMiner").dataset.minerId);
 document.getElementById("confirmPolisherSale").onclick=confirmDevelopmentPolisherSale;
 document.getElementById("cancelPolisherSale").onclick=closeDevelopmentPolisherSale;
 document.getElementById("polisherSaleModal").onkeydown=event=>{if(event.key==="Escape"){event.preventDefault();closeDevelopmentPolisherSale();}};
 document.getElementById("confirmMinerSale").onclick = confirmDevelopmentMinerSale;
 document.getElementById("cancelMinerSale").onclick = closeDevelopmentMinerSale;
 document.getElementById("minerSaleModal").onkeydown = event => {
     if(event.key === "Escape"){ event.preventDefault(); closeDevelopmentMinerSale(); }
     if(event.key === "Tab"){
         event.preventDefault();
         document.getElementById(event.target === document.getElementById("cancelMinerSale") ? "confirmMinerSale" : "cancelMinerSale").focus();
     }
 };
 document.getElementById("upgradeMiner").onclick = () => upgradeDevelopmentMiner(document.getElementById("upgradeMiner").dataset.minerId);
 document.getElementById("upgradeMinerOreLuck").onclick = () => upgradeDevelopmentMinerOreLuck(document.getElementById("upgradeMinerOreLuck").dataset.minerId);
document.getElementById("mineButton")
.onclick = function(){

    mineOre();

    updateUI();

};

    document.getElementById("buyDropper")
        .onclick = function(){

        if(isMinerDevelopment() || pendingDevelopmentWrite) return;
        const cost =
            getDropperCost();

        if(save.cash < cost)
            return;

        save.cash -= cost;

        save.droppers++;

        updateUI();

    };

          document.getElementById("buyAdder")
.onclick = function(){

    const cost =
        getAdderCost();

    if(save.cash < cost)
        return;

    save.cash -= cost;

    save.adders++;

    updateUI();

};

document.getElementById("buyMultiplier")
.onclick = function(){

    if(isMinerDevelopment() || pendingDevelopmentWrite) return;
    const cost =
        getMultiplierCost();

    if(save.cash < cost)
        return;

    save.cash -= cost;

    save.multipliers++;

    updateUI();

};

          document.getElementById(
    "upgradeFurnace"
).onclick = function(){

    upgradeFurnace();

    updateUI();

};

setInterval(function(){

    produceStone();

    updateUI();

}, 1000);


setInterval(function(){

    if(pendingDevelopmentWrite) return;
    updateDevelopmentMiner();
    if(!pendingDevelopmentWrite) updateAutoFurnace();

}, 100);


setInterval(saveGame, 5000);
}
          
function formatNumber(num, decimals = 2){

    num = Number(num);

    if(!Number.isFinite(num)){
        return "∞";
    }

    if(num === 0){
        return (0).toFixed(decimals);
    }

    const abs = Math.abs(num);

    // Numbers below 10,000 use normal formatting
    if(abs < 10000){

        return num.toLocaleString(
            undefined,
            {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }
        );

    }

    return formatLargeNumber(
        num,
        decimals
    );

}

const LARGE_NUMBER_SUFFIXES = [

    { exponent: 3, suffix: "K" },

    { exponent: 6, suffix: "M" },
    { exponent: 9, suffix: "B" },
    { exponent: 12, suffix: "T" },

    { exponent: 15, suffix: "Qa" },
    { exponent: 18, suffix: "Qi" },
    { exponent: 21, suffix: "Sx" },
    { exponent: 24, suffix: "Sp" },
    { exponent: 27, suffix: "Oc" },
    { exponent: 30, suffix: "No" },

    { exponent: 33, suffix: "Dc" },
    { exponent: 36, suffix: "Ud" },
    { exponent: 39, suffix: "Dd" },
    { exponent: 42, suffix: "Td" },
    { exponent: 45, suffix: "Qad" },
    { exponent: 48, suffix: "Qid" },
    { exponent: 51, suffix: "Sed" },
    { exponent: 54, suffix: "Spd" },
    { exponent: 57, suffix: "Ocd" },
    { exponent: 60, suffix: "Nod" },

    { exponent: 63, suffix: "Vg" },
    { exponent: 66, suffix: "Uvg" },
    { exponent: 69, suffix: "Dvg" },
    { exponent: 72, suffix: "Tvg" },
    { exponent: 75, suffix: "Qavg" },
    { exponent: 78, suffix: "Qivg" },
    { exponent: 81, suffix: "Sxvg" },
    { exponent: 84, suffix: "Spvg" },
    { exponent: 87, suffix: "Ocvg" },
    { exponent: 90, suffix: "Novg" },

    { exponent: 93, suffix: "Tg" },
    { exponent: 96, suffix: "Utg" },
    { exponent: 99, suffix: "Dtg" },
    { exponent: 102, suffix: "Ttg" },
    { exponent: 105, suffix: "Qatg" },
    { exponent: 108, suffix: "Qitg" },
    { exponent: 111, suffix: "Sxtg" },
    { exponent: 114, suffix: "Sptg" },
    { exponent: 117, suffix: "Octg" },
    { exponent: 120, suffix: "Notg" },

    { exponent: 123, suffix: "Qg" },
    { exponent: 126, suffix: "Uqg" },
    { exponent: 129, suffix: "Dqg" },
    { exponent: 132, suffix: "Tqg" },
    { exponent: 135, suffix: "Qaqg" },
    { exponent: 138, suffix: "Qiqg" },
    { exponent: 141, suffix: "Sxqg" },
    { exponent: 144, suffix: "Spqg" },
    { exponent: 147, suffix: "Ocqg" },
    { exponent: 150, suffix: "Noqg" },

    { exponent: 153, suffix: "Qqg" },
    { exponent: 156, suffix: "Uqqg" },
    { exponent: 159, suffix: "Dqqg" },
    { exponent: 162, suffix: "Tqqg" },
    { exponent: 165, suffix: "Qaq" },
    { exponent: 168, suffix: "Qiq" },
    { exponent: 171, suffix: "Sxq" },
    { exponent: 174, suffix: "Spq" },
    { exponent: 177, suffix: "Ocq" },
    { exponent: 180, suffix: "Noq" },

    { exponent: 183, suffix: "Og" },
    { exponent: 186, suffix: "Uog" },
    { exponent: 189, suffix: "Dog" },
    { exponent: 192, suffix: "Tog" },
    { exponent: 195, suffix: "Qaog" },
    { exponent: 198, suffix: "Qiog" },
    { exponent: 201, suffix: "Sxog" },
    { exponent: 204, suffix: "Spog" },
    { exponent: 207, suffix: "Ocog" },
    { exponent: 210, suffix: "Noog" },

    { exponent: 213, suffix: "Ng" },
    { exponent: 216, suffix: "Ung" },
    { exponent: 219, suffix: "Dng" },
    { exponent: 222, suffix: "Tng" },
    { exponent: 225, suffix: "Qang" },
    { exponent: 228, suffix: "Qing" },
    { exponent: 231, suffix: "Sxng" },
    { exponent: 234, suffix: "Spng" },
    { exponent: 237, suffix: "Ocng" },
    { exponent: 240, suffix: "Nong" },

    { exponent: 243, suffix: "Ce" }

];

function formatLargeNumber(
    num,
    decimals = 2
){

    const abs = Math.abs(num);

    if(abs < 10000){

        return num.toLocaleString(
            undefined,
            {
                minimumFractionDigits:
                    decimals,

                maximumFractionDigits:
                    decimals
            }
        );

    }

    // Find the largest suffix we can use
    let selected = null;

    for(
        let i = 0;
        i < LARGE_NUMBER_SUFFIXES.length;
        i++
    ){

        if(
            abs >=
            Math.pow(
                10,
                LARGE_NUMBER_SUFFIXES[i].exponent
            )
        ){

            selected =
                LARGE_NUMBER_SUFFIXES[i];

        }
        else{

            break;

        }

    }

    // Centillion and below
    if(selected){

        const scaled =
            num /
            Math.pow(
                10,
                selected.exponent
            );

        return (
            scaled.toFixed(decimals)
            +
            selected.suffix
        );

    }

    // Beyond Centillion
    const exponent =
        Math.floor(
            Math.log10(abs)
        );

    const mantissa =
        num /
        Math.pow(
            10,
            exponent
        );

    return (
        mantissa.toFixed(decimals)
        +
        "e" +
        exponent
    );

}

function formatCash(num){

    num = Number(num);

    if(!Number.isFinite(num)){
        return "∞";
    }

    num = Math.floor(num);

    if(num < 10000){

        return num.toLocaleString();

    }

    return formatLargeNumber(
        num,
        2
    );

}

function formatFullCashValue(num){

    num = Number(num);

    if(!Number.isFinite(num)){
        return "∞";
    }

    num = Math.floor(num);

    if(
        Math.abs(num) < 1e21
    ){

        return num.toLocaleString();

    }

    const exponent =
        Math.floor(
            Math.log10(
                Math.abs(num)
            )
        );

    const mantissa =
        num /
        Math.pow(
            10,
            exponent
        );

    return (
        mantissa.toPrecision(16)
        +
        "e" +
        exponent
    );

}

function formatXP(num){

    return Math.round(
        Number(num)
    ).toLocaleString();

}

function formatPercent(decimal){

    return (
        Number(decimal) * 100
    ).toFixed(2) + "%";

}

function formatMultiplier(multiplier){

    return (
        Number(multiplier)
            .toFixed(2)
    ) + "×";

}

function getFactoryLevelBonus(){

    return (
        Number(save.factoryLevel) *
        0.01
    );

}

function getPermanentBonus(type){

    return (
        save.permanentBonuses[type] ||
        0
    );

}

function getCycleBonus(type){

    return (
        save.cycleBonuses[type] ||
        0
    );

}

function getCombinedBonus(type){

    return (
        getPermanentBonus(type) +
        getCycleBonus(type)
    );

}

function getFactoryLevelMultiplier(){

    return (
        1 +
        getFactoryLevelBonus()
    );

}

function getOreValueMultiplier(){

    return (
        getFactoryLevelMultiplier()
    ) *
    (
        1 +
        getCombinedBonus(
            "oreValue"
        )
    );

}

function getOverallLuckMultiplier(){

    return (
        getFactoryLevelMultiplier()
    ) *
    (
        1 +
        getPermanentBonus(
            "allLuck"
        ) +
        getCycleBonus(
            "allLuck"
        )
    );

}

function getIncomeMultiplier(){

    return (
        getFactoryLevelMultiplier()
    ) *
    (
        1 +
        getCombinedBonus(
            "allIncome"
        )
    );

}

function getFactoryXPMultiplier(){

    return (
        getFactoryLevelMultiplier()
    ) *
    (
        1 +
        getCombinedBonus(
            "factoryXP"
        )
    );

}

function getSmeltSpeedMultiplier(){

    return (
        getFactoryLevelMultiplier()
    ) *
    (
        1 +
        getCombinedBonus(
            "smeltSpeed"
        )
    );

}

function getBonusMultiplier(type){

    return (
        1 +
        getCombinedBonus(type)
    );

}

function addFactoryXP(amount){

    save.factoryXP +=
        Math.round(amount);

    if(
        save.factoryXP < 0
    ){

        save.factoryXP = 0;

    }

}

          function openCollection(){

    document.getElementById(
        "collectionModal"
    ).style.display = "block";

}

function closeCollection(){

    document.getElementById(
        "collectionModal"
    ).style.display = "none";

}

          function openInventory(){

    document.getElementById(
        "inventoryModal"
    ).style.display = "block";

}

function closeInventory(){

    document.getElementById(
        "inventoryModal"
    ).style.display = "none";

}

          function openStats(){

    document.getElementById(
        "statsModal"
    ).style.display =
        "block";

}

function closeStats(){

    document.getElementById(
        "statsModal"
    ).style.display =
        "none";

}

function openMilestones(){

    buildMilestonesMenu();

    document.getElementById(
        "milestonesModal"
    ).style.display =
        "block";

}

function closeMilestones(){

    document.getElementById(
        "milestonesModal"
    ).style.display =
        "none";

}

function openAchievements(){

    buildAchievementsMenu();

    document.getElementById(
        "achievementsModal"
    ).style.display =
        "block";

}

function closeAchievements(){

    document.getElementById(
        "achievementsModal"
    ).style.display =
        "none";

}

function openFurnace(){

    buildFurnaceMenu();

    document.getElementById(
        "furnaceModal"
    ).style.display =
        "block";

}

function closeFurnace(){

    document.getElementById(
        "furnaceModal"
    ).style.display = "none";

}

          function addFurnaceItem(
    name,
    key,
    value
){

    const amount =
        save.inventory[key];
              if(amount <= 0)
    return;

const div =
    document.createElement(
        "div"
    );


    div.style.marginBottom =
        "15px";

    div.innerHTML = `

        <strong>${name}</strong>

        (${formatNumber(amount)})

        <br>

        <button
            onclick="
                showSmeltOptions(
                    this,
                    '${key}',
                    ${value}
                )
            ">

            Select

        </button>

    `;

    div.title =

        "Amount: " +

        amount.toLocaleString()

        +

        "\nValue: $" +

        value.toLocaleString()

        +

        "\nTotal: $" +

        (
            amount * value
        ).toLocaleString();

if(developerFurnaceEnabled()){
    try{
        const quote = developmentSmeltQuote(save, key, amount);
        div.title = "Testing sale · Amount: " + amount.toLocaleString() + "\nValue: $" + quote.value.toLocaleString() + "\nTotal: $" + quote.total.toLocaleString();
    }catch(error){ div.title = error.message; }
}
const container =
    document.getElementById(
        "furnaceItems"
    );

    container.appendChild(div);

}

function showSmeltOptions(
    button,
    key,
    value
){

    button.outerHTML = `

        <button
            onclick="
                prepareSmelt(
                    '${key}',
                    ${value},
                    0.25
                )
            ">
            25%
        </button>

        <button
            onclick="
                prepareSmelt(
                    '${key}',
                    ${value},
                    0.50
                )
            ">
            50%
        </button>

        <button
            onclick="
                prepareSmelt(
                    '${key}',
                    ${value},
                    1
                )
            ">
            100%
        </button>

    `;
}

function prepareSmelt(
    key,
    value,
    percent
){
    if(isMinerDevelopment()) return prepareDevelopmentSmelt(key, percent);

    if(autoFurnaceState.processing){

        return;

    }

const requestedAmount =
    Math.floor(

        save.inventory[key] *

        percent

    );

const amount = Math.min(

    requestedAmount,

    FURNACES[
        save.furnaceTier
    ].capacity

);

    if(amount <= 0)
        return;

    document.getElementById("confirmCohort").textContent = "";
    document.getElementById("confirmFurnaceMode").textContent = "Normal Furnace";
    pendingSmelt.key =
        key;

    pendingSmelt.value =
        value;

    pendingSmelt.amount =
        amount;

pendingSmelt.oreName = key;

document.getElementById(
    "confirmOre"
).textContent =
    key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());

    document.getElementById(
        "confirmAmount"
    ).textContent =
        amount.toLocaleString();

    document.getElementById(
        "confirmValue"
    ).textContent =
        value.toLocaleString();

    document.getElementById(
        "confirmTotal"
    ).textContent =
        (
            amount *
            value
        ).toLocaleString();

    document.getElementById(
        "smeltConfirmModal"
    ).style.display =
        "block";

}

function confirmSmelt(){
    if(isMinerDevelopment() && pendingSmelt.kind === "polished") return confirmDevelopmentPolishedSmelt();
    if(isMinerDevelopment()){
        if(autoFurnaceState.processing || pendingDevelopmentWrite) return false;
        const success = developmentCommand(next => {
            const {key, amount} = pendingSmelt;
            const quote = developmentSmeltQuote(next, key, amount);
            if(pendingSmelt.developerMode !== developerFurnaceEnabled(next)) throw Error("Furnace mode changed. Select the batch again.");
            const remaining = next.inventory[key] - amount;
            if(remaining + amount !== next.inventory[key] || next.inventory[key] - remaining !== amount) throw Error("Inventory precision exhausted");
            next.inventory[key] = remaining;
            next.cash = exactDevelopmentAdd(next.cash, quote.total);
            next.achievementStats.oresSmelted = exactDevelopmentAdd(next.achievementStats.oresSmelted, amount);
            next.factoryXP = exactDevelopmentAdd(next.factoryXP, amount);
            prepareDevelopmentProgress(next);
        }, { message: "Furnace sale saved.", smelt: true });
        return success;
    }

    if(autoFurnaceState.processing){

        closeSmeltConfirm();

        return;

    }

    save.inventory[
        pendingSmelt.key
    ] -=
        pendingSmelt.amount;

    save.cash +=

        pendingSmelt.amount *

        pendingSmelt.value;

    save.achievementStats
    .oresSmelted +=
        pendingSmelt.amount;

checkAchievements();

addFactoryXP(
    pendingSmelt.amount
);

updateFactoryLevel();

    closeSmeltConfirm();

    buildFurnaceMenu();

    updateUI();

}

          function closeSmeltConfirm(){

    document.getElementById(
        "smeltConfirmModal"
    ).style.display =
        "none";

}

          function buildFurnaceMenu(){

    const container =
        document.getElementById(
            "furnaceItems"
        );

    container.innerHTML = "";
    document.getElementById("polishedFurnaceSection").hidden = !isMinerDevelopment();
    buildPolishedFurnaceMenu();
              
addFurnaceItem(
    "🪨 Stone",
    "stone",
    save.stoneValue
);

ORE_KEYS.forEach(key => {

    addFurnaceItem(
        `${ORES[key].emoji} ${ORES[key].name}`,
        key,
        ORES[key].value
    );

});

if(container.innerHTML === ""){

    container.innerHTML =
        "<p>No items available to smelt.</p>";

}

}

function buildMilestonesMenu(){

    const container =
        document.getElementById(
            "milestoneItems"
        );

    container.innerHTML = "";

    FACTORY_MILESTONES.forEach(level => {

        const unlocked =
            save.factoryMilestones[
                level
            ];

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "milestone-item " +
            (
                unlocked
                ? "milestone-unlocked"
                : "milestone-locked"
            );

        div.innerHTML =
            "<strong>Level " +
            level.toLocaleString() +
            "</strong><br>" +
            (
                unlocked
                ? "Unlocked"
                : "Locked"
            );

        container.appendChild(
            div
        );

    });

}

function buildAchievementsMenu(){

    const container =
        document.getElementById(
            "achievementItems"
        );

    container.innerHTML = "";

    let currentCategory = "";

Object.entries(
    ACHIEVEMENTS
)

.sort((a, b) => {

    const aSave =

        save.achievements[a[0]] ||

        {
            unlocked:false,
            claimed:false
        };

    const bSave =

        save.achievements[b[0]] ||

        {
            unlocked:false,
            claimed:false
        };

    function getPriority(state){

        if(
            state.unlocked &&
            !state.claimed
        ){
            return 0;
        }

        if(
            state.claimed
        ){
            return 1;
        }

        return 2;

    }

    return (

        getPriority(aSave)

        -

        getPriority(bSave)

    );

})

.forEach(([id, achievement]) => {

        if(
            achievement.category !==
            currentCategory
        ){

            currentCategory =
                achievement.category;

            const heading =
                document.createElement(
                    "h3"
                );

            heading.textContent =
                currentCategory;

            container.appendChild(
                heading
            );

        }
const achievementSave =

    save.achievements[id] ||

    {

        unlocked:false,

        claimed:false

    };

const unlocked =
    achievementSave.unlocked;

const claimed =
    achievementSave.claimed;

const div =
    document.createElement(
        "div"
    );

div.dataset.id = id;

div.className =
    "achievement-item " +

    (

        claimed

        ?

        "achievement-unlocked"

        :

        "achievement-locked"

    );

        if(
    unlocked &&
    !claimed
){

    div.style.cursor =
        "pointer";

    div.onclick = () => {

        claimAchievement(id);

    };

}

// Build the progress text

let progressText = "";
let progressPercent = 0;
        
if(
    achievement.type === "stat"
){

    const current = Math.min(

        save.achievementStats[
            achievement.stat
        ] || 0,

        achievement.target

    );

    progressPercent =

    (current /

    achievement.target)

    * 100;

    progressText =

        formatNumber(current)

        +

        " / "

        +

        formatNumber(
            achievement.target
        );

}

else if(
    achievement.type === "level"
){

    const current = Math.min(

        save.factoryLevel,

        achievement.target

    );

    progressPercent =

    (current /

    achievement.target)

    * 100;

    progressText =

        formatNumber(current)

        +

        " / "

        +

        formatNumber(
            achievement.target
        );

}

let rewardText = "???";

div.innerHTML =

    "<strong>" +

    achievement.name +

    "</strong><br>" +

    achievement.description +

    "<br><br>" +

    (
claimed

?

"🟢 Completed"

:

unlocked

?

"🟡 Reward Available"

:

"<strong>Progress</strong><br>" +

        progressText +

        "<div class='achievement-progress'>" +

            "<div class='achievement-progress-fill' style='width:" +

                progressPercent +

                "%'></div>" +

        "</div>"

    )

    +

    "<br><br>" +
"<strong>Reward</strong><br>" +

rewardText +

(

    unlocked &&

    !claimed

    ?

    "<div class='achievement-claim-banner'>" +

    "🎁 CLAIM REWARD" +

    "</div>"

    :

    ""

);

        container.appendChild(
    div
);

    });

}

          function showDiscoveryPopup(
    oreName,
    oreValue
){

    document.getElementById(
        "popupOreName"
    ).textContent =
        oreName;

document.getElementById(
    "popupOreValue"
).textContent =
    "$" +
    formatNumber(
        oreValue,
        2
    );

    document.getElementById(
        "discoveryPopup"
    ).style.display =
        "block";

}

function closeDiscoveryPopup(){

    document.getElementById(
        "discoveryPopup"
    ).style.display =
        "none";

}

function showMilestonePopup(
    level
){

    document.getElementById(
        "milestonePopupLevel"
    ).textContent =
        level.toLocaleString();

    document.getElementById(
        "milestonePopup"
    ).style.display =
        "block";

}

function closeMilestonePopup(){

    document.getElementById(
        "milestonePopup"
    ).style.display =
        "none";

}

function showAchievementPopup(
    achievement
){

    const toast =
        document.getElementById(
            "achievementToast"
        );

    document.getElementById(
        "achievementPopupName"
    ).textContent =
        achievement.name;

    document.getElementById(
        "achievementPopupDescription"
    ).textContent =
        achievement.description;

    toast.classList.add(
        "show"
    );

    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 7000);

}

function resetSave(){
    if(recoveryState.active){
        resetRecoverySave();
        return;
    }

    if(
        !confirm(
            "Delete all save data?"
        )
    ){
        return;
    }

    localStorage.removeItem(
        "ef_incremental"
    );

    location.reload();

}

document.getElementById("exportRawSave").onclick = exportRecoverySave;
document.getElementById("retrySaveLoad").onclick = attemptSaveLoad;
document.getElementById("resetRecoverySave").onclick = resetRecoverySave;
// V1-GAME01: private development profile. Not public V2 activation.
let pendingDevelopmentWrite = null;
const DEVELOPMENT_MINER_MAX_TIER = 25;
const DEVELOPMENT_MINER_MAX_ORE_LUCK = 50;
function isMinerDevelopment(state = save){ return state.developmentProfile === "miner-1"; }
function createMinerDevelopmentSave(){
    return Object.assign(createDefaultSave(), {
        developmentProfile: "miner-1",
        developerTools: { furnaceEnabled: false },
        shop: { miningPower: 0, minerUnlocked: false },
        manual: { firstActionCompleted: false, equippedPickaxeId: "pickaxe:default", pickaxes: [] },
        factory: { minerSlots: MinerCandidateModel.createSlotAccess(), miners: [], polishers: [] },
        processedInventory: { polished: [], refined: [] },
        statistics: PolishedOutputStatisticsCandidateModel.createStatistics(),
        identity: { nextEntitySequence: 1, nextManualEquipSequence: 1 }
    });
}
function developmentRecord(value, keys){
    if(!value || typeof value !== "object" || Array.isArray(value) ||
        Reflect.ownKeys(value).length !== keys.length || keys.some(key => {
            const d = Object.getOwnPropertyDescriptor(value, key);
            return !d || !d.enumerable || !("value" in d);
        })) throw Error("Invalid development record");
}
function minerProjection(state){
    return { cash: state.cash, shop: { minerUnlocked: state.shop.minerUnlocked },
        factory: { minerSlots: state.factory.minerSlots, miners: state.factory.miners }, identity: state.identity };
}
function developmentOre(id){
    if(id === "stone") return { key: "stone", name: "Stone", emoji: "🪨", value: 1, xp: 1, tier: 0 };
    for(const [index, ores] of [TIER_1_ORES,TIER_2_ORES,TIER_3_ORES,TIER_4_ORES].entries()){
        if(ores.includes(id)) return { ...ORES[id], key: id, tier: index + 1 };
    }
    throw Error("Unknown resource");
}
function validateDevelopmentResult(actual, expected){
    if(expected !== null && typeof expected === "object"){
        if(Array.isArray(expected)){
            if(!Array.isArray(actual) || actual.length !== expected.length || Reflect.ownKeys(actual).length !== actual.length + 1) throw Error("Invalid result array");
        }else developmentRecord(actual, Object.keys(expected));
        for(const key of Object.keys(expected)) validateDevelopmentResult(actual[key], expected[key]);
    }else if(actual !== expected) throw Error("Invalid Miner result");
}
function minerResult(resourceId){
    const ore = developmentOre(resourceId);
    return { outputs: [InventoryModel.createLot({ resourceId, stage: "raw", refineCount: 0, amount: 1,
        polishedValue: null, preRefinerValue: null, refineBonus: null })],
        cashDelta: 0, factoryXPDelta: ore.xp, gemDustDelta: 0,
        events: [{ type: "resourceAcquired", resourceId, stage: "raw", refineCount: 0, amount: 1 }] };
}
function validateDevelopmentSave(state){
    if(!Object.prototype.hasOwnProperty.call(state, "developmentProfile")) return; // supported legacy mode
    try{
        if(!isMinerDevelopment(state)) throw Error("Unsupported development profile");
        if(Object.hasOwn(state, "developerTools")){
            developmentRecord(state.developerTools, ["furnaceEnabled"]);
            if(typeof state.developerTools.furnaceEnabled !== "boolean") throw Error("Invalid developer Furnace mode");
            if(state.developerTools.furnaceEnabled && state.autoFurnaceBatch.length)
                throw Error("Developer Furnace cannot own an automatic batch");
        }
        for(const key of Object.keys(createDefaultSave())) if(!Object.hasOwn(state, key)) throw Error("Missing development field: " + key);
        for(const key of ["stone", ...ORE_KEYS]) if(!Object.hasOwn(state.inventory, key)) throw Error("Missing inventory counter");
        developmentRecord(state.shop, ["miningPower", "minerUnlocked"]);
        if(![0,1].includes(state.shop.miningPower) || state.shop.minerUnlocked && state.shop.miningPower !== 1)
            throw Error("Invalid Mining Power prerequisite");
        developmentRecord(state.manual, ["firstActionCompleted", "equippedPickaxeId", "pickaxes"]);
        if(typeof state.manual.firstActionCompleted !== "boolean" || state.manual.equippedPickaxeId !== "pickaxe:default" ||
            !Array.isArray(state.manual.pickaxes) || state.manual.pickaxes.length) throw Error("Unsupported Pickaxe state");
        const projection = copySaveData(minerProjection(state));
        if(!Array.isArray(projection.factory.miners) || projection.factory.miners.length > 5 || state.droppers !== 0)
            throw Error("At most five Miners are supported; legacy Droppers are retired");
        for(const miner of projection.factory.miners){
            const cycle = miner.cycle;
            miner.cycle = null; // explicit idle projection; active data is validated below, never discarded from state
            if(!Number.isInteger(miner.tier) || miner.tier < 1 || miner.tier > DEVELOPMENT_MINER_MAX_TIER ||
                !Number.isInteger(miner.oreLuckLevel) || miner.oreLuckLevel < 0 ||
                miner.oreLuckLevel > DEVELOPMENT_MINER_MAX_ORE_LUCK || !state.shop.minerUnlocked)
                throw Error("Unsupported Miner ownership");
            // This profile has no Discount/Preservation ownership. Require the
            // exact purchase history; never infer paid tiers from owned level.
            const entries = [{ kind: "purchase", targetLevel: null,
                cashPaid: CashPricingModel.calculateCashPrice(100, { category: "minerPurchase", discountLevel: 0 }), basis: "actual" }];
            for(let targetLevel = 2; targetLevel <= miner.tier; targetLevel++)
                entries.push({ kind: "tier", targetLevel,
                    cashPaid: MinerTierModel.getTierUpgradePrice(targetLevel, 0), basis: "actual" });
            for(let targetLevel = 1; targetLevel <= miner.oreLuckLevel; targetLevel++)
                entries.push({ kind: "oreLuck", targetLevel,
                    cashPaid: MinerOreLuckModel.getUpgradePrice(targetLevel, 0), basis: "actual" });
            developmentRecord(miner.investment, ["entries"]);
            if(!Array.isArray(miner.investment.entries) || miner.investment.entries.length !== entries.length)
                throw Error("Invalid Miner investment history");
            if(miner.investment.entries[0]?.kind !== "purchase")
                throw Error("Miner purchase must precede upgrades");
            // Tier and local Luck are independent purchases. Validate the exact
            // required set without rewriting the chronological saved history.
            let paidTier = 1, paidOreLuck = 0;
            for(const payment of miner.investment.entries){
                const index = entries.findIndex(expected => expected.kind === payment?.kind && expected.targetLevel === payment?.targetLevel);
                if(index < 0) throw Error("Unexpected or duplicate Miner payment");
                validateDevelopmentResult(payment, entries.splice(index, 1)[0]);
                if(payment.kind === "tier" && payment.targetLevel !== ++paidTier)
                    throw Error("Tier payments must follow purchased tier order");
                if(payment.kind === "oreLuck" && payment.targetLevel !== ++paidOreLuck)
                    throw Error("Ore Luck payments must follow purchased level order");
            }
            if(cycle === null) continue;
            developmentRecord(cycle, ["id","phase","startedAtMs","durationMs","inputs","saleUnitValues","effectContext","result"]);
            if(cycle.id !== miner.id + "/cycle:" + (miner.nextCycleSequence - 1) || miner.nextCycleSequence < 2)
                throw Error("Invalid cycle identity");
            CycleEffectContextModel.validateMetadata(cycle.effectContext, "miner", {
                startedAtMs: cycle.startedAtMs, durationMs: cycle.durationMs, inputs: cycle.inputs, saleUnitValues: cycle.saleUnitValues });
            const c = cycle.effectContext;
            if(c.tier > miner.tier || c.overallLuck !== 1 || c.rebirthOreLuckLevel !== 0 ||
                c.localOreLuckLevel > miner.oreLuckLevel || c.speedLevel !== 0)
                throw Error("Unsupported bound effects");
            if(cycle.phase === "reserved"){
                if(cycle.result !== null) throw Error("Reserved cycle has result");
            }else if(cycle.phase === "resolved"){
                const resourceId = cycle.result?.outputs?.[0]?.resourceId;
                const outputTier = developmentOre(resourceId).tier;
                const probabilities = MinerTierModel.getTierProbabilities(c.tier, c.overallLuck);
                if(probabilities[outputTier === 0 ? "stone" : "tier" + outputTier] <= 0)
                    throw Error("Miner result is inaccessible to the captured tier");
                const expected = minerResult(resourceId);
                // Exact canonical nested shapes and values, independent of JSON key order.
                validateDevelopmentResult(cycle.result, expected);
            }else throw Error("Invalid cycle phase");
        }
        validateDevelopmentPolishers(state);
        MinerCandidateModel.validateCandidate(projection, state.factory.polishers.map(m => m.id));
    }catch(error){
        throw saveLoadError("DEVELOPMENT_INCOMPATIBLE", "Incompatible development save: " + error.message, error);
    }
}
function exactDevelopmentAdd(before, amount){
    const after = before + amount;
    if(!Number.isFinite(after) || after - before !== amount || after - amount !== before) throw Error("Quantity precision exhausted");
    return after;
}
function prepareDevelopmentProgress(state){
    state.factoryLevel = getFactoryLevelFromXP(state.factoryXP);
    for(const level of FACTORY_MILESTONES) if(state.factoryLevel >= level) state.factoryMilestones[level] = true;
    for(const [id, achievement] of Object.entries(ACHIEVEMENTS)){
        const value = achievement.type === "stat" ? state.achievementStats[achievement.stat] || 0 : state.factoryLevel;
        if(value >= achievement.target && !state.achievements[id]?.unlocked)
            state.achievements[id] = { unlocked: true, claimed: false };
    }
}
function prepareDevelopmentAward(state, resourceId, amount, manual){
    const ore = developmentOre(resourceId);
    state.inventory[resourceId] = exactDevelopmentAdd(state.inventory[resourceId], amount);
    state.totalOres = exactDevelopmentAdd(state.totalOres, amount);
    const counter = ore.tier === 0 ? "stoneOres" : "tier" + ore.tier + "Ores";
    state[counter] = exactDevelopmentAdd(state[counter], amount);
    state.factoryXP = exactDevelopmentAdd(state.factoryXP, ore.xp * amount);
    if(ore.tier){
        if(state.oreCollection[resourceId] === 0) state.achievementStats.oresDiscovered++;
        state.oreCollection[resourceId] = exactDevelopmentAdd(state.oreCollection[resourceId], amount);
    }
    if(manual){
        state.lastOre = ore.emoji + " " + ore.name; state.lastOreValue = ore.value;
        state.achievementStats.totalOresMined = exactDevelopmentAdd(state.achievementStats.totalOresMined, 1);
        state.manual.firstActionCompleted = true;
    }
    prepareDevelopmentProgress(state);
}
function publishDevelopmentState(next){
    const previous = save;
    save = next;
    document.getElementById("minerFeedback").textContent = "";
    for(const id of ORE_KEYS) if(previous.oreCollection[id] === 0 && save.oreCollection[id] > 0){
        const ore = developmentOre(id); showDiscoveryPopup(ore.emoji + " " + ore.name, ore.value);
    }
    for(const [id, progress] of Object.entries(save.achievements))
        if(progress.unlocked && !previous.achievements[id]?.unlocked) pendingAchievement = ACHIEVEMENTS[id];
    for(const level of FACTORY_MILESTONES)
        if(save.factoryMilestones[level] && !previous.factoryMilestones[level]) pendingMilestone = level;
    updateUI();
}
function retryDevelopmentWrite(){
    if(!pendingDevelopmentWrite) return false;
    try{
        localStorage.setItem(SAVE_KEY, pendingDevelopmentWrite.serialized);
    }catch(error){
        document.getElementById("developmentWriteError").textContent = "Saving failed. Gameplay is paused. Free browser storage, then retry the same transaction. Your previous stored save is preserved.";
        document.getElementById("developmentWriteRecovery").hidden = false;
        document.getElementById("gameRoot").inert = true;
        return false;
    }
    const next = pendingDevelopmentWrite.candidate, feedback = pendingDevelopmentWrite.feedback;
    pendingDevelopmentWrite = null;
    document.getElementById("developmentWriteRecovery").hidden = true;
    document.getElementById("gameRoot").inert = false;
    publishDevelopmentState(next);
    if(feedback){
        document.getElementById("devFeedback").textContent = feedback.message;
        if(feedback.minerSale) document.getElementById("minerFeedback").textContent = feedback.message;
        if(feedback.polisherSale) document.getElementById("polisherFeedback").textContent = feedback.message;
        if(feedback.smelt){ pendingSmelt = {}; closeSmeltConfirm(); buildFurnaceMenu(); }
    }
    return true;
}
function commitDevelopmentState(candidate, feedback = null){
    if(pendingDevelopmentWrite || recoveryState.active) return false;
    validateSaveData(candidate); validateDevelopmentSave(candidate);
    const serialized = JSON.stringify(candidate);
    pendingDevelopmentWrite = { candidate, serialized, feedback };
    return retryDevelopmentWrite();
}
function developmentCommand(prepare, feedback = null){
    if(!isMinerDevelopment() || pendingDevelopmentWrite || recoveryState.active) return false;
    try{ validateSaveData(save); validateDevelopmentSave(save); const next = copySaveData(save); prepare(next); return commitDevelopmentState(next, feedback); }
    catch(error){
        document.getElementById("minerFeedback").textContent = error.message;
        if(feedback) document.getElementById("devFeedback").textContent = error.message;
        if(feedback?.smelt) document.getElementById("smeltFeedback").textContent = error.message;
        if(feedback?.polisherSale) document.getElementById("polisherFeedback").textContent = error.message;
        return false;
    }
}
function developmentDebit(cash, price){
    const remaining = cash - price;
    if(cash < price || !Number.isFinite(remaining) || remaining < 0 || remaining + price !== cash || cash - remaining !== price)
        throw Error("Insufficient Cash or unrepresentable debit");
    return remaining;
}
// DEV01: private-profile test tools. These are client-side utilities, not an
// authorization boundary. Exclude/disable them before a public release.
function developerFurnaceEnabled(state = save){
    return isMinerDevelopment(state) && state.developerTools?.furnaceEnabled === true;
}
function developerAmount(input){
    if(typeof input === "string"){
        const text = input.trim();
        if(!/^[0-9]+$/.test(text)) throw Error("Enter a positive whole Cash amount using digits only.");
        const amount = Number(text);
        if(!Number.isFinite(amount) || BigInt(text) !== BigInt(amount)) throw Error("Cash amount cannot be represented exactly.");
        input = amount;
    }
    if(typeof input !== "number" || !Number.isFinite(input) || !Number.isInteger(input) || input <= 0)
        throw Error("Cash amount must be a positive finite whole number.");
    return input;
}
function addDeveloperCash(input){
    if(!isMinerDevelopment() || pendingDevelopmentWrite || recoveryState.active) return false;
    try{
        const amount = developerAmount(input);
        return developmentCommand(next => { next.cash = exactDevelopmentAdd(next.cash, amount); },
            { message: "Added $" + amount.toLocaleString() + " Cash. Saved." });
    }catch(error){ document.getElementById("devFeedback").textContent = error.message; return false; }
}
function setDeveloperFurnace(enabled){
    return developmentCommand(next => {
        if(typeof enabled !== "boolean") throw Error("Invalid Developer Furnace setting.");
        if(autoFurnaceState.processing || next.autoFurnaceBatch.length)
            throw Error("Wait for the current Auto Furnace batch to finish before switching.");
        next.developerTools = { furnaceEnabled: enabled };
    }, { message: enabled ? "Developer Furnace enabled. Manual sales only; Auto Furnace paused." : "Normal Furnace restored. Saved Auto Furnace preference retained.", smelt: true });
}
function exactDevelopmentProduct(a, b){
    const result = a * b;
    if(!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0 || !Number.isFinite(result) ||
        (a !== 0 && result / a !== b) || (b !== 0 && result / b !== a) ||
        (Number.isInteger(a) && Number.isInteger(b) && BigInt(result) !== BigInt(a) * BigInt(b)))
        throw Error("Sale value cannot be represented exactly.");
    return result;
}
function developmentSmeltQuote(state, key, amount){
    const ore = developmentOre(key), available = state.inventory[key];
    if(!Number.isFinite(available) || !Number.isInteger(available) || available < 0 ||
        !Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0 || amount > available ||
        (!developerFurnaceEnabled(state) && amount > FURNACES[state.furnaceTier].capacity))
        throw Error("Invalid or unavailable Furnace quantity. Select the batch again.");
    const normalValue = key === "stone" ? state.stoneValue : ore.value;
    const value = exactDevelopmentProduct(normalValue, developerFurnaceEnabled(state) ? 1000 : 1);
    const total = exactDevelopmentProduct(amount, value);
    exactDevelopmentAdd(state.cash, total);
    return { value, total };
}
function prepareDevelopmentSmelt(key, percent){
    document.getElementById("confirmCohort").textContent = "";
    document.getElementById("confirmFurnaceMode").textContent = developerFurnaceEnabled() ? "Developer Furnace · testing ×1,000" : "Normal Furnace";
    if(pendingDevelopmentWrite || recoveryState.active || autoFurnaceState.processing) return false;
    try{
        validateSaveData(save); validateDevelopmentSave(save); developmentOre(key);
        if(![0.25,0.5,1].includes(percent)) throw Error("Invalid Furnace percentage.");
        const available = save.inventory[key];
        const amount = Math.min(Math.floor(available * percent), developerFurnaceEnabled() ? available : FURNACES[save.furnaceTier].capacity);
        const quote = developmentSmeltQuote(save, key, amount);
        pendingSmelt = { key, amount, developerMode: developerFurnaceEnabled() };
        document.getElementById("smeltFeedback").textContent = "";
        document.getElementById("furnaceFeedback").textContent = "";
        document.getElementById("confirmOre").textContent = developmentOre(key).name;
        document.getElementById("confirmAmount").textContent = amount.toLocaleString();
        document.getElementById("confirmValue").textContent = quote.value.toLocaleString();
        document.getElementById("confirmTotal").textContent = quote.total.toLocaleString();
        document.getElementById("smeltConfirmModal").style.display = "block";
        return true;
    }catch(error){
        document.getElementById("devFeedback").textContent = error.message;
        document.getElementById("furnaceFeedback").textContent = error.message;
        document.getElementById("minerFeedback").textContent = error.message;
        return false;
    }
}
// GAME10: identity is the complete canonical Lot metadata, never an array index.
// This private three-tier Furnace has no normal ore sale multiplier. Do not
// activate FurnaceModel's twenty-tier multipliers or reapply Ore Value here.
function polishedSaleCohort(state, selection){
    InventoryModel.validateLot(selection);
    if(selection.stage !== "polished") throw Error("Select a Polished ore cohort.");
    InventoryModel.validateProcessedInventory(state.processedInventory);
    let cohort = null;
    for(const lot of state.processedInventory.polished){
        if(InventoryModel.lotsCompatible(lot, selection))
            cohort = cohort ? InventoryModel.mergeLots(cohort, lot) : InventoryModel.createLot(lot);
    }
    if(!cohort) throw Error("This Polished cohort is no longer available. Select it again.");
    return cohort;
}
function polishedSaleQuantity(available, percent, capacity){
    if(![0.25, 0.5, 1].includes(percent)) throw Error("Invalid Furnace percentage.");
    // Exact floor of the chosen fraction, including representable large Counts.
    const requested = BigInt(available) / BigInt(1 / percent);
    const amount = Number(requested);
    if(!Number.isFinite(amount) || BigInt(amount) !== requested) throw Error("Batch quantity cannot be represented exactly.");
    const limited = capacity === null ? amount : Math.min(amount, capacity);
    if(limited <= 0) throw Error("This percentage selects zero items. Choose a larger batch.");
    return limited;
}
function developmentPolishedSmeltQuote(state, selection, amount){
    const cohort = polishedSaleCohort(state, selection);
    if(typeof amount !== "number" || !Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0 || amount > cohort.amount ||
        (!developerFurnaceEnabled(state) && amount > FURNACES[state.furnaceTier].capacity))
        throw Error("Invalid or unavailable Polished Furnace quantity. Select the batch again.");
    InventoryModel.splitLot(cohort, amount); // Validate exact conservation before quoting.
    const value = exactDevelopmentProduct(cohort.polishedValue, developerFurnaceEnabled(state) ? 1000 : 1);
    const total = exactDevelopmentProduct(value, amount);
    exactDevelopmentAdd(state.cash, total);
    return { available: cohort.amount, value, total, developerMode: developerFurnaceEnabled(state), furnaceTier: state.furnaceTier };
}
function polishedCashText(value){ return value.toLocaleString(undefined, { maximumSignificantDigits: 21 }); }
function prepareDevelopmentPolishedSmelt(selection, percent){
    if(!isMinerDevelopment() || pendingDevelopmentWrite || recoveryState.active) return false;
    try{
        if(autoFurnaceState.processing || save.autoFurnaceBatch.length) throw Error("Wait for the active Auto Furnace batch to finish.");
        validateSaveData(save); validateDevelopmentSave(save);
        const cohort = polishedSaleCohort(save, selection);
        const amount = polishedSaleQuantity(cohort.amount, percent, developerFurnaceEnabled() ? null : FURNACES[save.furnaceTier].capacity);
        const quote = developmentPolishedSmeltQuote(save, cohort, amount);
        pendingSmelt = { kind: "polished", cohort: { ...cohort, amount: 1 }, amount, quote };
        document.getElementById("smeltFeedback").textContent = "";
        document.getElementById("furnaceFeedback").textContent = "";
        document.getElementById("confirmOre").textContent = "Polished " + developmentOre(cohort.resourceId).name;
        document.getElementById("confirmCohort").textContent = "Captured cohort value: $" + polishedCashText(cohort.polishedValue);
        document.getElementById("confirmFurnaceMode").textContent = quote.developerMode ? "Developer Furnace · testing ×1,000" : "Normal Furnace";
        document.getElementById("confirmAmount").textContent = amount.toLocaleString();
        document.getElementById("confirmValue").textContent = polishedCashText(quote.value);
        document.getElementById("confirmTotal").textContent = polishedCashText(quote.total);
        document.getElementById("smeltConfirmModal").style.display = "block";
        return true;
    }catch(error){ document.getElementById("furnaceFeedback").textContent = error.message; return false; }
}
function confirmDevelopmentPolishedSmelt(){
    return developmentCommand(next => {
        if(autoFurnaceState.processing || next.autoFurnaceBatch.length) throw Error("Wait for the active Auto Furnace batch to finish, then review the sale.");
        const { cohort, amount, quote: preview } = pendingSmelt;
        const quote = developmentPolishedSmeltQuote(next, cohort, amount);
        if(!preview || Object.keys(quote).some(key => quote[key] !== preview[key]))
            throw Error("Cohort quantity or Furnace quote changed. Select the batch again to review it.");
        let remaining = amount;
        next.processedInventory.polished = next.processedInventory.polished.flatMap(lot => {
            if(remaining === 0 || !InventoryModel.lotsCompatible(lot, cohort)) return [lot];
            const take = Math.min(remaining, lot.amount), split = InventoryModel.splitLot(lot, take);
            remaining = developmentDebit(remaining, take);
            return split.remaining ? [split.remaining] : [];
        });
        if(remaining !== 0) throw Error("Polished input ownership changed.");
        next.cash = exactDevelopmentAdd(next.cash, quote.total);
        // Same existing private Furnace effects as raw sales; no new Polisher event.
        next.achievementStats.oresSmelted = exactDevelopmentAdd(next.achievementStats.oresSmelted, amount);
        next.factoryXP = exactDevelopmentAdd(next.factoryXP, amount);
        prepareDevelopmentProgress(next);
    }, { message: "Polished Furnace sale saved.", smelt: true });
}
function buildPolishedFurnaceMenu(){
    const container = document.getElementById("polishedFurnaceItems");
    container.innerHTML = "";
    if(!isMinerDevelopment()) return;
    try{
        // Group compatible records using InventoryModel, without rewriting saved stock.
        let grouped = InventoryModel.createProcessedInventory();
        for(const lot of save.processedInventory.polished) grouped = InventoryModel.addProcessedLot(grouped, lot);
        for(const cohort of grouped.polished){
            const row = document.createElement("section"); row.className = "furnace-cohort";
            const label = document.createElement("strong"); label.textContent = "✦ Polished " + developmentOre(cohort.resourceId).name;
            const details = document.createElement("p"); details.textContent = "Available: " + cohort.amount.toLocaleString() + " · Captured unit value: $" + polishedCashText(cohort.polishedValue);
            const estimate = document.createElement("p");
            try{
                const amount = polishedSaleQuantity(cohort.amount, 1, developerFurnaceEnabled() ? null : FURNACES[save.furnaceTier].capacity);
                const quote = developmentPolishedSmeltQuote(save, cohort, amount);
                estimate.textContent = "Current batch: " + amount.toLocaleString() + " · Estimated Cash: $" + polishedCashText(quote.total);
            }catch(error){ estimate.textContent = error.message; }
            const actions = document.createElement("div"); actions.className = "furnace-cohort-actions";
            const select = document.createElement("button"); select.textContent = "Select";
            select.onclick = () => {
                actions.replaceChildren();
                for(const percent of [0.25, 0.5, 1]){
                    const button = document.createElement("button"); button.textContent = percent * 100 + "%";
                    button.onclick = () => prepareDevelopmentPolishedSmelt(cohort, percent);
                    actions.appendChild(button);
                }
            };
            actions.appendChild(select); row.appendChild(label); row.appendChild(details); row.appendChild(estimate); row.appendChild(actions); container.appendChild(row);
        }
        if(!grouped.polished.length) container.textContent = "No completed Polished stock available. Queued and processing inputs cannot be sold.";
    }catch(error){ container.textContent = error.message; }
}

function renderDeveloperTools(){
    const supported = isMinerDevelopment(), enabled = developerFurnaceEnabled();
    document.getElementById("devCashControls").hidden = !supported;
    document.getElementById("enableDeveloperFurnace").disabled = !supported || enabled || autoFurnaceState.processing;
    document.getElementById("restoreNormalFurnace").disabled = !supported || !enabled;
    document.getElementById("devFurnaceStatus").textContent = !supported ? "Cash and testing Furnace tools require the miner-1 development profile. Legacy gameplay is unchanged." :
        enabled ? "Testing mode active. Capacity: Unlimited. Auto Furnace paused." : autoFurnaceState.processing ? "Normal Furnace active. Wait for its reserved batch before enabling testing mode." : "Normal Furnace active. Its tier and automatic preference are preserved.";
    document.getElementById("furnaceModeNotice").textContent = enabled ? "Testing only · Manual sales ×1,000 Cash · Auto Furnace paused." : "Smelt resources from your inventory to earn Cash.";
    document.getElementById("furnaceModalTitle").textContent = enabled ? "Developer Furnace · manual test sales" : "🔥 Furnace";
}
function buyMiningPower(){
    return developmentCommand(next => {
        if(next.shop.miningPower !== 0) throw Error("Mining Power I is already owned");
        const cost = CashPricingModel.calculateCashPrice(250, { category: "miningPower", discountLevel: 0 });
        next.cash = developmentDebit(next.cash, cost);
        next.shop.miningPower = 1;
    });
}
function unlockDevelopmentMiner(){
    return developmentCommand(next => {
        if(next.shop.miningPower !== 1) throw Error("Purchase Mining Power I first");
        if(next.shop.minerUnlocked) throw Error("Miners are already unlocked");
        next.cash = developmentDebit(next.cash, CashPricingModel.calculateCashPrice(100, { category: "unlockMiner", discountLevel: 0 }));
        next.shop.minerUnlocked = true;
    });
}
// The complete profile is validated before any idle-only model projection.
// Compose only authorized changes; never save projected null cycles over live work.
function idleDevelopmentMinerProjection(state){
    validateSaveData(state); validateDevelopmentSave(state);
    const projection = copySaveData(minerProjection(state));
    for(const miner of projection.factory.miners) miner.cycle = null;
    return projection;
}
function unlockDevelopmentMinerSlot(slot){
    return developmentCommand(next => {
        const result = MinerCandidateModel.prepareSlotUnlock(idleDevelopmentMinerProjection(next), slot, 0, next.factory.polishers.map(m => m.id));
        next.cash = result.cash;
        next.factory.minerSlots = result.factory.minerSlots;
    });
}
function buyDevelopmentMiner(slot = 1){
    return developmentCommand(next => {
        const result = MinerCandidateModel.preparePurchase(idleDevelopmentMinerProjection(next), slot, { discountLevel: 0, preservationLevel: 0 }, next.factory.polishers.map(m => m.id));
        const purchased = result.factory.miners.find(miner => miner.slot === slot);
        next.cash = result.cash; next.identity = result.identity;
        next.factory.miners.push(purchased);
    });
}
function upgradeDevelopmentMiner(minerId){
    return upgradeDevelopmentMinerStat(minerId, "tier");
}
function upgradeDevelopmentMinerOreLuck(minerId){
    return upgradeDevelopmentMinerStat(minerId, "oreLuck");
}
function upgradeDevelopmentMinerStat(minerId, kind){
    return developmentCommand(next => {
        // Certify the complete active record BEFORE projecting it for the
        // intentionally idle-only pure calculator. The projection is not saved.
        validateSaveData(next); validateDevelopmentSave(next);
        const miner = next.factory.miners.find(item => item.id === minerId);
        if(!miner) throw Error("Unknown Miner ID");
        if(kind !== "tier" && kind !== "oreLuck") throw Error("Unsupported Miner upgrade");
        const field = kind === "tier" ? "tier" : "oreLuckLevel";
        if(kind === "tier" ? miner.tier >= DEVELOPMENT_MINER_MAX_TIER : miner.oreLuckLevel >= DEVELOPMENT_MINER_MAX_ORE_LUCK)
            throw Error(kind === "tier" ? "Tier " + DEVELOPMENT_MINER_MAX_TIER + " is the maximum for this build" : "Local Ore Luck " + DEVELOPMENT_MINER_MAX_ORE_LUCK + " is the maximum");
        const projection = idleDevelopmentMinerProjection(next);
        const prepare = kind === "tier" ? MinerUpgradeCandidateModel.prepareTierUpgrade : MinerUpgradeCandidateModel.prepareOreLuckUpgrade;
        const result = prepare(projection, minerId, 0, next.factory.polishers.map(m => m.id));
        const upgraded = result.factory.miners.find(item => item.id === minerId);
        next.cash = result.cash;
        miner[field] = upgraded[field];
        miner.investment = upgraded.investment;
        // Everything else, including reserved/resolved work and its sequence,
        // remains untouched. developmentCommand validates and writes atomically.
    });
}
// GAME08: an ephemeral confirmation is intent, not a saved receipt or payout.
let pendingMinerSale = null;
function minerSaleSignature(miner){
    return JSON.stringify({ id: miner.id, slot: miner.slot, tier: miner.tier,
        oreLuckLevel: miner.oreLuckLevel, investment: miner.investment });
}
function developmentMinerSaleQuote(miner, cash){
    const refund = InvestmentModel.calculateMinerRefund(miner.investment);
    let cashAfter;
    try{
        cashAfter = exactDevelopmentAdd(cash, refund);
        if(Number.isInteger(cash) && BigInt(cashAfter) !== BigInt(cash) + BigInt(refund)) throw Error("precision");
    }catch(error){ throw Error("Sale unavailable: the Cash balance cannot receive this refund exactly. No Miner or Cash was changed."); }
    return { refund, cashAfter };
}
function closeDevelopmentMinerSale(){
    pendingMinerSale = null;
    document.getElementById("minerSaleModal").style.display = "none";
    document.getElementById("sellMiner").focus();
}
function settleDevelopmentMinerBeforeSale(miner){
    // Only an ALREADY resolved result commits here. Never resolve due reserved
    // work or start another cycle as part of a sale command.
    const committed = advanceDevelopmentMiner(miner.id, Date.now());
    document.getElementById("minerFeedback").textContent = committed ?
        "Pending output delivered once. Review the Miner and confirm its sale again." :
        "Pending output could not be saved. The Miner has not been sold; retry the pending write first.";
    return false;
}
function prepareDevelopmentMinerSale(minerId){
    if(!isMinerDevelopment() || pendingDevelopmentWrite || recoveryState.active) return false;
    closeDevelopmentMinerSale();
    try{
        validateSaveData(save); validateDevelopmentSave(save);
        const miner = save.factory.miners.find(item => item.id === minerId);
        if(!miner || minerId !== selectedDevelopmentMinerId) throw Error("Unknown or stale Miner selection. Select the Miner again.");
        if(miner.cycle?.phase === "resolved") return settleDevelopmentMinerBeforeSale(miner);
        const quote = developmentMinerSaleQuote(miner, save.cash);
        pendingMinerSale = { minerId, signature: minerSaleSignature(miner), refund: quote.refund };
        document.getElementById("minerSaleTitle").textContent = "Sell Slot " + miner.slot + " Miner?";
        document.getElementById("minerSaleIdentity").textContent = miner.id + " · Tier " + miner.tier + " · Local Ore Luck " + miner.oreLuckLevel;
        document.getElementById("minerSaleRefund").textContent = "$" + quote.refund.toLocaleString("en-US");
        document.getElementById("minerSaleWarning").textContent = "The Miner and its individual upgrades will be permanently removed. Reserved work gives no production award. Slot " + miner.slot + " remains unlocked, allowing a new Miner to be purchased for $100.";
        document.getElementById("minerSaleModal").style.display = "block";
        document.getElementById("cancelMinerSale").focus();
        return true;
    }catch(error){ document.getElementById("minerFeedback").textContent = error.message; return false; }
}
function confirmDevelopmentMinerSale(){
    const intent = pendingMinerSale;
    closeDevelopmentMinerSale(); // recovery must remain accessible if this write fails
    if(!intent || !isMinerDevelopment() || pendingDevelopmentWrite || recoveryState.active) return false;
    try{
        validateSaveData(save); validateDevelopmentSave(save);
        const miner = save.factory.miners.find(item => item.id === intent.minerId);
        if(!miner || selectedDevelopmentMinerId !== intent.minerId || minerSaleSignature(miner) !== intent.signature)
            throw Error("Sale confirmation is stale. Select the Miner and review a new quote.");
        if(miner.cycle?.phase === "resolved") return settleDevelopmentMinerBeforeSale(miner);
        return developmentCommand(next => {
            const target = next.factory.miners.find(item => item.id === intent.minerId);
            if(!target || minerSaleSignature(target) !== intent.signature || target.cycle?.phase === "resolved")
                throw Error("Miner changed before sale. Confirm again.");
            const quote = developmentMinerSaleQuote(target, next.cash);
            if(quote.refund !== intent.refund) throw Error("Refund changed. Confirm again.");
            next.cash = quote.cashAfter;
            next.factory.miners = next.factory.miners.filter(item => item.id !== target.id);
            // Access flags and both global counters survive. Removed IDs and their
            // operations cannot be revived by the central ID-targeted scheduler.
        }, { minerSale: true, message: "Miner sold for $" + intent.refund.toLocaleString("en-US") + ". Slot access retained." });
    }catch(error){ document.getElementById("minerFeedback").textContent = error.message; return false; }
}
function renderDevelopmentMinerResale(miner){
    const button = document.getElementById("sellMiner"), status = document.getElementById("minerResaleStatus");
    button.dataset.minerId = miner?.id || "";
    button.disabled = !miner;
    document.getElementById("minerResaleControls").hidden = !miner;
    if(!miner) return;
    let totalText;
    try{ totalText = "$" + InvestmentModel.sumInvestment(miner.investment, { machineType: "miner", owned: true }).toLocaleString("en-US"); }
    catch(error){ totalText = "beyond exact Number display (recorded payments retained)"; }
    try{
        const quote = developmentMinerSaleQuote(miner, save.cash);
        status.textContent = "Recorded investment: " + totalText + " · Refund: $" + quote.refund.toLocaleString("en-US") +
            (miner.cycle?.phase === "resolved" ? " · Pending output must save first; then confirm again." : " · Slot access stays unlocked.");
        button.disabled = !!pendingDevelopmentWrite || recoveryState.active;
    }catch(error){ status.textContent = "Recorded investment: " + totalText + " · " + error.message; button.disabled = true; }
}
function mineDevelopmentOre(){
    return developmentCommand(next => {
        const tier = next.manual.firstActionCompleted ? rollManualTier() : 0;
        const ore = tier === 0 ? developmentOre("stone") : getRandomOre([TIER_1_ORES,TIER_2_ORES,TIER_3_ORES,TIER_4_ORES][tier - 1]);
        const power = 0.25 * (DEFAULT_PICKAXE.rawPower + 2 * next.shop.miningPower);
        const amount = Math.floor(power) + (power % 1 > 0 && Math.random() < power % 1 ? 1 : 0);
        prepareDevelopmentAward(next, ore.key, amount, true);
    });
}
function updateDevelopmentMiner(){
    if(!isMinerDevelopment() || pendingDevelopmentWrite || recoveryState.active) return;
    const now = Date.now();
    const ids = [...save.factory.miners, ...save.factory.polishers].map(m => m.id)
        .sort((a,b) => Number(a.split(":")[1]) - Number(b.split(":")[1]));
    for(const id of ids){
        const isPolisher = id.startsWith("polisher:");
        for(let step=0;step<3;step++){
            if(pendingDevelopmentWrite || recoveryState.active) return;
            const before = (isPolisher ? save.factory.polishers : save.factory.miners).find(m => m.id === id)?.cycle;
            if(before?.phase === "reserved" && now < before.startedAtMs + before.durationMs) break;
            if(!(isPolisher ? advanceDevelopmentPolisher(id,now) : advanceDevelopmentMiner(id,now))) break;
            if(before === null) break; // Never complete newly reserved work in this tick.
        }
    }
    renderDevelopmentMiner(); renderDevelopmentPolishers();
}
function advanceDevelopmentMiner(minerId, now){
    const miner = save.factory.miners.find(item => item.id === minerId);
    if(!miner) return false;
    const cycle = miner.cycle;
    if(cycle === null){
        return developmentCommand(next => {
            const m = next.factory.miners.find(item => item.id === minerId);
            if(m.nextCycleSequence >= Number.MAX_SAFE_INTEGER) throw Error("Miner sequence exhausted");
            m.cycle = { id: m.id + "/cycle:" + m.nextCycleSequence++, phase: "reserved", startedAtMs: now,
                durationMs: MinerTierModel.getProductionInterval(m.tier, 0) * 1000, inputs: [], saleUnitValues: null,
                effectContext: { version: 1, kind: "miner", tier: m.tier, overallLuck: 1, rebirthOreLuckLevel: 0, localOreLuckLevel: m.oreLuckLevel, speedLevel: 0 }, result: null };
        });
    }else if(cycle.phase === "reserved" && now >= cycle.startedAtMs + cycle.durationMs){
        return developmentCommand(next => {
            const c = next.factory.miners.find(item => item.id === minerId).cycle, effects = c.effectContext;
            const probabilities = MinerTierModel.getTierProbabilities(effects.tier, effects.overallLuck);
            const roll = Math.random(); let cumulative = 0, tier = effects.tier >= 6 ? 4 : 3;
            for(let i = 0; i <= 4; i++){
                cumulative += probabilities[i === 0 ? "stone" : "tier" + i];
                if(roll < cumulative){ tier = i; break; }
            }
            const id = tier === 0 ? "stone" : MinerOreLuckModel.selectOreId(tier, effects.rebirthOreLuckLevel, effects.localOreLuckLevel, Math.random());
            c.result = minerResult(id); c.phase = "resolved";
        });
    }else if(cycle.phase === "resolved"){
        return developmentCommand(next => {
            const m = next.factory.miners.find(item => item.id === minerId), output = m.cycle.result.outputs[0];
            prepareDevelopmentAward(next, output.resourceId, output.amount, false);
            m.cycle = null;
        });
    }
    return false;
}
// Selection is ephemeral UI state; it never writes ownership or restarts work.
let selectedDevelopmentMinerId = null;
function selectDevelopmentMiner(minerId){
    if(!isMinerDevelopment() || !save.factory.miners.some(miner => miner.id === minerId)) return false;
    selectedDevelopmentMinerId = minerId;
    renderDevelopmentMiner();
    return true;
}
function renderDevelopmentMinerSlots(selectedId){
    for(let slot = 1; slot <= 5; slot++){
        const miner = save.factory.miners.find(item => item.slot === slot);
        const unlocked = save.factory.minerSlots[slot - 1];
        const button = document.getElementById(slot === 1 ? "buyMiner" : "minerSlotAction" + slot);
        const status = document.getElementById("minerSlotStatus" + slot);
        const card = document.getElementById("minerSlot" + slot);
        card.dataset.selected = String(miner?.id === selectedId);
        const price = unlocked ? MinerCandidateModel.getMinerPrice(0) : MinerCandidateModel.getSlotPrice(slot, 0);
        status.textContent = miner ? "Tier " + miner.tier + " · Luck " + miner.oreLuckLevel : unlocked ? "Vacant · $" + formatCash(price) : "Locked · $" + formatCash(price);
        button.textContent = miner ? (miner.id === selectedId ? "Selected" : "Manage") : unlocked ? "Buy Miner · $" + formatCash(price) : "Unlock · $" + formatCash(price);
        button.disabled = miner ? false : save.cash < price || (unlocked && !save.shop.minerUnlocked);
        button.title = miner ? miner.id : "Slot " + slot + " · $" + price.toLocaleString("en-US") + (unlocked && !save.shop.minerUnlocked ? " · Requires Unlock Miners" : "");
        button.onclick = miner ? () => selectDevelopmentMiner(miner.id) : unlocked ? () => buyDevelopmentMiner(slot) : () => unlockDevelopmentMinerSlot(slot);
        const c = miner?.cycle;
        document.getElementById("minerSlotProgress" + slot).value = c ? Math.max(0, Math.min(100, (Date.now() - c.startedAtMs) / c.durationMs * 100)) : 0;
        document.getElementById("minerSlotProgress" + slot).hidden = !miner;
    }
}
function renderDevelopmentMiner(){
    const active = isMinerDevelopment();
    document.getElementById("minerPanel").hidden = !active;
    document.getElementById("miningPowerCard").hidden = !active;
    document.getElementById("manualPowerStatus").hidden = !active;
    document.getElementById("legacyModeNotice").hidden = active;
    document.getElementById("legacyDropperOverview").hidden = active;
    document.getElementById("dropperCard").hidden = active;
    document.getElementById("multiplierCard").hidden = active;
    if(!active) return;
    const miner = save.factory.miners.find(item => item.id === selectedDevelopmentMinerId) ||
        save.factory.miners.find(item => item.slot === 1) || save.factory.miners.find(() => true);
    selectedDevelopmentMinerId = miner?.id || null;
    const unlocked = save.shop.minerUnlocked;
    renderDevelopmentMinerSlots(selectedDevelopmentMinerId);
    renderDevelopmentMinerResale(miner);
    document.getElementById("minerDetailTitle").textContent = miner ? "Slot " + miner.slot + " · " + miner.id : "Miner management";
    document.getElementById("manualPowerLink").textContent = save.shop.miningPower ? "Mining Power I owned · 50% chance of +1 resource" : "Mining Power I · available in the Shop";
    document.getElementById("buyMiningPower").disabled = save.shop.miningPower === 1 || save.cash < 250;
    document.getElementById("buyMiningPower").textContent = save.shop.miningPower ? "Purchased" : "Buy Mining Power I · $250";
    document.getElementById("unlockMiner").disabled = unlocked || !save.shop.miningPower || save.cash < 100;
    document.getElementById("unlockMiner").textContent = unlocked ? "Miner system unlocked" : "Unlock Miners · $100";
    const c = miner?.cycle;
    const interval = miner ? MinerTierModel.getProductionInterval(miner.tier, 0) : 0;
    document.getElementById("minerStatus").textContent = miner ? "Owned Tier " + miner.tier + " / 25 Miner · 1 resource per cycle · Next cycle: Tier " + miner.tier + " (" + Number(interval.toFixed(3)) + "s)" : unlocked ? "Slot 1 is free and vacant. Purchase your Miner separately." : "Requires Mining Power I. Unlocking does not buy a machine.";
    const upgrade = document.getElementById("upgradeMiner"), atCap = miner?.tier === DEVELOPMENT_MINER_MAX_TIER;
    const nextTier = (miner?.tier || 1) + 1;
    const price = atCap ? null : MinerTierModel.getTierUpgradePrice(nextTier, 0);
    upgrade.dataset.minerId = miner?.id || "";
    upgrade.title = atCap ? "Maximum tier" : "Exact price: $" + price.toLocaleString("en-US");
    upgrade.disabled = !miner || atCap || save.cash < price;
    upgrade.textContent = atCap ? "Tier " + DEVELOPMENT_MINER_MAX_TIER + " · Max Level" : "Upgrade to Tier " + nextTier + " · $" + formatCash(price);
    document.getElementById("minerUpgradeHint").textContent = !miner ? "Purchase your first Miner to upgrade it." : atCap ? "Maximum Miner tier reached." : save.cash < price ? "Earn $" + formatCash(price) + " Cash. The current cycle keeps its original effects." : "Faster production and improved ore chances begin next cycle.";
    const luckButton = document.getElementById("upgradeMinerOreLuck");
    const luckAtCap = miner?.oreLuckLevel === DEVELOPMENT_MINER_MAX_ORE_LUCK;
    const nextLuck = (miner?.oreLuckLevel || 0) + 1;
    const luckPrice = luckAtCap ? null : MinerOreLuckModel.getUpgradePrice(nextLuck, 0);
    luckButton.dataset.minerId = miner?.id || "";
    luckButton.title = luckAtCap ? "Maximum local Ore Luck" : "Exact price: $" + luckPrice.toLocaleString("en-US");
    luckButton.disabled = !miner || luckAtCap || save.cash < luckPrice;
    luckButton.textContent = luckAtCap ? "Local Ore Luck 50 · Max Level" : "Upgrade Local Ore Luck " + (nextLuck === 1 ? "I" : nextLuck === 2 ? "II" : nextLuck) + " · $" + formatCash(luckPrice);
    document.getElementById("minerOreLuckStatus").textContent = miner ? "Local Ore Luck: " + miner.oreLuckLevel + " / " + DEVELOPMENT_MINER_MAX_ORE_LUCK + " (" + MinerOreLuckModel.getFinalOreLuck(0, miner.oreLuckLevel).toFixed(2) + "×)" +
        (c && c.effectContext.localOreLuckLevel !== miner.oreLuckLevel ? " · Current cycle: Level " + c.effectContext.localOreLuckLevel + " · Next cycle: Level " + miner.oreLuckLevel : "") : "Purchase your first Miner to upgrade Local Ore Luck.";
    document.getElementById("minerOreLuckHint").textContent = "Improves which ore is selected within a rolled tier, not the chance of a higher tier. " +
        (luckAtCap ? "Future cycles use Level 50; existing work is unchanged." : "Costs $" + formatCash(luckPrice) + " Cash; no Factory Discount. " + (miner && save.cash < luckPrice ? "Insufficient Cash. " : "") + "Existing work keeps its captured level.");
    const progress = c ? Math.max(0, Math.min(100, (Date.now() - c.startedAtMs) / c.durationMs * 100)) : 0;
    document.getElementById("minerProgress").value = progress;
    document.getElementById("minerCycleStatus").textContent = c ? "Current cycle: Tier " + c.effectContext.tier + " · " + Number((c.durationMs / 1000).toFixed(3)) + "s · " + (c.phase === "resolved" ? "Output resolved · awaiting saved delivery" : "Mining… " + Math.floor(progress) + "%") : miner ? "Ready for the next cycle" : "No Miner owned";
}

document.getElementById("retryDevelopmentWrite").onclick = retryDevelopmentWrite;

// GAME09 private-profile extension. No public migration or challenge consumer.
function completeDevelopmentPolisherFields(state){
    if(!isMinerDevelopment(state)) return;
    const present = [Object.hasOwn(state.factory || {}, "polishers"), Object.hasOwn(state,"processedInventory"), Object.hasOwn(state,"statistics")];
    if(present.every(v => !v)){
        // Only pre-Polisher miner-1 states have this known absence. Never derive history from stock.
        state.factory.polishers = [];
        state.processedInventory = { polished: [], refined: [] };
        state.statistics = PolishedOutputStatisticsCandidateModel.createStatistics();
    }else if(!present.every(Boolean)) throw Error("Incomplete Polisher development fields; recovery required");
}
function polisherProjection(state){
    return {cash:state.cash, identity:{...state.identity}, factory:{polishers:state.factory.polishers.map(m => ({...m,queue:[],cycle:null}))}};
}
function validateDevelopmentPolishers(state){
    developmentRecord(state.factory,["minerSlots","miners","polishers"]);
    for(const key of ["challenges","activeChallenges","challengeState"])
        if(Object.hasOwn(state,key)) throw Error("Active challenge state is unsupported in this private profile");
    developmentRecord(state.processedInventory,["polished","refined"]);
    InventoryModel.validateProcessedInventory(state.processedInventory);
    PolishedOutputStatisticsCandidateModel.validateStatistics(state.statistics);
    PolisherCandidateModel.validateCandidate(polisherProjection(state),state.factory.miners.map(m=>m.id));
    for(const m of state.factory.polishers){
        const expected=[{kind:"purchase",targetLevel:null,cashPaid:PolisherCandidateModel.getPurchasePrice(m.slot,0),basis:"actual"}];
        for(let tier=2;tier<=m.tier;tier++) expected.push({kind:"tier",targetLevel:tier,cashPaid:PolisherModel.getTierUpgradePrice(tier,0),basis:"actual"});
        validateDevelopmentResult(m.investment,{entries:expected});
        const projection={polisher:m,inventory:state.inventory};
        if(m.cycle===null) PolisherReservationCandidateModel.validateCandidate(projection);
        else {
            if(m.cycle.phase==="reserved") PolisherResolutionCandidateModel.validateReservedCandidate(projection);
            else PolisherResolutionCandidateModel.validateResolvedCandidate(projection);
            if(m.cycle.effectContext.tier>m.tier || m.cycle.effectContext.valueLevel!==0) throw Error("Unsupported bound Polisher effects");
        }
    }
}
function polisherCommand(prepare){
    const result=developmentCommand(prepare);
    document.getElementById("polisherFeedback").textContent=result ? "Saved." : document.getElementById("minerFeedback").textContent;
    return result;
}
function buyDevelopmentPolisher(slot){
    return polisherCommand(next=>{
        const result=PolisherCandidateModel.preparePurchase(polisherProjection(next),slot,{discountLevel:0,preservationLevel:0},next.factory.miners.map(m=>m.id));
        next.cash=result.cash;next.identity=result.identity;
        next.factory.polishers.push(result.factory.polishers.find(m=>m.slot===slot));
    });
}
function upgradeDevelopmentPolisher(id){
    return polisherCommand(next=>{
        const result=PolisherCandidateModel.prepareTierUpgrade(polisherProjection(next),id,0,next.factory.miners.map(m=>m.id));
        const target=next.factory.polishers.find(m=>m.id===id), upgraded=result.factory.polishers.find(m=>m.id===id);
        next.cash=result.cash;target.tier=upgraded.tier;target.investment=upgraded.investment;
    });
}
function setDevelopmentPolisherOre(id,oreId){
    return polisherCommand(next=>{
        const m=next.factory.polishers.find(m=>m.id===id);
        if(!m || oreId!==null && !ORE_KEYS.includes(oreId)) throw Error("Select an eligible raw ore");
        m.selectedOreId=oreId; // Preference only; existing queue/input/context unchanged.
    });
}
function queueDevelopmentPolisher(id,amount){
    return polisherCommand(next=>{
        const m=next.factory.polishers.find(m=>m.id===id);
        if(!m || !ORE_KEYS.includes(m.selectedOreId) || !Number.isFinite(amount) || !Number.isInteger(amount) || amount<=0)
            throw Error("Queue requires selected raw ore and a positive whole quantity");
        const before=next.inventory[m.selectedOreId];
        if(amount>before || m.nextCycleSequence>=Number.MAX_SAFE_INTEGER) throw Error("Insufficient raw ore or exhausted sequence");
        const remaining=before-amount;
        if(remaining+amount!==before || before-remaining!==amount) throw Error("Input quantity precision exhausted");
        const lot=InventoryModel.createLot({resourceId:m.selectedOreId,stage:"raw",refineCount:0,amount,polishedValue:null,preRefinerValue:null,refineBonus:null});
        next.inventory[m.selectedOreId]=remaining;
        m.queue.push({id:m.id+"/queue:"+m.nextCycleSequence++,lot});
    });
}
function reserveDevelopmentPolisher(id,source,now){
    return polisherCommand(next=>{
        const m=next.factory.polishers.find(m=>m.id===id);
        if(!m) throw Error("Unknown Polisher");
        // Existing profile Ore Value helper, once, at reservation. No Furnace/Developer multiplier.
        const currentOreValue=developmentOre(m.selectedOreId).value*getOreValueMultiplier();
        const result=PolisherReservationCandidateModel.prepareReservation({polisher:m,inventory:next.inventory},id,source,
            {currentOreValue,valueLevel:0,startedAtMs:now});
        next.inventory=result.inventory;next.factory.polishers[next.factory.polishers.findIndex(m=>m.id===id)]=result.polisher;
    });
}
function advanceDevelopmentPolisher(id,now){
    const m=save.factory.polishers.find(m=>m.id===id);
    if(!m) return false;
    if(m.cycle===null){
        // Queue entries are explicit player-selected sources; never invent queue priority or mix owners.
        if(m.queue.length || !m.selectedOreId || !save.inventory[m.selectedOreId]) return false;
        return reserveDevelopmentPolisher(id,{kind:"inventory"},now);
    }
    if(m.cycle.phase==="reserved"){
        if(now<m.cycle.startedAtMs+m.cycle.durationMs) return false;
        return polisherCommand(next=>{
            const target=next.factory.polishers.find(m=>m.id===id);
            const result=PolisherResolutionCandidateModel.prepareResolution({polisher:target,inventory:next.inventory},id,m.cycle.id,now);
            next.factory.polishers[next.factory.polishers.findIndex(m=>m.id===id)]=result.polisher;
        });
    }
    return polisherCommand(next=>{
        const target=next.factory.polishers.find(m=>m.id===id), event=target.cycle.result.events[0];
        const result=PolisherCommitCandidateModel.prepareCommit({polisher:target,inventory:next.inventory,processedInventory:next.processedInventory},id,m.cycle.id);
        const statistics=PolishedOutputStatisticsCandidateModel.prepareIncrement(next.statistics,event);
        // One full candidate/write: no inventory/statistics split and no mining/event callbacks.
        next.processedInventory=result.processedInventory;next.statistics=statistics;
        next.factory.polishers[next.factory.polishers.findIndex(m=>m.id===id)]=result.polisher;
    });
}
// GAME11: transient intent binds the full machine, including queues and work.
let pendingPolisherSale = null;
function polisherSaleSignature(machine){ return JSON.stringify(machine); }
function polisherReturnAdd(before, amount){
    const after = exactDevelopmentAdd(before, amount);
    if(BigInt(after) !== BigInt(before) + BigInt(amount)) throw Error("Raw ore return cannot be represented exactly.");
    return after;
}
function developmentPolisherSaleQuote(machine, state){
    if(machine.cycle?.phase === "resolved") throw Error("Pending Polished output must be delivered before resale.");
    const context = { machineType: "polisher", owned: true };
    const total = InvestmentModel.sumInvestment(machine.investment, context);
    const refund = InvestmentModel.calculateRefund(machine.investment, context);
    // All canonical profile tier/slot totals fit exactly. Keep the model's
    // fractional-history behavior; never coerce payments or bypass validation.
    if(machine.investment.entries.every(p => Number.isInteger(p.cashPaid))){
        const exact = machine.investment.entries.reduce((sum,p) => sum + BigInt(p.cashPaid),0n);
        if(BigInt(total) !== exact || BigInt(refund) !== exact / 2n) throw Error("Investment refund cannot be represented exactly.");
    }
    let cashAfter;
    try{
        cashAfter = exactDevelopmentAdd(state.cash, refund);
        if(Number.isInteger(state.cash) && BigInt(cashAfter) !== BigInt(state.cash) + BigInt(refund)) throw Error("precision");
    }catch(error){ throw Error("Sale unavailable: Cash cannot receive the refund exactly. No stock or ownership was changed."); }
    const queued = {}, reserved = {}, returns = {}, inventoryAfter = {};
    const add = (map, lot) => {
        InventoryModel.validateLot(lot);
        if(lot.stage !== "raw" || !ORE_KEYS.includes(lot.resourceId)) throw Error("Only owned raw ore can be returned.");
        map[lot.resourceId] = polisherReturnAdd(map[lot.resourceId] || 0, lot.amount);
        returns[lot.resourceId] = polisherReturnAdd(returns[lot.resourceId] || 0, lot.amount);
    };
    for(const entry of machine.queue) add(queued, entry.lot);
    if(machine.cycle) for(const lot of machine.cycle.inputs) add(reserved, lot);
    for(const id of ORE_KEYS) if(returns[id]) inventoryAfter[id] = polisherReturnAdd(state.inventory[id], returns[id]);
    return { total, refund, cashAfter, queued, reserved, returns, inventoryAfter };
}
function polisherReturnText(amounts){
    return ORE_KEYS.filter(id=>amounts[id]).map(id=>amounts[id].toLocaleString()+" "+developmentOre(id).name).join(", ") || "None";
}
function closeDevelopmentPolisherSale(){
    pendingPolisherSale = null;
    document.getElementById("polisherSaleModal").style.display = "none";
    document.getElementById("sellPolisher").focus();
}
function settleDevelopmentPolisherBeforeSale(machine){
    // This entry is used only for an already-resolved result. Never advance a
    // merely overdue reservation, and never chain a sale or new reservation.
    const committed = advanceDevelopmentPolisher(machine.id, Date.now());
    if(!committed && pendingDevelopmentWrite) pendingDevelopmentWrite.feedback = { polisherSale: true, message: "Pending Polished output delivered once. Review the Polisher and confirm a new sale." };
    document.getElementById("polisherFeedback").textContent = committed ?
        "Pending Polished output delivered once. Review the Polisher and confirm a new sale." :
        "Pending output could not be saved. The Polisher has not been sold; retry the pending write first.";
    return false;
}
function prepareDevelopmentPolisherSale(id){
    if(!isMinerDevelopment() || pendingDevelopmentWrite || recoveryState.active) return false;
    closeDevelopmentPolisherSale();
    try{
        validateSaveData(save); validateDevelopmentSave(save);
        const m = save.factory.polishers.find(m=>m.id===id);
        if(!m || selectedDevelopmentPolisherId !== id) throw Error("Unknown or stale Polisher selection. Select it again.");
        if(m.cycle?.phase === "resolved") return settleDevelopmentPolisherBeforeSale(m);
        const q = developmentPolisherSaleQuote(m, save);
        pendingPolisherSale = { id, signature: polisherSaleSignature(m), refund: q.refund, returns: q.returns };
        document.getElementById("polisherSaleTitle").textContent = "Sell Slot "+m.slot+" Polisher?";
        document.getElementById("polisherSaleIdentity").textContent = m.id+" · Tier "+m.tier;
        document.getElementById("polisherSaleInvestment").textContent = "$"+polishedCashText(q.total);
        document.getElementById("polisherSaleRefund").textContent = "$"+polishedCashText(q.refund);
        document.getElementById("polisherSaleQueued").textContent = polisherReturnText(q.queued);
        document.getElementById("polisherSaleReserved").textContent = polisherReturnText(q.reserved);
        document.getElementById("polisherSaleReplacement").textContent = "$"+PolisherCandidateModel.getPurchasePrice(m.slot,0).toLocaleString();
        document.getElementById("polisherSaleModal").style.display = "block";
        document.getElementById("cancelPolisherSale").focus();
        return true;
    }catch(error){ document.getElementById("polisherFeedback").textContent = error.message; return false; }
}
function confirmDevelopmentPolisherSale(){
    const intent = pendingPolisherSale;
    closeDevelopmentPolisherSale(); // Keep failed-write recovery above all dialogs.
    if(!intent || !isMinerDevelopment() || pendingDevelopmentWrite || recoveryState.active) return false;
    try{
        validateSaveData(save); validateDevelopmentSave(save);
        const m = save.factory.polishers.find(m=>m.id===intent.id);
        if(!m || selectedDevelopmentPolisherId !== intent.id) throw Error("Sale confirmation is stale. Select the Polisher again.");
        if(m.cycle?.phase === "resolved") return settleDevelopmentPolisherBeforeSale(m);
        if(polisherSaleSignature(m) !== intent.signature) throw Error("Polisher changed. Review a new sale confirmation.");
        return developmentCommand(next=>{
            const target = next.factory.polishers.find(m=>m.id===intent.id);
            if(!target || polisherSaleSignature(target)!==intent.signature) throw Error("Polisher changed before sale.");
            const q = developmentPolisherSaleQuote(target,next);
            if(q.refund!==intent.refund || JSON.stringify(q.returns)!==JSON.stringify(intent.returns)) throw Error("Sale quote changed. Confirm again.");
            Object.assign(next.inventory,q.inventoryAfter);
            next.cash=q.cashAfter;
            next.factory.polishers=next.factory.polishers.filter(m=>m.id!==target.id);
        },{polisherSale:true,message:"Polisher sold for $"+polishedCashText(intent.refund)+". Unprocessed raw ore returned; completed Polished stock retained."});
    }catch(error){ document.getElementById("polisherFeedback").textContent=error.message; return false; }
}
function renderDevelopmentPolisherResale(machine){
    const button=document.getElementById("sellPolisher"),status=document.getElementById("polisherResaleStatus");
    button.onclick=()=>prepareDevelopmentPolisherSale(machine.id);
    try{
        if(machine.cycle?.phase==="resolved"){
            status.textContent="Pending Polished output must save first; then review a fresh sale confirmation.";
        }else{
            const q=developmentPolisherSaleQuote(machine,save);
            status.textContent="Investment: $"+polishedCashText(q.total)+" · Refund: $"+polishedCashText(q.refund)+" · Raw return: "+polisherReturnText(q.returns);
        }
        button.disabled=!!pendingDevelopmentWrite||recoveryState.active;
    }catch(error){status.textContent=error.message;button.disabled=true;}
}

let selectedDevelopmentPolisherId=null;
function selectDevelopmentPolisher(id){
    if(!isMinerDevelopment() || !save.factory.polishers.some(m=>m.id===id)) return false;
    selectedDevelopmentPolisherId=id;renderDevelopmentPolishers();return true;
}
function renderDevelopmentPolishers(){
    const panel=document.getElementById("polisherPanel");panel.hidden=!isMinerDevelopment();
    document.getElementById("processedInventorySection").hidden=!isMinerDevelopment();
    if(!isMinerDevelopment()) return;
    const all=save.factory.polishers;
    const m=all.find(m=>m.id===selectedDevelopmentPolisherId)||all[0];selectedDevelopmentPolisherId=m?.id||null;
    for(let slot=1;slot<=3;slot++){
        const p=all.find(m=>m.slot===slot),button=document.getElementById("polisherAction"+slot),status=document.getElementById("polisherSlotStatus"+slot);
        status.textContent=p ? "Tier "+p.tier+" · "+(p.selectedOreId||"Unselected")+" · "+(p.cycle?.phase||"Idle") : "Empty · $"+PolisherCandidateModel.getPurchasePrice(slot,0).toLocaleString();
        button.textContent=p ? p.id===m?.id ? "Selected" : "Manage" : "Buy Polisher";
        button.disabled=p ? p.id===m?.id : save.cash<PolisherCandidateModel.getPurchasePrice(slot,0);
        button.onclick=()=>p ? selectDevelopmentPolisher(p.id) : buyDevelopmentPolisher(slot);
        const progress=document.getElementById("polisherSlotProgress"+slot);
        progress.value=p?.cycle ? Math.max(0,Math.min(100,100*(Date.now()-p.cycle.startedAtMs)/p.cycle.durationMs)) : 0;
    }
    document.getElementById("polisherDetail").hidden=!m;
    if(m){
        renderDevelopmentPolisherResale(m);
        document.getElementById("polisherDetailTitle").textContent="Slot "+m.slot+" · "+m.id+" · Tier "+m.tier+" / 10";
        const select=document.getElementById("polisherOre");
        if(!select.children.length){
            for(const id of ["",...ORE_KEYS]){const option=document.createElement("option");option.value=id;option.textContent=id ? developmentOre(id).name : "No ore selected";select.appendChild(option);}
        }
        select.value=m.selectedOreId||"";select.onchange=()=>setDevelopmentPolisherOre(m.id,select.value||null);
        const c=m.cycle;
        document.getElementById("polisherStatus").textContent="Available raw: "+(save.inventory[m.selectedOreId]||0)+" · Batch "+PolisherModel.getBatchSize(m.tier)+" · "+PolisherModel.getCycleTime(m.tier).toFixed(3)+"s. "+
            (c ? "Processing "+c.inputs[0].amount+" "+c.inputs[0].resourceId+" · captured Tier "+c.effectContext.tier+" · basis $"+c.effectContext.currentOreValue+" · "+c.phase : "Idle. Selected available ore processes automatically when the queue is empty.");
        const upgrade=document.getElementById("upgradePolisher"),price=m.tier<10 ? PolisherModel.getTierUpgradePrice(m.tier+1,0) : null;
        upgrade.textContent=price===null ? "Max Level" : "Upgrade Tier "+(m.tier+1)+" · $"+price.toLocaleString();upgrade.disabled=price===null||save.cash<price;upgrade.onclick=()=>upgradeDevelopmentPolisher(m.id);
        document.getElementById("queuePolisher").onclick=()=>queueDevelopmentPolisher(m.id,Number(document.getElementById("polisherQueueAmount").value));
        const queue=document.getElementById("polisherQueue"), signature=JSON.stringify([m.id,m.selectedOreId,!!c,m.queue]);
        // Keep live controls stable between 100ms progress refreshes.
        if(queue.dataset.signature!==signature){
            queue.dataset.signature=signature;queue.innerHTML="";
            for(const entry of m.queue){const row=document.createElement("div"),button=document.createElement("button");row.textContent=entry.lot.amount+" "+entry.lot.resourceId+" · "+entry.id+" ";button.textContent="Process batch";button.disabled=!!c||entry.lot.resourceId!==m.selectedOreId;button.onclick=()=>reserveDevelopmentPolisher(m.id,{kind:"queue",queueId:entry.id},Date.now());row.appendChild(button);queue.appendChild(row);}
        }
    }
    const inventory=document.getElementById("polishedInventoryList");inventory.innerHTML="";
    for(const lot of save.processedInventory.polished){const row=document.createElement("p");row.textContent=developmentOre(lot.resourceId).name+" · Polished ×"+lot.amount+" · captured value $"+lot.polishedValue;inventory.appendChild(row);}
    if(!save.processedInventory.polished.length) inventory.textContent="No Polished stock yet. Raw and processing inputs are separate.";
    const stats=document.getElementById("polishedStatistics");stats.innerHTML="";
    for(const id of ORE_KEYS){const count=save.statistics.lifetime.polishedOutput[id];if(count){const row=document.createElement("p");row.textContent=developmentOre(id).name+" · lifetime "+count+" · this Rebirth "+save.statistics.thisRebirth.polishedOutput[id];stats.appendChild(row);}}
}

attemptSaveLoad();
