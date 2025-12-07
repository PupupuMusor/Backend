import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

// dtos/achievement-response.dto.ts

export class AchievementUserDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID пользователя',
  })
  userId: string;

  @ApiProperty({
    example: 'ivanov',
    description: 'Логин пользователя',
  })
  login: string;

  @ApiProperty({
    example: 'Иванов Иван',
    description: 'Полное имя пользователя',
    required: false,
  })
  fullName?: string;
}

export class AchievementResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID достижения',
  })
  id: string;

  @ApiProperty({
    example: 'Первый тест',
    description: 'Название достижения',
  })
  name: string;

  @ApiProperty({
    example: 'Завершить первый тест в системе',
    description: 'Описание достижения',
  })
  description: string;

  @ApiProperty({
    example: 50,
    description: 'Количество баллов за достижение',
  })
  pointsReward: number;

  @ApiProperty({
    example: '/icons/first-test.png',
    description: 'Путь к иконке',
    required: false,
  })
  iconPath?: string;

  @ApiProperty({
    type: [AchievementUserDto],
    description: 'Пользователи, получившие это достижение',
  })
  userIds: AchievementUserDto[];
}

// assign-achievement-response.dto.ts

export class AssignAchievementResponseDto {
  @ApiProperty({
    example: true,
    description: 'Успешно ли назначено достижение',
  })
  success: boolean;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID пользователя',
  })
  userId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'UUID достижения',
  })
  achievementId: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Первый тест',
      description: 'Завершить первый тест',
      pointsReward: 50,
    },
    description: 'Информация о достижении',
  })
  achievement: any;

  @ApiProperty({
    example: 50,
    description: 'Количество добавленных баллов',
  })
  pointsAdded: number;

  @ApiProperty({
    example: 150,
    description: 'Общее количество баллов пользователя после начисления',
  })
  newTotalScore: number;
}

export class AssignAchievementDto {
  @ApiProperty({
    description: 'UUID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'UUID достижения',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @IsUUID()
  achievementId: string;
}

export class CreateAchievementDto {
  @ApiProperty({
    description: 'Название достижения',
    example: 'Первый тест',
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Описание достижения',
    example: 'Завершить первый тест в системе',
    maxLength: 500,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Количество баллов за достижение',
    example: 50,
    minimum: 0,
    maximum: 1000,
  })
  @IsInt()
  pointsReward: number;

  @ApiPropertyOptional({
    description: 'Путь к иконке достижения',
    example: '/icons/first-test.png',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  iconPath?: string;
}

export class UpdateAchievementDto {
  @ApiProperty({
    description: 'Название достижения',
    example: 'Первый тест (обновлено)',
    maxLength: 100,
    required: false,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Описание достижения',
    example: 'Завершить первый тест в системе - новое описание',
    maxLength: 500,
    required: false,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Количество баллов за достижение',
    example: 100,
    minimum: 0,
    maximum: 1000,
    required: false,
  })
  @IsInt()
  pointsReward: number;

  @ApiPropertyOptional({
    description: 'Путь к иконке достижения',
    example: '/icons/first-test-updated.png',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  iconPath?: string;
}
