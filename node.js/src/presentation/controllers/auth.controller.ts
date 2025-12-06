import { AUTH_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AuthLoginDto,
  AuthRegisterDto,
  ChangePasswordDto,
  ConfirmResetPasswordDto,
  RecoveryPasswordDto,
} from '@presentation/dto/auth.dto';
import { User } from '@prisma/client';
import { IAuthService } from '@use-cases/auth/auth.interface';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_SYMBOL) private readonly authService: IAuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get('sfedu')
  @UseGuards(AuthGuard('azuread'))
  sfedu() {}

  @Public()
  @Get('sfedu/callback')
  @UseGuards(AuthGuard('azuread'))
  async sfeduCallback(@Res() res, @Req() req) {
    const result = await this.authService.auth(res, req.user.id);
    return res.redirect(this.configService.getOrThrow<string>('ORIGIN_URL'));
  }

  @Public()
  @Post('register')
  async register(@Res() res: Response, @Body() dto: AuthRegisterDto) {
    const result = await this.authService.register(dto);
    return res.status(201).json(result);
  }

  @Public()
  @ApiOperation({ summary: 'Подтверждение кода для сброса пароля' })
  @ApiBody({ type: ConfirmResetPasswordDto })
  @ApiResponse({ status: 201, description: 'Код валидный' })
  @ApiResponse({ status: 404, description: 'Код не валидный или истек' })
  @Post('confirmReset')
  async confirmReset(
    @Body() dto: ConfirmResetPasswordDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.confirmReset(dto.email, dto.code);
    return res.status(201).json(result);
  }

  @Post('changePassword')
  @Auth(['ADMIN', 'STAFF'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Смена пароля' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 201, description: 'Успешная смена пароля' })
  @ApiResponse({ status: 404, description: 'Старый пароль не валидный' })
  @ApiResponse({
    status: 404,
    description: 'Новый пароль не подходит по валидации',
  })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    const result = await this.authService.changePassword(user, dto, res);
    return res.status(201).json(result);
  }
  @Public()
  @ApiOperation({ summary: 'Смена пароля' })
  @ApiBody({ type: RecoveryPasswordDto })
  @ApiResponse({ status: 201, description: 'Пароль поменялся' })
  @ApiResponse({ status: 404, description: 'Не удалось сменить пароль' })
  @Post('recovery')
  async recovery(@Body() dto: RecoveryPasswordDto, @Res() res: Response) {
    const result = await this.authService.recovery(
      dto.email,
      dto.resetToken,
      dto.passwordReset,
      res,
    );
    return res.status(201).json(result);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: AuthLoginDto, @Res() res: Response) {
    const result = await this.authService.login(res, dto);
    return res.status(200).json(result);
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refreshToken(req, res);
    return res.status(200).json(result);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    const result = await this.authService.logout(res);
    return res.status(200).json(result);
  }
}
