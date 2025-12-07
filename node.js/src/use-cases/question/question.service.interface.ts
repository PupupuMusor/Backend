import { ResponseQuestionDto } from '@presentation/dto/question.dto';

export interface IQuestionsService {
  findAll(): Promise<ResponseQuestionDto[]>;
  findFive(): Promise<ResponseQuestionDto[]>;
}
