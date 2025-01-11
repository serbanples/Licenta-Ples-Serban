import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable } from 'rxjs';
import * as _ from 'lodash';
import { AuthApiService } from '../auth-api/auth-api.service';
import { RequestWrapper } from '@app/shared';

/**
 * Auth guard class used to authenticate users on protected routes.
 */
@Injectable()
export class JwtGuard implements CanActivate {
  public readonly reflector: Reflector;
  private readonly authApiService: AuthApiService;

  /**
   * Constructor method.
   * 
   * @param {Reflector} reflector reflector.
   * @param {AuthApiService} service auth api service.
   */
  constructor(reflector: Reflector, service: AuthApiService) {
    this.reflector = reflector;
    this.authApiService = service;
  }

  /**
   * Method used to extract the cookies and validate the request.
   * 
   * @param {ExecutionContext} context execution context.
   * @returns {Observable<boolean>} true if user is authenticated, error if not.
   */
  canActivate(context: ExecutionContext): Observable<boolean> {
    const request: RequestWrapper = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if(_.isNil(token)) {
      throw new UnauthorizedException('No token provided');
    }

    return this.authApiService.whoami({ accessToken: token })
      .pipe(
        map((userContext) => {
          request.user = userContext;
          return true;
        }),
        catchError(() => {
          throw new UnauthorizedException('Invalid token');
        })
      )
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
