import {
  ATTEMPT_SERVICE_SYMBOL,
  QUESTION_SERVICE_SYMBOL,
  SCORING_RULES_SERVICE_SYMBOL,
  SCORING_SERVICE_SYMBOL,
  TEST_SCALES_SERVICE_SYMBOL,
  TESTS_SERVICE_SYMBOL,
} from '@common/constants';
import { AuthModule } from '@nest/modules/auth.module';
import { Module } from '@nestjs/common';
import { AttemptController } from '@presentation/controllers/attempt.controller';
import { AttemptService } from '@use-cases/attempt/attempt.service';
import { QuestionsService } from '@use-cases/question/question.service';
import { ScoringService } from '@use-cases/scoring';
import { ScoringRulesService } from '@use-cases/scoring-rules/scoring-rules.service';
import { TestScalesService } from '@use-cases/test-scale/test-scale.service';
import { TestsService } from '@use-cases/tests';
import { ScoringModule } from './scoring.module';
import { TestsModule } from './tests.module';

@Module({
  imports: [AuthModule, TestsModule, ScoringModule],
  controllers: [AttemptController],
  providers: [
    {
      provide: ATTEMPT_SERVICE_SYMBOL,
      useClass: AttemptService,
    },
    {
      provide: SCORING_SERVICE_SYMBOL,
      useClass: ScoringService,
    },
    {
      provide: SCORING_RULES_SERVICE_SYMBOL,
      useClass: ScoringRulesService,
    },
    {
      provide: TEST_SCALES_SERVICE_SYMBOL,
      useClass: TestScalesService,
    },
    {
      provide: TESTS_SERVICE_SYMBOL,
      useClass: TestsService,
    },
    {
      provide: QUESTION_SERVICE_SYMBOL,
      useClass: QuestionsService,
    },
  ],
})
export class AttemptModule {}
