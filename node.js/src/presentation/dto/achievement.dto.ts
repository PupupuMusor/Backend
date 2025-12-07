import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class AssignAchievementDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  achievementId: string;
}

export class CreateAchievementDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  pointsReward: number;

  @IsString()
  @IsOptional()
  iconPath?: string;
}

export class UpdateAchievementDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  pointsReward: number;

  @IsString()
  @IsOptional()
  iconPath?: string;
}
