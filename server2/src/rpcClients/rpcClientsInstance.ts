import { AuthClient } from "../rpc/clients/AuthRpcClient";
import { MailClient } from "../rpc/clients/MailRpcClient";

/** class used to manage all rpc clients used by servers */
export class RpcClientsInstance {
  public authClient: AuthClient;
  public mailClient: MailClient;

  constructor() {
    this.authClient = new AuthClient();
    this.mailClient = new MailClient();
    this.startAll();
  }

  /**
   * Method used to start all clients registered.
   * 
   * @returns {void} starts clients
   */
  private startAll(): void {
    this.authClient.connect();
    this.mailClient.connect();
  }
}