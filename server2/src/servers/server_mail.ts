import { MailServer } from "../rpc/servers/MailServer";
import { IServer } from "./server_iface";

/** Class used for configuring and starting Mailer Server */
export class Server implements IServer {
  private mailServer: MailServer = new MailServer();

  constructor() {
    this.start();
  }

  /**
   * Method used to start the mail server
   * 
   * @returns {void} starts the server
   */
  start(): void {
    this.mailServer.start('mail_queue');
  }
}