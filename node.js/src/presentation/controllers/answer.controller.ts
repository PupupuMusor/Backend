import { ANSWER_SERVICE_SYMBOL } from '@common/constants';
import { Controller, Inject } from '@nestjs/common';
import { IAnswerService } from '@use-cases/answer/answer.service.interface';

@Controller('answers')
export class AnswersController {
  constructor(
    @Inject(ANSWER_SERVICE_SYMBOL)
    private readonly answerService: IAnswerService,
  ) {}
}
