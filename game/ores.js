/*
========================================
EVERYTHING FACTORY ORE REFERENCE
========================================

STONE
----------------------------------------
Stone
Value: $1
XP: 1

========================================
TIER 1 (1 in 25)
========================================

Amber
Value: $10
XP: 5

Quartz
Value: $20
XP: 5

Topaz
Value: $30
XP: 5

Amethyst
Value: $40
XP: 5

Malachite
Value: $50
XP: 5

========================================
TIER 2 (1 in 1,000)
========================================

Citrine
Value: $250
XP: 25

Garnet
Value: $500
XP: 25

Peridot
Value: $750
XP: 25

Jade
Value: $900
XP: 25

Aquamarine
Value: $1,000
XP: 25

========================================
TIER 3 (1 in 50,000)
========================================

Spinel
Value: $5,000
XP: 100

Tourmaline
Value: $10,000
XP: 100

Sapphire
Value: $15,000
XP: 100

Ruby
Value: $20,000
XP: 100

Emerald
Value: $25,000
XP: 100

========================================
TIER 4 (1 in 250,000)
========================================

Onyx
Value: $50,000
XP: 1,000

Tanzanite
Value: $75,000
XP: 1,000

Alexandrite
Value: $100,000
XP: 1,000

Black Opal
Value: $150,000
XP: 1,000

Diamond
Value: $250,000
XP: 1,000

========================================
*/
/*
IMPORTANT:

Whenever an ore is added:

1. Add ore data below
2. Add inventory save data
3. Add collection save data
4. Add mining pool entry
5. Add collection UI entry
6. Add inventory UI entry
7. Add furnace entry

Last Updated:
v0.4.0
*/
const STONE = {
    name: "Stone",
    emoji: "🪨",
    value: 1,
    xp: 1
};

const ORES = {

    // Tier 1 (1 in 25)

    amber: {
        name: "Amber",
        emoji: "🟠",
        value: 10,
        tier: 1,
        xp: 5,
        rarity: 25
    },

    quartz: {
        name: "Quartz",
        emoji: "⚪",
        value: 20,
        tier: 1,
        xp: 5,
        rarity: 25
    },

    topaz: {
        name: "Topaz",
        emoji: "🟡",
        value: 30,
        tier: 1,
        xp: 5,
        rarity: 25
    },

    amethyst: {
        name: "Amethyst",
        emoji: "💜",
        value: 40,
        tier: 1,
        xp: 5,
        rarity: 25
    },

    malachite: {
        name: "Malachite",
        emoji: "🟢",
        value: 50,
        tier: 1,
        xp: 5,
        rarity: 25
    },

    // Tier 2 (1 in 1000)

    citrine: {
        name: "Citrine",
        emoji: "🟡",
        value: 250,
        tier: 2,
        xp: 25,
        rarity: 1000
    },

    garnet: {
        name: "Garnet",
        emoji: "🔴",
        value: 500,
        tier: 2,
        xp: 25,
        rarity: 1000
    },

    peridot: {
        name: "Peridot",
        emoji: "💚",
        value: 750,
        tier: 2,
        xp: 25,
        rarity: 1000
    },

    jade: {
        name: "Jade",
        emoji: "🟢",
        value: 900,
        tier: 2,
        xp: 25,
        rarity: 1000
    },

    aquamarine: {
        name: "Aquamarine",
        emoji: "💎",
        value: 1000,
        tier: 2,
        xp: 25,
        rarity: 1000
    },

    // Tier 3 (1 in 50,000)

    spinel: {
        name: "Spinel",
        emoji: "💗",
        value: 5000,
        tier: 3,
        xp: 100,
        rarity: 50000
    },

    tourmaline: {
        name: "Tourmaline",
        emoji: "🌈",
        value: 10000,
        tier: 3,
        xp: 100,
        rarity: 50000
    },

    sapphire: {
        name: "Sapphire",
        emoji: "💙",
        value: 15000,
        tier: 3,
        xp: 100,
        rarity: 50000
    },

    ruby: {
        name: "Ruby",
        emoji: "❤️",
        value: 20000,
        tier: 3,
        xp: 100,
        rarity: 50000
    },

    emerald: {
        name: "Emerald",
        emoji: "💚",
        value: 25000,
        tier: 3,
        xp: 100,
        rarity: 50000
    },

    // Tier 4 (1 in 250,000)

    onyx: {
        name: "Onyx",
        emoji: "⚫",
        value: 50000,
        tier: 4,
        xp: 1000,
        rarity: 250000
    },

    tanzanite: {
        name: "Tanzanite",
        emoji: "💜",
        value: 75000,
        tier: 4,
        xp: 1000,
        rarity: 250000
    },

    alexandrite: {
        name: "Alexandrite",
        emoji: "🌈",
        value: 100000,
        tier: 4,
        xp: 1000,
        rarity: 250000
    },

    blackOpal: {
        name: "Black Opal",
        emoji: "🖤",
        value: 150000,
        tier: 4,
        xp: 1000,
        rarity: 250000
    },

    diamond: {
        name: "Diamond",
        emoji: "💎",
        value: 250000,
        tier: 4,
        xp: 1000,
        rarity: 250000
    }

};

const TIER_1_ORES = [
    "amber",
    "quartz",
    "topaz",
    "amethyst",
    "malachite"
];

const TIER_2_ORES = [
    "citrine",
    "garnet",
    "peridot",
    "jade",
    "aquamarine"
];

const TIER_3_ORES = [
    "spinel",
    "tourmaline",
    "sapphire",
    "ruby",
    "emerald"
];

const TIER_4_ORES = [
    "onyx",
    "tanzanite",
    "alexandrite",
    "blackOpal",
    "diamond"
];

const ORE_KEYS = Object.keys(ORES);

function createDefaultInventory(){

    const inventory = {
        stone: 0
    };

    ORE_KEYS.forEach(key => {
        inventory[key] = 0;
    });

    return inventory;

}

function createDefaultCollection(){

    const collection = {};

    ORE_KEYS.forEach(key => {
        collection[key] = 0;
    });

    return collection;

}

function getRandomOre(oreList){

    const key =
        oreList[
            Math.floor(
                Math.random() *
                oreList.length
            )
        ];

    return {
        key: key,
        ...ORES[key]
    };

}

function getRarityText(rarity){

    return "1 in " +
        rarity.toLocaleString();

}

// V1-041A: pure candidate models only. No save, UI, RNG or processing ownership.
// Canonical records use exactly the fields below; live schema-1 validation is separate.
const InventoryModel = (() => {
    const lotFields = ["resourceId", "stage", "refineCount", "amount",
        "polishedValue", "preRefinerValue", "refineBonus"];
    const identityFields = lotFields.filter(key => key !== "amount");
    const materialFields = ["wood", "scrap", "metal"];
    const pickaxeFields = ["id", "tier", "remainingDurability", "lastManualEquipOrder"];

    function invalid(path, rule){
        throw new TypeError("Invalid inventory model: " + path + " " + rule);
    }

    function record(value, fields, path){
        if(value === null || typeof value !== "object" || Array.isArray(value))
            invalid(path, "must be a record");
        const prototype = Object.getPrototypeOf(value);
        if(prototype !== null && Object.getPrototypeOf(prototype) !== null)
            invalid(path, "must be a plain data record");
        if(Reflect.ownKeys(value).length !== fields.length)
            invalid(path, "must contain exactly the canonical fields");
        for(const key of fields){
            const descriptor = Object.getOwnPropertyDescriptor(value, key);
            if(!descriptor || !descriptor.enumerable || !("value" in descriptor))
                invalid(path + "." + key, "must be an own data field");
        }
    }

    function number(value, path, minimum = 0, integer = false){
        if(typeof value !== "number" || !Number.isFinite(value) || value < minimum ||
            (integer && !Number.isInteger(value)))
            invalid(path, "must be a finite " + (integer ? "integer " : "number ") + ">= " + minimum);
    }

    function validateLot(lot){
        record(lot, lotFields, "lot");
        if(!["raw", "polished", "refined"].includes(lot.stage))
            invalid("lot.stage", "must be raw, polished or refined");
        if(!ORE_KEYS.includes(lot.resourceId) && !(lot.stage === "raw" && lot.resourceId === "stone"))
            invalid("lot.resourceId", "must identify an allowed current resource");
        number(lot.amount, "lot.amount", 1, true);
        number(lot.refineCount, "lot.refineCount", lot.stage === "refined" ? 1 : 0, true);
        if(lot.refineCount > (lot.stage === "refined" ? 15 : 0))
            invalid("lot.refineCount", "is outside the stage range");
        if(lot.stage === "polished") number(lot.polishedValue, "lot.polishedValue");
        else if(lot.polishedValue !== null) invalid("lot.polishedValue", "must be null");
        if(lot.stage === "refined"){
            number(lot.preRefinerValue, "lot.preRefinerValue");
            // Historical negative bonuses are valid. Do not recompute perk/pass formulas.
            number(lot.refineBonus, "lot.refineBonus", -1);
            number(lot.preRefinerValue * (1 + lot.refineBonus), "lot derived value");
        } else if(lot.preRefinerValue !== null || lot.refineBonus !== null){
            invalid("lot", "must have null preRefinerValue and refineBonus at this stage");
        }
    }

    function createLot(data){
        validateLot(data);
        return { ...data };
    }

    function sameCohort(a, b){
        return identityFields.every(key => a[key] === b[key]);
    }

    function lotsCompatible(a, b){
        validateLot(a);
        validateLot(b);
        return sameCohort(a, b);
    }

    function mergeLots(a, b){
        if(!lotsCompatible(a, b)) invalid("merge", "requires compatible lots");
        const amount = a.amount + b.amount;
        number(amount, "merged amount", 1, true);
        // Counts are not capped at MAX_SAFE_INTEGER, but an operation must not lose units.
        if(amount - a.amount !== b.amount || amount - b.amount !== a.amount)
            invalid("merged amount", "cannot be represented without quantity loss");
        return { ...a, amount };
    }

    function splitLot(lot, quantity){
        validateLot(lot);
        number(quantity, "split quantity", 1, true);
        if(quantity > lot.amount) invalid("split quantity", "exceeds available amount");
        const rest = lot.amount - quantity;
        if(rest + quantity !== lot.amount || lot.amount - rest !== quantity)
            invalid("split quantity", "cannot be represented without quantity loss");
        return {
            taken: { ...lot, amount: quantity },
            remaining: rest === 0 ? null : { ...lot, amount: rest }
        };
    }

    function createProcessedInventory(){
        return { polished: [], refined: [] };
    }

    function validateProcessedInventory(inventory){
        record(inventory, ["polished", "refined"], "processed inventory");
        for(const stage of ["polished", "refined"]){
            if(!Array.isArray(inventory[stage])) invalid(stage, "must be an array");
            for(const lot of inventory[stage]){
                validateLot(lot);
                if(lot.stage !== stage) invalid(stage, "contains a lot of the wrong stage");
            }
        }
    }

    function addProcessedLot(inventory, lot){
        validateProcessedInventory(inventory);
        validateLot(lot);
        if(lot.stage === "raw") invalid("processed inventory", "cannot contain raw lots");
        const result = createProcessedInventory();
        let merged = createLot(lot);
        let insertionIndex = null;
        for(const stage of ["polished", "refined"]){
            for(const existing of inventory[stage]){
                if(stage === lot.stage && sameCohort(existing, lot)){
                    if(insertionIndex === null) insertionIndex = result[stage].length;
                    merged = mergeLots(merged, existing);
                } else result[stage].push(createLot(existing));
            }
        }
        result[lot.stage].splice(insertionIndex ?? result[lot.stage].length, 0, merged);
        return result;
    }

    function createMaterials(){
        return { wood: 0, scrap: 0, metal: 0 };
    }

    function validateMaterials(materials){
        record(materials, materialFields, "materials");
        for(const key of materialFields) number(materials[key], "materials." + key, 0, true);
    }

    function validatePickaxeCopy(copy, maximumDurability){
        record(copy, pickaxeFields, "pickaxe copy");
        if(typeof copy.id !== "string" || !/^pickaxe:[1-9][0-9]*$/.test(copy.id) ||
            !Number.isSafeInteger(Number(copy.id.slice(8))) ||
            copy.id !== "pickaxe:" + String(Number(copy.id.slice(8))))
            invalid("pickaxe.id", "must be a canonical positive safe sequence ID");
        number(copy.tier, "pickaxe.tier", 1, true);
        if(copy.tier > 8) invalid("pickaxe.tier", "must be <= 8");
        number(maximumDurability, "maximumDurability", 0, true);
        number(copy.remainingDurability, "pickaxe.remainingDurability", 0, true);
        if(copy.remainingDurability > maximumDurability)
            invalid("pickaxe.remainingDurability", "exceeds the supplied current maximum");
        if(!Number.isSafeInteger(copy.lastManualEquipOrder) || copy.lastManualEquipOrder < 0)
            invalid("pickaxe.lastManualEquipOrder", "must be a non-negative safe integer");
    }

    function createPickaxeCopy(data, maximumDurability){
        validatePickaxeCopy(data, maximumDurability);
        return { ...data };
    }

    return Object.freeze({ createLot, validateLot, lotsCompatible, mergeLots, splitLot,
        createProcessedInventory, validateProcessedInventory, addProcessedLot,
        createMaterials, validateMaterials, createPickaxeCopy, validatePickaxeCopy });
})();
