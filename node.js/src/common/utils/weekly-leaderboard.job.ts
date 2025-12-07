import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserWeeklyStatsService } from '@use-cases/weekly-stats/user-weekly-stats.service';

@Injectable()
export class WeeklyLeaderboardJob {
  private readonly logger = new Logger(WeeklyLeaderboardJob.name);

  constructor(
    private readonly userWeeklyStatsService: UserWeeklyStatsService,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    this.logger.debug('Running Weekly Leaderboard Job');

    const winner = await this.userWeeklyStatsService.findFirst();

    if (winner) {
      await this.sendCongratulatoryEmail(winner.userId, winner.points);
    }

    await this.userWeeklyStatsService.resetAllPoints();
    this.logger.debug('Weekly stats reset');
  }

  private async sendCongratulatoryEmail(userId: string, points: number) {
    this.logger.log(`Sending email to user ${userId} with ${points} points`);
  }
}
