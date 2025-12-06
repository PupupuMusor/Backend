import { Module } from '@nestjs/common';
import { WeeklyLeaderboardJob } from './weekly-leaderboard.job';
import { UserWeeklyStatsModule } from '../user-weekly-stats/user-weekly-stats.module';

@Module({
  imports: [UserWeeklyStatsModule],
  providers: [WeeklyLeaderboardJob],
})
export class JobsModule {}
