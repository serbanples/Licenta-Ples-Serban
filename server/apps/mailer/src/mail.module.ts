import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { LoggerModule } from '@app/logger';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from '@app/config';

/* eslint-disable @typescript-eslint/no-extraneous-class */

/** Mail Module class used to register needed dependencies */
@Module({
  imports: [
    LoggerModule.forRoot('Mailer Service'),
    MailerModule.forRoot({
      transport: {
        host: config.smtp.host,
        port: config.smtp.port,
        auth: undefined
      },
      defaults: {
        from: '"No Reply" <noreply@classcloud.com>'
      }
    })
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
