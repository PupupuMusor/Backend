import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UserSelectionDto {
  @ApiProperty({ description: 'ID вопроса' })
  @IsNotEmpty({ message: 'Поле questionId не должно быть пустым' })
  @IsUUID()
  questionId: string;

  @ApiProperty({ description: 'ID ответов' })
  @IsArray()
  @IsOptional()
  answerIds?: string[];

  @ApiProperty({ description: 'Ответы со вписыванием' })
  @IsString()
  @IsOptional()
  supplyAnswer?: string;
}

export class SubmitAttemptDto {
  @ApiProperty({ description: 'ID теста' })
  @IsNotEmpty({ message: 'Поле testId не должно быть пустым' })
  @IsUUID()
  testId: string;

  @ApiProperty({
    description: 'Выборы пользователя',
    type: UserSelectionDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => UserSelectionDto)
  @ArrayNotEmpty()
  selections: UserSelectionDto[];
}
