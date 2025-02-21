import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';
import { config } from '@app/config';

export const createAuthClient = (): ClientProxy => {
  return ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [config.rabbitMQ.url],
      queue: config.rabbitMQ.auth.queueName,
      queueOptions: { durable: false },
    },
  });
};