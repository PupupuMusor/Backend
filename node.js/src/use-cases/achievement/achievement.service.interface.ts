import {
  AssignAchievementDto,
  CreateAchievementDto,
  UpdateAchievementDto,
} from '@presentation/dto/achievement.dto';

export interface IAchievementService {
  findAll();
  findOne(id: string);
  create(createAchievementDto: CreateAchievementDto);
  update(id: string, updateAchievementDto: UpdateAchievementDto);
  remove(id: string);
  assignToUser(dto: AssignAchievementDto);
  getUserAchievements(userId: string);
  removeFromUser(userId: string, achievementId: string);
}
