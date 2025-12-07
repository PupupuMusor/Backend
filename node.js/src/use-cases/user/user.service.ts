import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, ResponseUserDto } from '@presentation/dto/user.dto';
import { User } from '@prisma/client';
import { IUserService } from '@use-cases/user/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data,
    });
    return user;
  }

  async createOffice() {
    return await this.prismaService.office.create({});
  }

  async findById(id: string): Promise<ResponseUserDto> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<ResponseUserDto> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async findByLogin(login: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { login } });
  }

  async findByLoginFront(login: string): Promise<ResponseUserDto> {
    return await this.prismaService.user.findUnique({ where: { login } });
  }

  async findByEmailLogin(email: string, login: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ login: login }, { email: email }],
      },
    });
    return user;
  }

  async findAll(): Promise<ResponseUserDto[]> {
    return await this.prismaService.user.findMany({});
  }
}
