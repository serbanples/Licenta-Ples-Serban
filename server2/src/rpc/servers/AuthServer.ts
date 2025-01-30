import { IAuthRpc } from "../interfaces/IAuthRpc";
import { RpcServer } from "../rabbitMQ/impl/RpcServer";

export class AuthServer extends RpcServer implements IAuthRpc {
  constructor() {
    super();
    this.registerMethods();
  }

  private registerMethods() {
    this.registerHandler('login', this.login.bind(this)); //conf
  }

  async login(): Promise<any> {
    return {message: 'login'};
  }

  async register(): Promise<any> {
    return 'register';
  }

  async logout(): Promise<any> {
    return 'logout'
  }

  async validateToken(): Promise<any> {
    return 'token';
  }
}