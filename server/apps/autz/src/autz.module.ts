import { Module } from '@nestjs/common';
import { AutzController } from './autz.controller';
import { AutzService } from './autz.service';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [LoggerModule.forRoot('AutzService')],
  controllers: [AutzController],
  providers: [AutzService],
})
export class AutzModule {}
