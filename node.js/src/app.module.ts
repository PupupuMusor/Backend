import { USER_SERVICE_SYMBOL } from '@common/constants';
import { PrismaModule } from '@infrastructure/db/prisma.module';
import { AchievementModule } from '@nest/modules/achievement.module';
import { AnswerModule } from '@nest/modules/answer.module';
import { QuestionModule } from '@nest/modules/question.module';
import { ScoringModule } from '@nest/modules/scoring.module';
import { UserAchievementsModule } from '@nest/modules/user-achievements.module';
import { UserWeeklyStatsModule } from '@nest/modules/user-weekly-stats.module';
import { UsersModule } from '@nest/modules/users.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '@use-cases/user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: Number(config.get<string>('REDIS_PORT')) ?? 6379,
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    UsersModule,
    QuestionModule,
    AnswerModule,
    ScoringModule,
    UserAchievementsModule,
    UserWeeklyStatsModule,
    AchievementModule,
  ],
  providers: [
    {
      provide: USER_SERVICE_SYMBOL,
      useClass: UserService,
    },
  ],
})
export class AppModule {}
