import { Global, Module } from '@nestjs/common';

import { LoggerService } from './logger.service';

/**
 * Logger Module class used to inject Logger service into components.
 * @method forRoot - Method needed to call when using LoggerModule.
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
      inject: ['APP_MODULE_NAME'], // Inject the module name
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {
  /**
   * Method used to inject the name of the service using the Module into the LoggerService for better logs.
   * @param serviceName - name of the microservice using the logger.
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
