import { NestFactory } from '@nestjs/core';
import { AutzModule } from './autz.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'libs/config/src';
import { LoggerService } from '@app/logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AutzModule, {
    transport: Transport.RMQ,
    options: {
      urls: [config.rabbitMQ.url],
      queue: config.rabbitMQ.autz.queueName,
      queueOptions: {
        durable: false,
      }
    }
  });
  const logger = app.get(LoggerService);

  await app.listen();

  logger.info('Authorization Microservice Started', {
    event: 'microservice_start',
    transport: 'RabbitMQ',
    queue: config.rabbitMQ.autz.queueName,
    url: config.rabbitMQ.url,
    environment: process.env['NODE_ENV'] ?? 'development',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '1.0.0'
  });
}
bootstrap().catch((error) => {
  console.error('Failed to start Authorization Microservice', {
    event: 'microservice_start_failed',
    error: (error as Error).message,
    timestamp: new Date().toISOString(),
    service: 'AuthzService'
  });
});
