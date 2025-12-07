import { USER_SERVICE_SYMBOL } from '@common/constants';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateOfficeDto, CreateUserDto } from '@presentation/dto/user.dto';
import { IUserService } from '@use-cases/user/user.service.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE_SYMBOL)
    private readonly userService: IUserService,
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, description: 'Пользователи успешно получены' })
  async getAll() {
    return await this.userService.findAll();
  }

  @Post('office')
  @ApiOperation({ summary: 'Создать офис' })
  async createOffice(@Body() createOfficeDto: CreateOfficeDto) {
    return this.userService.createOffice(createOfficeDto);
  }

  @Get('user/:login')
  @ApiQuery({
    name: 'login',
    type: 'string',
    description: 'Логин пользователя',
    required: true,
  })
  @ApiOperation({ summary: 'Получение пользователя по логину' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно получен' })
  async getByLogin(@Query('login') login: string) {
    return await this.userService.findByLoginFront(login);
  }
}
