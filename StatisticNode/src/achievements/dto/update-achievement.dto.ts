import { PartialType } from '@nestjs/mapped-types'; // Note: mapped-types is not in package.json, I should add it or just copy fields. I'll copy fields to avoid dependency issues if I can't run install.
import { IsInt, IsOptional, IsString } from 'class-validator';

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
