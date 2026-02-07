import { InMemoryRepo } from './repo';
import { AuraService } from './aura';
import { ProgressService } from './progress';

describe("DriveAura Integration Test", () => {
  const repo = new InMemoryRepo();
  const aura = new AuraService(repo);
  const progress = new ProgressService(repo);

  test("New users start with 0 points and can't unlock EV", () => {
    const canAccess = progress.isUnlocked("u1", "m2"); // m2 is EV Basics
    expect(canAccess).toBe(false);
  });

  test("Adding points allows unlocking", () => {
    aura.addPoints("u1", 25);
    const canAccess = progress.isUnlocked("u1", "m2");
    expect(canAccess).toBe(true);
  });
});