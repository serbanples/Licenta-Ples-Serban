import { WebRpcClientsInstance } from "../../rpcClients/web/webRpcClientsInstance";
import { AuthMiddleware } from "./lib/AuthMiddleware";

/** Class used to manage all web api server middlewares */
export class WebMiddlewareInstance {
  public authMiddleware: AuthMiddleware;
  private clients: WebRpcClientsInstance = new WebRpcClientsInstance();

  constructor() {
    this.authMiddleware = new AuthMiddleware(this.clients.authClient);
  }
}