import { USER_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '@presentation/dto/user.dto';
import { User } from '@prisma/client';
import { IUserService } from '@use-cases/user/user.service.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE_SYMBOL)
    private readonly userService: IUserService,
  ) {}

  @Post('staff')
  @Auth(['ADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание зав института' })
  @ApiResponse({ status: 200, description: 'Заведущий успешно создан' })
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Get('self')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение пользователя по токену' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно получен' })
  @ApiResponse({ status: 404, description: 'пользователь не найден' })
  async self(@CurrentUser('id') id: string) {
    return await this.userService.findById(id);
  }

  @Put('')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  @ApiQuery({
    name: 'userId',
    required: false,
  })
  @ApiQuery({
    name: 'removeFile',
    required: false,
    description: 'Если хотите удалить файл, не загружая новый',
  })
  @ApiQuery({
    name: 'isAdmin',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Запись обновлена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Запись не найдена.' })
  async update(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserDto,
    @Query('userId') userId?: string,
    @Query('isAdmin') isAdmin?: boolean,
  ) {
    if (isAdmin) return await this.userService.update(user, dto);
    user = await this.userService.resolveTarget(user, userId);
    return await this.userService.update(user, dto);
  }
}
