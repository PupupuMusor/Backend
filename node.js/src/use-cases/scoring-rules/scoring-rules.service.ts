import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateScoringRuleDto,
  ResponseScoringRuleDto,
} from '@presentation/dto/scoring-rules.dto';
import { IScoringRulesService } from './scoring-rules.service.interface';

@Injectable()
export class ScoringRulesService implements IScoringRulesService {
  constructor(private prisma: PrismaService) {}

  async createScoringRule(
    questionId: string,
    answerId: string,
    scoringRule: CreateScoringRuleDto,
    tx: any,
  ): Promise<ResponseScoringRuleDto> {
    const existingScale = await tx.testScales.findUnique({
      where: {
        id: scoringRule.testScaleId,
      },
      select: { id: true },
    });

    if (!existingScale) {
      throw new Error(`Шкала с ID: ${scoringRule.testScaleId} не найдена`);
    }

    return tx.scoringRules.create({
      data: {
        questionId,
        answerId,
        testScaleId: scoringRule.testScaleId,
        supplyText: scoringRule.supplyText,
        score: scoringRule.score,
      },
    });
  }

  async findById(id: string): Promise<ResponseScoringRuleDto> {
    const scoringRule = await this.prisma.scoringRules.findUnique({
      where: { id },
    });

    if (!scoringRule) {
      throw new NotFoundException('Правила оценивания не найдены');
    }
    return scoringRule;
  }
}
