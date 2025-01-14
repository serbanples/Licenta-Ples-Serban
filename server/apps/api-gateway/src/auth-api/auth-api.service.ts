import { config } from '@app/config';
import { AuthResponse, LoginAccountDto, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, Token, UserContextType, VerificationTokenDto } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

/**
 * Auth api service class used to communicate with auth server.
 */
@Injectable()
export class AuthApiService {
  private readonly authServer: ClientProxy;

  /**
   * Constructor method.
   * 
   * @param {ClientProxy} authServer proxy used to send messages to auth server.
   */
  constructor(@Inject(config.rabbitMQ.auth.serviceName) authServer: ClientProxy) {
    this.authServer = authServer;
  }

  /**
   * Method used in order to send a register message to auth server.
   * 
   * @param {NewAccountDto} requestData register form.
   * @returns {Observable<AuthResponse>} response from auth server.
   */
  register(requestData: NewAccountDto): Observable<AuthResponse> {
    return this.authServer.send(config.rabbitMQ.auth.messages.createAccount, requestData);
  }

  /**
   * Method used in order to send a login message to auth server.
   * 
   * @param {LoginAccountDto} requestData login form.
   * @returns {Observable<Token>} access token from auth server.
   */
  login(requestData: LoginAccountDto): Observable<Token> {
    return this.authServer.send(config.rabbitMQ.auth.messages.generateToken, requestData);
  }

  /**
   * Method used in order to send a whoami message to auth server.
   * 
   * @param {Token} token user access token.
   * @returns {Observable<UserContextType>} user context.
   */
  whoami(token: Token): Observable<UserContextType> {
    return this.authServer.send(config.rabbitMQ.auth.messages.validateToken, token);
  }

  /**
   * Method used in order to send a verify account message to auth server.
   * 
   * @param {VerificationTokenDto} verificationToken user account verification token.
   * @returns {Observable<AuthResponse>} response from auth server.
   */
  verifyAccount(verificationToken: VerificationTokenDto): Observable<AuthResponse> {
    return this.authServer.send(config.rabbitMQ.auth.messages.verifyAccount, verificationToken);
  }

  /**
   * Method used in order to send a reset password request message to auth server.
   * 
   * @param {RequestResetPasswordDto} resetPasswordRequestForm user reset password request form.
   * @returns {Observable<AuthResponse>} response from auth server.
   */
  requestResetPassword(resetPasswordRequestForm: RequestResetPasswordDto): Observable<AuthResponse> {
    return this.authServer.send(config.rabbitMQ.auth.messages.requestResetPassword, resetPasswordRequestForm);
  }

  /**
   * Method used in order to send a reset password message to auth server.
   * 
   * @param {ResetPasswordFormDto} resetPasswordForm user reset password form.
   * @returns {Observable<AuthResponse>} response from auth server.
   */
  resetPassword(resetPasswordForm: ResetPasswordFormDto): Observable<AuthResponse> {
    return this.authServer.send(config.rabbitMQ.auth.messages.resetPassword, resetPasswordForm);
  }

}
