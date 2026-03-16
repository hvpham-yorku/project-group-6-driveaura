/**
 * Integration tests: Quiz → Aura → Progress pipeline.
 *
 * These tests verify that the three core services work correctly
 * together end-to-end: a user answers a quiz, that awards Aura
 * points, which then changes their module-unlock eligibility.
 */
import { InMemoryRepo } from "../repo";
import { AuraService } from "../aura";
import { ProgressService } from "../progress";
import { QuizService } from "../quiz";
import type { User, Module } from "../types";

const LOCKED_MODULE: Module = {
  id: "ev-basics",
  title: "EV Basics",
  category: "EV",
  requiredPointsToUnlock: 30,
};

const NEW_USER: User = {
  id: "u1",
  name: "Alex",
  auraPoints: 0,
  completedModuleIds: [],
  moduleProgress: {},
};

describe("Quiz → Aura → Progress — integration", () => {
  let repo: InMemoryRepo;
  let aura: AuraService;
  let progress: ProgressService;
  let quiz: QuizService;

  beforeEach(() => {
    repo = new InMemoryRepo({ users: [{ ...NEW_USER }], modules: [LOCKED_MODULE] });
    aura = new AuraService(repo);
    progress = new ProgressService(repo);
    quiz = new QuizService(aura);
  });

  test("locked module is inaccessible for a new user", () => {
    expect(progress.isUnlocked("u1", "ev-basics")).toBe(false);
  });

  test("passing one quiz (15 pts) is not enough to unlock a 30-pt module", () => {
    quiz.checkAnswers("u1", 100);
    expect(progress.isUnlocked("u1", "ev-basics")).toBe(false);
    expect(repo.getUser("u1")?.auraPoints).toBe(15);
  });

  test("passing two quizzes (30 pts total) unlocks the 30-pt module", () => {
    quiz.checkAnswers("u1", 85);
    quiz.checkAnswers("u1", 90);
    expect(progress.isUnlocked("u1", "ev-basics")).toBe(true);
    expect(repo.getUser("u1")?.auraPoints).toBe(30);
  });

  test("failing a quiz awards no points and the module stays locked", () => {
    quiz.checkAnswers("u1", 50);
    expect(progress.isUnlocked("u1", "ev-basics")).toBe(false);
    expect(repo.getUser("u1")?.auraPoints).toBe(0);
  });

  test("mix of failed and passed quizzes accumulates only passing points", () => {
    quiz.checkAnswers("u1", 40);  // fail
    quiz.checkAnswers("u1", 80);  // pass → +15
    quiz.checkAnswers("u1", 60);  // fail
    quiz.checkAnswers("u1", 75);  // pass → +15
    expect(repo.getUser("u1")?.auraPoints).toBe(30);
    expect(progress.isUnlocked("u1", "ev-basics")).toBe(true);
  });

  test("points earned by one user do not affect another user's unlock state", () => {
    const secondUser: User = {
      id: "u2",
      name: "Dana",
      auraPoints: 0,
      completedModuleIds: [],
      moduleProgress: {},
    };
    const sharedRepo = new InMemoryRepo({
      users: [{ ...NEW_USER }, secondUser],
      modules: [LOCKED_MODULE],
    });
    const sharedAura = new AuraService(sharedRepo);
    const sharedProgress = new ProgressService(sharedRepo);
    const sharedQuiz = new QuizService(sharedAura);

    sharedQuiz.checkAnswers("u1", 100);
    sharedQuiz.checkAnswers("u1", 100);

    expect(sharedProgress.isUnlocked("u1", "ev-basics")).toBe(true);
    expect(sharedProgress.isUnlocked("u2", "ev-basics")).toBe(false);
  });

  test("boundary: score of exactly 70 triggers the unlock chain correctly", () => {
    quiz.checkAnswers("u1", 70);
    quiz.checkAnswers("u1", 70);
    expect(repo.getUser("u1")?.auraPoints).toBe(30);
    expect(progress.isUnlocked("u1", "ev-basics")).toBe(true);
  });
});
