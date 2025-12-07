import { ANSWER_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { AnswersController } from '@presentation/controllers/answer.controller';
import { AnswerService } from '@use-cases/answer/answer.service';

@Module({
  controllers: [AnswersController],
  imports: [],
  providers: [
    {
      provide: ANSWER_SERVICE_SYMBOL,
      useClass: AnswerService,
    },
  ],
})
export class AnswerModule {}
