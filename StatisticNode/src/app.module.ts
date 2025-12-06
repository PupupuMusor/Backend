import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AchievementsModule } from './achievements/achievements.module';
import { UserWeeklyStatsModule } from './user-weekly-stats/user-weekly-stats.module';
import { JobsModule } from './jobs/jobs.module';
import { UserAchievementsModule } from './user-achievements/user-achievements.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AchievementsModule,
    UserWeeklyStatsModule,
    JobsModule,
    UserAchievementsModule,
  ],
})
export class AppModule {}
