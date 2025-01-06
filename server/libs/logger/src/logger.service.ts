import { Injectable } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

import { createElasticLogger } from './elastic-logger.factory';

/**
 * Logger service class, used in order to log data to elastic search.
 * @method info - log informational messages
 * @method error - log error messages
 * @method warn - log warning messages
 */
@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  /**
   * Constructor for the LoggerService class
   * @param serviceName - name of the service
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
   * @param message - message to log
   * @param meta - additional metadata to log
   * @returns
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, { ...meta });
  }

  /**
   * Log error messages
   * @param message - message to log
   * @param meta - additional metadata to log
   * @returns
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, { ...meta });
  }

  /**
   * Log warning messages
   * @param message - message to log
   * @param meta - additional metadata to log
   * @returns
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, { ...meta });
  }
}
