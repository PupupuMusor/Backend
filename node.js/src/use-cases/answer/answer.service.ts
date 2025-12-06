import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AnswerResponseDto,
  CreateAnswerDto,
} from '@presentation/dto/answer.dto';
import { IAnswerService } from './answer.service.interface';

@Injectable()
export class AnswerService implements IAnswerService {
  constructor(private prisma: PrismaService) {}

  async createOne(
    questionId: string,
    data: CreateAnswerDto,
  ): Promise<AnswerResponseDto> {
    return this.prisma.answers.create({
      data: {
        questionId: questionId,
        ...data,
      },
    });
  }

  async update(id: string, data: Partial<CreateAnswerDto>) {
    await this.findById(id);
    return this.prisma.answers.update({ where: { id }, data });
  }

  async findByQuestion(questionId: string): Promise<AnswerResponseDto[]> {
    const answers = await this.prisma.answers.findMany({
      where: { questionId: questionId },
    });

    if (!answers) {
      throw new NotFoundException('Ответы не найдены');
    }

    return answers;
  }

  async findById(id: string): Promise<AnswerResponseDto> {
    const answer = await this.prisma.answers.findUnique({
      where: { id },
    });

    if (!answer) {
      throw new NotFoundException('Ответ не найден');
    }

    return answer;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.answers.delete({ where: { id } });
  }
}
