import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountModel } from './model/account.model';
import { map, Observable, switchMap } from 'rxjs';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAccountDto, NewAccountDto, Token } from '@app/shared_types';
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
   */
  constructor(model: AccountModel, jwtService: JwtService) {
    this.accountModel = model;
    this.jwtService = jwtService;
  }

  /**
   * Method used to create a new account.
   * 
   * @param {NewAccountDto} newAccount new account data.
   * @returns {Observable<AccountType>} user account.
   */
  createAccount(newAccount: NewAccountDto): Observable<AccountType> {
    return this.accountModel.findOne({ email: newAccount.email })
      .pipe(
        map((user) => {
          if(!_.isNil(user))
              throw new BadRequestException('User already exists');
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
        })
      )
  }

  /**
   * Method used to login a user.
   * 
   * @param
   * @returns {Token} user access token.
   */
  login(loginAccount: LoginAccountDto): Observable<Token> {
    return this.accountModel.findOne({ email: loginAccount.email })
      .pipe(
        switchMap((user) => {
          if(_.isNil(user))
            throw new NotFoundException('User not found!')

          return this.compareHash(loginAccount.password, user.password)
            .then((passwordsEqual) => {
              if(!passwordsEqual) {
                throw new BadRequestException('Incorrect password.');
              }

              return this.generateToken(user);
            });
        }),
        map((token) => {
          return { access_token: token }
        })
      )
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

  // }

  /**
   * Method used to generate a jwt token.
   * 
   * @param {AccountType} userData user account data.
   * @returns {Promsie<string>} access token.
   */
  private generateToken(userData: AccountType): Promise<string> {
    const payload = { sub: userData.id, email: userData.email, role: userData.role };

    return this.jwtService.signAsync(payload);
  }
}
