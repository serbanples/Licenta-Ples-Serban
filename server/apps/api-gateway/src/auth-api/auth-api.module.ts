import { Module } from '@nestjs/common';
import { AuthApiController } from './auth-api.controller';
import { AuthApiService } from './auth-api.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from '@app/config';

/* eslint-disable @typescript-eslint/no-extraneous-class */

/**
 * Auth api module class.
 */
@Module({
  imports: [
    ClientsModule.register([
      {
        name: config.rabbitMQ.auth.serviceName,
        transport: Transport.RMQ,
        options: {
          urls: [config.rabbitMQ.url],
          queue: config.rabbitMQ.auth.queueName,
          queueOptions: {
            durable: false,
          }
        }
      }
    ]),
  ],
  controllers: [AuthApiController],
  providers: [AuthApiService],
  exports: [AuthApiService]
})
export class AuthApiModule {}
