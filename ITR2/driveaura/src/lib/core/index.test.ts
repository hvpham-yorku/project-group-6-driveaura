/**
 * Core services — integration test suite.
 *
 * Tests the InMemoryRepo, AuraService, and ProgressService working
 * together as a cohesive system, covering the full user-journey from
 * account creation through module unlocking.
 */
import { InMemoryRepo } from "./repo";
import { AuraService } from "./aura";
import { ProgressService } from "./progress";

describe("DriveAura Core Services — Integration", () => {
  describe("New user baseline", () => {
    const repo = new InMemoryRepo();
    const progress = new ProgressService(repo);

    test("new user starts with 0 Aura points", () => {
      expect(repo.getUser("u1")?.auraPoints).toBe(0);
    });

    test("free module (Safety 101) is immediately accessible", () => {
      // m1 has requiredPointsToUnlock: 0
      expect(progress.isUnlocked("u1", "m1")).toBe(true);
    });

    test("locked module (EV Basics, 20 pts required) is inaccessible initially", () => {
      expect(progress.isUnlocked("u1", "m2")).toBe(false);
    });
  });

  describe("Earning Aura points", () => {
    let repo: InMemoryRepo;
    let aura: AuraService;
    let progress: ProgressService;

    beforeEach(() => {
      repo = new InMemoryRepo();
      aura = new AuraService(repo);
      progress = new ProgressService(repo);
    });

    test("addPoints reflects in isUnlocked when threshold is met", () => {
      aura.addPoints("u1", 25);
      expect(progress.isUnlocked("u1", "m2")).toBe(true);
    });

    test("addPoints with exactly the threshold amount unlocks the module", () => {
      aura.addPoints("u1", 20);
      expect(progress.isUnlocked("u1", "m2")).toBe(true);
    });

    test("addPoints one below the threshold does not unlock the module", () => {
      aura.addPoints("u1", 19);
      expect(progress.isUnlocked("u1", "m2")).toBe(false);
    });

    test("cumulative addPoints calls accumulate correctly", () => {
      aura.addPoints("u1", 10);
      aura.addPoints("u1", 10);
      expect(repo.getUser("u1")?.auraPoints).toBe(20);
      expect(progress.isUnlocked("u1", "m2")).toBe(true);
    });
  });

  describe("Repository isolation", () => {
    test("two separate InMemoryRepo instances are fully independent", () => {
      const repoA = new InMemoryRepo();
      const repoB = new InMemoryRepo();
      const auraA = new AuraService(repoA);

      auraA.addPoints("u1", 100);

      expect(repoA.getUser("u1")?.auraPoints).toBe(100);
      expect(repoB.getUser("u1")?.auraPoints).toBe(0);
    });

    test("saving a user via saveUser is reflected in subsequent getUser calls", () => {
      const repo = new InMemoryRepo();
      const user = repo.getUser("u1")!;
      user.auraPoints = 42;
      repo.saveUser(user);
      expect(repo.getUser("u1")?.auraPoints).toBe(42);
    });
  });

  describe("Unknown entity handling", () => {
    const repo = new InMemoryRepo();
    const progress = new ProgressService(repo);
    const aura = new AuraService(repo);

    test("isUnlocked returns false for a non-existent user", () => {
      expect(progress.isUnlocked("ghost-user", "m1")).toBe(false);
    });

    test("isUnlocked returns false for a non-existent module", () => {
      expect(progress.isUnlocked("u1", "ghost-module")).toBe(false);
    });

    test("addPoints for a non-existent user does nothing", () => {
      const result = aura.addPoints("ghost-user", 50);
      expect(result).toBeUndefined();
    });
  });
});
