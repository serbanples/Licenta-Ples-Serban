import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from '@app/config';
import { LoggerService } from '@app/logger';
import { CoreModule } from './core.module';

/* eslint-disable no-console */

/** Start method for Core Microservice */
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CoreModule, {
    transport: Transport.RMQ,
    options: {
      urls: [config.rabbitMQ.url],
      queue: config.rabbitMQ.core.queueName,
      queueOptions: {
        durable: false,
      }
    }
  });
  const logger = app.get(LoggerService);

  await app.listen();

  logger.info('Core Microservice Started', {
    event: 'microservice_start',
    transport: 'RabbitMQ',
    queue: config.rabbitMQ.core.queueName,
    url: config.rabbitMQ.url,
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '1.0.0'
  });
}
bootstrap().catch((error) => {
  console.error('Failed to start Core Microservice', {
    event: 'microservice_start_failed',
    error: (error as Error).message,
    timestamp: new Date().toISOString(),
    service: 'CoreService'
  });
});
