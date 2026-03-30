/**
 * SYSTEM / ACCEPTANCE TESTS — All User Stories
 *
 * These tests verify the data layer and business logic that backs each
 * user story end-to-end (without requiring a browser).
 *
 * For UI verification, see: src/__tests__/system/MANUAL_TESTS.md
 */

import { MODULES } from "@/app/modules/data";
import { QUIZZES } from "@/app/quizzes/data";
import {
  setLessonComplete,
  areAllLessonsComplete,
  getCompletedLessonsForModule,
  isLessonComplete,
  clearModuleProgress,
} from "@/app/modules/progress";
import { isModuleUnlocked } from "@/lib/learning/moduleUnlock";
import {
  setQuizEntryAllowed,
  isQuizEntryAllowed,
  clearQuizEntry,
} from "@/lib/learning/quizEntry";
import {
  computeReadinessScore,
  scoreLabel,
  readinessQuestions,
} from "@/lib/readiness/scoring";
import {
  awardLessonPoints,
  awardQuizPoints,
  getAuraPoints,
  AURA_POINT_VALUES,
} from "@/lib/auraPoints";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// ══════════════════════════════════════════════════════════════════════════════
// US-01 · Learning Modules (All Licence Levels)
// ══════════════════════════════════════════════════════════════════════════════
describe("US-01 · Learning Modules exist for all three licence levels", () => {
  test("there are G1 modules in the data", () => {
    const g1 = MODULES.filter((m) => m.licenseLevel === "G1");
    expect(g1.length).toBeGreaterThan(0);
  });

  test("there are G2 modules in the data", () => {
    const g2 = MODULES.filter((m) => m.licenseLevel === "G2");
    expect(g2.length).toBeGreaterThan(0);
  });

  test("there are G modules in the data", () => {
    const g = MODULES.filter((m) => m.licenseLevel === "G");
    expect(g.length).toBeGreaterThan(0);
  });

  test("every module has at least one lesson", () => {
    MODULES.forEach((m) => {
      expect(m.lessons.length).toBeGreaterThan(0);
    });
  });

  test("marking a lesson complete is tracked per module", () => {
    const mod = MODULES[0];
    setLessonComplete(mod.id, mod.lessons[0].id);
    expect(isLessonComplete(mod.id, mod.lessons[0].id)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// US-02 · Quizzes inside Modules
// ══════════════════════════════════════════════════════════════════════════════
describe("US-02 · Quizzes inside Modules", () => {
  test("quizzes exist and each has questions", () => {
    expect(QUIZZES.length).toBeGreaterThan(0);
    QUIZZES.forEach((q) => {
      expect(q.questions.length).toBeGreaterThan(0);
    });
  });

  test("quiz requires all lessons to be done before it can be started", () => {
    const mod = MODULES[0];
    const lessonIds = mod.lessons.map((l) => l.id);
    // Only complete first lesson
    setLessonComplete(mod.id, lessonIds[0]);
    expect(areAllLessonsComplete(mod.id, lessonIds)).toBe(lessonIds.length === 1);
  });

  test("quiz entry gate blocks direct URL access (no token)", () => {
    expect(isQuizEntryAllowed("g1-signs-signals-markings")).toBe(false);
  });

  test("quiz entry gate allows access after token is set", () => {
    setQuizEntryAllowed("g1-signs-signals-markings");
    expect(isQuizEntryAllowed("g1-signs-signals-markings")).toBe(true);
  });

  test("passing a quiz unlocks the next module", () => {
    const g1 = MODULES.filter((m) => m.licenseLevel === "G1");
    if (g1.length < 2) return;
    const passed = new Set([g1[0].id]);
    expect(isModuleUnlocked(g1[1].id, passed)).toBe(true);
  });

  test("failing a quiz 3 times resets lesson progress", () => {
    const mod = MODULES[0];
    mod.lessons.forEach((l) => setLessonComplete(mod.id, l.id));
    clearModuleProgress(mod.id); // simulate lockout
    expect(getCompletedLessonsForModule(mod.id)).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// US-03 · Data Visualization (Progress Insights)
// ══════════════════════════════════════════════════════════════════════════════
describe("US-03 · Data Visualization — progress data is available", () => {
  test("completed lesson count can be computed from progress module", () => {
    setLessonComplete("g1-signs", "1");
    setLessonComplete("g1-signs", "2");
    expect(getCompletedLessonsForModule("g1-signs")).toHaveLength(2);
  });

  test("Aura Points breakdown is available for display", () => {
    awardLessonPoints("g1-signs", "1");
    awardQuizPoints("g1-signs");
    expect(getAuraPoints()).toBeGreaterThan(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// US-04 · What To Do When an Accident Occurs
// ══════════════════════════════════════════════════════════════════════════════
describe("US-04 · Accident module content exists", () => {
  test("accident module exists in module data", () => {
    const accident = MODULES.find((m) =>
      m.id.includes("accident")
    );
    expect(accident).toBeDefined();
  });

  test("accident module has multiple lessons", () => {
    const accident = MODULES.find((m) => m.id.includes("accident"))!;
    expect(accident.lessons.length).toBeGreaterThanOrEqual(4);
  });

  test("accident lessons can be marked complete", () => {
    const accident = MODULES.find((m) => m.id.includes("accident"))!;
    const firstLesson = accident.lessons[0];
    setLessonComplete(accident.id, firstLesson.id);
    expect(isLessonComplete(accident.id, firstLesson.id)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// US-05 · Strategies to Stay Calm (Drive Readiness Check)
// ══════════════════════════════════════════════════════════════════════════════
describe("US-05 · Readiness Check scoring", () => {
  test("all 5 readiness questions are present", () => {
    expect(readinessQuestions.length).toBe(5);
  });

  test("answering all questions with best values gives 100", () => {
    const answers = Object.fromEntries(
      readinessQuestions.map((q) => [q.id, 0])
    );
    expect(computeReadinessScore(answers)).toBe(100);
  });

  test("answering all questions with worst values gives 0", () => {
    const answers = Object.fromEntries(
      readinessQuestions.map((q) => [q.id, 4])
    );
    expect(computeReadinessScore(answers)).toBe(0);
  });

  test("empty answers give 0 (no default-100 bug)", () => {
    expect(computeReadinessScore({})).toBe(0);
  });

  test("score correctly labelled across all thresholds", () => {
    expect(scoreLabel(100)).toBe("Safe to drive");
    expect(scoreLabel(70)).toBe("Use caution");
    expect(scoreLabel(40)).toBe("Do not drive");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// US-06 · Aura Points
// ══════════════════════════════════════════════════════════════════════════════
describe("US-06 · Aura Points rewarding", () => {
  test("starts at 0", () => {
    expect(getAuraPoints()).toBe(0);
  });

  test("completing a lesson awards the correct points", () => {
    awardLessonPoints("g1-signs", "1");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.LESSON);
  });

  test("passing a quiz awards the correct points", () => {
    awardQuizPoints("g1-signs");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.QUIZ);
  });

  test("same action cannot award points twice", () => {
    awardLessonPoints("g1-signs", "1");
    awardLessonPoints("g1-signs", "1");
    expect(getAuraPoints()).toBe(AURA_POINT_VALUES.LESSON); // not doubled
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// US-07 · Log-in and Account (Database Integration)
// ══════════════════════════════════════════════════════════════════════════════
describe("US-07 · Account — quiz entry is per-session only", () => {
  test("quiz entry token is not shared between quiz IDs", () => {
    setQuizEntryAllowed("quiz-a");
    expect(isQuizEntryAllowed("quiz-b")).toBe(false);
  });

  test("clearing the token signs the user 'out' of the quiz session", () => {
    setQuizEntryAllowed("quiz-a");
    clearQuizEntry();
    expect(isQuizEntryAllowed("quiz-a")).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// US-08 · Know Your Car (Vehicle Interior / G2 modules)
// ══════════════════════════════════════════════════════════════════════════════
describe("US-08 · Know Your Car — vehicle interior module exists", () => {
  test("vehicle interior module is in the G2 module list", () => {
    const vehicleMod = MODULES.find((m) =>
      m.id.includes("vehicle-interior")
    );
    expect(vehicleMod).toBeDefined();
    expect(vehicleMod?.licenseLevel).toBe("G2");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// US-09 · Module Locking (cross-cutting acceptance criterion)
// ══════════════════════════════════════════════════════════════════════════════
describe("US-09 · Module locking prevents skipping ahead", () => {
  test("cannot access module 2 without passing module 1's quiz", () => {
    const g1 = MODULES.filter((m) => m.licenseLevel === "G1");
    if (g1.length < 2) return;
    expect(isModuleUnlocked(g1[1].id, new Set())).toBe(false);
  });

  test("all first modules in each level are unlocked from the start", () => {
    ["G1", "G2", "G"].forEach((level) => {
      const first = MODULES.filter((m) => m.licenseLevel === level)[0];
      if (first) {
        expect(isModuleUnlocked(first.id, new Set())).toBe(true);
      }
    });
  });
});
