import { VerifyAccountType } from "../../types/mail";

/** Interface shared by mail client and server */
export interface IMailRpc {
  mailVerifyAccount(data: VerifyAccountType): void;
}