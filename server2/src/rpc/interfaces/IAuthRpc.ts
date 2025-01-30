export interface IAuthRpc {
  login(): Promise<any>;
  logout(): Promise<any>;
  register(): Promise<any>;
  validateToken(): Promise<any>;
}