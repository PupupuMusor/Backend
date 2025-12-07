import { ACHIEVEMENT_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { AchievementController } from '@presentation/controllers/achievement.controller';
import { AchievementService } from '@use-cases/achievement/achievement.service';

@Module({
  controllers: [AchievementController],
  imports: [],
  providers: [
    {
      provide: ACHIEVEMENT_SERVICE_SYMBOL,
      useClass: AchievementService,
    },
  ],
})
export class AchievementModule {}
