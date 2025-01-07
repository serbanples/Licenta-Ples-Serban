import { Controller, Get } from '@nestjs/common';
import { DbaccService } from './dbacc.service';

@Controller()
export class DbaccController {
  constructor(private readonly dbaccService: DbaccService) {}

  @Get()
  getHello(): string {
    return this.dbaccService.getHello();
  }
}
