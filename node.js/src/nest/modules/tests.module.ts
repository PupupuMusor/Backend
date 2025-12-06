import { TESTS_SERVICE_SYMBOL } from '@common/constants';
import { AuthModule } from '@nest/modules/auth.module';
import { Module } from '@nestjs/common';
import { TestsController } from '@presentation/controllers/tests.controller';
import { TestsService } from '@use-cases/tests/tests.service';

@Module({
  imports: [AuthModule],
  controllers: [TestsController],
  providers: [
    {
      provide: TESTS_SERVICE_SYMBOL,
      useClass: TestsService,
    },
  ],
})
export class TestsModule {}
