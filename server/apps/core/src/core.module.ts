import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/logger';
import { UsersModule } from './users/users.module';
import { ChatMetadataModule } from './chat-metadata/chats.module';
import { FileMetadataModule } from './file-metadata/file-metadata.module';

/* eslint-disable @typescript-eslint/no-extraneous-class */

/**
 * Core module class used to manage core microservice.
 */
@Module({
  imports: [
    LoggerModule.forRoot('Core Service'),
    UsersModule,
    ChatMetadataModule,
    FileMetadataModule,
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {}
