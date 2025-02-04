import { Factory } from "../../factories/factory";
import { LoginForm, RegisterForm, Token } from "../../types";
import { AuthLib } from "../lib/AuthLib";

/** Class used by Auth Server to process auth requests. */
export class AuthCore {
  private authLib: AuthLib = Factory.getInstance().getLogic().authLib;

  constructor() {}

  /**
   * Method used to register a user.
   * 
   * @param {RegisterForm} registerForm registration form.
   * @returns {Promise<boolean>} true if user has been registered, error if not.
   */
  async register(registerForm: RegisterForm): Promise<boolean> {
    return this.authLib.register(registerForm)
      .then(() => true)
  }

  /**
   * Method used to login a user.
   * 
   * @param {LoginForm} loginForm login form.
   * @returns {Token} jwt token.
   */
  async login(loginForm: LoginForm): Promise<Token> {
    return this.authLib.login(loginForm)
  }
}