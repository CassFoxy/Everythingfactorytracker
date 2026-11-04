/* Reference G milestone definitions and pure progression. No rewards or DOM. */
(function (root) {
  "use strict";
  const levels = Object.freeze([
    10,
    25,
    50,
    75,
    100,
    ...Array.from(
      { length: 245 },
      (_, index) =>
        Math.round((100 + 9900 * ((index + 1) / 245) ** 1.2) / 5) * 5,
    ),
  ]);
  const definitions = Object.freeze(
    levels.map((level, index) =>
      Object.freeze({
        id: "milestone:" + level,
        level,
        index: index + 1,
      }),
    ),
  );
  function createEarned() {
    return Object.fromEntries(levels.map((level) => [level, false]));
  }
  function validateEarned(earned) {
    if (
      !earned ||
      typeof earned !== "object" ||
      Array.isArray(earned) ||
      Object.keys(earned).length !== levels.length ||
      levels.some(
        (level) =>
          !Object.hasOwn(earned, level) || typeof earned[level] !== "boolean",
      )
    )
      throw Error("Invalid canonical milestone flags");
    return earned;
  }
  function complete(earned, factoryLevel) {
    validateEarned(earned);
    if (!Number.isInteger(factoryLevel) || factoryLevel < 0)
      throw Error("Invalid milestone Factory Level");
    const next = { ...earned };
    for (const level of levels) if (factoryLevel >= level) next[level] = true;
    return next;
  }
  function summary(earned) {
    validateEarned(earned);
    return {
      completed: levels.filter((level) => earned[level]).length,
      total: levels.length,
      next: levels.find((level) => !earned[level]) ?? null,
    };
  }
  const api = Object.freeze({
    levels,
    definitions,
    createEarned,
    validateEarned,
    complete,
    summary,
  });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.MilestoneModel = api;
})(globalThis);
