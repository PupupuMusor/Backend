import { TEST_SCALES_SERVICE_SYMBOL } from '@common/constants';
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
import { CreateScaleDto, ScaleResponseDto } from '@presentation/dto/scale.dto';
import { ITestScalesService } from '@use-cases/test-scale/test-scale.service.interface';

@Controller('scales')
export class TestScalesController {
  constructor(
    @Inject(TEST_SCALES_SERVICE_SYMBOL)
    private readonly testScalesService: ITestScalesService,
  ) {}

  @Post('')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавление шкалы к тесту' })
  @ApiBody({ type: [CreateScaleDto] })
  @ApiResponse({
    status: 201,
    description: 'Шкалы успешно созданы',
    type: [ScaleResponseDto],
  })
  async add(@Body() data: CreateScaleDto[]): Promise<ScaleResponseDto[]> {
    return this.testScalesService.create(data);
  }

  @Get('test/:testId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение шкал по ID теста' })
  @ApiResponse({
    status: 201,
    description: 'Шкалы успешно получены',
    type: [ScaleResponseDto],
  })
  async findByTestId(
    @Param('testId') testId: string,
  ): Promise<ScaleResponseDto[]> {
    return this.testScalesService.findByTestId(testId);
  }

  @Get(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение шкалы по ID' })
  @ApiResponse({
    status: 200,
    description: 'Шкала успешно получена',
    type: ScaleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Шкала не найдена',
  })
  @ApiResponse({
    status: 201,
    description: 'Шкалы успешно получены',
    type: ScaleResponseDto,
  })
  async findById(@Param('id') id: string): Promise<ScaleResponseDto> {
    return this.testScalesService.findById(id);
  }

  @Patch(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Редактирование шкалы' })
  @ApiBody({ type: CreateScaleDto })
  @ApiResponse({
    status: 201,
    description: 'Шкала успешно обновлена',
    type: ScaleResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateScaleDto>,
  ): Promise<ScaleResponseDto> {
    return this.testScalesService.update(id, dto);
  }

  @Delete(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление шкалы' })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Шкала успешно удалена' })
  @ApiResponse({ status: 404, description: 'Шкала не найдена' })
  @ApiResponse({ status: 403, description: 'Нет прав' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async delete(@Param('id') id: string) {
    return this.testScalesService.delete(id);
  }
}
