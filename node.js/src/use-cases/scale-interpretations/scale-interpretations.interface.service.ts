import {
  CreateScaleInterpretationDto,
  ResponseScaleInterpretation,
  UpdateScaleInterpretationDto,
} from '@presentation/dto/scale-interpretation.dto';

export interface IScaleInterpretationsService {
  create(
    data: CreateScaleInterpretationDto,
  ): Promise<ResponseScaleInterpretation>;
  createMany(
    data: CreateScaleInterpretationDto[],
  ): Promise<ResponseScaleInterpretation[]>;
  findByScaleId(testScaleId: string): Promise<ResponseScaleInterpretation[]>;
  findAll(): Promise<ResponseScaleInterpretation[]>;
  findByTestId(testId: string): Promise<ResponseScaleInterpretation[]>;
  update(
    id: string,
    data: Partial<CreateScaleInterpretationDto>,
  ): Promise<ResponseScaleInterpretation>;
  updateMany(
    data: UpdateScaleInterpretationDto[],
  ): Promise<ResponseScaleInterpretation[]>;
  delete(id: string): Promise<void>;
}
