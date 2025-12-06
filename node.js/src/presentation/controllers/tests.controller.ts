import { TESTS_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
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
import { CreateTestDto, ResponseTestDto } from '@presentation/dto/tests.dto';
import { Tests, User } from '@prisma/client';
import { ITestsService } from '@use-cases/tests';

@Controller('tests')
export class TestsController {
  constructor(
    @Inject(TESTS_SERVICE_SYMBOL)
    private readonly testService: ITestsService,
  ) {}

  @Post('')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать тест без вопросов' })
  @ApiBody({ type: CreateTestDto })
  @ApiResponse({
    status: 201,
    description: 'Тест создан успешно',
    type: CreateTestDto,
  })
  async create(@Body() data: CreateTestDto): Promise<ResponseTestDto> {
    return this.testService.create(data);
  }

  @Patch(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить существующий тест' })
  @ApiParam({ name: 'id', description: 'ID теста', required: true })
  @ApiBody({ type: CreateTestDto })
  @ApiResponse({
    status: 200,
    description: 'Тест обновлен успешно',
    type: CreateTestDto,
  })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CreateTestDto>,
  ): Promise<Tests> {
    return this.testService.update(id, data);
  }

  @Get('')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все тесты' })
  @ApiResponse({
    status: 200,
    description: 'Список тестов',
    type: [ResponseTestDto],
  })
  async findAll(@CurrentUser() user: User): Promise<ResponseTestDto[]> {
    return this.testService.findAll(user.id);
  }

  @Get('/admin/:userId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все тесты' })
  @ApiParam({ name: 'userId', description: 'ID юзера', required: true })
  @ApiResponse({
    status: 200,
    description: 'Список тестов',
    type: [ResponseTestDto],
  })
  async findAllForAdmin(
    @Param('userId') userId: string,
  ): Promise<ResponseTestDto[]> {
    return this.testService.findAll(userId);
  }

  @Get(':id')
  @Auth(['STAFF', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить тест по ID' })
  @ApiParam({ name: 'id', description: 'ID теста', required: true })
  @ApiResponse({ status: 200, description: 'Тест найден', type: CreateTestDto })
  async findById(@Param('id') id: string): Promise<Tests> {
    return this.testService.findById(id);
  }

  @Delete(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить тест по ID' })
  @ApiParam({ name: 'id', description: 'ID теста', required: true })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Тест успешно удален' })
  @ApiResponse({ status: 404, description: 'Тест не найден' })
  @ApiResponse({ status: 403, description: 'Нет прав' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.testService.delete(id);
  }
}
