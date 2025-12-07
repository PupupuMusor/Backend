import {
  CreateOfficeDto,
  CreateUserDto,
  ResponseUserDto,
} from '@presentation/dto/user.dto';
import { User } from '@prisma/client';

export interface IUserService {
  create(data: CreateUserDto): Promise<User>;
  createOffice(createOfficeDto: CreateOfficeDto);
  findById(id: string): Promise<ResponseUserDto>;
  findByEmail(email: string): Promise<ResponseUserDto>;
  findByLogin(login: string): Promise<User>;
  findByEmailLogin(email: string, login: string): Promise<User>;
  findByLoginFront(login: string): Promise<ResponseUserDto>;
  findAll(): Promise<ResponseUserDto[]>;
}
