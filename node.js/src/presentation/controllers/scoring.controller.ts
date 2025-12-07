import { SCORING_SERVICE_SYMBOL } from '@common/constants';
import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CalculatePointsDto } from '@presentation/dto/scoring.dto';
import { IScoringService } from '@use-cases/scoring/scoring.service.interface';

@Controller('scoring')
export class ScoringController {
  constructor(
    @Inject(SCORING_SERVICE_SYMBOL)
    private readonly scoringService: IScoringService,
  ) {}

  @Post(':login/calculate')
  @ApiOperation({ summary: 'Рассчитать и добавить баллы пользователю' })
  @ApiParam({ name: 'userId', description: 'UUID пользователя', type: String })
  @ApiBody({ type: CalculatePointsDto })
  async calculatePoints(
    @Param('login') login: string,
    @Body() dto: CalculatePointsDto,
  ) {
    return this.scoringService.calculateScores(login, dto);
  }
}
