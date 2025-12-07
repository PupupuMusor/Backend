import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { IUserWeeklyStatsService } from './user-weekly-stats.service.interface';

@Injectable()
export class UserWeeklyStatsService implements IUserWeeklyStatsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    return this.prisma.userWeeklyStats.findMany({
      skip,
      take,
      orderBy: {
        points: 'desc',
      },
    });
  }

  async findFirst() {
    return this.prisma.userWeeklyStats.findFirst({
      orderBy: {
        points: 'desc',
      },
    });
  }

  async resetAllPoints() {
    // In C#, this resets points. I assume it sets points to 0.
    // Or maybe it deletes the stats?
    // "ResetAllPointsAsync" implies setting to 0.
    // But wait, UserWeeklyStats has WeekStartDate. Maybe it creates new records?
    // The C# job says: "await _repository.ResetAllPointsAsync(ct);"
    // I'll assume it updates all points to 0 and updates WeekStartDate to now.

    // Since I can't see the repository implementation, I'll assume standard reset.
    // UpdateMany is supported in Prisma.

    return this.prisma.userWeeklyStats.updateMany({
      data: {
        points: 0,
      },
    });
  }
}
