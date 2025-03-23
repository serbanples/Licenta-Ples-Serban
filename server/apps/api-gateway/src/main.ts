import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from '@app/logger';
import { ApiGatewayModule } from './api-gateway.module';

/* eslint-disable no-console */

/**
 * Method used to start the Api server.
 * 
 * @returns {Promise<void>} starts the server
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiGatewayModule);

  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const logger = app.get(LoggerService);

  await app.listen(3000);

  logger.info('Api server started', {
    event: 'server_started',
    host: 'localhost',
    port: 3000,
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '1.0.0'
  });
}
bootstrap().catch((error) => {
  console.error('Failed to start Api server', {
    event: 'server_start_failed',
    error: (error as Error).message,
    timestamp: new Date().toISOString(),
    service: 'Api Gateway'
  });
});;
