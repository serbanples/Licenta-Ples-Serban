import * as _ from 'lodash';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SuccessResponse, LoginAccountDto, NewAccountDto, RequestResetPasswordDto, RequestWrapper, ResetPasswordFormDto, UserContextType, VerificationTokenDto } from '@app/shared';
import { JwtGuard } from '../guards/jwt.guard';
import { AuthApiService } from './auth-api.service';

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
   * @returns {Observable<SuccessResponse>} register response.
   */
  @Post('register')
  register(@Body() registerData: NewAccountDto): Observable<SuccessResponse> {
    return this.service.register(registerData);
  }

  /**
   * Method used to handle login requests.
   * 
   * @param {LoginAccountDto} loginData login form.
   * @param {Response} response response object.
   * @returns {Observable<SuccessResponse>} login response.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginData: LoginAccountDto, @Res({ passthrough: true }) response: Response): Observable<SuccessResponse> {
    return this.service.login(loginData)
      .pipe(
        map((token) => {
          this.setCookie(response, token.accessToken);
          return { success: true };
        })
      );
  }

  @Get('login/validation')
  loginValidation() {
    return this.service.extractValidationRules(LoginAccountDto);
  }

  @Get('register/validation')
  registerValidation() {
    return this.service.extractValidationRules(NewAccountDto);
  }

  /**
   * Method used to handle logout requests.
   * 
   * @param {Response} response response object.
   * @returns {SuccessResponse} logout response.
   */
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): SuccessResponse {
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
   * Method used to handle whoami requests.
   * 
   * @param {string} verificationToken account verification token.
   * @returns {Observable<SuccessResponse>} true if successful, error if not.
   */
  @HttpCode(HttpStatus.OK)
  @Get('verifyaccount')
  verifyAccount(@Query() verificationToken: VerificationTokenDto): Observable<SuccessResponse> {
    return this.service.verifyAccount(verificationToken);
  }

  /**
   * Method used to handle request password reset requests.
   * 
   * @param {RequestResetPasswordDto} requestResetPassword reset password request request.
   * @returns {Observable<SuccessResponse>} true if successful, error if not.
   */
  @HttpCode(HttpStatus.OK)
  @Post('request-reset-password')
  requestResetPassword(@Body() requestResetPassword: RequestResetPasswordDto): Observable<SuccessResponse> {
    return this.service.requestResetPassword(requestResetPassword);
  }

  /**
   * Method used to handle reset password requests.
   * 
   * @param {ResetPasswordFormDto} resetPasswordForm form to reset password
   * @returns {Observable<SuccessResponse>} true if successful, error if not.
   */
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body() resetPasswordForm: ResetPasswordFormDto): Observable<SuccessResponse> {
    return this.service.resetPassword(resetPasswordForm);
  }

  @HttpCode(HttpStatus.OK)
  @Get('delete-account')
  deleteAccount(@Req() req: RequestWrapper, @Query() id: string): Observable<SuccessResponse> {
    return this.service.deleteAccount(req.user!, id);
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
