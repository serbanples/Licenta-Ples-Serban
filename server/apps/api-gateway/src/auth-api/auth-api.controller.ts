import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthApiService } from './auth-api.service';
import { AuthResponse, LoginAccountDto, NewAccountDto, RequestWrapper, UserContextType } from '@app/shared';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import * as _ from 'lodash';

/**
 * Auth api controller class used to handle authenticationr requests.
 */
@Controller('auth')
export class AuthApiController {
  private readonly service: AuthApiService;

  /**
   * Constructor method.
   * 
   * @param {AuthApiService} service auth service used to communicate with auth microservice.
   */
  constructor(service: AuthApiService) {
    this.service = service;
  }

  /**
   * Method used to handle register requests.
   * 
   * @param {NewAccountDto} registerData registration form.
   * @returns {Observable<AuthResponse>} register response.
   */
  @Post('register')
  register(@Body() registerData: NewAccountDto): Observable<AuthResponse> {
    return this.service.register(registerData);
  }

  /**
   * Method used to handle login requests.
   * 
   * @param {LoginAccountDto} loginData login form.
   * @param {Response} response response object.
   * @returns {Observable<AuthResponse>} login response.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginData: LoginAccountDto, @Res({ passthrough: true }) response: Response): Observable<AuthResponse> {
    return this.service.login(loginData)
      .pipe(
        map((token) => {
          this.setCookie(response, token.accessToken);
          return { success: true };
        })
      );
  }

  /**
   * Method used to handle logout requests.
   * 
   * @param {Response} response response object.
   * @returns {AuthResponse} logout response.
   */
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): AuthResponse {
    this.clearCookie(response);
    return { success: true }
  }

  /**
   * Method used to handle whoami requests.
   * 
   * @param {Request} request request object.
   * @returns {Token} whoami response.
   */
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('whoami')
  whoami(@Req() request: RequestWrapper): UserContextType {
    if(_.isNil(request.user)) {
      throw new BadRequestException()
    }

    return request.user;
  }

  /**
   * Method used to add the token into a cookie.
   * 
   * @param {Response} response response object.
   * @param {string} token token to set to the cookie.
   * @returns {void} sets the cookie.
   */
  private setCookie(response: Response, token: string): void {
    response.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    })
  }

  /**
   * Method used to clear the cookie.
   * 
   * @param {Response} response response object
   * @returns {void} clears the cookie.
   */
  private clearCookie(response: Response): void {
    response.clearCookie('accessToken');
  }

}
