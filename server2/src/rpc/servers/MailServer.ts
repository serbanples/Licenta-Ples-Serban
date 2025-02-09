import { MailCore } from "../../logic/core/MailCore";
import { VerifyAccountType } from "../../types/mail";
import { IMailRpc } from "../interfaces/IMailRpc";
import { validateRPC } from "../middlewares/validateRequest";
import { RpcServer } from "../rabbitMQ/impl/RpcServer";

export class MailServer extends RpcServer implements IMailRpc {
  private mailCore: MailCore;

  constructor() {
    super();
    this.mailCore = new MailCore();
    this.registerMethods();
  }

  /**
   * Method used to register handler methods for different message types.
   */
  private registerMethods() {
    this.registerHandler('mailVerifyAccount', this.mailVerifyAccount.bind(this)); //conf
  }

  /**
   * Method used for sending verify account mails.
   */
  mailVerifyAccount(data: VerifyAccountType): void {
    validateRPC(VerifyAccountType, data)
      .then((validatedRequest) => this.mailCore.sendVerifyAccountMail(validatedRequest))
      .catch((error) => console.log(error)); // silently handle errors.
  }
}