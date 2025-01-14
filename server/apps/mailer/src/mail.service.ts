import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';

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
    const verificationUrl = `http://localhost:3000/verify-account?verificationToken=${verificationToken}`;
    const html = '<h1>Welcome to Our Platform!</h1><p>To verify your account, click on the link below:</p><a href="{{verificationUrl}}">Verify Account</a>';

    const template = handlebars.compile(html);
    const replacements = {
      verificationUrl,
    }

    await this.mailer.sendMail({
      from: '"Auth" <auth@classcloud.com>',
      to,
      subject: 'Verify your account',
      html: template(replacements),
    })
  }

  /**
   * Method used to send verification emails on account creation.
   * 
   * @param {string} to mail recipient
   * @param {string} resetToken verification token for the user.
   * @returns {Promise<void>} sends an email.
   */
  async sendResetPasswordEmail(to: string, resetToken: string): Promise<void> {
    const resetPasswordUrl = `http://localhost:3000/reset-password?resetToken=${resetToken}`;
    const html = '<p>To reset your password, click on the link below:</p><a href="{{resetPasswordUrl}}">Reset Password</a>';

    const template = handlebars.compile(html);
    const replacements = {
      resetPasswordUrl,
    }

    await this.mailer.sendMail({
      from: '"Auth" <auth@classcloud.com>',
      to,
      subject: 'Reset your password',
      html: template(replacements),
    })
  }

}
