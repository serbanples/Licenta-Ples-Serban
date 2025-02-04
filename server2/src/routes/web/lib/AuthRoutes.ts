import { Request, Response, Router } from "express";
import { AuthMiddleware } from "../../../middleware/web/lib/AuthMiddleware";
import { validateRequest } from "../../../expressMW";
import { LoginForm, RegisterForm } from "../../../types";

/** Class used to manage all authentication routes. */
export class AuthRoutes {
  private middleware: AuthMiddleware;
  private router: Router = Router();

  constructor(mw: AuthMiddleware) {
    this.middleware = mw;
    this.initializeRoutes();
  }

  /**
   * Getter method for Router
   * 
   * @returns {Router} auth routes.
   */
  getRouter(): Router {
    return this.router;
  }

  /**
   * Method used to initiailize the auth routes
   * 
   * @returns {void} creates the auth routes
   */
  private initializeRoutes(): void {
    this.router.post('/login', validateRequest(LoginForm), this.login.bind(this));
    this.router.post('/register', validateRequest(RegisterForm), this.register.bind(this));
    // this.router.get('/whoami', this.whoami.bind(this));
    // this.router.post('/logout', this.logout.bind(this));
  }

  /**
   * Method used to bind to login route
   * 
   * @param {Request} req http request.
   * @param {Response} res response to send back to user.
   */
  private async login(req: Request, res: Response) {
    // req body is already validated from express middleware function so we can cast it to needed type.
    const data = await this.middleware.login(req.body);
    res.send(data);
  }

  /**
   * Method used to bind to register route
   * 
   * @param {Request} req http request.
   * @param {Response} res response to send back to user.
   */
  private async register(req: Request, res: Response) {
    // req body is already validated from express middleware function so we can cast it to needed type.
    const data = await this.middleware.register(req.body);
    res.send(data);
  }
}