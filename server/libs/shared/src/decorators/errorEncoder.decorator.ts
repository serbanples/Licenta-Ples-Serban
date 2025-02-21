import { RpcException } from '@nestjs/microservices';
import { HttpException } from '@nestjs/common';

/**
 * A simple decorator to map HTTP exceptions to RPC exceptions in microservices.
 */
export function RpcErrorEncoder(): MethodDecorator {
  return (_: any, __: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        if (err instanceof HttpException) {
          throw new RpcException({
            statusCode: err.getStatus(),
            message: err.message,
            error: err.name,
          });
        }
        throw new RpcException({
          statusCode: 500,
          message: 'Internal Server Error',
          error: 'InternalServerError',
        });
      }
    };

    return descriptor;
  };
}
