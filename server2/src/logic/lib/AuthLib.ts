import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';

import { AccountModel } from "../../models/lib/AccountModel";
import { AuthResponse, LoginForm, RegisterForm, Token, VerifyAccountForm } from "../../types";
import { BadRequest, NotFound } from "../../config/exceptions";
import { AccountModelType } from "../../models/utils/resource.types";
import { config } from '../../config';
import { randomUUID } from 'crypto';
import { Factory } from '../../factories/factory';

/** Auth lib class used for processing auth related issues. */
export class AuthLib {
  private Model: AccountModel;
  private hashSalt: string;

  constructor(accountModel: AccountModel) {
    this.Model = accountModel;
    this.hashSalt = bcrypt.genSaltSync();
  }

  /**
   * Method used to login a user.
   * 
   * @param {LoginForm} form login form send by user.
   * @returns {Token} jwt token.
   */
  async login(form: LoginForm): Promise<Token> {
    return this.Model.findOneWithPassword({ email: form.email })
        .then(async (user) => {
            if(_.isNil(user)) {
                throw new NotFound('User not found!');
            }
            const passwordsMatch = await this.comparePasswords(form.password, user.password);

            if(!passwordsMatch) {
                throw new BadRequest('Incorrect password!');
            }
            const token = this.generateToken(user);
            return { token };
        })
  }

  /**
   * Method used to register a user.
   * 
   * @param {RegisterForm} form registration form sent by user.
   * @returns {UserModelType} registered user data.
   */
  async register(form: RegisterForm): Promise<AuthResponse> {
    if(form.password !== form.confirmPassword)
      throw new BadRequest('Passwords dont match!');

    const verificationToken = this.generateVerificationToken();

    const user: Partial<AccountModelType> = {
      username: form.username,
      password: await this.hashPassword(form.password),
      email: form.email,
      accountVerificationToken: verificationToken
    };

    return this.Model.findOne({ email: user.email })
      .then((foundUser) => {
          if(!_.isNil(foundUser))
            throw new BadRequest('User already exists');
          return this.Model.create(user);
      })
      .then(account => {
        this.sendVerificationMail(account.email, account.accountVerificationToken);

        return { success: true };
      })
  }

  /**
   * Method used to verify account.
   * 
   * @param {VerifyAccountForm} form user verify account request.
   * @returns {AuthResponse} 
   */
  async verifyAccount(form: VerifyAccountForm): Promise<AuthResponse> {
    return this.Model.updateOne({ accountVerificationToken: form.token }, { isVerified: true })
      .then((updatedAccount) => {
        if(_.isNil(updatedAccount)) {
          throw new NotFound('Invalid verification token!');
        }

        return { success: true };
      })
  }

  /**
   * Method used to hash passwords.
   * 
   * @param {string} password original password.
   * @returns {Promise<string>} hashed password
   */
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.hashSalt);
  }

  /**
   * Method used to compare a password to a hashed password.
   * 
   * @param {string} password normal text password.
   * @param {string} hashedPassword hashed password.
   * @returns {Promise<boolean>} true if equal, false if not.
   */
  private comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Method used in order to generate ta json web token.
   * 
   * @param {UserModelType} user user object.
   * @returns {string} jwt token.
   */
  private generateToken(user: AccountModelType): string {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt_secret, { expiresIn: '24h' });
  }

  /**
   * Method used to generate a verification token.
   * 
   * @returns {string} random verification token.
   */
  private generateVerificationToken(): string {
    return randomUUID();
  }

  /**
   * Method used to send a account verification email to user.
   * 
   * @param {string} email user email.
   * @param {string} verificationToken user verfication token.
   * @returns {void} sends email.
   */
  private sendVerificationMail(email: string, verificationToken: string): void {
    Factory.getInstance().getRPCClients().mailClient.mailVerifyAccount({ to: email, verificationToken: verificationToken });
  }

}