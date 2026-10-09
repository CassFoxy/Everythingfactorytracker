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

// V1-050A: pure Reference E pricing; not connected to legacy purchase handlers.
const CashPricingModel = (() => {
    // Only Defined Cash categories belong here. Non-Cash costs have their own rules.
    const discountEligibility = Object.freeze({
        minerPurchase: true, minerTier: true,
        polisherPurchase: true, polisherTier: true,
        refinerPurchase: true, refinerTier: true, furnaceTier: true,
        unlockMiner: false, minerSlot: false, minerOreLuck: false,
        oreValue: false, miningPower: false, miningLuck: false, miningDuplication: false
    });

    function invalid(field, rule){
        throw new TypeError("Invalid Cash pricing: " + field + " " + rule);
    }

    function validateAmount(value, field){
        if(typeof value !== "number" || !Number.isFinite(value) || value < 0)
            invalid(field, "must be a finite non-negative number");
    }

    function getCashRoundingStep(discountedRaw){
        validateAmount(discountedRaw, "discountedRaw");
        if(discountedRaw < 1000) return 1;
        if(discountedRaw < 1000000) return 10;
        if(discountedRaw < 1000000000) return 1000;
        return 1000000;
    }

    function roundCashPrice(discountedRaw){
        const step = getCashRoundingStep(discountedRaw);
        const price = step * Math.floor(discountedRaw / step + 0.5);
        validateAmount(price, "rounded price");
        return price;
    }

    function getDiscountFactor(level){
        if(!Number.isInteger(level) || level < 0 || level > 10)
            invalid("discountLevel", "must be an integer from 0 through 10");
        return 1 - 0.05 * level;
    }

    // rawPrice must be freshly evaluated from the ORIGINAL target-level formula.
    // No previous payable price, save state or perk ownership is read or retained.
    // options = { category: a key above, discountLevel: integer 0..10 }.
    // Returns a quote; only a successful future transaction may record ActualPaid.
    function calculateCashPrice(rawPrice, options){
        validateAmount(rawPrice, "rawPrice");
        if(options === null || typeof options !== "object" || Array.isArray(options) ||
            Reflect.ownKeys(options).length !== 2)
            invalid("options", "must contain only category and discountLevel");
        for(const key of ["category", "discountLevel"]){
            const descriptor = Object.getOwnPropertyDescriptor(options, key);
            if(!descriptor || !descriptor.enumerable || !("value" in descriptor))
                invalid(key, "must be an explicit own data field");
        }
        if(typeof options.category !== "string" ||
            !Object.prototype.hasOwnProperty.call(discountEligibility, options.category))
            invalid("category", "must identify a supported Cash purchase");
        // Validate the supplied level even when the category receives no Discount.
        const factor = getDiscountFactor(options.discountLevel);
        const discountedRaw = rawPrice * (discountEligibility[options.category] ? factor : 1);
        return roundCashPrice(discountedRaw);
    }

    return Object.freeze({ getCashRoundingStep, roundCashPrice, getDiscountFactor, calculateCashPrice });
})();

// V1-050B: recorded-payment models only; no quote lookup, debit, resale or persistence.
const InvestmentModel = (() => {
    const tierCaps = Object.freeze({ miner: 25, polisher: 10, refiner: 10 });
    const paymentFields = ["kind", "targetLevel", "cashPaid", "basis"];

    function invalid(field, rule){
        throw new TypeError("Invalid investment model: " + field + " " + rule);
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

    function machineCap(machineType){
        if(typeof machineType !== "string" || !Object.prototype.hasOwnProperty.call(tierCaps, machineType))
            invalid("machineType", "must be miner, polisher or refiner");
        return tierCaps[machineType];
    }

    // Structural reading accepts approved historical records, but does not reconstruct
    // prices or certify migration provenance. New runtime entries use createActualPayment.
    function validatePayment(payment, machineType){
        const cap = machineCap(machineType);
        record(payment, paymentFields, "payment");
        if(!["actual", "legacyEquivalentV1"].includes(payment.basis))
            invalid("payment.basis", "must be actual or legacyEquivalentV1");
        if(typeof payment.cashPaid !== "number" || !Number.isFinite(payment.cashPaid) || payment.cashPaid < 0)
            invalid("payment.cashPaid", "must be a finite non-negative number");
        if(payment.kind === "purchase"){
            if(payment.targetLevel !== null) invalid("purchase targetLevel", "must be null");
        } else if(payment.kind === "tier" || payment.kind === "oreLuck"){
            const localLuck = payment.kind === "oreLuck";
            if(localLuck && machineType !== "miner") invalid("oreLuck", "is Miner-only");
            const minimum = localLuck ? 1 : 2;
            const maximum = localLuck ? 50 : cap;
            if(!Number.isInteger(payment.targetLevel) || payment.targetLevel < minimum || payment.targetLevel > maximum)
                invalid("payment.targetLevel", "must be an integer from " + minimum + " through " + maximum);
        } else invalid("payment.kind", "must be purchase, tier or Miner oreLuck");
    }

    function createActualPayment(payment, machineType){
        validatePayment(payment, machineType);
        if(payment.basis !== "actual") invalid("new payment.basis", "must be actual");
        return { ...payment };
    }

    function createInvestment(){
        return { entries: [] };
    }

    // Context is explicit and never stored: { machineType, owned: Boolean }.
    // No current tier/perk input: missing paid tiers must not be fabricated.
    function inspectInvestment(investment, context){
        record(context, ["machineType", "owned"], "context");
        machineCap(context.machineType);
        if(typeof context.owned !== "boolean") invalid("context.owned", "must be a Boolean");
        record(investment, ["entries"], "investment");
        if(!Array.isArray(investment.entries)) invalid("entries", "must be an array");
        if(!context.owned && investment.entries.length !== 0)
            invalid("unowned candidate", "must have an empty ledger");
        const seen = new Set();
        let purchases = 0;
        let total = 0;
        for(const payment of investment.entries){
            validatePayment(payment, context.machineType);
            const key = payment.kind + ":" + payment.targetLevel;
            if(seen.has(key)) invalid("entries", "contains duplicate " + key);
            seen.add(key);
            if(payment.kind === "purchase") purchases++;
            const next = total + payment.cashPaid;
            if(!Number.isFinite(next)) invalid("total", "must remain finite");
            // No arbitrary Cash cap/epsilon. Reject non-reversible additions rather
            // than silently absorbing or changing a recorded amount (including fractions).
            if(next - total !== payment.cashPaid || next - payment.cashPaid !== total)
                invalid("total", "cannot represent the recorded payments without precision loss");
            total = next;
        }
        if(context.owned && purchases !== 1) invalid("owned investment", "must have exactly one purchase");
        return total;
    }

    function validateInvestment(investment, context){
        inspectInvestment(investment, context);
    }

    function appendActualPayment(investment, payment, context){
        validateInvestment(investment, context);
        const added = createActualPayment(payment, context.machineType);
        const result = { entries: investment.entries.map(entry => ({ ...entry })).concat(added) };
        // The first purchase produces an owned-ready ledger, not a live machine.
        validateInvestment(result, { machineType: context.machineType, owned: true });
        return result;
    }

    function sumInvestment(investment, context){
        return inspectInvestment(investment, context);
    }

    function calculateRefund(investment, context){
        return Math.floor(0.50 * sumInvestment(investment, context));
    }

    return Object.freeze({ validatePayment, createActualPayment, createInvestment,
        validateInvestment, appendActualPayment, sumInvestment, calculateRefund });
})();

// V1-071A1: non-writing, idle-only candidate projection; never a save validator.
const MinerCandidateModel = (() => {
    const slotPrices = Object.freeze([0, 10000, 1000000, 10000000000, 1000000000000]);
    const minerFields = ["id", "slot", "tier", "oreLuckLevel", "investment", "nextCycleSequence", "cycle"];

    function invalid(field, rule){
        throw new TypeError("Invalid Miner candidate: " + field + " " + rule);
    }

    function record(value, fields, path){
        if(value === null || typeof value !== "object" || Array.isArray(value))
            invalid(path, "must be a record");
        const prototype = Object.getPrototypeOf(value);
        if(prototype !== null && Object.getPrototypeOf(prototype) !== null)
            invalid(path, "must be a plain data record");
        if(Reflect.ownKeys(value).length !== fields.length)
            invalid(path, "must contain exactly the candidate fields");
        for(const key of fields){
            const descriptor = Object.getOwnPropertyDescriptor(value, key);
            if(!descriptor || !descriptor.enumerable || !("value" in descriptor))
                invalid(path + "." + key, "must be an own data field");
        }
    }

    function array(value, path){
        if(!Array.isArray(value) || Reflect.ownKeys(value).length !== value.length + 1)
            invalid(path, "must be a dense data array");
        for(let i = 0; i < value.length; i++){
            const descriptor = Object.getOwnPropertyDescriptor(value, i);
            if(!descriptor || !descriptor.enumerable || !("value" in descriptor))
                invalid(path, "must contain only own data entries");
        }
    }

    function integer(value, minimum, maximum, path){
        if(!Number.isInteger(value) || value < minimum || value > maximum)
            invalid(path, "must be an integer from " + minimum + " through " + maximum);
    }

    function entitySequence(id, kinds){
        if(typeof id !== "string") invalid("id", "must be a canonical entity ID");
        const match = /^(pickaxe|miner|polisher|refiner):([1-9][0-9]*)$/.exec(id);
        if(!match || !kinds.includes(match[1]) || !Number.isSafeInteger(Number(match[2])) ||
            String(Number(match[2])) !== match[2]) invalid("id", "must be a canonical allocated entity ID");
        return Number(match[2]);
    }

    function createSlotAccess(){
        return [true, false, false, false, false];
    }

    function validateSlots(slots){
        array(slots, "minerSlots");
        if(slots.length !== 5 || slots.some(flag => typeof flag !== "boolean") || slots[0] !== true)
            invalid("minerSlots", "requires five Booleans with slot 1 unlocked");
    }

    function validateIdleMiner(miner){
        record(miner, minerFields, "miner");
        entitySequence(miner.id, ["miner"]);
        integer(miner.slot, 1, 5, "slot");
        integer(miner.tier, 1, 25, "tier");
        integer(miner.oreLuckLevel, 0, 50, "oreLuckLevel");
        integer(miner.nextCycleSequence, 1, Number.MAX_SAFE_INTEGER, "nextCycleSequence");
        // Active-cycle certification belongs to the cycle consumer, not this model.
        if(miner.cycle !== null) invalid("cycle", "must be null; active-cycle validation is not supported");
        InvestmentModel.validateInvestment(miner.investment, { machineType: "miner", owned: true });
        for(const payment of miner.investment.entries){
            if(payment.kind === "tier" && payment.targetLevel > miner.tier ||
                payment.kind === "oreLuck" && payment.targetLevel > miner.oreLuckLevel)
                invalid("investment", "cannot record an upgrade above the owned level");
        }
    }

    function validateCollection(miners, slots){
        validateSlots(slots);
        array(miners, "miners");
        if(miners.length > 5) invalid("miners", "cannot exceed five owned entities");
        const ids = new Set(), occupied = new Set();
        for(const miner of miners){
            validateIdleMiner(miner);
            if(ids.has(miner.id)) invalid("miners", "contains a duplicate ID");
            if(occupied.has(miner.slot)) invalid("miners", "contains a duplicate slot");
            if(!slots[miner.slot - 1]) invalid("miners", "cannot occupy a locked slot");
            ids.add(miner.id);
            occupied.add(miner.slot);
        }
    }

    // Exact projection: {cash, shop:{minerUnlocked}, factory:{minerSlots,miners},
    // identity:{nextEntitySequence,nextManualEquipSequence}}. Not an entire V2 save.
    // otherEntityIds is REQUIRED caller context: all allocated non-Miner entity IDs,
    // excluding reserved Default/Furnace IDs. The future full-state adapter supplies it
    // and retains unrelated fields/extensions; this model cannot certify omitted IDs.
    function validateCandidate(state, otherEntityIds){
        record(state, ["cash", "shop", "factory", "identity"], "state");
        if(typeof state.cash !== "number" || !Number.isFinite(state.cash) || state.cash < 0)
            invalid("cash", "must be a finite non-negative number");
        record(state.shop, ["minerUnlocked"], "shop");
        if(typeof state.shop.minerUnlocked !== "boolean") invalid("minerUnlocked", "must be a Boolean");
        record(state.factory, ["minerSlots", "miners"], "factory");
        validateCollection(state.factory.miners, state.factory.minerSlots);
        record(state.identity, ["nextEntitySequence", "nextManualEquipSequence"], "identity");
        for(const key of ["nextEntitySequence", "nextManualEquipSequence"])
            integer(state.identity[key], 1, Number.MAX_SAFE_INTEGER, key);
        array(otherEntityIds, "otherEntityIds");
        const sequences = new Set();
        function reserve(id, kinds){
            const sequence = entitySequence(id, kinds);
            if(sequences.has(sequence)) invalid("identity", "contains a reused entity sequence");
            if(sequence >= state.identity.nextEntitySequence)
                invalid("nextEntitySequence", "must exceed every supplied entity sequence");
            sequences.add(sequence);
        }
        for(const miner of state.factory.miners) reserve(miner.id, ["miner"]);
        for(const id of otherEntityIds) reserve(id, ["pickaxe", "polisher", "refiner"]);
    }

    function getSlotState(miners, slots, slot){
        validateCollection(miners, slots);
        integer(slot, 1, 5, "slot");
        return { unlocked: slots[slot - 1], occupied: miners.some(miner => miner.slot === slot) };
    }

    function getSlotPrice(slot, discountLevel){
        integer(slot, 1, 5, "slot");
        return CashPricingModel.calculateCashPrice(slotPrices[slot - 1], { category: "minerSlot", discountLevel });
    }

    function getMinerPrice(discountLevel){
        return CashPricingModel.calculateCashPrice(100, { category: "minerPurchase", discountLevel });
    }

    function debit(cash, price){
        if(cash < price) invalid("cash", "is insufficient");
        const remaining = cash - price;
        if(!Number.isFinite(remaining) || remaining + price !== cash || cash - remaining !== price)
            invalid("cash", "cannot represent the exact debit");
        return remaining;
    }

    function copyCandidate(state){
        return {
            cash: state.cash, shop: { ...state.shop }, identity: { ...state.identity },
            factory: {
                minerSlots: [...state.factory.minerSlots],
                miners: state.factory.miners.map(miner => ({ ...miner,
                    investment: { entries: miner.investment.entries.map(payment => ({ ...payment })) }
                }))
            }
        };
    }

    function prepareSlotUnlock(state, slot, discountLevel, otherEntityIds){
        validateCandidate(state, otherEntityIds);
        integer(slot, 1, 5, "slot");
        const price = getSlotPrice(slot, discountLevel);
        if(state.factory.minerSlots[slot - 1]) invalid("slot", "is already unlocked");
        const cash = debit(state.cash, price);
        const result = copyCandidate(state);
        result.cash = cash;
        result.factory.minerSlots[slot - 1] = true;
        return result;
    }

    function preparePurchase(state, slot, options, otherEntityIds){
        validateCandidate(state, otherEntityIds);
        record(options, ["discountLevel", "preservationLevel"], "options");
        integer(options.preservationLevel, 0, 25, "preservationLevel");
        const price = getMinerPrice(options.discountLevel);
        const access = getSlotState(state.factory.miners, state.factory.minerSlots, slot);
        if(state.factory.miners.length >= 5) invalid("miners", "already owns five");
        if(!access.unlocked) invalid("slot", "is locked");
        if(access.occupied) invalid("slot", "is occupied");
        if(!state.shop.minerUnlocked) invalid("minerUnlocked", "requires the separate Unlock Miner purchase");
        const cash = debit(state.cash, price);
        const sequence = state.identity.nextEntitySequence;
        if(sequence === Number.MAX_SAFE_INTEGER) invalid("nextEntitySequence", "is exhausted");
        const investment = InvestmentModel.appendActualPayment(InvestmentModel.createInvestment(),
            { kind: "purchase", targetLevel: null, cashPaid: price, basis: "actual" },
            { machineType: "miner", owned: false });
        const result = copyCandidate(state);
        result.cash = cash;
        result.identity.nextEntitySequence = sequence + 1;
        result.factory.miners.push({ id: "miner:" + sequence, slot,
            tier: Math.min(25, Math.max(1, options.preservationLevel)), oreLuckLevel: 0,
            investment, nextCycleSequence: 1, cycle: null });
        validateCandidate(result, otherEntityIds);
        return result;
    }

    return Object.freeze({ createSlotAccess, validateSlots, validateIdleMiner, validateCollection,
        validateCandidate, getSlotState, getSlotPrice, getMinerPrice, prepareSlotUnlock, preparePurchase });
})();

// V1-071B1: Reference B mathematics only, not a production cycle or resource award.
const MinerTierModel = (() => {
    // Stone is a percentage anchor; ore columns are relative source weights.
    // Keep all approved rows, including their original rounding discrepancies.
    const sources = Object.freeze([
        [95.898, 4.000, 0.100, 0.002, 0],
        [95.086, 4.726, 0.185, 0.003, 0],
        [93.439, 6.177, 0.378, 0.006, 0],
        [91.203, 8.018, 0.768, 0.011, 0],
        [88.480, 10.000, 1.500, 0.020, 0],
        [85.344, 12.722, 1.908, 0.025, 0.0004],
        [81.861, 15.134, 2.754, 0.250, 0.0011],
        [78.096, 17.538, 3.799, 0.565, 0.0021],
        [74.119, 19.851, 5.048, 0.979, 0.0034],
        [70.000, 22.000, 6.500, 1.495, 0.0050],
        [65.813, 22.097, 8.375, 3.704, 0.011],
        [61.631, 21.463, 10.485, 6.402, 0.019],
        [57.521, 20.068, 12.810, 9.573, 0.028],
        [53.542, 17.907, 15.325, 13.188, 0.039],
        [49.744, 15.000, 18.000, 17.206, 0.050],
        [46.165, 14.167, 19.364, 20.179, 0.125],
        [42.830, 13.026, 20.650, 23.285, 0.208],
        [39.754, 11.600, 21.853, 26.494, 0.299],
        [36.939, 9.915, 22.969, 29.780, 0.397],
        [34.383, 8.000, 24.000, 33.117, 0.500],
        [32.075, 7.169, 23.498, 36.482, 0.776],
        [30.000, 6.241, 22.829, 39.864, 1.067],
        [28.141, 5.229, 22.011, 43.251, 1.369],
        [26.481, 4.145, 21.062, 46.631, 1.680],
        [25.000, 3.000, 20.000, 50.000, 2.000]
    ].map(([stone, tier1, tier2, tier3, tier4]) => Object.freeze({ stone, tier1, tier2, tier3, tier4 })));
    const oreKeys = ["tier1", "tier2", "tier3", "tier4"];
    const exponents = [0.20, 0.40, 0.60, 0.80];

    function integer(value, minimum, maximum, field){
        if(!Number.isInteger(value) || value < minimum || value > maximum)
            throw new TypeError("Invalid Miner tier model: " + field + " must be an integer from " + minimum + " through " + maximum);
    }

    function finite(value){
        if(!Number.isFinite(value)) throw new TypeError("Invalid Miner tier model: non-finite calculation");
        return value;
    }

    function getTierSource(tier){
        integer(tier, 1, 25, "tier");
        return sources[tier - 1]; // Immutable, including the returned row.
    }

    function getTierProbabilities(tier, overallLuck){
        const source = getTierSource(tier);
        if(typeof overallLuck !== "number" || !Number.isFinite(overallLuck) || overallLuck <= 0)
            throw new TypeError("Invalid Miner tier model: Overall Luck must be positive and finite");
        const stone = source.stone / 100;
        const eligible = oreKeys.map(key => key === "tier4" && tier < 6 ? 0 : source[key]);
        const sourceTotal = eligible.reduce((sum, weight) => sum + weight, 0);
        const adjusted = eligible.map((weight, i) => finite(
            (1 - stone) * (weight / sourceTotal) * Math.pow(overallLuck, exponents[i])));
        const oreTotal = finite(adjusted.reduce((sum, weight) => sum + weight, 0));
        const total = finite(stone + oreTotal);
        // Identity Luck retains the approved anchor exactly despite source rounding.
        const normalizedStone = overallLuck === 1 ? stone : stone / total;
        const floorApplies = normalizedStone < 0.25;
        const result = { stone: floorApplies ? 0.25 : normalizedStone };
        for(let i = 0; i < oreKeys.length; i++)
            result[oreKeys[i]] = finite(floorApplies ? 0.75 * (adjusted[i] / oreTotal) : adjusted[i] / total);
        // Retain full precision: sum is 1 to floating-point precision. Do not apply
        // display rounding or subtract a remainder from Stone/the locked T4 bucket.
        // Direct normalization also retains tiny eligible probabilities at small Luck,
        // even if the representable Stone probability rounds to 1.
        return result;
    }

    function getRawTierUpgradeCost(targetTier){
        integer(targetTier, 2, 25, "targetTier");
        let raw = 400;
        for(let target = 3; target <= targetTier; target++) raw = finite(raw * (target === 6 ? 7.5 : 4));
        return raw;
    }

    function getTierUpgradePrice(targetTier, discountLevel){
        return CashPricingModel.calculateCashPrice(getRawTierUpgradeCost(targetTier),
            { category: "minerTier", discountLevel });
    }

    function getProductionInterval(tier, rebirthSpeedLevel){
        integer(tier, 1, 25, "tier");
        integer(rebirthSpeedLevel, 0, 50, "rebirthSpeedLevel");
        const normal = Math.max(0.1, 5 * Math.pow(0.96, tier - 1));
        return finite(Math.max(0.1, normal * (1 - 0.01 * rebirthSpeedLevel))); // Seconds, not rounded.
    }

    return Object.freeze({ getTierSource, getTierProbabilities, getRawTierUpgradeCost,
        getTierUpgradePrice, getProductionInterval, BASE_OUTPUT_PER_CYCLE: 1 });
})();

// V1-071C1: conditional ore selection only. The caller has already selected a
// non-Stone tier with Overall Luck; this model never rolls or changes that tier.
const MinerOreLuckModel = (() => {
    const tiers = [TIER_1_ORES, TIER_2_ORES, TIER_3_ORES, TIER_4_ORES];

    function integer(value, minimum, maximum, field){
        if(!Number.isInteger(value) || value < minimum || value > maximum)
            throw new TypeError("Invalid Miner Ore Luck: " + field + " must be an integer from " + minimum + " through " + maximum);
    }

    function finite(value){
        if(!Number.isFinite(value)) throw new TypeError("Invalid Miner Ore Luck: non-finite calculation");
        return value;
    }

    function getFinalOreLuck(rebirthLevel, localLevel){
        integer(rebirthLevel, 0, 5000, "rebirthLevel");
        integer(localLevel, 0, 50, "localLevel");
        // Inscriptions are Deferred: fixed 1x, no ownership/count modifier.
        return finite((1 + 0.002 * rebirthLevel) * (1 + 0.02 * localLevel));
    }

    function getOreWeights(rebirthLevel, localLevel){
        const luck = getFinalOreLuck(rebirthLevel, localLevel);
        return Array.from({ length: 5 }, (_, index) => finite(
            Math.pow(0.65, index) * Math.pow(luck, 0.1 * index)));
    }

    // Ore tier numbers 1..4, not Miner tiers. Fresh records expose IDs only,
    // never mutable catalogue entries. Stone bypasses this API in a future caller.
    function getOreProbabilities(oreTier, rebirthLevel, localLevel){
        integer(oreTier, 1, 4, "oreTier");
        const weights = getOreWeights(rebirthLevel, localLevel);
        const total = finite(weights.reduce((sum, weight) => sum + weight, 0));
        return tiers[oreTier - 1].map((resourceId, index) => ({
            resourceId, probability: finite(weights[index] / total)
        }));
    }

    function selectOreId(oreTier, rebirthLevel, localLevel, roll){
        if(typeof roll !== "number" || !Number.isFinite(roll) || roll < 0 || roll >= 1)
            throw new TypeError("Invalid Miner Ore Luck: roll must be in [0, 1)");
        const distribution = getOreProbabilities(oreTier, rebirthLevel, localLevel);
        let cumulative = 0;
        for(const entry of distribution){
            cumulative += entry.probability;
            if(roll < cumulative) return entry.resourceId;
        }
        // Only a floating-point remainder can reach here. All five weights are
        // positive at Defined levels; keep the result in the selected tier.
        return distribution[distribution.length - 1].resourceId;
    }

    function getRawUpgradeCost(targetLevel){
        integer(targetLevel, 1, 50, "targetLevel");
        return finite(1000 * Math.pow(1.25, targetLevel - 1));
    }

    function getUpgradePrice(targetLevel, discountLevel){
        return CashPricingModel.calculateCashPrice(getRawUpgradeCost(targetLevel),
            { category: "minerOreLuck", discountLevel });
    }

    return Object.freeze({ getFinalOreLuck, getOreWeights, getOreProbabilities,
        selectOreId, getRawUpgradeCost, getUpgradePrice });
})();
