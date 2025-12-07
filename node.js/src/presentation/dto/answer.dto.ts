import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({ description: 'Текст варианта ответа', example: 'Вариант 1' })
  @IsNotEmpty({ message: 'Поле text не должно быть пустым' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Порядок отображения варианта', example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({})
  scores: number;

  @ApiProperty({})
  isRight: Boolean;
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
}

export class CreateAnswersWithQuestionDto {
  @ApiProperty({ description: 'Текст ответа' })
  @IsNotEmpty({ message: 'Поле text не должно быть пустым' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Баллы' })
  @IsNotEmpty({ message: 'Поле score не должно быть пустым' })
  score: number;
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
}
