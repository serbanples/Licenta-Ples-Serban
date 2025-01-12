import { Controller, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MailService } from './mail.service';
import { LoggingInterceptor } from '@app/logger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { config } from '@app/config';
import { VerificationEmailDto } from 'libs/shared/src/dtos/mail.dto';

@UsePipes(ValidationPipe)
@UseInterceptors(LoggingInterceptor)
@Controller()
export class MailController {
  private readonly mailService: MailService;

  constructor(mail: MailService) {
    this.mailService = mail;
  }

  @MessagePattern(config.rabbitMQ.mailer.messages.verifyAccount)
  verifyAccount(@Payload() emailData: VerificationEmailDto): Promise<void> {
    return this.mailService.sendVerificationEmail(emailData.to, emailData.verificationToken);
  }
}
