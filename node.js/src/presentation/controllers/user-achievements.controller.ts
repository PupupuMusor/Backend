import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AssignAchievementDto } from '@presentation/dto/achievement.dto';
import { IAchievementService } from '@use-cases/achievement/achievement.service.interface';

@Controller('api/UserAchievement')
export class UserAchievementsController {
  constructor(private readonly achievementService: IAchievementService) {}

  @Post('assign')
  assignAchievement(@Body() assignAchievementDto: AssignAchievementDto) {
    return this.achievementService.assignToUser(assignAchievementDto);
  }

  @Get(':userId')
  getUserAchievements(@Param('userId') userId: string) {
    return this.achievementService.getUserAchievements(userId);
  }

  @Delete(':userId/:achievementId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAchievement(
    @Param('userId') userId: string,
    @Param('achievementId') achievementId: string,
  ) {
    const success = await this.achievementService.removeFromUser(
      userId,
      achievementId,
    );
    if (!success) {
      throw new NotFoundException();
    }
  }
}
