import { setCode, verifyCode } from '@common/store/code';
import { PrismaService } from '@infrastructure/db/prisma.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthLoginDto,
  AuthRegisterDto,
  ChangePasswordDto,
} from '@presentation/dto/auth.dto';
import { User } from '@prisma/client';
import { IAuthService } from '@use-cases/auth/auth.interface';
import { ITokensService } from '@use-cases/tokens/tokens.service.interface';
import { IUserService } from '@use-cases/user/user.service.interface';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService implements IAuthService {
  private readonly COOKIE_DOMAIN: string;
  private readonly UPLOADED_FILES_DESTINATION: string;

  constructor(
    @Inject('userService')
    private readonly userService: IUserService,
    @Inject('tokensService')
    private readonly tokensService: ITokensService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
  }
  async login(
    res: Response,
    dto: AuthLoginDto,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByLogin(dto.login);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValidPassword = bcrypt.compareSync(dto.password, user.password);

    if (!isValidPassword) {
      throw new NotFoundException('неправильный пароль');
    }

    return this.auth(res, user.id);
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('refresh_token не существует');
    }

    try {
      const tokens = await this.tokensService.refreshTokens(refreshToken);
      const userId = tokens.id;
      return this.auth(res, userId);
    } catch (error) {
      throw new UnauthorizedException(
        `Невалидный refresh_token: ${error.message}`,
      );
    }
  }

  async logout(res: Response) {
    await this.setCookie(res, '', new Date(0));
  }

  async register(dto: AuthRegisterDto): Promise<User> {
    const checkUser = await this.userService.findByEmailLogin(
      dto.email,
      dto.login,
    );
    if (checkUser) throw new BadRequestException('почта или логин уже заняты');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const { approval: _approval, ...createData } = dto;
    const user = await this.userService.create({
      ...createData,
      password: hashedPassword,
    });
    return user;
  }

  async recovery(
    email: string,
    resetToken: string,
    passwordReset: string,
    res: Response,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('Пользователя не существует');

    const valid = await verifyCode(
      user.id,
      'password_reset_confirmed',
      email,
      resetToken,
    );

    if (!valid)
      throw new BadRequestException('Недействительный или просроченный токен');

    const hashedPassword = await bcrypt.hash(passwordReset, 10);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return this.auth(res, user.id);
  }

  async changePassword(user: User, data: ChangePasswordDto, res: Response) {
    const isValidPassword = bcrypt.compareSync(
      data.currentPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new NotFoundException('неправильный пароль');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return this.auth(res, user.id);
  }

  async confirmReset(
    email: string,
    code: string,
  ): Promise<{ resetTokenRaw: string }> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Пользователя не существует');
    }
    const entry = await verifyCode(user.id, 'password_reset', email, code);

    if (!entry) {
      throw new BadRequestException('Неверный или просроченный код');
    }

    const resetTokenRaw = Math.random().toString(36).substring(2, 15);

    await setCode(
      user.id,
      'password_reset_confirmed',
      email,
      resetTokenRaw,
      15 * 60 * 1000,
    );

    return { resetTokenRaw: resetTokenRaw };
  }

  async auth(res: Response, id: string) {
    const { access_token, refresh_token } =
      this.tokensService.generateTokens(id);
    await this.setCookie(
      res,
      refresh_token,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    );

    return { access_token };
  }

  private async setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: true,
      sameSite: 'strict',
    });
  }
}
