import { Injectable } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

import { createElasticLogger } from './elastic-logger.factory';

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Logger service class, used in order to log data to elastic search.
 */
@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  /**
   * Constructor for the LoggerService class
   * 
   * @param {string} serviceName - name of the service
   */
  constructor(private readonly serviceName: string) {
    const elasticTransport = createElasticLogger(this.serviceName);

    elasticTransport.on('error', (error) => {
      console.error('Elasticsearch transport error:', error);
    });

    this.logger = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      defaultMeta: { service: this.serviceName },
      transports: [
        new transports.Console({
          format: format.combine(format.timestamp(), format.json()),
        }),
        elasticTransport,
      ],
    });

    this.info('Logger initialized', {
      timestamp: new Date(),
      service: this.serviceName,
    });
  }

  /**
   * Log informational messages
   * 
   * @param {string} message - message to log
   * @param {any} meta - additional metadata to log
   * @returns {void} logs a message to elastic.
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, { ...meta });
  }

  /**
   * Log error messages
   * 
   * @param {string} message - message to log
   * @param {any} meta - additional metadata to log
   * @returns {void} logs a message to elastic.
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, { ...meta });
  }

  /**
   * Log warning messages
   * 
   * @param {string} message - message to log
   * @param {any} meta - additional metadata to log
   * @returns {void} logs a message to elastic.
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, { ...meta });
  }
}
