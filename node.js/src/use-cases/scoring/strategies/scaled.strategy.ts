import { Injectable } from '@nestjs/common';
import {
  TestWithDetails,
  UserSelectionAnswerWithDetails,
  UserSelectionWithDetails,
} from '../scoring.service.interface';

@Injectable()
export class ScaledStrategy {
  async calculateScores(
    test: TestWithDetails,
    selections: UserSelectionWithDetails[],
  ): Promise<{
    scaleScores: Array<{
      scaleId: string;
      score: number;
    }>;
    perQuestionScores: Record<string, Record<string, number>>;
  }> {
    const scaleScoresMap = new Map<string, number>();
    const perQuestionScores: Record<string, Record<string, number>> = {};

    for (const scale of test.testScales) {
      scaleScoresMap.set(scale.id, 0);
    }

    for (const selection of selections) {
      const questionScore: Record<string, number> = {};

      for (const scale of test.testScales) {
        let questionScaleScore = 0;

        const questionRules = scale.scoringRules.filter(
          (rule) => rule.questionId === selection.questionId,
        );

        for (const rule of questionRules) {
          const isMatch = this.checkRuleMatch(rule, selection.answers);

          if (isMatch) {
            const currentScore = scaleScoresMap.get(scale.id) || 0;
            scaleScoresMap.set(scale.id, currentScore + rule.score);
            questionScaleScore += rule.score;
          }
        }

        if (questionScaleScore !== 0) {
          questionScore[scale.id] = questionScaleScore;
        }
      }

      perQuestionScores[selection.questionId] = questionScore;
    }

    const scaleScores = Array.from(scaleScoresMap.entries()).map(
      ([scaleId, score]) => ({
        scaleId,
        score,
      }),
    );

    return { scaleScores, perQuestionScores };
  }

  private checkRuleMatch(
    rule: {
      answerId?: string;
      supplyText?: string;
      score: number;
    },
    userAnswers: UserSelectionAnswerWithDetails[],
  ): boolean {
    if (rule.answerId) {
      return userAnswers.some(
        (userAnswer) => userAnswer.answerId === rule.answerId,
      );
    }

    if (rule.supplyText) {
      return userAnswers.some(
        (userAnswer) =>
          userAnswer.supplyText &&
          this.normalizeText(userAnswer.supplyText) ===
            this.normalizeText(rule.supplyText),
      );
    }

    return false;
  }

  private normalizeText(text: string): string {
    return text.trim().toLowerCase();
  }
}
