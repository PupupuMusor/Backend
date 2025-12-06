import { Module } from '@nestjs/common';
import { UserAchievementsController } from './user-achievements.controller';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [AchievementsModule],
  controllers: [UserAchievementsController],
})
export class UserAchievementsModule {}
