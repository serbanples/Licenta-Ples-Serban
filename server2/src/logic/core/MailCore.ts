import { Factory } from "../../factories/factory";
import { VerifyAccountType } from "../../types/mail";
import { MailLib } from "../lib/MailLib";

/** Class used by Mail Server to process mailer requests. */
export class MailCore {
  private mailLib: MailLib = Factory.getInstance().getLogic().mailLib;

  constructor() {}

  /**
   * Method used to send Verify Account Emails
   * 
   * @param {VerifyAccountType} mailData object containing user email and verification token.
   * @returns {void} sends mail.
   */
  sendVerifyAccountMail(mailData: VerifyAccountType): void {
    this.mailLib.sendVerifyAccountMail(mailData);
  }

}