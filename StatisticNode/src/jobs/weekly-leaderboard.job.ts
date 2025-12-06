import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserWeeklyStatsService } from '../user-weekly-stats/user-weekly-stats.service';

@Injectable()
export class WeeklyLeaderboardJob {
  private readonly logger = new Logger(WeeklyLeaderboardJob.name);

  constructor(private readonly userWeeklyStatsService: UserWeeklyStatsService) {}

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
    // Placeholder for email sending logic
    // In C# it used HttpClient to call some service.
    // Here I'll just log it.
    this.logger.log(`Sending email to user ${userId} with ${points} points`);
    
    // If actual HTTP call is needed, we would use HttpService from @nestjs/axios
    // const response = await this.httpService.post('...', { userId, points }).toPromise();
  }
}
