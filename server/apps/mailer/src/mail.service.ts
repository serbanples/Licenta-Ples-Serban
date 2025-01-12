import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

/**
 * Mail Service class used to send emails.
 */
@Injectable()
export class MailService {
  private mailer: MailerService;

  /**
   * Constructor method.
   * 
   * @param {MailerService} service mailer service for sending mails.
   */
  constructor(service: MailerService) {
    this.mailer = service;
  }

  /**
   * Method used to send verification emails on account creation.
   * 
   * @param {string} to mail recipient
   * @param {string} verificationToken verification token for the user.
   * @returns {Promise<void>} sends an email.
   */
  async sendVerificationEmail(to: string, verificationToken: string): Promise<void> {
    const verificationUrl = `http://localhost:3000/verify-account?token=${verificationToken}`;

    await this.mailer.sendMail({
      from: 'auth@classcloud.com',
      to,
      subject: 'Verify your account',
      template: './templates/verification',
      context: {
        verificationUrl
      }
    })
  }

}
