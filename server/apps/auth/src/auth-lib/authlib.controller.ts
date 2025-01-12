import { config } from '@app/config';
import { AuthResponse, LoginAccountDto, NewAccountDto, Token, UserContextType } from '@app/shared';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './authlib.service';
import { LoggingInterceptor } from '@app/logger';

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
   * @returns {Observable<AuthResponse>} registration response.
   */
  @MessagePattern(config.rabbitMQ.auth.messages.createAccount)
  createAccount(@Payload() newAccount: NewAccountDto): Promise<AuthResponse> {
    return this.authService.createAccount(newAccount);
  }

  /**
   * Method used to proccess generate token messages.
   * 
   * @param {LoginAccountDto} loginAccount login data.
   * @returns {Observable<Token>} access token generated for the user.
   */
  @MessagePattern(config.rabbitMQ.auth.messages.generateToken)
  generateToken(@Payload() loginAccount: LoginAccountDto): Promise<Token> {
    return this.authService.login(loginAccount);
  }

  /**
   * Method used to proccess validate token messages
   * 
   * @param {Token} token user token.
   * @returns {Observable<any>} user data extracted from token.
   */
  @MessagePattern(config.rabbitMQ.auth.messages.validateToken)
  validateToken(@Payload() token: Token): Promise<UserContextType> {
    return this.authService.whoami(token);
  }
}
