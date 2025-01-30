import { Request, Response, Router } from "express";
import { AuthMiddleware } from "../../../middleware/web/lib/AuthMiddleware";

export class AuthRoutes {
  private middleware: AuthMiddleware;
  private router: Router = Router();

  constructor(mw: AuthMiddleware) {
    this.middleware = mw;
    this.initializeRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  /**
   * Method used to initiailize the auth routes
   * 
   * @returns {void} creates the auth routes
   */
  private initializeRoutes(): void {
    this.router.post('/login', this.login.bind(this));
    // this.router.post('/register', this.register.bind(this));
    // this.router.get('/whoami', this.whoami.bind(this));
    // this.router.post('/logout', this.logout.bind(this));
  }

  private async login(req: Request, res: Response) {
    const data = await this.middleware.login();
    res.send(data);
  }
}