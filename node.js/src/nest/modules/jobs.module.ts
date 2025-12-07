import { WeeklyLeaderboardJob } from '@common/utils/weekly-leaderboard.job';
import { Module } from '@nestjs/common';
import { UserWeeklyStatsModule } from './user-weekly-stats.module';

@Module({
  imports: [UserWeeklyStatsModule],
  providers: [WeeklyLeaderboardJob],
})
export class JobsModule {}
