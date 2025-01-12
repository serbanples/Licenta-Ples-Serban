import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [
    LoggerModule.forRoot('Mailer Service')
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
