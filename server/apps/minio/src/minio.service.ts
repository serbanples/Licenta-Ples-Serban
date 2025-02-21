import { Injectable } from '@nestjs/common';

@Injectable()
export class MinioService {
  getHello(): string {
    return 'Hello World!';
  }
}
