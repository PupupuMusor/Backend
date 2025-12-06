import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserSelectionDto {
  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty({ type: () => [UserAnswerDto] })
  answers: UserAnswerDto[];

  @ApiProperty()
  calculatedScores: Record<string, number>;

  @ApiProperty()
  interpretations: Record<string, string>;
}

export class UserAnswerDto {
  @ApiProperty({ required: false })
  @IsUUID()
  answerId?: string;

  @ApiProperty({ required: false })
  supplyText?: string;
}

export class ScaleScoreDto {
  @ApiProperty()
  scaleId: string;

  @ApiProperty()
  scaleName: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  interpretation: string;
}

export class AttemptResultDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  testId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ type: () => [ScaleScoreDto] })
  scaleScores: ScaleScoreDto[];

  @ApiProperty()
  interpretations?: Record<string, string>;
}

export class AttemptAdminResultDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  testId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ type: () => [UserSelectionDto] })
  userSelections: UserSelectionDto[];

  @ApiProperty()
  interpretations?: Record<string, string>;
}
