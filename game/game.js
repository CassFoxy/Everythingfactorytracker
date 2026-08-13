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
let save = JSON.parse(
    localStorage.getItem("ef_incremental")
) || {
cash: 100,

factoryLevel: 1,
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

factoryMilestones:
    createDefaultMilestones(),

achievementStats: {

    totalOresMined: 0,

    oresDiscovered: 0,

    oresSmelted: 0

},

achievements: {},

permanentBonuses:{

    oreValue:0,

    dropperSpeed:0,

    adderPower:0,

    multiplierPower:0,

    duplicateChance:0,

    furnaceCapacity:0,

    factoryXP:0,

    miningLuck:0

},

cosmetics:{

    unlocked:{

        default:true

    },

    equipped:{

        dropper:"default",

        adder:"default",

        multiplier:"default",

        furnace:"default"

    }

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

save.autoFurnaceBatch ??= [];
save.autoFurnaceEnabled ??= true;
save.autoFurnaceStartTime ??= 0;

save.autoFurnaceMode ??= "oresStone";
save.autoFurnaceBatchMode ??= "available";

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

    totalOresMined: 0,

    oresDiscovered: 0,

    oresSmelted: 0

};

save.achievementStats.totalOresMined ??= 0;
save.achievementStats.oresDiscovered ??= 0;
save.achievementStats.oresSmelted ??= 0;

save.achievements ??= {};
Object.keys(
    save.achievements
).forEach(id => {

    if(
        typeof save.achievements[id] ===
        "boolean"
    ){

        save.achievements[id] = {

            unlocked:
                save.achievements[id],

            claimed: false

        };

    }

});
save.permanentBonuses ??= {

    oreValue:0,

    dropperSpeed:0,

    adderPower:0,

    multiplierPower:0,

    duplicateChance:0,

    furnaceCapacity:0,

    factoryXP:0,

    miningLuck:0

};

save.permanentBonuses.oreValue ??= 0;
save.permanentBonuses.dropperSpeed ??= 0;
save.permanentBonuses.adderPower ??= 0;
save.permanentBonuses.multiplierPower ??= 0;
save.permanentBonuses.duplicateChance ??= 0;
save.permanentBonuses.furnaceCapacity ??= 0;
save.permanentBonuses.factoryXP ??= 0;
save.permanentBonuses.miningLuck ??= 0;

save.cosmetics ??= {

    unlocked:{

        default:true

    },

    equipped:{

        dropper:"default",

        adder:"default",

        multiplier:"default",

        furnace:"default"

    }

};

save.cosmetics.unlocked ??= {};
save.cosmetics.equipped ??= {};

save.cosmetics.unlocked.default ??= true;

save.cosmetics.equipped.dropper ??= "default";
save.cosmetics.equipped.adder ??= "default";
save.cosmetics.equipped.multiplier ??= "default";
save.cosmetics.equipped.furnace ??= "default";

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
    cost: 500
},

{
    name: "Auto Furnace",
    capacity: 100,
    cost: 2500
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

    save.autoFurnaceMode ??= "oresStone";
    save.autoFurnaceBatchMode ??= "available";

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


function getAutoFurnaceMode(){

    return save.autoFurnaceMode ||
        "oresStone";

}


function getAutoFurnaceBatchMode(){

    return save.autoFurnaceBatchMode ||
        "available";

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


    save.factoryXP +=
        totalItems;


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

    autoFurnaceState.enabled =
        true;

    save.autoFurnaceEnabled =
        true;

    saveGame();

    updateAutoFurnaceUI();

    startAutoFurnaceCycle();

}


function updateAutoFurnace(){

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
            `Batch value: $${formatNumber(batchValue)}`;

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


setInterval(function(){

    updateAutoFurnace();

}, 100);


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

    updateUI();
