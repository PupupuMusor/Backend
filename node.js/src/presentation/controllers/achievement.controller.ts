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
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  CreateAchievementDto,
  UpdateAchievementDto,
} from '@presentation/dto/achievement.dto';
import { IAchievementService } from '@use-cases/achievement/achievement.service.interface';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: IAchievementService) {}

  @Post()
  @ApiOperation({ summary: '' })
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementService.create(createAchievementDto);
  }

  @Get()
  @ApiOperation({ summary: '' })
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
