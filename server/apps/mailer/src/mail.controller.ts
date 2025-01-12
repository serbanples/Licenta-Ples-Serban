import { Controller, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MailService } from './mail.service';
import { LoggingInterceptor } from '@app/logger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { config } from '@app/config';
import { VerificationEmailDto } from 'libs/shared/src/dtos/mail.dto';

/**
 * Mail Controller class used to process mail related messages sent by other microservices.
 */
@UsePipes(ValidationPipe)
@UseInterceptors(LoggingInterceptor)
@Controller()
export class MailController {
  private readonly mailService: MailService;

  /**
   * Constructor method.
   * 
   * @param {MailService} mail mail service instance.
   */
  constructor(mail: MailService) {
    this.mailService = mail;
  }

  /**
   * Method used to process verify account messages.
   * 
   * @param {VerificationEmailDto} emailData email data containing the user email and verifiaction token.
   * @returns {Promise<void>} sends a message, doesnt return.
   */
  @MessagePattern(config.rabbitMQ.mailer.messages.verifyAccount)
  verifyAccount(@Payload() emailData: VerificationEmailDto): Promise<void> {
    return this.mailService.sendVerificationEmail(emailData.to, emailData.verificationToken);
  }
}
