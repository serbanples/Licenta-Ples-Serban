import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { UsersController } from './users.controller';
import { UserService } from './users.service';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [UsersController],
    providers: [UserService],
})
export class UsersModule {}
