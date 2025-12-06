import { CreateTestDto, ResponseTestDto } from '@presentation/dto/tests.dto';

export interface ITestsService {
  create(data: CreateTestDto): Promise<ResponseTestDto>;
  update(id: string, data: Partial<CreateTestDto>): Promise<any>;
  findAll(userId: string): Promise<ResponseTestDto[]>;
  findByIdWithScales(id: string);
  findById(id: string): Promise<any>;
  delete(id: string): Promise<void>;
}
