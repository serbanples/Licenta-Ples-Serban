import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '@app/database';
import { config } from '@app/config';
import { AuthController } from './authlib.controller';
import { AuthService } from './authlib.service';

/* eslint-disable @typescript-eslint/no-extraneous-class */

/**
 * Auth lib module class used to handle authentication part for authentication microservice.
 */
@Module({
  imports: [
    JwtModule.register({
      secret: 'super secret key',
      signOptions: { expiresIn: '24h'},
    }),
    DatabaseModule,
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
      },
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
      }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthLibModule {}
