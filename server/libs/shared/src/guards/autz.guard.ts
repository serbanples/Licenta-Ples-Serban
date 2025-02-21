import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { lastValueFrom } from 'rxjs';
import { config } from '@app/config';
import { AutzAuthorizedType, UserContextType } from '../types';
import { createAuthClient } from '../factories';
import _ from 'lodash';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly authClient: ClientProxy;

  constructor(private readonly reflector: Reflector) {
    this.authClient = createAuthClient(); // Manually create the RabbitMQ client
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    if (_.isNil(requiredPermissions) || _.isNil(requiredPermissions[0])) {
        return true; // No permissions required
    }
    const [resource, action] = requiredPermissions[0].split(':');

    const payload = context.switchToRpc().getData();
    const userContext: UserContextType = payload.userContext;
    const autzData: AutzAuthorizedType = {
        usercontext: userContext,
        resource: resource || '',
        action: action || '',
    }

    try {
      const response: boolean = await lastValueFrom(
        this.authClient.send(config.rabbitMQ.auth.messages.authorize, autzData)
      );

      if(!response) {
        throw new RpcException({
            statusCode: 403,
            message: 'Unauthorized access',
            error: 'Forbidden'
        });
      }
      return response;
    } catch (error) {
        throw new RpcException({
            statusCode: 403,
            message: (error as Error).message,
            error: 'Forbidden'
        });
    }
  }
}
