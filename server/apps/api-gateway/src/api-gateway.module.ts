import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerMiddleware, LoggerModule } from '@app/logger';
import { config } from '@app/config';
import { AuthApiModule } from './auth-api/auth-api.module';
import { JwtGuard } from './guards/jwt.guard';
import { UsersApiModule } from './users-api/users-api.module';

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
      rootPath: join(__dirname, '../../../../', 'client-react/dist'),
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
