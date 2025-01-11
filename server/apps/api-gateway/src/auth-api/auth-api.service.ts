import { config } from '@app/config';
import { AuthResponse, LoginAccountDto, NewAccountDto, Token } from '@app/shared';
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
    return this.authServer.send(config.rabbitMQ.auth.messages.register, requestData);
  }

  /**
   * Method used in order to send a login message to auth server.
   * 
   * @param {LoginAccountDto} requestData login form.
   * @returns {Observable<Token>} access token from auth server.
   */
  login(requestData: LoginAccountDto): Observable<Token> {
    return this.authServer.send(config.rabbitMQ.auth.messages.login, requestData);
  }
}
