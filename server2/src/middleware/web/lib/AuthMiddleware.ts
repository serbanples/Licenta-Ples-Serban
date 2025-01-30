import { AuthClient } from "../../../rpc/clients/AuthRpcClient";

export class AuthMiddleware {
  private authClient: AuthClient;

  constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  public login() {
    return this.authClient.login();
  }
}