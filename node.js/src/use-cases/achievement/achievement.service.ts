import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.achievement.findMany();
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

    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    const userAchievement = await this.prisma.userAchievements.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
      update: {},
      create: {
        userId,
        achievementId,
      },
      include: {
        achievement: true,
      },
    });

    return {
      userId: userAchievement.userId,
      achievementId: userAchievement.achievementId,
      achievement: userAchievement.achievement,
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
