import { Router } from "express";
import { WebMiddlewareInstance } from "../../middleware/web/webMiddlewareInstance";
import { AuthRoutes } from "./lib/AuthRoutes";

/** Class used to manage all web api server routes. */
export class WebRoutesInstance {
  public authRoutes: AuthRoutes;
  private router: Router = Router();
  private middleware: WebMiddlewareInstance = new WebMiddlewareInstance();

  constructor() {
    this.authRoutes = new AuthRoutes(this.middleware.authMiddleware);
    this.router.use('/api', this.initializeRoutes());
  }

  /**
   * Getter method for Router
   * 
   * @returns {Router} web api server routes.
   */
  getRouter(): Router {
    return this.router;
  }

  /**
   * Method used to initialize the routes
   * 
   * @returns {Router} router with all application routes.
   */
  private initializeRoutes(): Router {
    const router = Router();
    router.use('/auth', this.authRoutes.getRouter());

    return router;
  }
}
