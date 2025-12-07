import { ACHIEVEMENT_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { UserAchievementsController } from '@presentation/controllers/user-achievements.controller';
import { AchievementService } from '@use-cases/achievement/achievement.service';
import { AchievementModule } from './achievement.module';

@Module({
  controllers: [UserAchievementsController],
  imports: [AchievementModule],
  providers: [
    {
      provide: ACHIEVEMENT_SERVICE_SYMBOL,
      useClass: AchievementService,
    },
  ],
})
export class UserAchievementsModule {}
