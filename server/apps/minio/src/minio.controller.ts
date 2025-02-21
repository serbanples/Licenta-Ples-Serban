import { Controller, Get } from '@nestjs/common';
import { MinioService } from './minio.service';

@Controller()
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get()
  getHello(): string {
    return this.minioService.getHello();
  }
}
