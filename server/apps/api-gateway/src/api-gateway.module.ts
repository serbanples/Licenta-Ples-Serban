import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware, LoggerModule } from '@app/logger';
import { AuthApiModule } from './auth-api/auth-api.module';
import { AuthGuard } from './guards/auth-api.guard';

/**
 * Api gateway module class.
 */
@Module({
  imports: [
    LoggerModule.forRoot('Api Gateway'),
    AuthApiModule
  ],
  controllers: [],
  providers: [AuthGuard],
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
