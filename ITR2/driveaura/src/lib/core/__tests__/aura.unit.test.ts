import { InMemoryRepo } from "../repo";
import { AuraService } from "../aura";
import type { User, Module } from "../types";

const makeUser = (overrides?: Partial<User>): User => ({
  id: "u-test",
  name: "Test User",
  auraPoints: 0,
  completedModuleIds: [],
  moduleProgress: {},
  ...overrides,
});

const makeModule = (overrides?: Partial<Module>): Module => ({
  id: "m-test",
  title: "Test Module",
  category: "General",
  requiredPointsToUnlock: 10,
  ...overrides,
});

describe("AuraService — unit", () => {
  let repo: InMemoryRepo;
  let aura: AuraService;

  beforeEach(() => {
    repo = new InMemoryRepo({ users: [makeUser()], modules: [makeModule()] });
    aura = new AuraService(repo);
  });

  test("addPoints increases the user's auraPoints by the given amount", () => {
    const result = aura.addPoints("u-test", 10);
    expect(result?.auraPoints).toBe(10);
  });

  test("addPoints accumulates over multiple calls", () => {
    aura.addPoints("u-test", 5);
    aura.addPoints("u-test", 15);
    const user = repo.getUser("u-test");
    expect(user?.auraPoints).toBe(20);
  });

  test("addPoints returns undefined for an unknown user", () => {
    const result = aura.addPoints("nonexistent", 10);
    expect(result).toBeUndefined();
  });

  test("addPoints does not change points for other users", () => {
    const other = makeUser({ id: "u-other", auraPoints: 5 });
    const repoWithTwo = new InMemoryRepo({ users: [makeUser(), other], modules: [] });
    const svc = new AuraService(repoWithTwo);

    svc.addPoints("u-test", 20);

    expect(repoWithTwo.getUser("u-other")?.auraPoints).toBe(5);
  });

  test("addPoints with zero does not change auraPoints", () => {
    const result = aura.addPoints("u-test", 0);
    expect(result?.auraPoints).toBe(0);
  });
});
