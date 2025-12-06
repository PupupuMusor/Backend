import {
  SCORING_SERVICE_SYMBOL,
  TESTS_SERVICE_SYMBOL,
} from '@common/constants';
import { PrismaService } from '@infrastructure/db/prisma.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AttemptAdminResultDto,
  AttemptResultDto,
  ScaleScoreDto,
} from '@presentation/dto/result-attempt.dto';
import { SubmitAttemptDto } from '@presentation/dto/submit-attempt.dto';
import { Prisma } from '@prisma/client';
import { IScoringService } from '@use-cases/scoring';
import { ITestsService } from '@use-cases/tests';
import { plainToInstance } from 'class-transformer';
import {
  AttemptWithDetails,
  IAttemptService,
} from './attempt.service.interface';

@Injectable()
export class AttemptService implements IAttemptService {
  constructor(
    private prisma: PrismaService,
    @Inject(TESTS_SERVICE_SYMBOL)
    private readonly testService: ITestsService,
    @Inject(SCORING_SERVICE_SYMBOL)
    private readonly scoringService: IScoringService,
  ) {}

  async submitAttempt(
    userId: string,
    dto: SubmitAttemptDto,
  ): Promise<AttemptResultDto> {
    return this.prisma.$transaction(async (tx) => {
      await this.deletePreviousAttemptIfExists(userId, dto.testId, tx);

      const attempt = await tx.attempts.create({
        data: { userId, testId: dto.testId },
      });

      for (const selection of dto.selections) {
        const userSelection = await tx.userSelections.create({
          data: { attemptId: attempt.id, questionId: selection.questionId },
        });

        if (selection.supplyAnswer) {
          await tx.userSelectionAnswers.create({
            data: {
              userSelectionId: userSelection.id,
              supplyText: selection.supplyAnswer,
            },
          });
        }

        if (selection.answerIds?.length) {
          await tx.userSelectionAnswers.createMany({
            data: selection.answerIds.map((answerId) => ({
              userSelectionId: userSelection.id,
              answerId,
            })),
          });
        }
      }

      const test = await this.testService.findByIdWithScales(dto.testId);
      const attemptWithDetails = await this.getAttemptWithDetails(
        attempt.id,
        tx,
      );

      const results = await this.scoringService.calculateScores(
        test,
        attemptWithDetails.userSelections,
      );

      const scaleScoresWithInterpretations = await Promise.all(
        results.scaleScores.map(async (score) => {
          const interpretation = await tx.scaleInterpretations.findFirst({
            where: {
              testScaleId: score.scaleId,
              minScore: { lte: score.score },
              maxScore: { gte: score.score },
            },
          });

          return {
            ...score,
            scaleInterpretationId: interpretation?.id,
            interpretationText:
              interpretation?.interpretation || 'Не определено',
          };
        }),
      );

      await this.saveAttemptScores(
        attempt.id,
        scaleScoresWithInterpretations,
        tx,
      );

      const updatedAttempt = await tx.attempts.findUnique({
        where: { id: attempt.id },
        include: {
          attemptScores: {
            include: {
              testScales: true,
              scaleInterpretations: true,
            },
          },
        },
      });

      const scaleScores: ScaleScoreDto[] = updatedAttempt.attemptScores.map(
        (s) => ({
          scaleId: s.testScaleId,
          scaleName: s.testScales.name,
          score: s.score,
          interpretation:
            s.scaleInterpretations?.interpretation || 'Не определено',
        }),
      );

      const interpretations: Record<string, string> = {};
      for (const score of scaleScores) {
        interpretations[score.scaleName] = score.interpretation;
      }

      return plainToInstance(AttemptResultDto, {
        id: updatedAttempt.id,
        testId: updatedAttempt.testId,
        userId: updatedAttempt.userId,
        scaleScores,
        interpretations,
        updatedAt: updatedAttempt.updatedAt,
      });
    });
  }

  async findAdminByTestId(
    testId: string,
    userId: string,
  ): Promise<AttemptAdminResultDto | null> {
    const attempt = await this.prisma.attempts.findUnique({
      where: { userId_testId: { userId, testId } },
      include: {
        userSelections: {
          include: {
            answers: true,
          },
        },
        attemptScores: {
          include: {
            testScales: true,
            scaleInterpretations: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Попытка не найдена');
    }

    const scaleScores = attempt.attemptScores.map((s) => ({
      scaleId: s.testScaleId,
      scaleName: s.testScales.name,
      score: s.score,
      interpretation: s.scaleInterpretations?.interpretation || 'Не определено',
    }));

    const interpretations: Record<string, string> = {};
    for (const s of scaleScores) {
      interpretations[s.scaleName] = s.interpretation;
    }

    const userSelections = attempt.userSelections.map((us) => ({
      questionId: us.questionId,
      answers: us.answers.map((a) => ({
        answerId: a.answerId || undefined,
        supplyText: a.supplyText || undefined,
      })),
      calculatedScores: {},
      interpretations,
    }));

    return plainToInstance(AttemptAdminResultDto, {
      id: attempt.id,
      testId: attempt.testId,
      userId: attempt.userId,
      userSelections,
      scaleScores,
      interpretations,
    });
  }

  async findByTestId(
    testId: string,
    userId: string,
  ): Promise<AttemptResultDto> {
    const attempt = await this.prisma.attempts.findUnique({
      where: { userId_testId: { userId, testId } },
      include: {
        attemptScores: {
          include: {
            testScales: true,
            scaleInterpretations: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Попытка не найдена');
    }

    const scaleScores = attempt.attemptScores.map((s) => ({
      scaleId: s.testScaleId,
      scaleName: s.testScales.name,
      score: s.score,
      interpretation: s.scaleInterpretations?.interpretation || 'Не определено',
    }));

    const interpretations: Record<string, string> = {};
    for (const s of scaleScores) {
      interpretations[s.scaleName] = s.interpretation;
    }

    return plainToInstance(AttemptResultDto, {
      id: attempt.id,
      testId: attempt.testId,
      userId: attempt.userId,
      scaleScores,
      interpretations,
    });
  }

  private async deletePreviousAttemptIfExists(
    userId: string,
    testId: string,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const prev = await tx.attempts.findUnique({
      where: { userId_testId: { userId, testId } },
    });

    if (!prev) return;

    await tx.userSelectionAnswers.deleteMany({
      where: { userSelections: { attemptId: prev.id } },
    });
    await tx.userSelections.deleteMany({ where: { attemptId: prev.id } });
    await tx.attemptScores.deleteMany({ where: { attemptId: prev.id } });
    await tx.attempts.delete({ where: { id: prev.id } });
  }

  private async saveAttemptScores(
    attemptId: string,
    scaleScores: Array<{
      scaleId: string;
      score: number;
      scaleInterpretationId?: string;
      interpretationText: string;
    }>,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.attemptScores.createMany({
      data: scaleScores.map((s) => ({
        attemptId,
        testScaleId: s.scaleId,
        score: s.score,
        scaleInterpretationId: s.scaleInterpretationId || null,
      })),
    });
  }

  private async getAttemptWithDetails(
    attemptId: string,
    tx: Prisma.TransactionClient,
  ): Promise<AttemptWithDetails> {
    return (await tx.attempts.findUnique({
      where: { id: attemptId },
      include: {
        userSelections: {
          include: {
            questions: true,
            answers: {
              include: {
                answers: true,
              },
            },
          },
        },
        attemptScores: {
          include: {
            scaleInterpretations: true,
          },
        },
      },
    })) as unknown as AttemptWithDetails;
  }
}
