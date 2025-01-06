import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { LoggerService } from './logger.service';

/**
 * Logger Middleware class used to log http requests and responses
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: LoggerService;

  /**
   * Constructor method
   * 
   * @param {LoggerService} logger logger service instance.
   */
  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  /**
   * Middleware function that intercepts requests and responses and logs data from them.
   * 
   * @param {Request} req incoming request.
   * @param {Response} res outgoint response.
   * @param {NextFunction} next express next function.
   * @returns {void} logs request/response data.
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;

    this.logger.info('HTTP Request', {
      type: 'request',
      method,
      url: originalUrl,
      timestamp: new Date().toISOString(),
    });

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.info('HTTP Response', {
        type: 'response',
        method,
        url: originalUrl,
        statusCode,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}
