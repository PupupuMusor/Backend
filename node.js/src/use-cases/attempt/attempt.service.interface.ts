import {
  AttemptAdminResultDto,
  AttemptResultDto,
} from '@presentation/dto/result-attempt.dto';
import { SubmitAttemptDto } from '@presentation/dto/submit-attempt.dto';
import {
  Attempts,
  AttemptScores,
  Questions,
  UserSelectionAnswers,
  UserSelections,
} from '@prisma/client';

export interface AttemptWithDetails extends Attempts {
  userSelections: (UserSelections & {
    answers: UserSelectionAnswers[];
    questions: Questions;
  })[];
  attemptScores: AttemptScores[];
}

export interface IAttemptService {
  submitAttempt(
    userId: string,
    dto: SubmitAttemptDto,
  ): Promise<AttemptResultDto>;
  findByTestId(
    testId: string,
    userId: string,
  ): Promise<AttemptResultDto | null>;
  findAdminByTestId(
    testId: string,
    userId: string,
  ): Promise<AttemptAdminResultDto | null>;
}
