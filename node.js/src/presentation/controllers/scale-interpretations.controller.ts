import { SCALES_INTERPRETATIONS_SERVICE_SYMBOL } from '@common/constants';
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
  CreateScaleInterpretationDto,
  ResponseScaleInterpretation,
  ResponseScaleInterpretationWithProfessions,
  UpdateScaleInterpretationDto,
} from '@presentation/dto/scale-interpretation.dto';
import { IScaleInterpretationsService } from '@use-cases/scale-interpretations/scale-interpretations.interface.service';

@Controller('interpretation')
export class ScaleInterpretationsController {
  constructor(
    @Inject(SCALES_INTERPRETATIONS_SERVICE_SYMBOL)
    private readonly scaleInterpretationsService: IScaleInterpretationsService,
  ) {}

  @Post('')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавление интерпретации к шкале' })
  @ApiBody({ type: CreateScaleInterpretationDto })
  async add(
    @Body() data: CreateScaleInterpretationDto,
  ): Promise<ResponseScaleInterpretation> {
    return this.scaleInterpretationsService.create(data);
  }

  @Post('many')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавление интерпретации к шкале' })
  @ApiBody({ type: [CreateScaleInterpretationDto] })
  @ApiResponse({
    status: 201,
    description: 'Получение прошло успешно',
    type: [ResponseScaleInterpretation],
  })
  async addMany(
    @Body() data: CreateScaleInterpretationDto[],
  ): Promise<ResponseScaleInterpretation[]> {
    return this.scaleInterpretationsService.createMany(data);
  }

  @Get('scale/:testScaleId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение интерпретации по ID шкалы' })
  @ApiParam({ name: 'testScaleId', description: 'ID шкалы', required: true })
  @ApiResponse({
    status: 200,
    description: 'Получение прошло успешно',
    type: [ResponseScaleInterpretation],
  })
  async findByScaleId(
    @Param('testScaleId') testScaleId: string,
  ): Promise<ResponseScaleInterpretation[]> {
    return this.scaleInterpretationsService.findByScaleId(testScaleId);
  }

  @Get('all')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех интерпретаций' })
  @ApiResponse({
    status: 200,
    description: 'Получение прошло успешно',
    type: [ResponseScaleInterpretation],
  })
  async getAll(): Promise<ResponseScaleInterpretation[]> {
    return this.scaleInterpretationsService.findAll();
  }

  @Get(':testId')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение интерпретации по ID теста' })
  @ApiParam({ name: 'testId', description: 'ID теста', required: true })
  @ApiResponse({
    status: 200,
    description: 'Получение прошло успешно',
    type: [ResponseScaleInterpretationWithProfessions],
  })
  async findByTestId(
    @Param('testId') testId: string,
  ): Promise<ResponseScaleInterpretationWithProfessions[]> {
    return this.scaleInterpretationsService.findByTestId(testId);
  }

  @Patch('one/:id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Редактирование интерпретации' })
  @ApiBody({ type: CreateScaleInterpretationDto })
  @ApiResponse({
    status: 200,
    description: 'Получение прошло успешно',
    type: ResponseScaleInterpretation,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateScaleInterpretationDto>,
  ): Promise<ResponseScaleInterpretation> {
    return this.scaleInterpretationsService.update(id, dto);
  }

  @Patch('many')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Редактирование нескольких интерпретаций' })
  @ApiBody({ type: [UpdateScaleInterpretationDto] })
  @ApiResponse({
    status: 200,
    description: 'Получение прошло успешно',
    type: [ResponseScaleInterpretation],
  })
  async updateMany(
    @Body() dtos: UpdateScaleInterpretationDto[],
  ): Promise<ResponseScaleInterpretation[]> {
    return this.scaleInterpretationsService.updateMany(dtos);
  }

  @Delete(':id')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление интерпретации' })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Интерпретация успешно удалена' })
  @ApiResponse({ status: 404, description: 'Интерпретация не найдена' })
  @ApiResponse({ status: 403, description: 'Нет прав' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async delete(@Param('id') id: string) {
    return this.scaleInterpretationsService.delete(id);
  }
}
