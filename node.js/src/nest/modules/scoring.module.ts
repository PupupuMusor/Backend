import { SCORING_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { ScoringService } from '@use-cases/scoring';
import { ScaledStrategy } from '@use-cases/scoring/strategies/scaled.strategy';
import { AuthModule } from './auth.module';

@Module({
  controllers: [],
  imports: [AuthModule],
  providers: [
    {
      provide: SCORING_SERVICE_SYMBOL,
      useClass: ScoringService,
    },
    ScaledStrategy,
  ],
  exports: [SCORING_SERVICE_SYMBOL, ScaledStrategy],
})
export class ScoringModule {}
