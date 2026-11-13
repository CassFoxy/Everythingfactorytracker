/* GAME24: read-only committed manual-award facts and bounded transient lifetimes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.MiningFeedbackModel = api;
})(globalThis, () => {
  "use strict";
  function event(before, after, ores) {
    if (
      before?.developmentProfile !== "miner-1" ||
      after?.developmentProfile !== "miner-1" ||
      before.rebirthCount !== after.rebirthCount
    )
      return null;
    const a = before.statistics.lifetime.gameplay,
      b = after.statistics.lifetime.gameplay;
    if (b.manualClicks <= a.manualClicks) return null;
    const rewards = [];
    for (const [id, ore] of Object.entries({
      stone: { name: "Stone", tier: 0 },
      ...ores,
    })) {
      const amount = BigInt(b.manualOutput[id]) - BigInt(a.manualOutput[id]);
      if (amount > 0n)
        rewards.push({
          id,
          name: ore.name,
          tier: ore.tier,
          amount: String(amount),
        });
    }
    for (const id of ["wood", "scrap", "metal"]) {
      const amount = BigInt(b.materials[id]) - BigInt(a.materials[id]);
      if (amount > 0n)
        rewards.push({
          id,
          name: id[0].toUpperCase() + id.slice(1),
          tier: 0,
          amount: String(amount),
        });
    }
    if (!rewards.length) return null;
    const pickaxe = before.manual.pickaxes.find(
      (p) => p.id === before.manual.equippedPickaxeId,
    );
    return {
      kind: "manual",
      pickaxeTier: pickaxe?.tier || 0,
      tier: Math.max(...rewards.map((r) => r.tier)),
      rewards,
    };
  }
  function createBurst({
    schedule = setTimeout,
    cancel = clearTimeout,
    render = () => {},
    clearView = () => {},
    duration = 1300,
  } = {}) {
    let timer = null,
      generation = 0,
      rewards = new Map(),
      tier = 0;
    function clear() {
      generation++;
      if (timer !== null) cancel(timer);
      timer = null;
      rewards.clear();
      tier = 0;
      clearView();
    }
    function push(fact) {
      if (!fact) return;
      for (const r of fact.rewards) {
        const old = rewards.get(r.id);
        rewards.set(r.id, {
          ...r,
          amount: String(BigInt(old?.amount || "0") + BigInt(r.amount)),
        });
      }
      tier = Math.max(tier, fact.tier);
      if (timer !== null) cancel(timer);
      const token = ++generation;
      try {
        render({ ...fact, tier, rewards: [...rewards.values()] });
      } catch (error) {
        clear();
        throw error;
      }
      timer = schedule(() => {
        if (token === generation) clear();
      }, duration);
    }
    return Object.freeze({
      push,
      clear,
      snapshot: () => ({
        rewards: [...rewards.values()],
        timerActive: timer !== null,
      }),
    });
  }
  return Object.freeze({ event, createBurst });
});
