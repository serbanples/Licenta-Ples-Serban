import { Module } from '@nestjs/common';
import { AuthController } from './authlib.controller';
import { AuthService } from './authlib.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '@app/config';
import { AccountSchema, AccountType } from './model/account.schema';
import { AccountModel } from './model/account.model';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    MongooseModule.forRoot(config.mongodb.auth_db_uri),
    MongooseModule.forFeature([{ name: AccountType.name, schema: AccountSchema }]),
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
  controllers: [AuthController],
  providers: [AuthService, AccountModel],
})
export class AuthLibModule {}
