import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateScaleDto {
  @ApiProperty({ description: 'Id теста', example: '' })
  @IsUUID()
  testId: string;

  @ApiProperty({ description: 'Название шкалы', example: 'Общий балл' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ScaleResponseDto {
  @ApiProperty({ description: 'ID шкалы' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Id теста', example: '' })
  @IsUUID()
  testId: string;

  @ApiProperty({ description: 'Название шкалы', example: 'Общий балл' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
