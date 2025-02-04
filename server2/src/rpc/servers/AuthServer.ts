import { Factory } from "../../factories/factory";
import { AuthCore } from "../../logic/core/AuthCore";
import { LoginForm, RegisterForm, Token } from "../../types";
import { IAuthRpc } from "../interfaces/IAuthRpc";
import { RpcServer } from "../rabbitMQ/impl/RpcServer";

/** Auth Server class used for listening to rabbit mq and processing data */
export class AuthServer extends RpcServer implements IAuthRpc {
  private authCore: AuthCore;

  constructor() {
    super();
    this.authCore = new AuthCore;
    this.registerMethods();
  }

  /**
   * Method used to register handler methods for different message types.
   */
  private registerMethods() {
    this.registerHandler('login', this.login.bind(this)); //conf
    this.registerHandler('register', this.register.bind(this));
  }

  /**
   * Method used for handling login messages.
   * 
   * @param {LoginForm} loginForm login user form.
   * @returns {Token} jwt token
   */
  async login(loginForm: LoginForm): Promise<Token> {
    return this.authCore.login(loginForm);
  }

  /**
   * Method used for handling register messages.
   * 
   * @param {RegisterForm} registerForm register user form.
   * @returns {boolean} success for registration.
   */
  async register(registerForm: RegisterForm): Promise<boolean> {
    return this.authCore.register(registerForm);
  }

  /**
   * Method used for handling logout messages.
   * 
   * @returns {any} any
   */
  async logout(): Promise<any> {
    return 'logout'
  }

  /**
   * Method used for handling verify token messages.
   * 
   * @param {Token} token jwt token.
   * @returns {any} any
   */
  async validateToken(token: Token): Promise<any> {
    return 'token';
  }
}