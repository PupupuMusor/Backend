import { TEST_SCALES_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { TestScalesController } from '@presentation/controllers/test-scales.controller';
import { TestScalesService } from '@use-cases/test-scale/test-scale.service';
import { AuthModule } from './auth.module';

@Module({
  controllers: [TestScalesController],
  imports: [AuthModule],
  providers: [
    {
      provide: TEST_SCALES_SERVICE_SYMBOL,
      useClass: TestScalesService,
    },
  ],
})
export class TestScalesModule {}
