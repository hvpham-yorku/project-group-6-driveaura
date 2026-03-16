import { InMemoryRepo } from "../repo";
import { ProgressService } from "../progress";
import type { User, Module } from "../types";

const makeUser = (overrides?: Partial<User>): User => ({
  id: "u1",
  name: "Test",
  auraPoints: 0,
  completedModuleIds: [],
  moduleProgress: {},
  ...overrides,
});

const makeModule = (overrides?: Partial<Module>): Module => ({
  id: "m1",
  title: "Safety 101",
  category: "Safety",
  requiredPointsToUnlock: 0,
  ...overrides,
});

describe("ProgressService — unit", () => {
  test("free module (0 pts required) is always unlocked for any user", () => {
    const repo = new InMemoryRepo({
      users: [makeUser({ auraPoints: 0 })],
      modules: [makeModule({ requiredPointsToUnlock: 0 })],
    });
    const svc = new ProgressService(repo);
    expect(svc.isUnlocked("u1", "m1")).toBe(true);
  });

  test("module is locked when user has fewer points than required", () => {
    const repo = new InMemoryRepo({
      users: [makeUser({ auraPoints: 19 })],
      modules: [makeModule({ requiredPointsToUnlock: 20 })],
    });
    const svc = new ProgressService(repo);
    expect(svc.isUnlocked("u1", "m1")).toBe(false);
  });

  test("module is unlocked when user has exactly the required points", () => {
    const repo = new InMemoryRepo({
      users: [makeUser({ auraPoints: 20 })],
      modules: [makeModule({ requiredPointsToUnlock: 20 })],
    });
    const svc = new ProgressService(repo);
    expect(svc.isUnlocked("u1", "m1")).toBe(true);
  });

  test("module is unlocked when user has more than required points", () => {
    const repo = new InMemoryRepo({
      users: [makeUser({ auraPoints: 100 })],
      modules: [makeModule({ requiredPointsToUnlock: 20 })],
    });
    const svc = new ProgressService(repo);
    expect(svc.isUnlocked("u1", "m1")).toBe(true);
  });

  test("returns false when user does not exist", () => {
    const repo = new InMemoryRepo({
      users: [],
      modules: [makeModule()],
    });
    const svc = new ProgressService(repo);
    expect(svc.isUnlocked("ghost", "m1")).toBe(false);
  });

  test("returns false when module does not exist", () => {
    const repo = new InMemoryRepo({
      users: [makeUser({ auraPoints: 999 })],
      modules: [],
    });
    const svc = new ProgressService(repo);
    expect(svc.isUnlocked("u1", "nonexistent")).toBe(false);
  });
});
