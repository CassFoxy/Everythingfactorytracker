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

inventory: {
    stone: 0,

    amber: 0,
    amethyst: 0,
    malachite: 0,
    quartz: 0,
    topaz: 0,

    aquamarine: 0,
    citrine: 0,
    garnet: 0,
    jade: 0,
    peridot: 0,

    emerald: 0,
    ruby: 0,
    sapphire: 0,
    spinel: 0,
    tourmaline: 0,

    alexandrite: 0,
    blackOpal: 0,
    diamond: 0,
    onyx: 0,
    tanzanite: 0
},

oreCollection: {
    amber: 0,
    amethyst: 0,
    malachite: 0,
    quartz: 0,
    topaz: 0,

    aquamarine: 0,
    citrine: 0,
    garnet: 0,
    jade: 0,
    peridot: 0,

    emerald: 0,
    ruby: 0,
    sapphire: 0,
    spinel: 0,
    tourmaline: 0,

    alexandrite: 0,
    blackOpal: 0,
    diamond: 0,
    onyx: 0,
    tanzanite: 0
}
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

save.inventory.amber ??= 0;
save.inventory.amethyst ??= 0;
save.inventory.malachite ??= 0;
save.inventory.quartz ??= 0;
save.inventory.topaz ??= 0;

save.inventory.aquamarine ??= 0;
save.inventory.citrine ??= 0;
save.inventory.garnet ??= 0;
save.inventory.jade ??= 0;
save.inventory.peridot ??= 0;

save.inventory.emerald ??= 0;
save.inventory.ruby ??= 0;
save.inventory.sapphire ??= 0;
save.inventory.spinel ??= 0;
save.inventory.tourmaline ??= 0;

save.inventory.alexandrite ??= 0;
save.inventory.blackOpal ??= 0;
save.inventory.diamond ??= 0;
save.inventory.onyx ??= 0;
save.inventory.tanzanite ??= 0;
save.oreCollection ??= {};

save.oreCollection.amber ??= 0;
save.oreCollection.amethyst ??= 0;
save.oreCollection.malachite ??= 0;
save.oreCollection.quartz ??= 0;
save.oreCollection.topaz ??= 0;

save.oreCollection.aquamarine ??= 0;
save.oreCollection.citrine ??= 0;
save.oreCollection.garnet ??= 0;
save.oreCollection.jade ??= 0;
save.oreCollection.peridot ??= 0;

save.oreCollection.emerald ??= 0;
save.oreCollection.ruby ??= 0;
save.oreCollection.sapphire ??= 0;
save.oreCollection.spinel ??= 0;
save.oreCollection.tourmaline ??= 0;

save.oreCollection.alexandrite ??= 0;
save.oreCollection.blackOpal ??= 0;
save.oreCollection.diamond ??= 0;
save.oreCollection.onyx ??= 0;
save.oreCollection.tanzanite ??= 0;

          let pendingSmelt = {

    key: "",
    value: 0,
    amount: 0,
    oreName: ""

};

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

function updateFactoryLevel(){

    save.factoryLevel = Math.floor(

        Math.sqrt(
            save.factoryXP / 100
        )

    );

    if(save.factoryLevel < 1)
        save.factoryLevel = 1;

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

// Tier 1

addFurnaceItem(
    `${ORES.amber.emoji} ${ORES.amber.name}`,
    "amber",
    ORES.amber.value
);

addFurnaceItem(
    `${ORES.quartz.emoji} ${ORES.quartz.name}`,
    "quartz",
    ORES.quartz.value
);

addFurnaceItem(
    `${ORES.topaz.emoji} ${ORES.topaz.name}`,
    "topaz",
    ORES.topaz.value
);

addFurnaceItem(
    `${ORES.amethyst.emoji} ${ORES.amethyst.name}`,
    "amethyst",
    ORES.amethyst.value
);

addFurnaceItem(
    `${ORES.malachite.emoji} ${ORES.malachite.name}`,
    "malachite",
    ORES.malachite.value
);

// Tier 2

addFurnaceItem(
    `${ORES.citrine.emoji} ${ORES.citrine.name}`,
    "citrine",
    ORES.citrine.value
);

addFurnaceItem(
    `${ORES.garnet.emoji} ${ORES.garnet.name}`,
    "garnet",
    ORES.garnet.value
);

addFurnaceItem(
    `${ORES.peridot.emoji} ${ORES.peridot.name}`,
    "peridot",
    ORES.peridot.value
);

addFurnaceItem(
    `${ORES.jade.emoji} ${ORES.jade.name}`,
    "jade",
    ORES.jade.value
);

addFurnaceItem(
    `${ORES.aquamarine.emoji} ${ORES.aquamarine.name}`,
    "aquamarine",
    ORES.aquamarine.value
);

// Tier 3

addFurnaceItem(
    `${ORES.spinel.emoji} ${ORES.spinel.name}`,
    "spinel",
    ORES.spinel.value
);

addFurnaceItem(
    `${ORES.tourmaline.emoji} ${ORES.tourmaline.name}`,
    "tourmaline",
    ORES.tourmaline.value
);

addFurnaceItem(
    `${ORES.sapphire.emoji} ${ORES.sapphire.name}`,
    "sapphire",
    ORES.sapphire.value
);

addFurnaceItem(
    `${ORES.ruby.emoji} ${ORES.ruby.name}`,
    "ruby",
    ORES.ruby.value
);

addFurnaceItem(
    `${ORES.emerald.emoji} ${ORES.emerald.name}`,
    "emerald",
    ORES.emerald.value
);

// Tier 4

addFurnaceItem(
    `${ORES.onyx.emoji} ${ORES.onyx.name}`,
    "onyx",
    ORES.onyx.value
);

addFurnaceItem(
    `${ORES.tanzanite.emoji} ${ORES.tanzanite.name}`,
    "tanzanite",
    ORES.tanzanite.value
);

addFurnaceItem(
    `${ORES.alexandrite.emoji} ${ORES.alexandrite.name}`,
    "alexandrite",
    ORES.alexandrite.value
);

addFurnaceItem(
    `${ORES.blackOpal.emoji} ${ORES.blackOpal.name}`,
    "blackOpal",
    ORES.blackOpal.value
);

addFurnaceItem(
    `${ORES.diamond.emoji} ${ORES.diamond.name}`,
    "diamond",
    ORES.diamond.value
);

if(container.innerHTML === ""){

    container.innerHTML =
        "<p>No items available to smelt.</p>";

}

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

    updateUI();
