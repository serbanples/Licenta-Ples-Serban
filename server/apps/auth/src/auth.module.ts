import { Module } from '@nestjs/common';
import { AuthLibModule } from './auth-lib/auth-lib.module';
import { AutzLibModule } from './autz-lib/autz-lib.module';
import { LoggerModule } from '@app/logger';
@Module({
  imports: [
    AuthLibModule, 
    AutzLibModule,
    LoggerModule.forRoot('Auth Service'),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
