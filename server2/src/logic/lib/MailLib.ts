import { config } from "../../config";
import { VerifyAccountType } from "../../types/mail";
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars'

/**
 * Mail Lib class used to handle mail sending logic.
 */
export class MailLib {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port
    }, {
      from: '"No Reply" <noreply@classcloud.com>'
    })
  }

  /**
   * Method used to send verification emails on account creation.
   * 
   * @param {VerifyAccountType} mailData mail recipient and validation token
   * @returns {void} sends an email.
   */
  sendVerifyAccountMail(mailData: VerifyAccountType): void {
    const { to, verificationToken } = mailData;

    // Verification link
    const verificationUrl = `http://localhost:3000/verify-account?verificationToken=${verificationToken}`;

    // Email template
    const html = `
      <h1>Welcome to Our Platform!</h1>
      <p>To verify your account, click on the link below:</p>
      <a href="{{verificationUrl}}">Verify Account</a>
    `;

    // Compile the template with Handlebars
    const template = handlebars.compile(html);
    const replacements = { verificationUrl };
    const compiledHtml = template(replacements);

    // Send email
    this.transporter.sendMail({
      from: '"Auth" <auth@classcloud.com>',
      to,
      subject: 'Verify your account',
      html: compiledHtml,
    });
  }
}