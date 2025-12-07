export interface IScoringService {
  calculateScores(
    login: string,
    CalculatePointsDto,
  ): Promise<{
    points: number;
    totalPoints: number;
  }>;
}
