import { Module } from '@nestjs/common';
import { UserAchievementsController } from '@presentation/controllers/user-achievements.controller';
import { AchievementModule } from './achievement.module';

@Module({
  imports: [AchievementModule],
  controllers: [UserAchievementsController],
})
export class UserAchievementsModule {}
