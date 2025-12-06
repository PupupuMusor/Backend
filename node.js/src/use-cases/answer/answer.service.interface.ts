import {
  AnswerResponseDto,
  CreateAnswerDto,
} from '@presentation/dto/answer.dto';

export interface IAnswerService {
  createOne(
    questionId: string,
    data: CreateAnswerDto,
  ): Promise<AnswerResponseDto>;
  update(
    id: string,
    data: Partial<CreateAnswerDto>,
  ): Promise<AnswerResponseDto>;
  findByQuestion(questionId: string): Promise<AnswerResponseDto[]>;
  findById(id: string): Promise<AnswerResponseDto>;
  delete(id: string): Promise<void>;
}
