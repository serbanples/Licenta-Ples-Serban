import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    LoggerModule.forRoot('Minio Service')
  ],
  controllers: [],
  providers: [],
})
export class MinioModule {}
