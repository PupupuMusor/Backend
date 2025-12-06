import { Module } from '@nestjs/common';
import { UserWeeklyStatsService } from './user-weekly-stats.service';
import { UserWeeklyStatsController } from './user-weekly-stats.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserWeeklyStatsController],
  providers: [UserWeeklyStatsService, PrismaService],
  exports: [UserWeeklyStatsService],
})
export class UserWeeklyStatsModule {}
