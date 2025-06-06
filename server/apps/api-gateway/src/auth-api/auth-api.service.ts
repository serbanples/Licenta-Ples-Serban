import { Observable } from 'rxjs';
import { validateSync, ValidationError } from 'class-validator';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { config } from '@app/config';
import { SuccessResponse, LoginAccountDto, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, Token, UserContextType, VerificationTokenDto, WithContext, AccountDeleteType } from '@app/shared';

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
   * @returns {Observable<SuccessResponse>} response from auth server.
   */
  register(requestData: NewAccountDto): Observable<SuccessResponse> {
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
   * @returns {Observable<SuccessResponse>} response from auth server.
   */
  verifyAccount(verificationToken: VerificationTokenDto): Observable<SuccessResponse> {
    return this.authServer.send(config.rabbitMQ.auth.messages.verifyAccount, verificationToken);
  }

  /**
   * Method used in order to send a reset password request message to auth server.
   * 
   * @param {RequestResetPasswordDto} resetPasswordRequestForm user reset password request form.
   * @returns {Observable<SuccessResponse>} response from auth server.
   */
  requestResetPassword(resetPasswordRequestForm: RequestResetPasswordDto): Observable<SuccessResponse> {
    return this.authServer.send(config.rabbitMQ.auth.messages.requestResetPassword, resetPasswordRequestForm);
  }

  /**
   * Method used in order to send a reset password message to auth server.
   * 
   * @param {ResetPasswordFormDto} resetPasswordForm user reset password form.
   * @returns {Observable<SuccessResponse>} response from auth server.
   */
  resetPassword(resetPasswordForm: ResetPasswordFormDto): Observable<SuccessResponse> {
    return this.authServer.send(config.rabbitMQ.auth.messages.resetPassword, resetPasswordForm);
  }

  deleteAccount(userContext: UserContextType, id: string): Observable<SuccessResponse> {
    const payload: WithContext<AccountDeleteType> = {
      userContext,
      data: {
        id
      }
    }

    return this.authServer.send(config.rabbitMQ.auth.messages.deleteAccount, payload);
  }

  extractValidationRules(dto: any): Record<string, any> {
    // Create an empty instance of the DTO
    const dtoInstance = new dto();
    
    // Get validation errors for empty instance
    const errors: ValidationError[] = validateSync(dtoInstance);
    
    // Map the validation rules
    const rules: Record<string, any> = {};
    
    errors.forEach((error: ValidationError) => {
      const propertyName = error.property;
      const constraints = error.constraints;
      
      if (!rules[propertyName]) {
        rules[propertyName] = {};
      }
      
      // Map each constraint to a rule
      if (constraints) {
        Object.keys(constraints).forEach(key => {
          switch(key) {
            case 'isNotEmpty':
              rules[propertyName].required = true;
              break;
            case 'isEmail':
              rules[propertyName].email = true;
              break;
            case 'matches':
              const start = constraints[key]?.indexOf('/') || 0;
              const end = constraints[key]?.lastIndexOf('/');
              rules[propertyName].pattern = constraints[key]?.substring(start + 1, end);
              break;
            case 'minLength':
              rules[propertyName].minLength = parseInt(constraints[key]!.match(/\d+/)![0]);
              break;
            case 'maxLength':
              rules[propertyName].maxLength = parseInt(constraints[key]!.match(/\d+/)![0]);
              break;
          }
        });
      }
    });

    console.log('Extracted rules:', rules);
    return rules;
  }

}
