import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScaleDto, ScaleResponseDto } from '@presentation/dto/scale.dto';
import { ITestScalesService } from './test-scale.service.interface';

@Injectable()
export class TestScalesService implements ITestScalesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateScaleDto[]): Promise<ScaleResponseDto[]> {
    return this.prisma.testScales.createManyAndReturn({
      data,
    });
  }

  async findById(id: string): Promise<ScaleResponseDto> {
    const scale = await this.prisma.testScales.findUnique({
      where: { id },
    });

    if (!scale) {
      return null;
    }
    return scale;
  }

  async findByTestId(testId: string): Promise<ScaleResponseDto[]> {
    const scales = await this.prisma.testScales.findMany({
      where: { testId },
    });

    if (!scales) {
      return [];
    }
    return scales;
  }

  async update(
    id: string,
    data: Partial<CreateScaleDto>,
  ): Promise<ScaleResponseDto> {
    const testScale = await this.findById(id);

    if (!testScale) {
      throw new NotFoundException('Тест не найден');
    }
    return this.prisma.testScales.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    const testScale = await this.findById(id);
    if (!testScale) {
      throw new NotFoundException('Тест не найден');
    }
    await this.prisma.testScales.delete({ where: { id } });
  }
}
