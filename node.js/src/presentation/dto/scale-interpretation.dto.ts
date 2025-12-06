import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateScaleInterpretationDto {
  @ApiProperty({
    description: 'Id шкалы',
    example: '3f4c0af2-5f03-4539-92fb-68878f260f6c',
  })
  @IsUUID()
  testScaleId: string;

  @ApiProperty({ description: 'Минимальный балл для интерпретации' })
  @IsNumber()
  minScore: number;

  @ApiProperty({ description: 'Максимальный балл для интерпретации' })
  @IsNumber()
  maxScore: number;

  @ApiProperty({ description: 'Текст интерпретации' })
  @IsString()
  interpretation: string;

  constructor() {
    if (this.maxScore <= this.minScore) {
      throw new Error('maxScore должен быть больше minScore');
    }
  }
}

export class ResponseScaleInterpretation {
  @ApiProperty({
    description: 'ID интепретации',
    example: '3f4c0af2-5f03-4539-92fb-68878f260f6c',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Id шкалы',
    example: '3f4c0af2-5f03-4539-92fb-68878f260f6c',
  })
  @IsUUID()
  testScaleId: string;

  @ApiProperty({ description: 'Минимальный балл для интерпретации' })
  @IsNumber()
  minScore: number;

  @ApiProperty({ description: 'Максимальный балл для интерпретации' })
  @IsNumber()
  maxScore: number;

  @ApiProperty({ description: 'Текст интерпретации' })
  @IsString()
  interpretation: string;
}

export class UpdateScaleInterpretationDto {
  @ApiProperty({ description: 'ID интерпретации' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Id шкалы', required: false })
  @IsUUID()
  @IsOptional()
  testScaleId?: string;

  @ApiProperty({
    description: 'Минимальный балл для интерпретации',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  minScore?: number;

  @ApiProperty({
    description: 'Максимальный балл для интерпретации',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  maxScore?: number;

  @ApiProperty({ description: 'Текст интерпретации', required: false })
  @IsString()
  @IsOptional()
  interpretation?: string;
}
