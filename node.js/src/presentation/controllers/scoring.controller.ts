import { SCORING_SERVICE_SYMBOL } from '@common/constants';
import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  CalculatePointsDto,
  PlusScoresDto,
} from '@presentation/dto/scoring.dto';
import { IScoringService } from '@use-cases/scoring/scoring.service.interface';

@Controller('scoring')
export class ScoringController {
  constructor(
    @Inject(SCORING_SERVICE_SYMBOL)
    private readonly scoringService: IScoringService,
  ) {}

  @Post(':login/calculate')
  @ApiOperation({ summary: 'Рассчитать и добавить баллы пользователю' })
  @ApiParam({ name: 'login', description: 'Логин пользователя', type: String })
  @ApiBody({ type: CalculatePointsDto })
  async calculatePoints(
    @Param('login') login: string,
    @Body() dto: CalculatePointsDto,
  ) {
    return this.scoringService.calculateScores(login, dto);
  }

  @Post(':login/score')
  @ApiOperation({ summary: 'Добавить баллы пользователю' })
  @ApiParam({ name: 'login', description: 'Логин пользователя', type: String })
  @ApiBody({ type: PlusScoresDto })
  async plusScores(@Param('login') login: string, @Body() dto: PlusScoresDto) {
    return this.scoringService.plusScores(login, dto);
  }
}
