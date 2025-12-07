import { QUESTION_SERVICE_SYMBOL } from '@common/constants';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IQuestionsService } from '@use-cases/question/question.service.interface';

@Controller('questions')
export class QuestionsController {
  constructor(
    @Inject(QUESTION_SERVICE_SYMBOL)
    private readonly questionsService: IQuestionsService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Получение всех вопросов' })
  @ApiResponse({ status: 200, description: 'Вопросы успешно получены' })
  async getAll() {
    return await this.questionsService.findAll();
  }

  @Get('')
  @ApiOperation({ summary: 'Получение 5 вопросов' })
  @ApiResponse({ status: 200, description: 'Вопросы успешно получены' })
  async get() {
    return await this.questionsService.findFive();
  }
}
