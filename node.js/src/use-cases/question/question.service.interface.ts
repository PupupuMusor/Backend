import {
  CreateQuestionWithAnswersDto,
  ResponseQuestionDto,
  UpdateQuestionWithAnswersDto,
} from '@presentation/dto/question.dto';

export interface IQuestionsService {
  createWithAnswers(
    testId: string,
    questionsDto: CreateQuestionWithAnswersDto[],
  ): Promise<ResponseQuestionDto[]>;
  update(
    questionsDto: UpdateQuestionWithAnswersDto[],
  ): Promise<ResponseQuestionDto[]>;
  findByTest(testId: string): Promise<ResponseQuestionDto[]>;
  findById(id: string): Promise<ResponseQuestionDto>;
  delete(id: string): Promise<void>;
}
