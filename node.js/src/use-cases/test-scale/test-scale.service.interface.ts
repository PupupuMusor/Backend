import { CreateScaleDto, ScaleResponseDto } from '@presentation/dto/scale.dto';

export interface ITestScalesService {
  create(data: CreateScaleDto[]): Promise<ScaleResponseDto[]>;
  findById(id: string): Promise<ScaleResponseDto>;
  findByTestId(testId: string): Promise<ScaleResponseDto[]>;
  update(id: string, data: Partial<CreateScaleDto>): Promise<ScaleResponseDto>;
  delete(id: string): Promise<void>;
}
