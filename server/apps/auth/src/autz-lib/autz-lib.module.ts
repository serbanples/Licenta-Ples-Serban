import { Module } from '@nestjs/common';
import { AutzController } from './controller/autz.controller';
import { AutzService } from './service/autz.service';

@Module({
    controllers: [AutzController],
    providers: [AutzService],
})
export class AutzLibModule {}
