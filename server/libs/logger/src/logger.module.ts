import { Global, Module } from '@nestjs/common';

import { LoggerService } from './loggers/logger.service';
import { LoggingInterceptor } from './loggers/logging.interceptor';
import { LoggerMiddleware } from './loggers/logger.middleware';

/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable jsdoc/require-returns */

/**
 * Logger Module class used to inject Logger service into components.
 */
@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: (moduleName: string) => {
        const serviceName = moduleName.replace('Module', '');
        return new LoggerService(serviceName);
      },
      inject: ['APP_MODULE_NAME']
    },
    LoggingInterceptor,
    LoggerMiddleware
  ],
  exports: [
    LoggerService,
    LoggingInterceptor,
    LoggerMiddleware
  ],
})
export class LoggerModule {
  /**
   * Method used to inject the name of the service using the Module into the LoggerService for better logs.
   * 
   * @param {string} serviceName - name of the microservice using the logger.
   */
  static forRoot(serviceName: string) {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'APP_MODULE_NAME',
          useValue: serviceName,
        },
      ],
    };
  }
}
