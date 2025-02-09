import { VerifyAccountType } from "../../types/mail";
import { IMailRpc } from "../interfaces/IMailRpc";
import { RpcClient } from "../rabbitMQ/impl/RpcClient";

export class MailClient extends RpcClient implements IMailRpc {
  constructor() {
    super('mail_queue');
  }

  mailVerifyAccount(data: VerifyAccountType): void {
    this.emit('mailVerifyAccount', [data]);
  }
}