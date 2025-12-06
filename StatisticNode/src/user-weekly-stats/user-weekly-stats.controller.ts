import { Controller, Get, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { UserWeeklyStatsService } from './user-weekly-stats.service';

@Controller('api/UserWeeklyStats')
export class UserWeeklyStatsController {
  constructor(private readonly userWeeklyStatsService: UserWeeklyStatsService) {}

  @Get()
  async findAll(
    @Query('skip', ParseIntPipe) skip: number = 0,
    @Query('take', ParseIntPipe) take: number = 10,
  ) {
    return this.userWeeklyStatsService.findAll(skip, take);
  }

  @Get('first')
  async findFirst() {
    const result = await this.userWeeklyStatsService.findFirst();
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
