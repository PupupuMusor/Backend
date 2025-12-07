import { SCORING_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { ScoringController } from '@presentation/controllers/scoring.controller';
import { ScoringService } from '@use-cases/scoring';

@Module({
  controllers: [ScoringController],
  imports: [],
  providers: [
    {
      provide: SCORING_SERVICE_SYMBOL,
      useClass: ScoringService,
    },
  ],
  exports: [SCORING_SERVICE_SYMBOL],
})
export class ScoringModule {}
