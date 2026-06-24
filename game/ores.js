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
