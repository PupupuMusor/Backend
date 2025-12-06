import {
  SCALES_INTERPRETATIONS_SERVICE_SYMBOL,
  TEST_SCALES_SERVICE_SYMBOL,
} from '@common/constants';
import { Module } from '@nestjs/common';
import { ScaleInterpretationsController } from '@presentation/controllers/scale-interpretations.controller';
import { ScaleInterpretationsService } from '@use-cases/scale-interpretations/scale-interpretations.service';
import { TestScalesService } from '@use-cases/test-scale/test-scale.service';
import { AuthModule } from './auth.module';
import { TestScalesModule } from './test-scale.module';

@Module({
  controllers: [ScaleInterpretationsController],
  imports: [AuthModule, TestScalesModule],
  providers: [
    {
      provide: SCALES_INTERPRETATIONS_SERVICE_SYMBOL,
      useClass: ScaleInterpretationsService,
    },
    {
      provide: TEST_SCALES_SERVICE_SYMBOL,
      useClass: TestScalesService,
    },
  ],
})
export class ScaleInterpretationsModule {}
