import { Injectable } from '@nestjs/common';

@Injectable()
export class DbaccService {
  getHello(): string {
    return 'Hello World!';
  }
}
