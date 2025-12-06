import { CreateUserDto, ResponseUserDto } from '@presentation/dto/user.dto';

export interface IUserService {
  create(data: CreateUserDto): Promise<ResponseUserDto>;
  findById(id: string): Promise<ResponseUserDto>;
  findByEmail(email: string): Promise<ResponseUserDto>;
}
