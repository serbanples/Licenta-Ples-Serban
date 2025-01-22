/** Dependency injection container implementation */

import _ from "lodash";
import { Constructor, InjectableOptions, Token } from "./types";
import { INJECTABLE_METADATA_KEY } from "./metadata";

export class Container {
  private static instance: Container;
  private registry: Map<Token, any> = new Map();
  private factories: Map<Token, Constructor> = new Map();

  private constructor() {}

  static getInstance(): Container {
    if(_.isNil(Container.instance)) {
      Container.instance = new Container();
    }

    return Container.instance;
  }

  /**
   * Method used to register a service to the dependency container.
   * 
   * @param {string} token name of the service.
   * @param {any} factory instance of the service registered.
   */
  register<T>(token: Token, factory: Constructor<T>): void {
    this.factories.set(token, factory);
  }

  /**
   * Method used to access an instance inside of the container.
   * 
   * @param {Token} token name of the service.
   * @returns {T} requested service or error.
   */
  resolve<T>(token: Token): T {
    // Check if instance exists for singleton
    let instance = this.registry.get(token);
    if (!_.isNil(instance)) {
      return instance;
    }

    // Get the factory
    const factory = this.factories.get(token);
    if (_.isNil(factory)) {
      throw new Error(`No provider found for ${token.toString()}`);
    }

    // Create new instance
    instance = new factory();
    
    // Store instance if singleton
    const options: InjectableOptions = Reflect.getMetadata(INJECTABLE_METADATA_KEY, factory);
    if (options?.singleton) {
      this.registry.set(token, instance);
    }

    return instance;
  }
}