/* Base Collection presentation facts. No state mutation or duplicate ore catalogue. */
(function (root) {
  "use strict";
  function snapshot(ores, quantities) {
    const entries = Object.entries(ores)
      .sort((a, b) => a[1].tier - b[1].tier)
      .map(([id, ore], index) => {
        const amount = quantities[id] ?? 0;
        if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 0)
          throw Error("Invalid Collection quantity");
        const common = {
          slot: index + 1,
          tier: ore.tier,
          discovered: amount > 0,
        };
        // Unknown records contain no identifying properties, even for accessibility consumers.
        return amount > 0
          ? {
              ...common,
              id,
              name: ore.name,
              icon: id,
              baseValue: ore.value,
              rarity: ore.rarity,
              amount,
            }
          : common;
      });
    const discovered = entries.filter((e) => e.discovered).length,
      total = entries.length;
    return {
      entries,
      discovered,
      total,
      percentage: total ? (discovered / total) * 100 : 0,
    };
  }
  const api = Object.freeze({ snapshot });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CollectionModel = api;
})(globalThis);
