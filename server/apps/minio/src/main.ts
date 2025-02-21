import { NestFactory } from '@nestjs/core';
import { MinioModule } from './minio.module';

async function bootstrap() {
  const app = await NestFactory.create(MinioModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
