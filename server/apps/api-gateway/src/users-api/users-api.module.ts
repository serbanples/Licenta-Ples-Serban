import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from '@app/config';
import { UsersApiControler } from './users-api.controller';
import { UsersApiService } from './users-api.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: config.rabbitMQ.core.serviceName,
        transport: Transport.RMQ,
        options: {
          urls: [config.rabbitMQ.url],
          queue: config.rabbitMQ.core.queueName,
          queueOptions: {
            durable: false,
          }
        }
      },
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
  controllers: [UsersApiControler],
  providers: [UsersApiService],
})
export class UsersApiModule { }
