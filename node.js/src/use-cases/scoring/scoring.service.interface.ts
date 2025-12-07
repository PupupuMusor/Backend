import { PlusScoresDto } from '@presentation/dto/scoring.dto';

export interface IScoringService {
  calculateScores(
    login: string,
    CalculatePointsDto,
  ): Promise<{
    points: number;
    totalPoints: number;
  }>;
  plusScores(login: string, dto: PlusScoresDto);
}
