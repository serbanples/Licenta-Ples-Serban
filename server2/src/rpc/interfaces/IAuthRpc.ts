import { AuthResponse, LoginForm, RegisterForm, Token } from "../../types";

/** Interface shared by auth client and server */
export interface IAuthRpc {
  login(loginForm: LoginForm): Promise<Token>;
  logout(): Promise<any>;
  register(registerForm: RegisterForm): Promise<AuthResponse>;
  validateToken(token: Token): Promise<any>;
}