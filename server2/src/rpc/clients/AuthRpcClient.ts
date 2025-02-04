import { LoginForm, RegisterForm, Token } from "../../types";
import { IAuthRpc } from "../interfaces/IAuthRpc";
import { RpcClient } from "../rabbitMQ/impl/RpcClient";

/**
 * Auth client class used to communicate with auth server.
 */
export class AuthClient extends RpcClient implements IAuthRpc {
  constructor() {
    super('auth_queue'); //replace from conf;
  }

  /**
   * Mehtod used to call auth server login method.
   * 
   * @param {LoginForm} loginForm user registration form.
   * @returns {Promise<Token>} jwt token for authentication.
   */
  async login(loginForm: LoginForm): Promise<Token> {
    return this.call('login', [loginForm]);
  }

  /**
   * 
   */
  async logout(): Promise<any> {

  }

  /**
   * 
   */
  async validateToken(): Promise<any> {
    
  }

  /**
   * Mehtod used to call auth server register method.
   * 
   * @param {RegisterForm} registerForm user registration form.
   * @returns {Promise<any>} any
   */
  async register(registerForm: RegisterForm): Promise<any> {
    return this.call('register', [registerForm]);
  }
}