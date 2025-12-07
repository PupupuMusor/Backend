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
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AchievementResponseDto,
  CreateAchievementDto,
  UpdateAchievementDto,
} from '@presentation/dto/achievement.dto';
import { IAchievementService } from '@use-cases/achievement/achievement.service.interface';

@Controller('achievement')
export class AchievementController {
  constructor(
    @Inject(ACHIEVEMENT_SERVICE_SYMBOL)
    private readonly achievementService: IAchievementService,
  ) {}

  @Post()
  @ApiOperation({ summary: '' })
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementService.create(createAchievementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все достижения с пользователями' })
  @ApiResponse({
    status: 200,
    description: 'Список достижений с пользователями',
    type: [AchievementResponseDto],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Первый тест',
        description: 'Завершить первый тест в системе',
        pointsReward: 50,
        iconPath: '/icons/first-test.png',
        userIds: [
          {
            userId: '123e4567-e89b-12d3-a456-426614174001',
            login: 'ivanov',
            fullName: 'Иванов Иван',
          },
        ],
      },
    ],
  })
  findAll() {
    return this.achievementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '' })
  async findOne(@Param('id') id: string) {
    const achievement = await this.achievementService.findOne(id);
    if (!achievement) {
      throw new NotFoundException();
    }
    return achievement;
  }

  @Put(':id')
  @ApiOperation({ summary: '' })
  async update(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    const updated = await this.achievementService.update(
      id,
      updateAchievementDto,
    );
    if (!updated) {
      throw new NotFoundException();
    }
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const success = await this.achievementService.remove(id);
    if (!success) {
      throw new NotFoundException();
    }
  }
}
