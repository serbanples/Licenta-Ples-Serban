import { AuthClient } from "../../rpc/clients/AuthRpcClient";

/** class used to manage all rpc clients used by web api server */
export class WebRpcClientsInstance {
  public authClient: AuthClient;

  constructor() {
    this.authClient = new AuthClient();
    this.startAll();
  }

  /**
   * Method used to start all clients registered.
   * 
   * @returns {void} starts clients
   */
  private startAll(): void {
    this.authClient.connect();
  }
}