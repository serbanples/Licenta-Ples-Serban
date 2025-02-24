import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { DatabaseModule } from '@app/database';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [UsersController],
    providers: [UserService],
})
export class UsersModule {}
