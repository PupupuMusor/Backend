import { PrismaService } from '@infrastructure/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, ResponseUserDto } from '@presentation/dto/user.dto';
import { IUserService } from '@use-cases/user/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.prismaService.user.create({
      data,
    });
    return user;
  }

  async findById(id: string): Promise<ResponseUserDto> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<ResponseUserDto> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }
}
