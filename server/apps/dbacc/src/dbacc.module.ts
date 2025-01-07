import { Module } from '@nestjs/common';
import { DbaccController } from './dbacc.controller';
import { DbaccService } from './dbacc.service';

@Module({
  imports: [],
  controllers: [DbaccController],
  providers: [DbaccService],
})
export class DbaccModule {}
