import { Injectable } from '@nestjs/common';
import {
  IScoringService,
  TestWithDetails,
  UserSelectionWithDetails,
} from './scoring.service.interface';
import { ScaledStrategy } from './strategies/scaled.strategy';

@Injectable()
export class ScoringService implements IScoringService {
  constructor(private scaled: ScaledStrategy) {}

  async calculateScores(
    test: TestWithDetails,
    selections: UserSelectionWithDetails[],
  ): Promise<{
    scaleScores: Array<{
      scaleId: string;
      score: number;
      scaleInterpretationId?: string;
    }>;
    perQuestionScores: Record<string, Record<string, number>>;
  }> {
    return this.scaled.calculateScores(test, selections);
  }
}
