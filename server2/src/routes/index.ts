import { Router } from 'express';
import { WebRoutesInstance } from './web/webRoutesInstance';

export * from './web/webRoutesInstance';
export * from './web/lib/AuthRoutes';

export const createWebRoutes = (): Router => {
  const webRoutes = new WebRoutesInstance();

  return webRoutes.getRouter();
}