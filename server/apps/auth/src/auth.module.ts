import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/logger';
import { AuthLibModule } from './auth-lib/auth-lib.module';
import { AutzLibModule } from './autz-lib/autz-lib.module';

/* eslint-disable @typescript-eslint/no-extraneous-class */

/**
 * Auth module class used to manage auth microservice.
 */
@Module({
  imports: [
    AuthLibModule, 
    AutzLibModule,
    LoggerModule.forRoot('Auth Service'),
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AuthModule {}
