import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware, LoggerModule } from '@app/logger';
import { AuthApiModule } from './auth-api/auth-api.module';
import { JwtGuard } from './guards/jwt.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersApiModule } from './users-api/users-api.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from '@app/config';

/**
 * Api gateway module class.
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
    LoggerModule.forRoot('Api Gateway'),
    AuthApiModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../', 'client/dist/client'),
      exclude: ['/api*']
    }),
    UsersApiModule,
  ],
  controllers: [],
  providers: [JwtGuard],
})
export class ApiGatewayModule implements NestModule {
  /**
   * Method used to set global middleware logger.
   * 
   * @param {MiddlewareConsumer} consumer Middleware consumer
   * @returns {void} applies Logging middleware to every route.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
