const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const M = require("../../milestone-model.js");

test("Reference G: all 250 generated thresholds exactly match the independently listed catalogue", () => {
  const bible = fs.readFileSync(
    path.join(__dirname, "../GAME_BIBLE.md"),
    "utf8",
  );
  const section = bible
    .split("## Reference G Milestones and deferred rewards")[1]
    .split("Track earned flags permanently")[0];
  const listed = [
    ...section.matchAll(/- Entries \d+–\d+: ([\d, ]+)\./g),
  ].flatMap((match) => match[1].split(",").map(Number));
  assert.equal(listed.length, 250);
  assert.deepEqual(M.levels, listed);
  assert.equal(new Set(M.levels).size, 250);
  assert.deepEqual(M.levels.slice(0, 5), [10, 25, 50, 75, 100]);
  assert.equal(M.levels.at(-1), 10000);
  M.levels.forEach((level, i) => {
    assert.equal(level % 5, 0);
    assert.ok(level <= 10000 && (!i || level > M.levels[i - 1]));
    assert.equal(M.definitions[i].id, "milestone:" + level);
  });
});
test("Every threshold records below/equal/above correctly with permanent independent flags", () => {
  for (const level of M.levels) {
    const initial = M.createEarned();
    assert.equal(M.complete(initial, level - 1)[level], false);
    const earned = M.complete(initial, level);
    assert.equal(earned[level], true);
    assert.equal(M.complete(initial, level + 1)[level], true);
    assert.equal(initial[level], false);
    assert.deepEqual(M.complete(earned, level), earned);
    assert.deepEqual(M.complete(earned, 0), earned);
  }
});
test("Large Factory Level jumps retain every intermediate milestone without changing XP", () => {
  const before = M.complete(M.createEarned(), 95);
  const next = M.complete(before, 200);
  assert.deepEqual(
    M.levels.filter((level) => next[level] && !before[level]),
    [100, 115, 130, 150, 170, 195],
  );
  assert.deepEqual(M.summary(next), { completed: 10, total: 250, next: 215 });
  assert.deepEqual(M.summary(M.createEarned()), {
    completed: 0,
    total: 250,
    next: 10,
  });
  assert.deepEqual(M.summary(M.complete(next, 12000)), {
    completed: 250,
    total: 250,
    next: null,
  });
});
test("Malformed canonical flags and levels reject without clamping", () => {
  for (const bad of [
    null,
    [],
    {},
    { ...M.createEarned(), 10: 1 },
    { ...M.createEarned(), 200: true },
  ])
    assert.throws(() => M.validateEarned(bad));
  for (const bad of [-1, 0.5, NaN, Infinity, "10"])
    assert.throws(() => M.complete(M.createEarned(), bad));
});
