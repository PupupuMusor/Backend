import { IsString, IsUUID } from 'class-validator';

export class AssignAchievementDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  achievementId: string;
}
