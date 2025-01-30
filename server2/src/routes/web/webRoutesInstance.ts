import { Router } from "express";
import { WebMiddlewareInstance } from "../../middleware/web/webMiddlewareInstance";
import { AuthRoutes } from "./lib/AuthRoutes";

export class WebRoutesInstance {
  public authRoutes: AuthRoutes;
  private router: Router = Router();

  constructor(middlewares: WebMiddlewareInstance) {
    this.authRoutes = new AuthRoutes(middlewares.authMiddleware);
    this.router.use('/api', this.initializeRoutes());
  }

  getRouter(): Router {
    return this.router;
  }

  /**
   * Method used to initialize the routes
   * 
   * @returns {Router} router with all application routes
   */
  private initializeRoutes(): Router {
    const router = Router();
    router.use('/auth', this.authRoutes.getRouter());

    return router;
  }
}
