import { InMemoryRepo } from './repo';

export class ProgressService {
  constructor(private repo: InMemoryRepo) {}

  isUnlocked(userId: string, moduleId: string): boolean {
    const user = this.repo.getUser(userId);
    const mod = this.repo.getModule(moduleId);
    if (!user || !mod) return false;

    return user.auraPoints >= mod.requiredPointsToUnlock;
  }
}