import { USER_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '@presentation/dto/user.dto';
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
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Get('all')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, description: 'Пользователи успешно получены' })
  async getAll() {
    return await this.userService.findAll();
  }

  @Get('user/:login')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, description: 'Пользователи успешно получены' })
  async getByLogin(@Query() login: string) {
    return await this.userService.findByLoginFront(login);
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
}
