import {
  AUTH_SERVICE_SYMBOL,
  TOKENS_SERVICE_SYMBOL,
  USER_SERVICE_SYMBOL,
} from '@common/constants';
import { PrismaModule } from '@infrastructure/db/prisma.module';
import { JwtAuthGuard } from '@nest/guard/jwt.guard';
import { AnswerModule } from '@nest/modules/answer.module';
import { AttemptModule } from '@nest/modules/attempt.module';
import { AuthModule } from '@nest/modules/auth.module';
import { QuestionModule } from '@nest/modules/question.module';
import { ScaleInterpretationsModule } from '@nest/modules/scale-interpretation.module';
import { ScoringModule } from '@nest/modules/scoring.module';
import { TestScalesModule } from '@nest/modules/test-scale.module';
import { TestsModule } from '@nest/modules/tests.module';
import { TokensModule } from '@nest/modules/tokens.module';
import { UsersModule } from '@nest/modules/users.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { IAuthService } from '@use-cases/auth/auth.interface';
import { AuthService } from '@use-cases/auth/auth.service';
import { TokensService } from '@use-cases/tokens/tokens.service';
import { ITokensService } from '@use-cases/tokens/tokens.service.interface';
import { UserService } from '@use-cases/user/user.service';
import { getJwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
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
    AuthModule,
    TokensModule,
    UsersModule,
    TestsModule,
    AttemptModule,
    QuestionModule,
    TestScalesModule,
    AnswerModule,
    ScoringModule,
    ScaleInterpretationsModule,
  ],
  providers: [
    {
      provide: USER_SERVICE_SYMBOL,
      useClass: UserService,
    },
    {
      provide: TOKENS_SERVICE_SYMBOL,
      useClass: TokensService,
    },
    {
      provide: AUTH_SERVICE_SYMBOL,
      useClass: AuthService,
    },
    {
      provide: APP_GUARD,
      useFactory: (
        reflector: Reflector,
        tokensService: ITokensService,
        authService: IAuthService,
      ) => new JwtAuthGuard(reflector, tokensService, authService),
      inject: [Reflector, TOKENS_SERVICE_SYMBOL, AUTH_SERVICE_SYMBOL],
    },
  ],
})
export class AppModule {}
