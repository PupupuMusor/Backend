import {
  Answers,
  Questions,
  ScaleInterpretations,
  ScoringRules,
  Tests,
  TestScales,
  UserSelectionAnswers,
  UserSelections,
} from '@prisma/client';

export interface ScoringRuleWithDetails extends ScoringRules {
  answer?: Answers;
  question?: Questions;
}

export interface TestScalesWithDetails extends TestScales {
  scoringRules: ScoringRuleWithDetails[];
  scaleInterpretation: ScaleInterpretations[];
}

export interface TestWithDetails extends Tests {
  testScales: TestScalesWithDetails[];
  questions: Questions[];
}

export interface UserSelectionAnswerWithDetails extends UserSelectionAnswers {
  answers?: Answers;
}

export interface UserSelectionWithDetails extends UserSelections {
  answers: UserSelectionAnswerWithDetails[];
  questions: Questions;
}

export interface IScoringService {
  calculateScores(
    test: TestWithDetails,
    selections: UserSelectionWithDetails[],
  ): Promise<{
    scaleScores: Array<{
      scaleId: string;
      score: number;
    }>;
    perQuestionScores: Record<string, Record<string, number>>;
  }>;
}
