import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from '@app/config';
import { LoggerService } from '@app/logger';

/* eslint-disable no-console */

/** Start method for Authorization Microservice */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [config.rabbitMQ.url],
      queue: config.rabbitMQ.auth.queueName,
      queueOptions: {
        durable: false,
      }
    }
  });
  const logger = app.get(LoggerService);

  await app.listen();

  logger.info('Authentication Microservice Started', {
    event: 'microservice_start',
    transport: 'RabbitMQ',
    queue: config.rabbitMQ.auth.queueName,
    url: config.rabbitMQ.url,
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '1.0.0'
  });
}
bootstrap().catch((error) => {
  console.error('Failed to start Authentication Microservice', {
    event: 'microservice_start_failed',
    error: (error as Error).message,
    timestamp: new Date().toISOString(),
    service: 'AuthService'
  });
});
