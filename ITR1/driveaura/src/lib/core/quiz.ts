import { AuraService } from './aura';

export class QuizService {
  constructor(private aura: AuraService) {}

  checkAnswers(userId: string, score: number) {
    // If they get 70% or more, give them 15 points
    if (score >= 70) {
      return this.aura.addPoints(userId, 15);
    }
    return null;
  }
}