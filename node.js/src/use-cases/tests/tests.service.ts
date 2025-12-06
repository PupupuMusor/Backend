import { PrismaService } from '@infrastructure/db/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTestDto, ResponseTestDto } from '@presentation/dto/tests.dto';
import { Tests } from '@prisma/client';
import { ITestsService } from './tests.service.interface';

@Injectable()
export class TestsService implements ITestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTestDto): Promise<ResponseTestDto> {
    return this.prisma.tests.create({ data });
  }

  async findAll(userId: string): Promise<ResponseTestDto[]> {
    const tests = await this.prisma.tests.findMany({
      include: {
        attempts: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tests.map((test) => ({
      id: test.id,
      title: test.title,
      isCompleted: test.attempts.length > 0,
    }));
  }

  async findById(id: string): Promise<any> {
    const test = await this.prisma.tests.findUnique({
      where: { id },
      include: {
        testScales: {
          include: {
            scaleInterpretations: true,
            scoringRules: true,
          },
        },
        questions: {
          include: {
            answers: {
              include: {
                scoringRules: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!test) throw new BadRequestException('Тест не найден');
    return test;
  }

  private async findBasicById(id: string): Promise<Tests> {
    const test = await this.prisma.tests.findUnique({
      where: { id },
    });
    if (!test) return null;
    return test;
  }

  async findByIdWithScales(id: string) {
    return this.prisma.tests.findUnique({
      where: { id },
      include: {
        testScales: {
          include: {
            scoringRules: {
              include: {
                answers: true,
                questions: true,
              },
            },
            scaleInterpretations: true,
          },
        },
        questions: true,
      },
    });
  }

  async update(id: string, data: Partial<CreateTestDto>): Promise<Tests> {
    const test = await this.findBasicById(id);
    if (!test) {
      throw new NotFoundException('Тест не найден');
    }
    return this.prisma.tests.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    const test = await this.findBasicById(id);
    if (!test) {
      throw new NotFoundException('Тест не найден');
    }
    await this.prisma.tests.delete({ where: { id } });
  }
}
