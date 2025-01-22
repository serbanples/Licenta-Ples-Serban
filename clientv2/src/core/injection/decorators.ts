/** Dependency injection decorators implementation */

import 'reflect-metadata';
import { Constructor, InjectableOptions, Token } from './types';
import { INJECT_METADATA_KEY, INJECTABLE_METADATA_KEY } from './metadata';
import _ from 'lodash';
import { Container } from './container';

export function Injectable(options: InjectableOptions = { singleton: true }) {
  return function(target: Constructor) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, options, target);

    // Get the original constructor parameters
    const params: Token[] = Reflect.getMetadata('design:paramtypes', target) || [];

    // Get any @Inject decorators
    const injectionTokens: Token[] = Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];

    // Create a new constructor that handles dependency injection
    const newConstructor: any = function(...args: any[]) {
      const injectedParams = _.map(params, (param, index) => {
        // Use explicitly defined injection token if available
        const token = injectionTokens[index] || param;
        return Container.getInstance().resolve(token);
      });

      return new target(...injectedParams);
    }

    // Copy prototype
    newConstructor.prototype = target.prototype;

    // Register the class in the container if it's a singleton
    if(options.singleton) {
      Container.getInstance().register(target, newConstructor);
    }

    return newConstructor;
  }
}

export function Inject(token: Token) {
  return function(target: any, _: string | symbol, parameterIndex: number) {
    const existingTokens: Token[] = Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingTokens, target);
  };
}