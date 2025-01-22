/** Dependency injection types for inject options and others. */

export type Constructor<T = any> = new (...args: any[]) => T;
export type Token = string | symbol | Constructor;

export interface InjectableOptions {
  singleton?: boolean;
}