import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { ResponseQuestionDto } from '@presentation/dto/question.dto';
import { IQuestionsService } from './question.service.interface';

@Injectable()
export class QuestionsService implements IQuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ResponseQuestionDto[]> {
    return await this.prisma.questions.findMany({});
  }

  async findFive(): Promise<ResponseQuestionDto[]> {
    const allQuestionIds = await this.prisma.questions.findMany({
      select: { id: true },
    });

    const shuffledIds = allQuestionIds
      .map((q) => q.id)
      .sort(() => Math.random() - 0.5);

    const randomIds = shuffledIds.slice(0, 5);

    return await this.prisma.questions.findMany({
      where: {
        id: { in: randomIds },
      },
      include: {
        answers: true,
      },
    });
  }
}
