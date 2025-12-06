import { QUESTION_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CreateQuestionWithAnswersDto,
  ResponseQuestionDto,
  UpdateQuestionWithAnswersDto,
} from '@presentation/dto/question.dto';
import { IQuestionsService } from '@use-cases/question/question.service.interface';

@Controller('questions')
export class QuestionsController {
  constructor(
    @Inject(QUESTION_SERVICE_SYMBOL)
    private readonly questionsService: IQuestionsService,
  ) {}

  @Post(':testId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание вопроса с ответами' })
  @ApiParam({ name: 'testId', description: 'ID теста', required: true })
  @ApiBody({ type: [CreateQuestionWithAnswersDto] })
  async createWithAnswers(
    @Param('testId') testId: string,
    @Body() data: CreateQuestionWithAnswersDto[],
  ) {
    return this.questionsService.createWithAnswers(testId, data);
  }

  @Patch('')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Радактирование вопроса' })
  @ApiBody({ type: [UpdateQuestionWithAnswersDto] })
  async update(
    @Body() dto: UpdateQuestionWithAnswersDto[],
  ): Promise<ResponseQuestionDto[]> {
    return this.questionsService.update(dto);
  }

  @Get('test/:testId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение вопроса по id теста' })
  @ApiParam({ name: 'testId', description: 'ID теста', required: true })
  async findByTest(
    @Param('testId') testId: string,
  ): Promise<ResponseQuestionDto[]> {
    return this.questionsService.findByTest(testId);
  }

  @Get(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение вопроса по id' })
  @ApiParam({ name: 'id', description: 'ID вопроса', required: true })
  async findAll(@Param('id') id: string): Promise<ResponseQuestionDto> {
    return this.questionsService.findById(id);
  }

  @Delete(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление вопроса' })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Вопрос успешно удален' })
  @ApiResponse({ status: 404, description: 'Вопрос не найден' })
  @ApiResponse({ status: 403, description: 'Нет прав' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async delete(@Param('id') id: string) {
    return this.questionsService.delete(id);
  }
}
