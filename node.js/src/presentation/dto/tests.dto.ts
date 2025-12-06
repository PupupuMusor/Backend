import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTestDto {
  @ApiProperty({
    description: 'Название теста',
    maxLength: 256,
    example: 'Тест Юнга',
  })
  @IsNotEmpty({ message: 'Поле title не должно быть пустым' })
  @IsString()
  @MaxLength(256)
  title: string;

  @ApiProperty({
    description: 'Описание теста',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  instruction?: string;
}

export class ResponseTestDto {
  @ApiProperty({ description: 'ID теста' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Название теста' })
  title: string;

  @ApiProperty({ description: 'Прошел ли пользователь тест' })
  @IsOptional()
  isCompleted?: boolean;

  @ApiProperty({ description: 'Привязаны ли к тесту профессии' })
  @IsOptional()
  isProfessions?: boolean;
}
