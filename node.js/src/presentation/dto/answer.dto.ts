import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  CreateScoringRuleDto,
  ResponseScoringRuleDto,
} from './scoring-rules.dto';

export class CreateAnswerDto {
  @ApiProperty({ description: 'Текст варианта ответа', example: 'Вариант 1' })
  @IsNotEmpty({ message: 'Поле text не должно быть пустым' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Порядок отображения варианта', example: 1 })
  @IsNumber()
  order: number;
}

export class AnswerResponseDto {
  @ApiProperty({ description: 'ID ответа', required: false })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'ID вопроса' })
  @IsNotEmpty({ message: 'Поле questionId не должно быть пустым' })
  @IsUUID()
  questionId: string;

  @ApiProperty({ description: 'Текст ответа' })
  @IsNotEmpty({ message: 'Поле text не должно быть пустым' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'Порядок ответа' })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Правила начисления баллов за этот ответ',
    required: false,
    type: ResponseScoringRuleDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ResponseScoringRuleDto)
  scoringRules?: ResponseScoringRuleDto;
}

export class CreateAnswersWithQuestionDto {
  @ApiProperty({ description: 'Текст ответа' })
  @IsNotEmpty({ message: 'Поле text не должно быть пустым' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Порядок ответа' })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'Правила начисления баллов за этот ответ',
    required: false,
    type: CreateScoringRuleDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateScoringRuleDto)
  scoringRules?: CreateScoringRuleDto;
}

export class UpdateAnswersWithQuestionDto {
  @ApiProperty({ description: 'ID ответа', required: false })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Текст ответа' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ description: 'Порядок ответа' })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Правила начисления баллов за этот ответ',
    required: false,
    type: CreateScoringRuleDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateScoringRuleDto)
  scoringRules?: CreateScoringRuleDto;
}
