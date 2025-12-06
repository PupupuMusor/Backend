import { AuthLoginDto, ChangePasswordDto } from '@presentation/dto/auth.dto';
import { CreateUserDto } from '@presentation/dto/user.dto';
import { User } from '@prisma/client';
import { Request, Response } from 'express';

export interface IAuthService {
  register(dto: CreateUserDto): Promise<User>;
  login(res: Response, dto: AuthLoginDto): Promise<{ access_token: string }>;
  refreshToken(
    req: Request,
    res: Response,
  ): Promise<{
    access_token: string;
  }>;
  confirmReset(email: string, code: string): Promise<{ resetTokenRaw: string }>;
  recovery(
    email: string,
    resetToken: string,
    passwordReset: string,
    res: Response,
  ): Promise<{ access_token: string }>;
  auth(res: Response, id: string): Promise<{ access_token: string }>;
  logout(res: Response): Promise<void>;
  changePassword(
    user: User,
    data: ChangePasswordDto,
    res: Response,
  ): Promise<{ access_token: string }>;
}
