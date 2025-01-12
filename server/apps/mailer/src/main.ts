import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from '@app/config';
import { LoggerService } from '@app/logger';

/* eslint-disable no-console */

/** Start method for Authorization Microservice */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MailModule, {
    transport: Transport.RMQ,
    options: {
      urls: [config.rabbitMQ.url],
      queue: config.rabbitMQ.mailer.queueName,
      queueOptions: {
        durable: false,
      }
    }
  });

  const logger = app.get(LoggerService);

  await app.listen();

  logger.info('Mailing Microservice Started', {
    event: 'microservice_start',
    transport: 'RabbitMQ',
    queue: config.rabbitMQ.mailer.queueName,
    url: config.rabbitMQ.url,
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '1.0.0'
  });
}
bootstrap().catch((error) => {
  console.error('Failed to start Mailing Microservice', {
    event: 'microservice_start_failed',
    error: (error as Error).message,
    timestamp: new Date().toISOString(),
    service: 'AuthService'
  });
});
