import { PrismaService } from '@infrastructure/db/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateScaleInterpretationDto,
  ResponseScaleInterpretation,
  UpdateScaleInterpretationDto,
} from '@presentation/dto/scale-interpretation.dto';
import { isUUID } from 'class-validator';
import { IScaleInterpretationsService } from './scale-interpretations.interface.service';

@Injectable()
export class ScaleInterpretationsService implements IScaleInterpretationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateScaleInterpretationDto,
  ): Promise<ResponseScaleInterpretation> {
    if (data.maxScore <= data.minScore) {
      throw new BadRequestException('maxScore должен быть больше minScore');
    }

    const existingInterpretations =
      await this.prisma.scaleInterpretations.findMany({
        where: {
          testScaleId: data.testScaleId,
          OR: [
            {
              minScore: { lte: data.maxScore },
              maxScore: { gte: data.minScore },
            },
          ],
        },
      });

    if (existingInterpretations.length > 0) {
      throw new BadRequestException(
        'Диапазон score пересекается с существующими интерпретациями',
      );
    }

    return this.prisma.scaleInterpretations.create({
      data,
    });
  }

  async createMany(
    data: CreateScaleInterpretationDto[],
  ): Promise<ResponseScaleInterpretation[]> {
    return this.prisma.$transaction(async (tx) => {
      for (const item of data) {
        if (item.maxScore <= item.minScore) {
          throw new BadRequestException(
            `maxScore должен быть больше minScore для интерпретации с testScaleId ${item.testScaleId}`,
          );
        }
      }

      const interpretationsByScale = new Map<
        string,
        CreateScaleInterpretationDto[]
      >();

      for (const item of data) {
        if (!interpretationsByScale.has(item.testScaleId)) {
          interpretationsByScale.set(item.testScaleId, []);
        }
        interpretationsByScale.get(item.testScaleId)!.push(item);
      }

      for (const [testScaleId, interpretations] of interpretationsByScale) {
        for (let i = 0; i < interpretations.length; i++) {
          for (let j = i + 1; j < interpretations.length; j++) {
            const a = interpretations[i];
            const b = interpretations[j];

            if (
              (a.minScore <= b.maxScore && a.maxScore >= b.minScore) ||
              (b.minScore <= a.maxScore && b.maxScore >= a.minScore)
            ) {
              throw new BadRequestException(
                `Обнаружено пересечение диапазонов score в новых интерпретациях для шкалы ${testScaleId}`,
              );
            }
          }
        }

        const existingInterpretations = await tx.scaleInterpretations.findMany({
          where: {
            testScaleId: testScaleId,
          },
          select: {
            minScore: true,
            maxScore: true,
          },
        });

        for (const newItem of interpretations) {
          for (const existing of existingInterpretations) {
            if (
              (newItem.minScore <= existing.maxScore &&
                newItem.maxScore >= existing.minScore) ||
              (existing.minScore <= newItem.maxScore &&
                existing.maxScore >= newItem.minScore)
            ) {
              throw new BadRequestException(
                `Диапазон score [${newItem.minScore}-${newItem.maxScore}] пересекается с существующей интерпретацией [${existing.minScore}-${existing.maxScore}] для шкалы ${testScaleId}`,
              );
            }
          }
        }
      }

      return tx.scaleInterpretations.createManyAndReturn({
        data,
      });
    });
  }

  async findByScaleId(
    testScaleId: string,
  ): Promise<ResponseScaleInterpretation[]> {
    const interpretations = this.prisma.scaleInterpretations.findMany({
      where: { testScaleId },
    });

    if (!interpretations) {
      return [];
    }

    return interpretations;
  }

  async findByTestId(testId: string): Promise<ResponseScaleInterpretation[]> {
    const interpretations = await this.prisma.scaleInterpretations.findMany({
      where: {
        testScales: {
          testId: testId,
        },
      },
      orderBy: [
        {
          testScaleId: 'asc',
        },
        {
          minScore: 'asc',
        },
      ],
    });

    if (!interpretations || interpretations.length === 0) {
      return [];
    }

    return interpretations.map((interpretation) => ({
      id: interpretation.id,
      testScaleId: interpretation.testScaleId,
      minScore: interpretation.minScore,
      maxScore: interpretation.maxScore,
      interpretation: interpretation.interpretation,
    }));
  }

  async findAll(): Promise<ResponseScaleInterpretation[]> {
    return this.prisma.scaleInterpretations.findMany({});
  }

  private async findById(id: string): Promise<ResponseScaleInterpretation> {
    const interpretation = await this.prisma.scaleInterpretations.findUnique({
      where: { id },
    });

    if (!interpretation) {
      throw new NotFoundException('Интепретация не найдена');
    }
    return interpretation;
  }

  async update(
    id: string,
    data: Partial<CreateScaleInterpretationDto>,
  ): Promise<ResponseScaleInterpretation> {
    await this.findById(id);
    return this.prisma.scaleInterpretations.update({ where: { id }, data });
  }

  async updateMany(
    dtos: UpdateScaleInterpretationDto[],
  ): Promise<ResponseScaleInterpretation[]> {
    return this.prisma.$transaction(async (tx) => {
      const uniqueIds = new Set(dtos.map((dto) => dto.id));
      if (uniqueIds.size !== dtos.length) {
        throw new BadRequestException('Обнаружены дублирующиеся ID');
      }

      for (const dto of dtos) {
        if (!isUUID(dto.id)) {
          throw new BadRequestException(`Невалидный UUID: ${dto.id}`);
        }
      }

      const ids = Array.from(uniqueIds);
      const existingRecords = await tx.scaleInterpretations.findMany({
        where: { id: { in: ids } },
      });

      const existingMap = new Map(
        existingRecords.map((record) => [record.id, record]),
      );

      for (const dto of dtos) {
        const existing = existingMap.get(dto.id);
        if (!existing) {
          throw new NotFoundException(
            `Интерпретация с ID ${dto.id} не найдена`,
          );
        }

        const finalMaxScore =
          dto.maxScore !== undefined ? dto.maxScore : existing.maxScore;
        const finalMinScore =
          dto.minScore !== undefined ? dto.minScore : existing.minScore;

        if (finalMaxScore <= finalMinScore) {
          throw new BadRequestException(
            `maxScore (${finalMaxScore}) должен быть больше minScore (${finalMinScore}) для интерпретации ${dto.id}`,
          );
        }
      }

      const updatePromises = dtos.map((dto) =>
        tx.scaleInterpretations.update({
          where: { id: dto.id },
          data: dto,
        }),
      );

      const results = await Promise.all(updatePromises);
      return results;
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.scaleInterpretations.delete({ where: { id } });
  }
}
