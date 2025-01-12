import { Module } from '@nestjs/common';
import { AuthLibModule } from './auth-lib/auth-lib.module';
import { AutzLibModule } from './autz-lib/autz-lib.module';
import { LoggerModule } from '@app/logger';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from '@app/config';

/* eslint-disable @typescript-eslint/no-extraneous-class */

/**
 * Auth module class used to manage auth microservice.
 */
@Module({
  imports: [
    AuthLibModule, 
    AutzLibModule,
    LoggerModule.forRoot('Auth Service'),
    AuthModule,
    ClientsModule.register([
      {
        name: config.rabbitMQ.mailer.serviceName,
        transport: Transport.RMQ,
        options: {
          urls: [config.rabbitMQ.url],
          queue: config.rabbitMQ.mailer.queueName,
          queueOptions: {
            durable: false,
          }
        }
      }
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
