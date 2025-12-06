import { SCORING_RULES_SERVICE_SYMBOL } from '@common/constants';
import { PrismaService } from '@infrastructure/db/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  AnswerResponseDto,
  UpdateAnswersWithQuestionDto,
} from '@presentation/dto/answer.dto';
import {
  CreateQuestionWithAnswersDto,
  ResponseQuestionDto,
  UpdateQuestionWithAnswersDto,
} from '@presentation/dto/question.dto';
import { ResponseScoringRuleDto } from '@presentation/dto/scoring-rules.dto';
import { Prisma } from '@prisma/client';
import { IScoringRulesService } from '@use-cases/scoring-rules/scoring-rules.service.interface';
import { IQuestionsService } from './question.service.interface';

@Injectable()
export class QuestionsService implements IQuestionsService {
  constructor(
    private prisma: PrismaService,
    @Inject(SCORING_RULES_SERVICE_SYMBOL)
    private readonly scoringRulesService: IScoringRulesService,
  ) {}

  async createWithAnswers(
    testId: string,
    questionsDto: CreateQuestionWithAnswersDto[],
  ): Promise<ResponseQuestionDto[]> {
    return this.prisma.$transaction(async (tx) => {
      const questions = await Promise.all(
        questionsDto.map(async (questionDto) => {
          const question = await tx.questions.create({
            data: {
              testId,
              text: questionDto.text,
              order: questionDto.order,
              type: questionDto.type,
            },
          });

          if (!questionDto.answers || questionDto.answers.length === 0) {
            return {
              id: question.id,
              text: question.text,
              order: question.order,
              type: question.type,
            };
          }
          const answers = await Promise.all(
            questionDto.answers.map(async (answerDto) => {
              const answer = await tx.answers.create({
                data: {
                  questionId: question.id,
                  text: answerDto.text,
                  order: answerDto.order,
                },
              });

              let scoringRule = null;

              if (answerDto.scoringRules) {
                scoringRule = await this.scoringRulesService.createScoringRule(
                  answer.questionId,
                  answer.id,
                  answerDto.scoringRules,
                  tx,
                );
              }

              return {
                id: answer.id,
                questionId: answer.questionId,
                text: answer.text,
                order: answer.order,
                scoringRules: scoringRule
                  ? {
                      id: scoringRule.id,
                      questionId: scoringRule.questionId,
                      answerId: scoringRule.answerId,
                      supplyText: scoringRule.supplyText,
                      score: scoringRule.score,
                      testScaleId: scoringRule.testScaleId,
                    }
                  : undefined,
              };
            }),
          );

          return {
            id: question.id,
            text: question.text,
            order: question.order,
            type: question.type,
            answers: answers,
          };
        }),
      );

      return questions;
    });
  }

  async update(
    questionsDto: UpdateQuestionWithAnswersDto[],
  ): Promise<ResponseQuestionDto[]> {
    return this.prisma.$transaction(async (tx) => {
      const testId = await this.getTestIdFromQuestions(questionsDto, tx);

      if (testId) {
        await this.deleteAttemptsByTestId(testId, tx);
      }

      const updatedQuestions = await Promise.all(
        questionsDto.map(async (questionDto) =>
          this.updateQuestionWithAnswers(questionDto, tx),
        ),
      );

      return updatedQuestions;
    });
  }

  private async getTestIdFromQuestions(
    questionsDto: UpdateQuestionWithAnswersDto[],
    tx: Prisma.TransactionClient,
  ): Promise<string | null> {
    if (questionsDto.length === 0 || !questionsDto[0].id) {
      return null;
    }

    const firstQuestion = await tx.questions.findUnique({
      where: { id: questionsDto[0].id },
      select: { testId: true },
    });

    return firstQuestion?.testId || null;
  }

  private async deleteAttemptsByTestId(
    testId: string,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.attempts.deleteMany({
      where: { testId: testId },
    });
  }

  private async updateQuestionWithAnswers(
    questionDto: UpdateQuestionWithAnswersDto,
    tx: Prisma.TransactionClient,
  ): Promise<ResponseQuestionDto> {
    await this.handleAnswerDeletions(questionDto, tx);

    const updatedQuestion = await this.updateQuestion(questionDto, tx);
    const updatedAnswers = await this.handleQuestionAnswers(
      questionDto,
      updatedQuestion.id,
      tx,
    );

    return this.buildResponseQuestionDto(updatedQuestion, updatedAnswers);
  }

  private async handleAnswerDeletions(
    questionDto: UpdateQuestionWithAnswersDto,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const currentAnswers = await tx.answers.findMany({
      where: { questionId: questionDto.id },
      select: { id: true },
    });

    const currentAnswerIds = currentAnswers.map((answer) => answer.id);
    const incomingAnswerIds = (questionDto.answers || [])
      .map((answer) => answer.id)
      .filter(Boolean);

    const answersToDelete = currentAnswerIds.filter(
      (id) => !incomingAnswerIds.includes(id),
    );

    if (answersToDelete.length > 0) {
      await tx.answers.deleteMany({
        where: {
          id: { in: answersToDelete },
        },
      });
    }
  }

  private async updateQuestion(
    questionDto: UpdateQuestionWithAnswersDto,
    tx: Prisma.TransactionClient,
  ): Promise<ResponseQuestionDto> {
    const updateData: Prisma.QuestionsUpdateInput = {};

    if (questionDto.text !== undefined) {
      updateData.text = questionDto.text;
    }
    if (questionDto.order !== undefined) {
      updateData.order = questionDto.order;
    }
    if (questionDto.type !== undefined) {
      updateData.type = questionDto.type;
    }

    const question = await tx.questions.update({
      where: { id: questionDto.id },
      data: updateData,
    });

    return {
      id: question.id,
      text: question.text,
      order: question.order,
      type: question.type,
      answers: [],
    };
  }

  private async handleQuestionAnswers(
    questionDto: UpdateQuestionWithAnswersDto,
    questionId: string,
    tx: Prisma.TransactionClient,
  ): Promise<AnswerResponseDto[]> {
    if (!questionDto.answers) {
      return this.getExistingAnswers(questionId, tx);
    }

    return Promise.all(
      questionDto.answers.map(async (answerDto) =>
        this.handleSingleAnswer(answerDto, questionId, tx),
      ),
    );
  }

  private async getExistingAnswers(
    questionId: string,
    tx: Prisma.TransactionClient,
  ): Promise<AnswerResponseDto[]> {
    const existingAnswers = await tx.answers.findMany({
      where: { questionId: questionId },
      include: {
        scoringRules: {
          include: {
            testScales: true,
          },
        },
      },
    });

    return existingAnswers.map((answer) => this.buildAnswerResponseDto(answer));
  }

  private buildAnswerResponseDto(answer: any): AnswerResponseDto {
    const scoringRule = answer.scoringRules?.[0];

    return {
      id: answer.id,
      questionId: answer.questionId,
      text: answer.text,
      order: answer.order,
      scoringRules: scoringRule
        ? {
            id: scoringRule.id,
            questionId: scoringRule.questionId,
            answerId: scoringRule.answerId,
            supplyText: scoringRule.supplyText,
            score: scoringRule.score,
            testScaleId: scoringRule.testScaleId,
          }
        : undefined,
    };
  }

  private async handleSingleAnswer(
    answerDto: UpdateAnswersWithQuestionDto,
    questionId: string,
    tx: Prisma.TransactionClient,
  ): Promise<AnswerResponseDto> {
    const answer = await this.upsertAnswer(answerDto, questionId, tx);
    const scoringRule = await this.handleScoringRules(
      answerDto,
      answer.id,
      questionId,
      tx,
    );

    return {
      ...answer,
      scoringRules: scoringRule || undefined,
    };
  }

  private async upsertAnswer(
    answerDto: UpdateAnswersWithQuestionDto,
    questionId: string,
    tx: Prisma.TransactionClient,
  ): Promise<Omit<AnswerResponseDto, 'scoringRules'>> {
    if (answerDto.id) {
      const updateData: Prisma.AnswersUpdateInput = {};

      if (answerDto.text !== undefined) {
        updateData.text = answerDto.text;
      }
      if (answerDto.order !== undefined) {
        updateData.order = answerDto.order;
      }

      const answer = await tx.answers.update({
        where: { id: answerDto.id },
        data: updateData,
      });

      return {
        id: answer.id,
        questionId: answer.questionId,
        text: answer.text,
        order: answer.order,
      };
    } else {
      const answer = await tx.answers.create({
        data: {
          questionId: questionId,
          text: answerDto.text,
          order: answerDto.order,
        },
      });

      return {
        id: answer.id,
        questionId: answer.questionId,
        text: answer.text,
        order: answer.order,
      };
    }
  }

  private async handleScoringRules(
    answerDto: UpdateAnswersWithQuestionDto,
    answerId: string,
    questionId: string,
    tx: Prisma.TransactionClient,
  ): Promise<ResponseScoringRuleDto | null> {
    const shouldDeleteScoringRules = answerDto.scoringRules || answerDto.id;

    if (shouldDeleteScoringRules) {
      await tx.scoringRules.deleteMany({
        where: { answerId: answerId },
      });
    }

    if (answerDto.scoringRules) {
      return this.scoringRulesService.createScoringRule(
        questionId,
        answerId,
        answerDto.scoringRules,
        tx,
      );
    }

    return null;
  }

  private buildResponseQuestionDto(
    question: ResponseQuestionDto,
    answers: AnswerResponseDto[],
  ): ResponseQuestionDto {
    return {
      ...question,
      answers: answers,
    };
  }

  async findByTest(testId: string): Promise<ResponseQuestionDto[]> {
    const questions = await this.prisma.questions.findMany({
      where: { testId: testId },
      include: {
        answers: {
          orderBy: { order: 'asc' },
          include: {
            scoringRules: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    if (!questions || questions.length === 0) {
      return [];
    }

    return questions.map((question) => ({
      id: question.id,
      text: question.text,
      order: question.order,
      type: question.type,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        text: answer.text,
        order: answer.order,
        scoringRules:
          answer.scoringRules && answer.scoringRules.length > 0
            ? {
                id: answer.scoringRules[0].id,
                questionId: answer.scoringRules[0].questionId,
                answerId: answer.scoringRules[0].answerId,
                supplyText: answer.scoringRules[0].supplyText,
                score: answer.scoringRules[0].score,
                testScaleId: answer.scoringRules[0].testScaleId,
              }
            : undefined,
      })),
    }));
  }

  async findById(id: string): Promise<ResponseQuestionDto> {
    const question = await this.prisma.questions.findUnique({
      where: { id },
      include: {
        answers: {
          orderBy: { order: 'asc' },
          include: {
            scoringRules: true,
          },
        },
      },
    });

    if (!question) {
      return null;
    }

    return {
      id: question.id,
      text: question.text,
      order: question.order,
      type: question.type,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        text: answer.text,
        order: answer.order,
        scoringRules:
          answer.scoringRules && answer.scoringRules.length > 0
            ? {
                id: answer.scoringRules[0].id,
                questionId: answer.scoringRules[0].questionId,
                answerId: answer.scoringRules[0].answerId,
                supplyText: answer.scoringRules[0].supplyText,
                score: answer.scoringRules[0].score,
                testScaleId: answer.scoringRules[0].testScaleId,
              }
            : undefined,
      })),
    };
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.questions.delete({ where: { id } });
  }
}
