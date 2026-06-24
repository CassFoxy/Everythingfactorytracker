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

const ores = [
    {name:"🌈 Alexandrite", value:100000, key:"alexandrite"},
    {name:"🖤 Black Opal", value:150000, key:"blackOpal"},
    {name:"💎 Diamond", value:250000, key:"diamond"},
    {name:"⚫ Onyx", value:50000, key:"onyx"},
    {name:"💜 Tanzanite", value:75000, key:"tanzanite"}
];

const ore =
    ores[Math.floor(
        Math.random() * ores.length
    )];

save.lastOre = ore.name;
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
        ore.name,
        ore.value
    );

}

save.tier4Ores++;

save.factoryXP += 1000;

    }

// Tier 3 (1 in 50,000)

else if(roll < 0.000024){

const ores = [
    {name:"💚 Emerald", value:25000, key:"emerald"},
    {name:"❤️ Ruby", value:20000, key:"ruby"},
    {name:"💙 Sapphire", value:15000, key:"sapphire"},
    {name:"💗 Spinel", value:5000, key:"spinel"},
    {name:"🌈 Tourmaline", value:10000, key:"tourmaline"}
];

const ore =
    ores[Math.floor(
        Math.random() * ores.length
    )];

save.lastOre = ore.name;
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
        ore.name,
        ore.value
    );

}

save.tier3Ores++;

save.factoryXP += 100;

    }

// Tier 2 (1 in 1,000)

else if(roll < 0.001024){

const ores = [
    {name:"💎 Aquamarine", value:1000, key:"aquamarine"},
    {name:"🟡 Citrine", value:250, key:"citrine"},
    {name:"🔴 Garnet", value:500, key:"garnet"},
    {name:"🟢 Jade", value:900, key:"jade"},
    {name:"💚 Peridot", value:750, key:"peridot"}
];

const ore =
    ores[Math.floor(
        Math.random() * ores.length
    )];

save.lastOre = ore.name;
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
        ore.name,
        ore.value
    );

}

save.tier2Ores++;

save.factoryXP += 25;

    }

// Tier 1 (1 in 25)

else if(roll < 0.041024){

const ores = [
    {name:"🟠 Amber", value:10, key:"amber"},
    {name:"💜 Amethyst", value:40, key:"amethyst"},
    {name:"🟢 Malachite", value:50, key:"malachite"},
    {name:"⚪ Quartz", value:20, key:"quartz"},
    {name:"🟡 Topaz", value:30, key:"topaz"}
];

const ore =
    ores[Math.floor(
        Math.random() * ores.length
    )];

save.lastOre = ore.name;
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
        ore.name,
        ore.value
    );

}

save.tier1Ores++;

save.factoryXP += 5;

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

updateOreDisplay("amberLabel","amberCount","Amber",save.oreCollection.amber);
updateOreDisplay("amethystLabel","amethystCount","Amethyst",save.oreCollection.amethyst);
updateOreDisplay("malachiteLabel","malachiteCount","Malachite",save.oreCollection.malachite);
updateOreDisplay("quartzLabel","quartzCount","Quartz",save.oreCollection.quartz);
updateOreDisplay("topazLabel","topazCount","Topaz",save.oreCollection.topaz);

updateOreDisplay("aquamarineLabel","aquamarineCount","Aquamarine",save.oreCollection.aquamarine);
updateOreDisplay("citrineLabel","citrineCount","Citrine",save.oreCollection.citrine);
updateOreDisplay("garnetLabel","garnetCount","Garnet",save.oreCollection.garnet);
updateOreDisplay("jadeLabel","jadeCount","Jade",save.oreCollection.jade);
updateOreDisplay("peridotLabel","peridotCount","Peridot",save.oreCollection.peridot);

updateOreDisplay("emeraldLabel","emeraldCount","Emerald",save.oreCollection.emerald);
updateOreDisplay("rubyLabel","rubyCount","Ruby",save.oreCollection.ruby);
updateOreDisplay("sapphireLabel","sapphireCount","Sapphire",save.oreCollection.sapphire);
updateOreDisplay("spinelLabel","spinelCount","Spinel",save.oreCollection.spinel);
updateOreDisplay("tourmalineLabel","tourmalineCount","Tourmaline",save.oreCollection.tourmaline);

updateOreDisplay("alexandriteLabel","alexandriteCount","Alexandrite",save.oreCollection.alexandrite);
updateOreDisplay("blackOpalLabel","blackOpalCount","Black Opal",save.oreCollection.blackOpal);
updateOreDisplay("diamondLabel","diamondCount","Diamond",save.oreCollection.diamond);
updateOreDisplay("onyxLabel","onyxCount","Onyx",save.oreCollection.onyx);
updateOreDisplay("tanzaniteLabel","tanzaniteCount","Tanzanite",save.oreCollection.tanzanite);

updateInventoryTooltip(
    "invStone",
    save.inventory.stone,
    save.stoneValue
);

updateInventoryTooltip(
    "invAmber",
    save.inventory.amber,
    10
);

updateInventoryTooltip(
    "invAmethyst",
    save.inventory.amethyst,
    40
);

updateInventoryTooltip(
    "invMalachite",
    save.inventory.malachite,
    50
);

updateInventoryTooltip(
    "invQuartz",
    save.inventory.quartz,
    20
);

updateInventoryTooltip(
    "invTopaz",
    save.inventory.topaz,
    30
);

updateInventoryTooltip(
    "invAquamarine",
    save.inventory.aquamarine,
    1000
);

updateInventoryTooltip(
    "invCitrine",
    save.inventory.citrine,
    250
);

updateInventoryTooltip(
    "invGarnet",
    save.inventory.garnet,
    500
);

updateInventoryTooltip(
    "invJade",
    save.inventory.jade,
    900
);

updateInventoryTooltip(
    "invPeridot",
    save.inventory.peridot,
    750
);

updateInventoryTooltip(
    "invEmerald",
    save.inventory.emerald,
    25000
);

updateInventoryTooltip(
    "invRuby",
    save.inventory.ruby,
    20000
);

updateInventoryTooltip(
    "invSapphire",
    save.inventory.sapphire,
    15000
);

updateInventoryTooltip(
    "invSpinel",
    save.inventory.spinel,
    5000
);

updateInventoryTooltip(
    "invTourmaline",
    save.inventory.tourmaline,
    10000
);

updateInventoryTooltip(
    "invAlexandrite",
    save.inventory.alexandrite,
    100000
);

updateInventoryTooltip(
    "invBlackOpal",
    save.inventory.blackOpal,
    150000
);

updateInventoryTooltip(
    "invDiamond",
    save.inventory.diamond,
    250000
);

updateInventoryTooltip(
    "invOnyx",
    save.inventory.onyx,
    50000
);

updateInventoryTooltip(
    "invTanzanite",
    save.inventory.tanzanite,
    75000
);
    
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

    addFurnaceItem(
        "🟠 Amber",
        "amber",
        10
    );

    addFurnaceItem(
        "💜 Amethyst",
        "amethyst",
        40
    );

    addFurnaceItem(
        "🟢 Malachite",
        "malachite",
        50
    );

    addFurnaceItem(
        "⚪ Quartz",
        "quartz",
        20
    );

    addFurnaceItem(
        "🟡 Topaz",
        "topaz",
        30
    );

    addFurnaceItem(
        "💎 Aquamarine",
        "aquamarine",
        1000
    );

    addFurnaceItem(
        "🟡 Citrine",
        "citrine",
        250
    );

    addFurnaceItem(
        "🔴 Garnet",
        "garnet",
        500
    );

    addFurnaceItem(
        "🟢 Jade",
        "jade",
        900
    );

    addFurnaceItem(
        "💚 Peridot",
        "peridot",
        750
    );

    addFurnaceItem(
        "💚 Emerald",
        "emerald",
        25000
    );

    addFurnaceItem(
        "❤️ Ruby",
        "ruby",
        20000
    );

    addFurnaceItem(
        "💙 Sapphire",
        "sapphire",
        15000
    );

    addFurnaceItem(
        "💗 Spinel",
        "spinel",
        5000
    );

    addFurnaceItem(
        "🌈 Tourmaline",
        "tourmaline",
        10000
    );

    addFurnaceItem(
        "🌈 Alexandrite",
        "alexandrite",
        100000
    );

    addFurnaceItem(
        "🖤 Black Opal",
        "blackOpal",
        150000
    );

    addFurnaceItem(
        "💎 Diamond",
        "diamond",
        250000
    );

    addFurnaceItem(
        "⚫ Onyx",
        "onyx",
        50000
    );

    addFurnaceItem(
        "💜 Tanzanite",
        "tanzanite",
        75000
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
