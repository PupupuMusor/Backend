import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  AnswerResponseDto,
  CreateAnswersWithQuestionDto,
  UpdateAnswersWithQuestionDto,
} from './answer.dto';

export class CreateQuestionWithAnswersDto {
  @ApiProperty({ description: 'Текст вопроса' })
  @IsNotEmpty({ message: 'Поле text не должно быть пустым' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Порядок вопроса' })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'Ответы на вопрос',
    type: [CreateAnswersWithQuestionDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswersWithQuestionDto)
  @IsArray()
  answers?: CreateAnswersWithQuestionDto[];
}

export class UpdateQuestionWithAnswersDto {
  @ApiProperty({
    description: 'ID вопроса',
    example: '3f4c0af2-5f03-4539-92fb-68878f260f6c',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Текст вопроса' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ description: 'Порядок вопроса' })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Ответы на вопрос',
    type: [UpdateAnswersWithQuestionDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswersWithQuestionDto)
  @IsArray()
  answers?: UpdateAnswersWithQuestionDto[];
}

export class ResponseQuestionDto {
  @ApiProperty({
    description: 'ID вопроса',
    example: '3f4c0af2-5f03-4539-92fb-68878f260f6c',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Текст вопроса',
    example: 'Как вы себя оцениваете?',
  })
  @IsNotEmpty({ message: 'Поле text не должно быть пустым' })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Ответы на вопрос',
    type: [AnswerResponseDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AnswerResponseDto)
  @IsArray()
  answers?: AnswerResponseDto[];
}
