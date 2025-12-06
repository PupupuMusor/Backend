import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AssignAchievementDto } from './dto/assign-achievement.dto';

@Injectable()
export class AchievementsService {
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
    const existing = await this.prisma.achievement.findUnique({ where: { id } });
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
    
    // Check if achievement exists
    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    // Create relation
    // Prisma create throws if unique constraint violated (already assigned), so we might want to use upsert or ignore
    // C# code just adds it.
    
    const userAchievement = await this.prisma.usersAchievements.upsert({
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
    const userAchievements = await this.prisma.usersAchievements.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
    });

    return userAchievements.map((ua) => ua.achievement);
  }

  async removeFromUser(userId: string, achievementId: string) {
    try {
      await this.prisma.usersAchievements.delete({
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
