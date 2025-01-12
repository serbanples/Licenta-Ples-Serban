import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountModel } from './model/account.model';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponse, LoginAccountDto, NewAccountDto, Token, UserContextType } from '@app/shared';
import { AccountType } from './model/account.schema';
import { config } from '@app/config';
import { ClientProxy } from '@nestjs/microservices';

/**
 * Auth service class.
 */
@Injectable()
export class AuthService {
  private readonly accountModel: AccountModel;
  private readonly jwtService: JwtService;
  private readonly mailClient: ClientProxy;
  private readonly SALT_ROUNDS = 10;

  /**
   * Constructor method.
   * 
   * @param {AccountModel} model account model used.
   * @param {JwtService} jwtService jwt service instance used to sign and validate tokens.
   * @param {ClientProxy} mailer proxy to mailer microservice.
   */
  constructor(model: AccountModel, jwtService: JwtService, @Inject(config.rabbitMQ.mailer.serviceName) mailer: ClientProxy) {
    this.accountModel = model;
    this.jwtService = jwtService;
    this.mailClient = mailer;
  }

  /**
   * Method used to create a new account.
   * 
   * @param {NewAccountDto} newAccount new account data.
   * @returns {Promise<AuthResponse>} registration resoponse if successful.
   */
  async createAccount(newAccount: NewAccountDto): Promise<AuthResponse> {
    return this.accountModel.findOne({ email: newAccount.email })
      .then((user) => {
        if(!_.isNil(user)) {
          throw new BadRequestException('User already exists');
        }
        return Promise.all([
          this.hashPassword(newAccount.password),
          this.generateVerificationToken(newAccount.email)
        ]);
      })
      .then(async ([hashedPassword, verificationToken]) => {
        const user = {
          email: newAccount.email,
          password: hashedPassword,
          accountVerificationToken: verificationToken
        }

        await this.accountModel.create(user);
        return verificationToken;
      })
      .then(async (verificationToken) => {
        this.sendVerificationEmail(newAccount.email, verificationToken);

        return { success: true }
      })
  }

  /**
   * Method used to login a user.
   * 
   * @param {LoginAccountDto} loginAccount user to login.
   * @returns {Promise<Token>} user access token.
   */
  async login(loginAccount: LoginAccountDto): Promise<Token> {
    return this.accountModel.findOne({ email: loginAccount.email })
      .then((user) => {
        if(_.isNil(user)) {
          throw new NotFoundException('User not found!')
        }
        return this.compareHash(loginAccount.password, user.password)
          .then((passwordsEqual) => {
            if(!passwordsEqual) {
              throw new BadRequestException('Incorrect password.');
            }

            return this.generateToken(user);
          });
      })
      .then((token) => {
        return { accessToken: token };
      })
  }

  /**
   * Method used to get user credentials from a token.
   * 
   * @param {Token} token user access token.
   * @returns {Observable} user data.
   */
  whoami(token: Token): Promise<UserContextType> {
    return this.verifyToken(token.accessToken);
  }

  /**
   * Method used to hash passwords.
   * 
   * @param {string} password original password.
   * @returns {Promise<string>} hashed password.
   */
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
  /**
   * Method used to compare hashed passwords.
   * 
   * @param {string} password original password.
   * @param {string} hashedPassword hashed password.
   * @returns {Promise<boolean>} true if equal, false if not.
   */
  private compareHash(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // private notifyDbAcc() {
  /// emit event to db acc with user data in order to insert new user there.
  // }

  /**
   * Method used to generate a jwt token.
   * 
   * @param {AccountType} userData user account data.
   * @returns {Promsie<string>} access token.
   */
  private generateToken(userData: AccountType): Promise<string> {
    const payload = { id: userData.id, email: userData.email, role: userData.role };

    return this.jwtService.signAsync(payload);
  }

  private generateVerificationToken(userEmail: string): Promise<string> {
    return this.jwtService.signAsync({ email: userEmail });
  }

  /**
   * Method used to validate a jwt token.
   * 
   * @param {string} token jwt token.
   * @returns {Promise} user context.
   */
  private async verifyToken(token: string): Promise<UserContextType> {
    return this.jwtService.verifyAsync(token)
      .then((decodedToken) => {
        return {
          id: decodedToken['id'],
          email: decodedToken['email'],
          role: decodedToken['role']
        };
      });
  }

  /**
   * Method used to send a verification email.
   * 
   * @param {string} email email of the user to verify
   * @param {string} verificationToken verification token.
   * @returns {void} sends an email.
   */
  private sendVerificationEmail(email: string, verificationToken: string): void {
    this.mailClient.emit(config.rabbitMQ.mailer.messages.verifyAccount, { to: email, verificationToken });
  }
}
