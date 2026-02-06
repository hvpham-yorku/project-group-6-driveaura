import { InMemoryRepo } from './repo';

export class AuraService {
  constructor(private repo: InMemoryRepo) {}

  addPoints(userId: string, points: number) {
    const user = this.repo.getUser(userId);
    if (!user) return;
    
    user.auraPoints += points;
    this.repo.saveUser(user);
    return user;
  }
}