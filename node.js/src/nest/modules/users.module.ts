import { USER_SERVICE_SYMBOL } from '@common/constants';
import { Module } from '@nestjs/common';
import { UsersController } from '@presentation/controllers';
import { UserService } from '@use-cases/user/user.service';

@Module({
  controllers: [UsersController],
  imports: [],
  providers: [
    {
      provide: USER_SERVICE_SYMBOL,
      useClass: UserService,
    },
  ],
})
export class UsersModule {}
