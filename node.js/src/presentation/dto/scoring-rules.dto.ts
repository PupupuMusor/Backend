import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateScoringRuleDto {
  @ApiProperty({
    description: 'Текст ответа, если правило для свободного ответа',
    required: false,
  })
  @IsOptional()
  @IsString()
  supplyText?: string;

  @ApiProperty({ description: 'Баллы за правило' })
  @IsNumber()
  score: number;

  @ApiProperty({ description: 'Id шкалы', example: '' })
  @IsUUID()
  testScaleId: string;
}

export class ResponseScoringRuleDto {
  @ApiProperty({
    description: 'ID правил оценивания',
    example: '3f4c0af2-5f03-4539-92fb-68878f260f6c',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Id вопроса', example: '' })
  @IsUUID()
  questionId: string;

  @ApiProperty({ description: 'Id ответа', example: '' })
  @IsOptional()
  @IsUUID()
  answerId?: string;

  @ApiProperty({
    description: 'Текст ответа, если правило для свободного ответа',
    required: false,
  })
  @IsOptional()
  @IsString()
  supplyText?: string;

  @ApiProperty({ description: 'Баллы за правило' })
  @IsNumber()
  score: number;

  @ApiProperty({ description: 'Id шкалы', example: '' })
  @IsUUID()
  testScaleId: string;
}
