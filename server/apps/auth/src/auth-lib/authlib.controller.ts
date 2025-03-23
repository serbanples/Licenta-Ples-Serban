import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';
import { SuccessResponse, LoginAccountDto, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, RpcErrorEncoder, Token, UserContextType, VerificationTokenDto, Authorize, WithContext, AccountDeleteType } from '@app/shared';
import { LoggingInterceptor } from '@app/logger';
import { config } from '@app/config';
import { AuthService } from './authlib.service';

/**
 * Auth controller class used to handle incoming messages for authentication
 */
@UseInterceptors(LoggingInterceptor)
@Controller()
export class AuthController {
  private authService: AuthService;

  /**
   * Constructor method.
   * 
   * @param {AuthService} service auth service used to process the data.
   */
  constructor(service: AuthService) {
    this.authService = service;
  }
 
  /**
   * Method used to proccess create account messages
   * 
   * @param {NewAccountDto} newAccount registration data.
   * @returns {Promise<SuccessResponse>} registration response.
   */
  @MessagePattern(config.rabbitMQ.auth.messages.createAccount)
  @RpcErrorEncoder()
  createAccount(@Payload() newAccount: NewAccountDto): Promise<SuccessResponse> {
    return this.authService.createAccount(newAccount);
  }

  /**
   * Method used to proccess generate token messages.
   * 
   * @param {LoginAccountDto} loginAccount login data.
   * @returns {Promise<Token>} access token generated for the user.
   */
  @MessagePattern(config.rabbitMQ.auth.messages.generateToken)
  @RpcErrorEncoder()
  generateToken(@Payload() loginAccount: LoginAccountDto): Promise<Token> {
    return this.authService.login(loginAccount);
  }

  /**
   * Method used to proccess validate token messages
   * 
   * @param {Token} token user token.
   * @returns {Promise<UserContextType>} user data extracted from token.
   */
  @MessagePattern(config.rabbitMQ.auth.messages.validateToken)
  @RpcErrorEncoder()
  validateToken(@Payload() token: Token): Promise<UserContextType> {
    return this.authService.whoami(token);
  }

  /**
   * Method used to proccess verify account messages
   * 
   * @param {VerificationTokenDto} verificationToken verification token for user.
   * @returns {Promise<SuccessResponse>} verification response
   */
  @MessagePattern(config.rabbitMQ.auth.messages.verifyAccount)
  @RpcErrorEncoder()
  verifyAccount(@Payload() verificationToken: VerificationTokenDto): Promise<SuccessResponse> {
    return this.authService.verifyAccount(verificationToken);
  }

  /**
   * Method used to proccess reset password request messages
   * 
   * @param {RequestResetPasswordDto} resetPasswordRequestForm form to request a password reset for user.
   * @returns {Promise<SuccessResponse>} reset password request response
   */
  @MessagePattern(config.rabbitMQ.auth.messages.requestResetPassword)
  @RpcErrorEncoder()
  requestResetPassword(@Payload() resetPasswordRequestForm: RequestResetPasswordDto): Promise<SuccessResponse> {
    return this.authService.requestResetPassword(resetPasswordRequestForm);
  }

  /**
   * Method used to proccess reset password messages
   * 
   * @param {ResetPasswordFormDto} resetPasswordForm form to reset password for user.
   * @returns {Promise<SuccessResponse>} reset password response
   */
 @MessagePattern(config.rabbitMQ.auth.messages.resetPassword)
 @RpcErrorEncoder()
 resetPassword(@Payload() resetPasswordForm: ResetPasswordFormDto): Promise<SuccessResponse> {
   return this.authService.resetPassword(resetPasswordForm);
 }

 @MessagePattern(config.rabbitMQ.auth.messages.deleteAccount)
 @Authorize('account:delete')
 @RpcErrorEncoder()
 deleteAccount(@Payload() data: WithContext<AccountDeleteType>): Promise<SuccessResponse> {
  return this.authService.deleteAccount(data.userContext, data.data.id);
 }
}
