import { WebRpcClientsInstance } from "../../rpcClients/web/webRpcClientsInstance";
import { AuthMiddleware } from "./lib/AuthMiddleware";

export class WebMiddlewareInstance {
  public authMiddleware: AuthMiddleware;

  constructor(clients: WebRpcClientsInstance) {
    this.authMiddleware = new AuthMiddleware(clients.authClient);
  }
}