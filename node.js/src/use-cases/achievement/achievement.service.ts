import { PrismaService } from '@infrastructure/db/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AssignAchievementDto,
  CreateAchievementDto,
  UpdateAchievementDto,
} from '@presentation/dto/achievement.dto';
import { IAchievementService } from './achievement.service.interface';

@Injectable()
export class AchievementService implements IAchievementService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const achievements = await this.prisma.achievement.findMany({
      include: {
        user: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return achievements.map((achievement) => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      pointsReward: achievement.pointsReward,
      userIds: achievement.user.map((userAchievement) => ({
        userId: userAchievement.user.id,
        login: userAchievement.user.login,
        fullName: userAchievement.user.fullName,
      })),
    }));
  }
  async findOne(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!achievement) {
      return null;
    }
    return achievement;
  }

  async create(createAchievementDto: CreateAchievementDto) {
    return this.prisma.achievement.create({
      data: createAchievementDto,
    });
  }

  async update(id: string, updateAchievementDto: UpdateAchievementDto) {
    const existing = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!existing) return null;

    return this.prisma.achievement.update({
      where: { id },
      data: updateAchievementDto,
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.achievement.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async assignToUser(dto: AssignAchievementDto) {
    const { userId, achievementId } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const existingAchievement = await tx.userAchievements.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
      });

      if (existingAchievement) {
        throw new ConflictException('User already has this achievement');
      }

      const userAchievement = await tx.userAchievements.create({
        data: {
          userId,
          achievementId,
        },
        include: {
          achievement: true,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          scores: {
            increment: achievement.pointsReward,
          },
        },
        select: {
          id: true,
          login: true,
          scores: true,
        },
      });

      return {
        userAchievement,
        updatedUser,
      };
    });

    return {
      userId: result.userAchievement.userId,
      achievementId: result.userAchievement.achievementId,
      achievement: result.userAchievement.achievement,
      pointsAdded: achievement.pointsReward,
      newTotalScore: result.updatedUser.scores,
    };
  }

  async getUserAchievements(userId: string) {
    const userAchievements = await this.prisma.userAchievements.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
    });

    return userAchievements.map((ua) => ua.achievement);
  }

  async removeFromUser(userId: string, achievementId: string) {
    try {
      await this.prisma.userAchievements.delete({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
