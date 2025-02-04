import { AuthClient } from "../../../rpc/clients/AuthRpcClient";
import { LoginForm, RegisterForm, Token } from "../../../types";

/** Auth middleware class used to type and format some data. */
export class AuthMiddleware {
  private authClient: AuthClient;

  constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  /**
   * Method used to format login data.
   * Because of 'class validator' lib we already validated this using express middleware func
   * 
   * @param {LoginForm} loginForm user login form.
   * @returns {Promise<Token>} jwt token for user.
   */
  public login(loginForm: LoginForm): Promise<Token> {
    return this.authClient.login(loginForm);
  }

  /**
   * Method used to format register data.
   * Because of 'class validator' lib we already validated this using express middleware func
   * 
   * @param {RegisterForm} registerForm user register form.
   * @returns {Promise<any>} any
   */
  public register(registerForm: RegisterForm): Promise<any> {
    return this.authClient.register(registerForm);
  }
}