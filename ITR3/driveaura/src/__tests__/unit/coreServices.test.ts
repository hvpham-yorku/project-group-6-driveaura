/**
 * UNIT TESTS — Core Domain Services (InMemoryRepo, AuraService, ProgressService)
 * User Story: Aura Points + Learning Modules
 *
 * These test the fundamental domain objects that the whole app is built on.
 */

import { InMemoryRepo } from "@/lib/core/repo";
import { AuraService } from "@/lib/core/aura";
import { ProgressService } from "@/lib/core/progress";
import { DEFAULT_MODULES, DEFAULT_USERS } from "@/lib/core/types";

// ─── InMemoryRepo ─────────────────────────────────────────────────────────────

describe("InMemoryRepo", () => {
  test("returns the default user by ID", () => {
    const repo = new InMemoryRepo();
    const user = repo.getUser("u1");
    expect(user).toBeDefined();
    expect(user?.id).toBe("u1");
  });

  test("returns undefined for a user that does not exist", () => {
    const repo = new InMemoryRepo();
    expect(repo.getUser("nonexistent")).toBeUndefined();
  });

  test("returns the default module by ID", () => {
    const repo = new InMemoryRepo();
    const firstModule = DEFAULT_MODULES[0];
    const mod = repo.getModule(firstModule.id);
    expect(mod).toBeDefined();
    expect(mod?.id).toBe(firstModule.id);
  });

  test("returns undefined for a module that does not exist", () => {
    const repo = new InMemoryRepo();
    expect(repo.getModule("fake-module")).toBeUndefined();
  });

  test("saveUser persists changes for subsequent getUser calls", () => {
    const repo = new InMemoryRepo();
    const user = repo.getUser("u1")!;
    user.auraPoints = 999;
    repo.saveUser(user);
    expect(repo.getUser("u1")?.auraPoints).toBe(999);
  });

  test("accepts custom users and modules via constructor options", () => {
    const customUser = { id: "test-user", name: "Test", auraPoints: 0, completedModuleIds: [], moduleProgress: {} };
    const repo = new InMemoryRepo({ users: [customUser] });
    expect(repo.getUser("test-user")).toBeDefined();
  });
});

// Helper: create a fresh user object so tests don't share state
function freshUser() {
  return { id: "u1", name: "Driver", auraPoints: 0, completedModuleIds: [], moduleProgress: {} };
}
function freshRepo() {
  return new InMemoryRepo({ users: [freshUser()], modules: DEFAULT_MODULES });
}

// ─── AuraService ──────────────────────────────────────────────────────────────

describe("AuraService", () => {
  test("addPoints increases the user's aura points", () => {
    const repo = freshRepo();
    const aura = new AuraService(repo);
    aura.addPoints("u1", 10);
    expect(repo.getUser("u1")?.auraPoints).toBe(10);
  });

  test("addPoints accumulates across multiple calls", () => {
    const repo = freshRepo();
    const aura = new AuraService(repo);
    aura.addPoints("u1", 10);
    aura.addPoints("u1", 15);
    expect(repo.getUser("u1")?.auraPoints).toBe(25);
  });

  test("addPoints for a nonexistent user does not throw", () => {
    const repo = freshRepo();
    const aura = new AuraService(repo);
    expect(() => aura.addPoints("ghost-user", 50)).not.toThrow();
  });

  test("addPoints returns the updated user object", () => {
    const repo = freshRepo();
    const aura = new AuraService(repo);
    const result = aura.addPoints("u1", 5);
    expect(result?.auraPoints).toBe(5);
  });
});

// ─── ProgressService ─────────────────────────────────────────────────────────

describe("ProgressService", () => {
  test("new user cannot access a locked module (not enough points)", () => {
    const repo = freshRepo();
    const progress = new ProgressService(repo);
    // m2 requires 20 points; fresh user starts with 0
    expect(progress.isUnlocked("u1", "m2")).toBe(false);
  });

  test("user can access a module after earning enough points", () => {
    const repo = freshRepo();
    const aura = new AuraService(repo);
    const progress = new ProgressService(repo);
    aura.addPoints("u1", 20);
    expect(progress.isUnlocked("u1", "m2")).toBe(true);
  });

  test("isUnlocked returns false for a nonexistent user", () => {
    const repo = freshRepo();
    const progress = new ProgressService(repo);
    expect(progress.isUnlocked("ghost", "m1")).toBe(false);
  });

  test("isUnlocked returns false for a nonexistent module", () => {
    const repo = freshRepo();
    const progress = new ProgressService(repo);
    expect(progress.isUnlocked("u1", "fake-module")).toBe(false);
  });
});
