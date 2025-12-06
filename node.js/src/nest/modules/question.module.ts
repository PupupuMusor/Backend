import {
  QUESTION_SERVICE_SYMBOL,
  SCORING_RULES_SERVICE_SYMBOL,
  TEST_SCALES_SERVICE_SYMBOL,
} from '@common/constants';
import { Module } from '@nestjs/common';
import { QuestionsController } from '@presentation/controllers/question.controller';
import { QuestionsService } from '@use-cases/question/question.service';
import { ScoringRulesService } from '@use-cases/scoring-rules/scoring-rules.service';
import { TestScalesService } from '@use-cases/test-scale/test-scale.service';
import { AuthModule } from './auth.module';

@Module({
  controllers: [QuestionsController],
  imports: [AuthModule],
  providers: [
    {
      provide: QUESTION_SERVICE_SYMBOL,
      useClass: QuestionsService,
    },
    {
      provide: TEST_SCALES_SERVICE_SYMBOL,
      useClass: TestScalesService,
    },
    {
      provide: SCORING_RULES_SERVICE_SYMBOL,
      useClass: ScoringRulesService,
    },
  ],
})
export class QuestionModule {}
