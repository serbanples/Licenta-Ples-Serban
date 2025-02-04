import * as bcrypt from 'bcryptjs';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';

import { AccountModel } from "../../models/lib/AccountModel";
import { LoginForm, RegisterForm, Token } from "../../types";
import { BadRequest, NotFound } from "../../config/exceptions";
import { AccountModelType } from "../../models/utils/resource.types";
import { config } from '../../config';

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
  async register(form: RegisterForm): Promise<AccountModelType> {
    if(form.password !== form.confirmPassword)
        throw new BadRequest('Passwords dont match!');


    const user: Partial<AccountModelType> = {
        username: form.username,
        password: await this.hashPassword(form.password),
        email: form.email,
    };

    return this.Model.findOne({ email: user.email })
        .then((foundUser) => {
            if(!_.isNil(foundUser))
                throw new BadRequest('User already exists');
            return this.Model.create(user);
        })
  }

   /**
     * Method used to hash passwords.
     * 
     * @param {string} password original password.
     * @returns {Promise<string>} hashed password
     */
   public hashPassword(password: string): Promise<string> {
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

}