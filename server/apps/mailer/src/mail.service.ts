import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private mailer: MailerService;

  constructor(service: MailerService) {
    this.mailer = service;
  }

  async sendVerificationEmail(to: string, verificationToken: string): Promise<void> {
    console.log(verificationToken)
    const verificationUrl = `http://localhost:3000/verify-account?token=${verificationToken}`;

    await this.mailer.sendMail({
      to,
      subject: 'Verify your account',
      template: './templates/verification',
      context: {
        verificationUrl
      }
    })
  }

}
