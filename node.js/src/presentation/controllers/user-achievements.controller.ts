import { ACHIEVEMENT_SERVICE_SYMBOL } from '@common/constants';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AssignAchievementDto,
  AssignAchievementResponseDto,
} from '@presentation/dto/achievement.dto';
import { IAchievementService } from '@use-cases/achievement/achievement.service.interface';

@Controller('api/UserAchievement')
export class UserAchievementsController {
  constructor(
    @Inject(ACHIEVEMENT_SERVICE_SYMBOL)
    private readonly achievementService: IAchievementService,
  ) {}

  @Post('assign')
  @ApiOperation({ summary: 'Назначить достижение пользователю' })
  @ApiBody({ type: AssignAchievementDto })
  @ApiResponse({
    status: 201,
    description: 'Достижение успешно назначено, баллы добавлены',
    type: AssignAchievementResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь или достижение не найдены',
  })
  @ApiResponse({
    status: 409,
    description: 'У пользователя уже есть это достижение',
  })
  async assignAchievement(@Body() assignAchievementDto: AssignAchievementDto) {
    return this.achievementService.assignToUser(assignAchievementDto);
  }

  @Get(':userId')
  getUserAchievements(@Param('userId') userId: string) {
    return this.achievementService.getUserAchievements(userId);
  }

  @Get('all')
  getAll() {
    return this.achievementService.findAll();
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
