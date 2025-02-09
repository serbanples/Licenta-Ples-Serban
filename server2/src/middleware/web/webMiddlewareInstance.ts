import { RpcClientsInstance } from "../../rpcClients/rpcClientsInstance";
import { AuthMiddleware } from "./lib/AuthMiddleware";

/** Class used to manage all web api server middlewares */
export class WebMiddlewareInstance {
  public authMiddleware: AuthMiddleware;
  private clients: RpcClientsInstance = new RpcClientsInstance();

  constructor() {
    this.authMiddleware = new AuthMiddleware(this.clients.authClient);
  }
}