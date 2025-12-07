import { SCORING_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { ScoringService } from '@use-cases/scoring';

@Module({
  controllers: [],
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
