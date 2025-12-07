import { QUESTION_SERVICE_SYMBOL } from '@common/constants';
import { Controller, Inject } from '@nestjs/common';
import { IQuestionsService } from '@use-cases/question/question.service.interface';

@Controller('questions')
export class QuestionsController {
  constructor(
    @Inject(QUESTION_SERVICE_SYMBOL)
    private readonly questionsService: IQuestionsService,
  ) {}
}
