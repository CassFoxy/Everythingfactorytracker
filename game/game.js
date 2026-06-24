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
        name: "First Swing",
        description: "Mine your first stone.",
        type: "stat",
        stat: "stoneMined",
        target: 1
    },

    stoneMiner: {
        name: "Stone Miner",
        description: "Mine 100 stone.",
        type: "stat",
        stat: "stoneMined",
        target: 100
    },

    dedicatedMiner: {
        name: "Dedicated Miner",
        description: "Mine 1,000 stone.",
        type: "stat",
        stat: "stoneMined",
        target: 1000
    },

    firstDiscovery: {
        name: "Shiny!",
        description: "Discover your first ore.",
        type: "stat",
        stat: "oresDiscovered",
        target: 1
    },

    firstSmelt: {
        name: "First Smelt",
        description: "Smelt an ore.",
        type: "stat",
        stat: "oresSmelted",
        target: 1
    },

    factoryOwner: {
        name: "Factory Owner",
        description: "Reach Factory Level 10.",
        type: "level",
        target: 10
    }

};

function createDefaultMilestones(){

    const milestones = {};

    FACTORY_MILESTONES.forEach(level => {

        milestones[level] = false;

    });

    return milestones;

}
let save = JSON.parse(
    localStorage.getItem("ef_incremental")
) || {
cash: 100,

factoryLevel: 1,
factoryXP: 100,

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

factoryMilestones:
    createDefaultMilestones(),

achievementStats: {

    stoneMined: 0,

    oresDiscovered: 0,

    oresSmelted: 0

},

achievements: {}
};

save.factoryLevel ??= 1;
          save.factoryXP ??= 100;

save.totalOres ??= 0;
          save.stoneOres ??= 0;

save.tier1Ores ??= 0;
save.tier2Ores ??= 0;
save.tier3Ores ??= 0;
save.tier4Ores ??= 0;

save.lastOre ??= "None";
save.lastOreValue ??= 0;
          save.stoneValue ??= 1;
          save.inventory ??= {};
          save.furnaceTier ??= 0;

save.inventory.stone ??= 0;

ORE_KEYS.forEach(key => {
    save.inventory[key] ??= 0;
});

save.oreCollection ??= {};

ORE_KEYS.forEach(key => {
    save.oreCollection[key] ??= 0;
});

save.factoryMilestones ??=
    createDefaultMilestones();

save.achievementStats ??= {

    stoneMined: 0,

    oresDiscovered: 0,

    oresSmelted: 0

};

save.achievements ??= {};

FACTORY_MILESTONES.forEach(level => {

    save.factoryMilestones[level]
        ??= false;

});

          let pendingSmelt = {

    key: "",
    value: 0,
    amount: 0,
    oreName: ""

};

let pendingMilestone = null;
let pendingAchievement = null;

          const FURNACES = [

{
    name: "Starter Furnace",
    capacity: 10,
    cost: 0
},

{
    name: "Basic Furnace",
    capacity: 50,
    cost: 10000
}

];

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

    save.factoryLevel = Math.floor(

        Math.sqrt(
            save.factoryXP / 100
        )

    );

if(save.factoryLevel < 1)
    save.factoryLevel = 1;

checkFactoryMilestones();
    checkAchievements();
}

function unlockAchievement(id){

    if(save.achievements[id])
        return;

    save.achievements[id] = true;

    pendingAchievement =
        ACHIEVEMENTS[id];

}

function checkAchievements(){

    Object.entries(
        ACHIEVEMENTS
    ).forEach(([id, achievement]) => {

        if(save.achievements[id])
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

function saveGame(){
        localStorage.setItem(
            "ef_incremental",
            JSON.stringify(save)
        );
    }

          function upgradeFurnace(){

    if(save.furnaceTier >= 1)
        return;

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

save.factoryXP += 0.1;
        
        if(
            Math.random() <
            duplicateChance
        ){
save.inventory.stone++;

save.stoneOres++;

save.totalOres++;

save.factoryXP += 0.1;

        }

    }

    updateFactoryLevel();

}


function mineOre(){

    const roll = Math.random();

// Tier 4 (1 in 250,000)

if(roll < 0.000004){

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

save.factoryXP +=
    ore.xp;

    }

// Tier 3 (1 in 50,000)

else if(roll < 0.000024){

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

save.factoryXP +=
    ore.xp;

    }

// Tier 2 (1 in 1,000)

else if(roll < 0.001024){

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
save.factoryXP +=
    ore.xp;

    }

// Tier 1 (1 in 25)

else if(roll < 0.041024){

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

save.factoryXP +=
    ore.xp;

    }

// Stone (~95.9%)

    else{

    save.lastOre = "🪨 Stone";

    save.lastOreValue = 1;

save.stoneOres++;

save.inventory.stone++;

        save.factoryXP += 1;

}

save.totalOres++;

save.achievementStats.stoneMined++;

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
    nextLevelXP -
    currentLevelXP;

const xpPercent =
    Math.min(
        100,
        (xpIntoLevel / xpNeeded) * 100
    );

    document.getElementById(
    "xpBar"
).style.width =
    xpPercent + "%";

document.getElementById(
    "factoryXP"
).textContent =

    Math.floor(
        save.factoryXP
    ).toLocaleString()

    +

    " / "

    +

    Math.floor(
        nextLevelXP
    ).toLocaleString();

document.getElementById(
    "nextLevelXP"
).textContent =

    Math.floor(

        nextLevelXP -
        save.factoryXP

    ).toLocaleString();

    document.getElementById("cash").textContent =
        formatNumber(save.cash);

    document.getElementById("droppers").textContent =
        save.droppers;

    document.getElementById("dropperCost").textContent =
        formatNumber(getDropperCost());

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
    furnace.name;

document.getElementById(
    "furnaceCapacity"
).textContent =
    furnace.capacity;

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

        formatNumber(

            FURNACES[
                save.furnaceTier + 1
            ].cost

        ) +

        ")";

}
    

    document.getElementById("adderCost").textContent =
        formatNumber(getAdderCost());

    document.getElementById("multiplierCost").textContent =
        formatNumber(getMultiplierCost());


    document.getElementById("lastOre").textContent =
    save.lastOre;

    document.getElementById("lastOreValue").textContent =
    formatNumber(save.lastOreValue);

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

document.getElementById("mineButton")
.onclick = function(){

    mineOre();

    updateUI();

};

    document.getElementById("buyDropper")
        .onclick = function(){

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

    setInterval(saveGame, 5000);
          
          function formatNumber(num){

    if(num < 1000)
        return Math.floor(num);

    if(num < 1000000)
        return (
            num / 1000
        ).toFixed(1) + "K";

    if(num < 1000000000)
        return (
            num / 1000000
        ).toFixed(1) + "M";

    return (
        num / 1000000000
    ).toFixed(1) + "B";

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
        document.createElement("div");

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

    save.factoryXP +=
    pendingSmelt.amount;

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
        formatNumber(
            oreValue
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

    document.getElementById(
        "achievementPopupName"
    ).textContent =
        achievement.name;

    document.getElementById(
        "achievementPopupDescription"
    ).textContent =
        achievement.description;

    document.getElementById(
        "achievementPopup"
    ).style.display =
        "block";

}

function closeAchievementPopup(){

    document.getElementById(
        "achievementPopup"
    ).style.display =
        "none";

}

    updateUI();
