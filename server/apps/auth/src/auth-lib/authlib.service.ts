import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountModel } from './model/account.model';
import { from, map, Observable, switchMap } from 'rxjs';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponse, LoginAccountDto, NewAccountDto, Token, UserContextType } from '@app/shared';
import { AccountType } from './model/account.schema';

/**
 * Auth service class.
 */
@Injectable()
export class AuthService {
  private readonly accountModel: AccountModel;
  private readonly jwtService: JwtService;
  private readonly SALT_ROUNDS = 10;

  /**
   * Constructor method.
   * 
   * @param {AccountModel} model account model used.
   * @param {JwtService} jwtService jwt service instance used to sign and validate tokens.
   */
  constructor(model: AccountModel, jwtService: JwtService) {
    this.accountModel = model;
    this.jwtService = jwtService;
  }

  /**
   * Method used to create a new account.
   * 
   * @param {NewAccountDto} newAccount new account data.
   * @returns {Observable<AuthResponse>} registration resoponse if successful.
   */
  createAccount(newAccount: NewAccountDto): Observable<AuthResponse> {
    return this.accountModel.findOne({ email: newAccount.email })
      .pipe(
        map((user) => {
          if(!_.isNil(user)) {
              throw new BadRequestException('User already exists');
          }
        }),
        switchMap(() => {
          return this.hashPassword(newAccount.password);
        }),
        switchMap((hashedPassword) => {
          const userInfo = {
            email: newAccount.email,
            password: hashedPassword
          }

          return this.accountModel.create(userInfo);
        }),
        map(() => ({ success: true }))
      )
  }

  /**
   * Method used to login a user.
   * 
   * @param {LoginAccountDto} loginAccount user to login.
   * @returns {Observable<Token>} user access token.
   */
  login(loginAccount: LoginAccountDto): Observable<Token> {
    return this.accountModel.findOne({ email: loginAccount.email })
      .pipe(
        switchMap((user) => {
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
        }),
        map((token) => {
          return { accessToken: token }
        })
      )
  }

  /**
   * Method used to get user credentials from a token.
   * 
   * @param {Token} token user access token.
   * @returns {Observable} user data.
   */
  whoami(token: Token): Observable<UserContextType> {
    return from(this.verifyToken(token.accessToken));
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
    console.log(userData.id)
    const payload = { id: userData.id, email: userData.email, role: userData.role };

    return this.jwtService.signAsync(payload);
  }

  /**
   * Method used to validate a jwt token.
   * 
   * @param {string} token jwt token.
   * @returns {Promise} user context.
   */
  private verifyToken(token: string): Promise<UserContextType> {
    return this.jwtService.verifyAsync(token)
      .then((decodedToken) => {
        return {
          id: decodedToken['id'],
          email: decodedToken['email'],
          role: decodedToken['role']
        };
      });
  }
}
