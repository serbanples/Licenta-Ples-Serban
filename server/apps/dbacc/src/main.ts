import { NestFactory } from '@nestjs/core';
import { DbaccModule } from './dbacc.module';

async function bootstrap() {
  const app = await NestFactory.create(DbaccModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
