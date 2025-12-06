import {
  CreateScoringRuleDto,
  ResponseScoringRuleDto,
} from '@presentation/dto/scoring-rules.dto';

export interface IScoringRulesService {
  createScoringRule(
    questionId: string,
    answerId: string,
    scoringRules: CreateScoringRuleDto,
    tx: any,
  ): Promise<ResponseScoringRuleDto>;
  findById(id: string): Promise<ResponseScoringRuleDto>;
}
