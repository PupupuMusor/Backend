import { IsInt, IsOptional, IsString } from 'class-validator';

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
