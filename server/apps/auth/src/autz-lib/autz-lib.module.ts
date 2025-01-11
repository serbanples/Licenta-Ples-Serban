import { Module } from '@nestjs/common';
import { AutzController } from './autz.controller';
import { AutzService } from './autz.service';

/* eslint-disable @typescript-eslint/no-extraneous-class */

/**
 * Autz Lib module class used to handle auhtorization part for auth microservice.
 */
@Module({
    controllers: [AutzController],
    providers: [AutzService],
})
export class AutzLibModule {}
