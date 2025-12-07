import { QUESTION_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { QuestionsController } from '@presentation/controllers/question.controller';
import { QuestionsService } from '@use-cases/question/question.service';

@Module({
  controllers: [QuestionsController],
  imports: [],
  providers: [
    {
      provide: QUESTION_SERVICE_SYMBOL,
      useClass: QuestionsService,
    },
  ],
})
export class QuestionModule {}
