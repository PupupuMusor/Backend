import { ANSWER_SERVICE_SYMBOL } from '@common/constants';
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
  ApiResponse,
} from '@nestjs/swagger';
import { CreateAnswerDto } from '@presentation/dto/answer.dto';
import { IAnswerService } from '@use-cases/answer/answer.service.interface';

@Controller('answers')
export class AnswersController {
  constructor(
    @Inject(ANSWER_SERVICE_SYMBOL)
    private readonly answerService: IAnswerService,
  ) {}

  @Post(':questionId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание ответа' })
  @ApiBody({ type: CreateAnswerDto })
  async add(
    @Param('questionId') questionId: string,
    @Body() data: CreateAnswerDto,
  ) {
    return this.answerService.createOne(questionId, data);
  }

  @Patch(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Радактирование ответа' })
  @ApiBody({ type: CreateAnswerDto })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateAnswerDto>) {
    return this.answerService.update(id, dto);
  }

  @Get('question/:questionId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение ответов по id вопроса' })
  async findByTest(@Param('questionId') questionId: string) {
    return this.answerService.findByQuestion(questionId);
  }

  @Get('answer/:id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение ответа по id' })
  async findById(@Param('id') id: string) {
    const result = await this.answerService.findById(id);
    return result;
  }

  @Delete(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление ответа' })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Ответ успешно удален' })
  @ApiResponse({ status: 404, description: 'Ответ не найден' })
  @ApiResponse({ status: 403, description: 'Нет прав' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async delete(@Param('id') id: string) {
    return this.answerService.delete(id);
  }
}
