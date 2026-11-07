/* Presentation facts and queue only. Never writes gameplay or persisted state. */
(function (root) {
  "use strict";
  const priorities = Object.freeze({
    major: 0,
    progression: 1,
    information: 2,
  });
  function createQueue({
    schedule = setTimeout,
    cancel = clearTimeout,
    onChange = () => {},
  } = {}) {
    let waiting = [],
      current = null,
      sequence = 0,
      generation = 0,
      timer = null,
      paused = false,
      held = false;
    const seen = new Set();
    const snapshot = () => ({
      current: current ? { ...current } : null,
      waiting: waiting.map((n) => ({ ...n })),
      paused,
      held,
    });
    function stop() {
      generation++;
      if (timer !== null) cancel(timer);
      timer = null;
    }
    function order() {
      waiting.sort(
        (a, b) =>
          priorities[a.priority] - priorities[b.priority] || a.order - b.order,
      );
    }
    function pump() {
      stop();
      order();
      if (
        current &&
        waiting[0] &&
        priorities[waiting[0].priority] < priorities[current.priority]
      ) {
        waiting.push(current);
        current = null;
        order();
      }
      if (!current && !paused) current = waiting.shift() || null;
      onChange(snapshot());
      if (current && !paused && !held && current.duration !== null) {
        const token = generation,
          id = current.id;
        timer = schedule(() => {
          if (token === generation) dismiss(id);
        }, current.duration);
      }
    }
    function enqueueMany(notices) {
      let added = 0;
      for (const notice of notices) {
        if (
          !notice ||
          typeof notice.id !== "string" ||
          !Object.hasOwn(priorities, notice.priority) ||
          typeof notice.title !== "string"
        )
          throw Error("Invalid notification");
        if (seen.has(notice.id)) continue;
        const duration =
          notice.duration === undefined
            ? { major: 9000, progression: 7000, information: 4500 }[
                notice.priority
              ]
            : notice.duration;
        if (duration !== null && (!Number.isFinite(duration) || duration <= 0))
          throw Error("Invalid notification duration");
        seen.add(notice.id);
        waiting.push({ ...notice, duration, order: sequence++ });
        added++;
      }
      if (added) pump();
      return added;
    }
    function dismiss(id = current?.id) {
      if (!current || current.id !== id) return false;
      current = null;
      pump();
      return true;
    }
    function setPaused(value) {
      value = !!value;
      if (value !== paused) {
        paused = value;
        pump();
      }
    }
    function setHeld(value) {
      value = !!value;
      if (value !== held) {
        held = value;
        pump();
      }
    }
    function clear() {
      stop();
      waiting = [];
      current = null;
      seen.clear();
      onChange(snapshot());
    }
    return Object.freeze({
      enqueueMany,
      dismiss,
      setPaused,
      setHeld,
      clear,
      snapshot,
    });
  }
  const display = (n) =>
    Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
  function events(before, after, catalog) {
    const out = [];
    const emit = (type, priority, title, body, icon, route, extra = {}) =>
      out.push({ type, priority, title, body, icon, route, ...extra });
    for (const ore of catalog.ores)
      if (!before.oreCollection[ore.id] && after.oreCollection[ore.id] > 0)
        emit(
          "discovery",
          "major",
          ore.name + " discovered",
          "Tier " + ore.tier + " · Added to your Collection.",
          ore.id,
          "collection",
          { tier: ore.tier, resourceId: ore.id },
        );
    for (const [id, a] of Object.entries(catalog.achievements))
      if (
        after.achievements[id]?.unlocked &&
        !before.achievements[id]?.unlocked
      )
        emit(
          "achievement",
          "major",
          a.name + " unlocked",
          a.description,
          "achievements",
          "achievements",
          { recordId: id },
        );
    const milestones =
      after.rebirthCount > 0
        ? catalog.milestones.filter(
            (l) =>
              (after.milestoneProgress?.earned || after.factoryMilestones)[l] &&
              !(before.milestoneProgress?.earned || before.factoryMilestones)[
                l
              ],
          )
        : [];
    if (milestones.length > 8)
      emit(
        "milestone",
        "major",
        milestones.length + " milestones earned",
        "Factory Levels " +
          milestones[0] +
          "–" +
          milestones.at(-1) +
          ". View every earned milestone in Milestones.",
        "milestones",
        "milestones",
        { levels: milestones },
      );
    else
      for (const level of milestones)
        emit(
          "milestone",
          "major",
          "Factory Level " + level + " milestone",
          "Milestone permanently recorded.",
          "milestones",
          "milestones",
          { level },
        );
    if (after.factoryLevel > before.factoryLevel)
      emit(
        "level",
        "progression",
        "Factory Level " + before.factoryLevel + " → " + after.factoryLevel,
        "Your Factory XP progression has increased.",
        "upgrade",
        "statistics",
      );
    if (after.rebirthCount > before.rebirthCount) {
      emit(
        "rebirth",
        "major",
        "Rebirth " + after.rebirthCount + " complete",
        "+" +
          display(after.stardust - before.stardust) +
          " Stardust · Permanent progress retained.",
        "rebirth",
        "rebirth",
      );
      return out; // Removal/reset is not resale or a purchase.
    }
    const cashPaid = before.cash - after.cash,
      refund = after.cash - before.cash;
    const cashText = " · $" + display(cashPaid) + " paid";
    if (!before.shop.minerUnlocked && after.shop.minerUnlocked)
      emit(
        "unlock",
        "progression",
        "Miners unlocked",
        "Purchase a Miner in an unlocked slot" + cashText + ".",
        "locked",
        "miners",
      );
    after.factory.minerSlots.forEach((v, i) => {
      if (v && !before.factory.minerSlots[i])
        emit(
          "unlock",
          "progression",
          "Miner Slot " + (i + 1) + " unlocked",
          "Slot access is permanent; purchase a Miner separately" +
            cashText +
            ".",
          "purchase",
          "miners",
        );
    });
    for (const [key, title] of Object.entries(catalog.shop))
      if (after.shop[key] > before.shop[key])
        emit(
          "purchase",
          "information",
          title + " upgraded",
          "Level " +
            before.shop[key] +
            " → " +
            after.shop[key] +
            cashText +
            ".",
          key === "miningLuck"
            ? "luck"
            : key === "miningDuplication"
              ? "duplication"
              : "pickaxe0",
          "shop",
        );
    for (const [id, definition] of Object.entries(catalog.perks))
      if (after.permanentPerks[id] > before.permanentPerks[id])
        emit(
          "purchase",
          "information",
          definition.name + " upgraded",
          "Level " +
            before.permanentPerks[id] +
            " → " +
            after.permanentPerks[id] +
            " · " +
            display(before.stardust - after.stardust) +
            " Stardust paid.",
          "stardust",
          "perks",
        );
    for (const [key, title, route] of [
      ["miners", "Miner", "miners"],
      ["polishers", "Polisher", "polishers"],
      ["refiner", "Refiner", "refiner"],
    ]) {
      const old =
        key === "refiner"
          ? [before.factory.refiner].filter(Boolean)
          : before.factory[key];
      const next =
        key === "refiner"
          ? [after.factory.refiner].filter(Boolean)
          : after.factory[key];
      for (const m of next) {
        const prior = old.find((p) => p.id === m.id),
          label = title + (m.slot ? " Slot " + m.slot : "");
        if (!prior)
          emit(
            "purchase",
            "information",
            label + " purchased",
            m.id + cashText + ".",
            "purchase",
            route,
          );
        else
          for (const [stat, name] of [
            ["tier", "Tier"],
            ["oreLuckLevel", "Local Ore Luck"],
          ])
            if (m[stat] > prior[stat])
              emit(
                "purchase",
                "information",
                label + " upgraded",
                name + " " + prior[stat] + " → " + m[stat] + cashText + ".",
                "upgrade",
                route,
              );
      }
      for (const m of old)
        if (!next.some((n) => n.id === m.id))
          emit(
            "resale",
            "information",
            title + " sold",
            m.id +
              " · $" +
              display(refund) +
              " refunded. Replacement is available.",
            "sell",
            route,
          );
    }
    const oldFurnace = before.factory.furnace,
      newFurnace = after.factory.furnace;
    if (newFurnace) {
      if (!oldFurnace)
        emit(
          "purchase",
          "information",
          "Furnace modernised",
          "Canonical Furnace controls are available.",
          "upgrade",
          "furnace",
        );
      else if (newFurnace.tier > oldFurnace.tier)
        emit(
          "purchase",
          "information",
          "Furnace upgraded",
          "Tier " + oldFurnace.tier + " → " + newFurnace.tier + cashText + ".",
          "upgrade",
          "furnace",
        );
      if (oldFurnace && oldFurnace.tier < 3 && newFurnace.tier >= 3)
        emit(
          "unlock",
          "progression",
          "Automatic Furnace available",
          "Automation is now available. Your saved preference is unchanged.",
          "processing",
          "furnace",
        );
    } else if (after.furnaceTier > before.furnaceTier)
      emit(
        "purchase",
        "information",
        "Furnace upgraded",
        "Inherited Furnace upgrade" + cashText + ".",
        "upgrade",
        "furnace",
      );
    for (const copy of after.manual.pickaxes) {
      const old = before.manual.pickaxes.find((p) => p.id === copy.id);
      if (!old)
        emit(
          "craft",
          "information",
          catalog.pickaxes[copy.tier] + " Pickaxe crafted",
          copy.id + " · A new independent copy is ready to equip.",
          "pickaxe" + copy.tier,
          "pickaxes",
        );
      else if (old.remainingDurability === 0 && copy.remainingDurability > 0)
        emit(
          "repair",
          "information",
          catalog.pickaxes[copy.tier] + " Pickaxe repaired",
          copy.id +
            " · Restored to " +
            display(copy.remainingDurability) +
            " durability.",
          "repair",
          "pickaxes",
        );
    }
    const eligible = (s) => !!s.factory.furnace && s.cash >= 1000000;
    if (!eligible(before) && eligible(after))
      emit(
        "rebirthAvailable",
        "information",
        "Rebirth is available",
        "You have at least $1,000,000 unspent Cash. Review the reset and Stardust award before confirming.",
        "rebirth",
        "rebirth",
      );
    return out;
  }
  const api = Object.freeze({ priorities, createQueue, events });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NotificationModel = api;
})(globalThis);
