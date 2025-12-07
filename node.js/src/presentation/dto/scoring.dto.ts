import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, IsUUID } from 'class-validator';

export class CalculatePointsDto {
  @ApiProperty({
    description: 'Массив UUID ответов',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Должен быть хотя бы один ответ' })
  @IsUUID('4', {
    each: true,
    message: 'Каждый ID ответа должен быть валидным UUID',
  })
  answerIds: string[];
}

export class PlusScoresDto {
  @ApiProperty({
    description: 'Баллы',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'Баллы должны быть целым числом' })
  scores: number;
}
