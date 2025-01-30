import { AuthClient } from "../../rpc/clients/AuthRpcClient";

export class WebRpcClientsInstance {
  public authClient: AuthClient;

  constructor() {
    this.authClient = new AuthClient();
    this.startAll();
  }

  private startAll() {
    this.authClient.connect();
  }
}