import * as _ from 'lodash';
import { catchError, map, Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequestWrapper } from '@app/shared';
import { config } from '@app/config';

/**
 * Auth guard class used to authenticate users on protected routes.
 */
@Injectable()
export class JwtGuard implements CanActivate {
  /**
   * Constructor method.
   */
  constructor(
    @Inject(config.rabbitMQ.auth.serviceName) private readonly authClient: ClientProxy
  ) {}

  /**
   * Method used to extract the cookies and validate the request.
   * 
   * @param {ExecutionContext} context execution context.
   * @returns {Observable<boolean>} true if user is authenticated, error if not.
   */
  canActivate(context: ExecutionContext): Observable<boolean> {
    const request: RequestWrapper = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (_.isNil(token)) {
      throw new UnauthorizedException('No token provided');
    }

    return this.authClient.send(config.rabbitMQ.auth.messages.validateToken, { accessToken: token }).pipe(
      map((userContext) => {
        request.user = userContext;
        return true;
      }),
      catchError(() => {
        throw new UnauthorizedException('Invalid token');
      })
    );
  }

  /**
   * Method used to extract the token from the request.
   * 
   * @param {RequestWrapper} request request object.
   * @returns {string} token.
   */
  private extractToken(request: RequestWrapper): string {
    const accessToken = request.cookies['accessToken'];

    return accessToken;
  }
}
