import _ from "lodash";
import { WebRoutesInstance } from "../routes";
import { WebMiddlewareInstance } from "../middleware";
import { WebRpcClientsInstance } from "../rpcClients";

export class FactoryApiWeb {
  private static instance: FactoryApiWeb;
  private static routes: WebRoutesInstance;
  private static middleware: WebMiddlewareInstance;
  private static rpcClients: WebRpcClientsInstance;

  private constructor() {
    FactoryApiWeb.rpcClients = new WebRpcClientsInstance();
    FactoryApiWeb.middleware = new WebMiddlewareInstance(FactoryApiWeb.rpcClients);
    FactoryApiWeb.routes = new WebRoutesInstance(FactoryApiWeb.middleware);
  }

  static getInstance() {
    if(_.isNil(this.instance)) {
      this.instance = new FactoryApiWeb();
    }
    return this.instance;
  }

  getRoutes(): WebRoutesInstance {
    return FactoryApiWeb.routes;
  }
}