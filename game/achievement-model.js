/* GAME23: the existing six achievements; no reward consumers. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AchievementModel = api;
})(globalThis, () => {
  "use strict";
  const catalogue = {
    firstSwing: {
      category: "⛏ Mining",

      name: "First Swing",

      description: "Mine your first stone.",

      type: "stat",

      stat: "totalOresMined",

      target: 1,

      reward: {
        type: null,
        value: 0,
      },
    },

    stoneMiner: {
      category: "⛏ Mining",

      name: "Ore Miner",

      description: "Mine 100 ores.",

      type: "stat",

      stat: "totalOresMined",

      target: 100,

      reward: {
        type: null,
        value: 0,
      },
    },

    dedicatedMiner: {
      category: "⛏ Mining",

      name: "Dedicated Miner",

      description: "Mine 1,000 ores.",

      type: "stat",

      stat: "totalOresMined",

      target: 1000,

      reward: {
        type: null,
        value: 0,
      },
    },
    firstDiscovery: {
      category: "📖 Collection",

      name: "Shiny!",

      description: "Discover your first ore.",

      type: "stat",

      stat: "oresDiscovered",

      target: 1,

      reward: {
        type: null,
        value: 0,
      },
    },

    firstSmelt: {
      category: "🔥 Furnace",

      name: "First Smelt",

      description: "Smelt an ore.",

      type: "stat",

      stat: "oresSmelted",

      target: 1,

      reward: {
        type: null,
        value: 0,
      },
    },

    factoryOwner: {
      category: "🏭 Factory",

      name: "Factory Owner",

      description: "Reach Factory Level 10.",

      type: "level",

      target: 10,

      reward: {
        type: null,
        value: 0,
      },
    },
  };

  for (const a of Object.values(catalogue)) {
    Object.freeze(a.reward);
    Object.freeze(a);
  }
  Object.freeze(catalogue);
  function progress(state, id) {
    const a = catalogue[id];
    if (!a) throw Error("Unknown achievement");
    const value =
      a.type === "level"
        ? state.factoryLevel
        : (state.achievementStats[a.stat] ?? 0);
    return {
      value,
      target: a.target,
      current: Math.min(value, a.target),
      percent: Math.min(100, (value / a.target) * 100),
      unit:
        a.stat === "totalOresMined"
          ? "manual actions"
          : a.stat === "oresDiscovered"
            ? "unique ores"
            : a.stat === "oresSmelted"
              ? "items smelted"
              : "Factory Level",
    };
  }
  function eligible(state) {
    return Object.keys(catalogue).filter(
      (id) =>
        !state.achievements[id]?.unlocked &&
        progress(state, id).value >= catalogue[id].target,
    );
  }
  function complete(state) {
    for (const id of eligible(state))
      state.achievements[id] = { unlocked: true, claimed: false };
  }
  function revealed(state) {
    return Object.keys(catalogue).some(
      (id) => state.achievements[id]?.unlocked === true,
    );
  }
  function claim(state, id) {
    if (
      !Object.hasOwn(catalogue, id) ||
      !state.achievements[id]?.unlocked ||
      state.achievements[id].claimed
    )
      throw Error("Achievement is locked, unknown or already claimed.");
    state.achievements[id].claimed = true;
  }
  return Object.freeze({
    catalogue,
    progress,
    eligible,
    complete,
    revealed,
    claim,
  });
});
