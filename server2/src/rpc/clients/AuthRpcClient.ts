import { IAuthRpc } from "../interfaces/IAuthRpc";
import { RpcClient } from "../rabbitMQ/impl/RpcClient";

export class AuthClient extends RpcClient implements IAuthRpc {
  constructor() {
    super('auth_queue'); //replace from conf;
  }

  async login(): Promise<any> {
    return this.call<any>('login', []);
  }

  async logout(): Promise<any> {

  }

  async validateToken(): Promise<any> {
    
  }

  async register(): Promise<any> {
    
  }
}