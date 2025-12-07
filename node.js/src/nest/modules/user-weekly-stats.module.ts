import { WEEKLY_STATS_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { UserWeeklyStatsController } from '@presentation/controllers/user-weekly-stats.controller';
import { UserWeeklyStatsService } from '@use-cases/weekly-stats/user-weekly-stats.service';

@Module({
  controllers: [UserWeeklyStatsController],
  imports: [],
  providers: [
    {
      provide: WEEKLY_STATS_SERVICE_SYMBOL,
      useClass: UserWeeklyStatsService,
    },
  ],
  exports: [WEEKLY_STATS_SERVICE_SYMBOL],
})
export class UserWeeklyStatsModule {}
