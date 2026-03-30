/**
 * UNIT TESTS — Module Unlock Logic
 * User Story: Learning Modules (All Licence Levels)
 *
 * Tests the rule: a module is unlocked only when the previous module's
 * quiz has been passed. The very first module in each level is always open.
 */

import { isModuleUnlocked } from "@/lib/learning/moduleUnlock";
import { MODULES } from "@/app/modules/data";

// Get the ordered G1 modules for test reference
const g1Modules = MODULES.filter((m) => m.licenseLevel === "G1");
const g2Modules = MODULES.filter((m) => m.licenseLevel === "G2");
const gModules  = MODULES.filter((m) => m.licenseLevel === "G");

describe("isModuleUnlocked — first module always open", () => {
  test("the first G1 module is unlocked with no passed quizzes", () => {
    const firstG1 = g1Modules[0];
    expect(isModuleUnlocked(firstG1.id, new Set())).toBe(true);
  });

  test("the first G2 module is unlocked with no passed quizzes", () => {
    const firstG2 = g2Modules[0];
    expect(isModuleUnlocked(firstG2.id, new Set())).toBe(true);
  });

  test("the first G module is unlocked with no passed quizzes", () => {
    const firstG = gModules[0];
    expect(isModuleUnlocked(firstG.id, new Set())).toBe(true);
  });
});

describe("isModuleUnlocked — subsequent modules require previous quiz", () => {
  test("second G1 module is locked when the first quiz has not been passed", () => {
    if (g1Modules.length < 2) return; // skip if only one module
    const second = g1Modules[1];
    expect(isModuleUnlocked(second.id, new Set())).toBe(false);
  });

  test("second G1 module unlocks after the first module's quiz is passed", () => {
    if (g1Modules.length < 2) return;
    const first  = g1Modules[0];
    const second = g1Modules[1];
    const passedIds = new Set([first.id]);
    expect(isModuleUnlocked(second.id, passedIds)).toBe(true);
  });

  test("passing a quiz for a different level does not unlock a G1 module", () => {
    if (g1Modules.length < 2) return;
    const second = g1Modules[1];
    const wrongLevelPassed = new Set(["g2-licensing-restrictions"]);
    expect(isModuleUnlocked(second.id, wrongLevelPassed)).toBe(false);
  });

  test("second G2 module unlocks after first G2 quiz is passed", () => {
    if (g2Modules.length < 2) return;
    const first  = g2Modules[0];
    const second = g2Modules[1];
    const passedIds = new Set([first.id]);
    expect(isModuleUnlocked(second.id, passedIds)).toBe(true);
  });
});

describe("isModuleUnlocked — unknown module ID", () => {
  test("returns false for a module ID that does not exist", () => {
    expect(isModuleUnlocked("nonexistent-module", new Set())).toBe(false);
  });
});
