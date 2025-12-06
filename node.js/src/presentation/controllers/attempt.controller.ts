import { ATTEMPT_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AttemptAdminResultDto,
  AttemptResultDto,
} from '@presentation/dto/result-attempt.dto';
import { SubmitAttemptDto } from '@presentation/dto/submit-attempt.dto';
import { User } from '@prisma/client';
import { IAttemptService } from '@use-cases/attempt';

@Controller('attempts')
export class AttemptController {
  constructor(
    @Inject(ATTEMPT_SERVICE_SYMBOL)
    private readonly attemptService: IAttemptService,
  ) {}

  @Post('')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Попытка прохождения теста' })
  @ApiBody({ type: SubmitAttemptDto })
  @ApiResponse({
    status: 201,
    description: 'Ответы записаны успешно',
    type: AttemptResultDto,
  })
  async submitAttempt(
    @CurrentUser() user: User,
    @Body() submitDto: SubmitAttemptDto,
  ): Promise<AttemptResultDto> {
    return this.attemptService.submitAttempt(user.id, submitDto);
  }

  @Get(':testId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'testId',
    type: 'string',
    description: 'id теста',
  })
  @ApiResponse({
    status: 201,
    description: 'Попытка возвращена успешно',
    type: AttemptResultDto,
  })
  @ApiResponse({ status: 200, description: 'Попытка успешно найдена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Попытка не найдена.' })
  async findByTestId(
    @Param('testId', new ParseUUIDPipe({ version: '4' })) testId: string,
    @CurrentUser() user: User,
  ): Promise<AttemptResultDto> {
    return await this.attemptService.findByTestId(testId, user.id);
  }

  @Get('admin/:testId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'testId',
    type: 'string',
    description: 'id теста',
  })
  @ApiQuery({
    name: 'userId',
    type: 'string',
    description: 'ID пользователя',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Попытка возвращена успешно',
    type: AttemptResultDto,
  })
  async findAdminByTestId(
    @Param('testId', new ParseUUIDPipe({ version: '4' })) testId: string,
    @Query('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ): Promise<AttemptAdminResultDto> {
    return await this.attemptService.findAdminByTestId(testId, userId);
  }
}
