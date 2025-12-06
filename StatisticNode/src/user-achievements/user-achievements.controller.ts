import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AchievementsService } from '../achievements/achievements.service';
import { AssignAchievementDto } from '../achievements/dto/assign-achievement.dto';

@Controller('api/UserAchievement')
export class UserAchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post('assign')
  assignAchievement(@Body() assignAchievementDto: AssignAchievementDto) {
    return this.achievementsService.assignToUser(assignAchievementDto);
  }

  @Get(':userId')
  getUserAchievements(@Param('userId') userId: string) {
    return this.achievementsService.getUserAchievements(userId);
  }

  @Delete(':userId/:achievementId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAchievement(
    @Param('userId') userId: string,
    @Param('achievementId') achievementId: string,
  ) {
    const success = await this.achievementsService.removeFromUser(
      userId,
      achievementId,
    );
    if (!success) {
      throw new NotFoundException();
    }
  }
}
