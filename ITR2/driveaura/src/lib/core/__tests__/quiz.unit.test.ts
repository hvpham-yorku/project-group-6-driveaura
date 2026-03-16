import { InMemoryRepo } from "../repo";
import { AuraService } from "../aura";
import { QuizService } from "../quiz";
import type { User } from "../types";

const makeUser = (overrides?: Partial<User>): User => ({
  id: "u1",
  name: "Tester",
  auraPoints: 0,
  completedModuleIds: [],
  moduleProgress: {},
  ...overrides,
});

describe("QuizService — unit", () => {
  let repo: InMemoryRepo;
  let aura: AuraService;
  let quiz: QuizService;

  beforeEach(() => {
    repo = new InMemoryRepo({ users: [makeUser()], modules: [] });
    aura = new AuraService(repo);
    quiz = new QuizService(aura);
  });

  test("passing score of exactly 70 awards 15 Aura points", () => {
    const result = quiz.checkAnswers("u1", 70);
    expect(result?.auraPoints).toBe(15);
  });

  test("perfect score of 100 awards 15 Aura points", () => {
    const result = quiz.checkAnswers("u1", 100);
    expect(result?.auraPoints).toBe(15);
  });

  test("score of 85 awards 15 Aura points", () => {
    const result = quiz.checkAnswers("u1", 85);
    expect(result?.auraPoints).toBe(15);
  });

  test("failing score of 69 awards no points and returns null", () => {
    const result = quiz.checkAnswers("u1", 69);
    expect(result).toBeNull();
    expect(repo.getUser("u1")?.auraPoints).toBe(0);
  });

  test("score of 0 awards no points", () => {
    const result = quiz.checkAnswers("u1", 0);
    expect(result).toBeNull();
    expect(repo.getUser("u1")?.auraPoints).toBe(0);
  });

  test("passing an unknown user returns undefined (not null)", () => {
    const result = quiz.checkAnswers("ghost", 100);
    expect(result).toBeUndefined();
  });
});
