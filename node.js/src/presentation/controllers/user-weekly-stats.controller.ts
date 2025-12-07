import { WEEKLY_STATS_SERVICE_SYMBOL } from '@common/constants';
import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserWeeklyStatsService } from '@use-cases/weekly-stats/user-weekly-stats.service';

@Controller('api/UserWeeklyStats')
export class UserWeeklyStatsController {
  constructor(
    @Inject(WEEKLY_STATS_SERVICE_SYMBOL)
    private readonly userWeeklyStatsService: UserWeeklyStatsService,
  ) {}

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
