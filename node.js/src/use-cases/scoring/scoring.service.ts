import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CalculatePointsDto,
  PlusScoresDto,
} from '@presentation/dto/scoring.dto';
import { IScoringService } from './scoring.service.interface';

@Injectable()
export class ScoringService implements IScoringService {
  constructor(private prisma: PrismaService) {}

  async calculateScores(
    login: string,
    data: CalculatePointsDto,
  ): Promise<{
    points: number;
    totalPoints: number;
  }> {
    const answers = await this.prisma.answers.findMany({
      where: { id: { in: data.answerIds } },
      include: {
        questions: true,
      },
    });

    let earnedPoints = 0;

    for (const answer of answers) {
      if (answer.isRight) {
        earnedPoints += 1;
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { login: login },
      data: {
        scores: {
          increment: earnedPoints,
        },
      },
      select: {
        scores: true,
      },
    });

    return {
      points: earnedPoints,
      totalPoints: updatedUser.scores,
    };
  }

  async plusScores(login: string, dto: PlusScoresDto) {
    return await this.prisma.user.update({
      where: { login: login },
      data: {
        scores: {
          increment: dto.scores,
        },
      },
      select: {
        scores: true,
      },
    });
  }
}
