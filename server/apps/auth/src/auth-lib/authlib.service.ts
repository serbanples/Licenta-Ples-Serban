import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponse, LoginAccountDto, NewAccountDto, RequestResetPasswordDto, ResetPasswordFormDto, Token, UserContextType, VerificationTokenDto } from '@app/shared';
import { config } from '@app/config';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { AccountModel } from '@app/database/models/account.model';
import { AccountType } from '@app/database/schema/account.schema';

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
        return this.hashPassword(newAccount.password);
      })
      .then((hashedPassword) => {
        const verificationToken = this.generateVerificationToken();

        const user = {
          email: newAccount.email,
          password: hashedPassword,
          accountVerificationToken: verificationToken
        }

        return this.accountModel.create(user);
      })
      .then((account) => {
        this.sendVerificationEmail(newAccount.email, account.accountVerificationToken);

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
    return this.accountModel.findOneWithPassword({ email: loginAccount.email })
      .then((user) => {
        if(_.isNil(user)) {
          throw new NotFoundException('User not found!')
        }
        return this.compareHash(loginAccount.password, user.password)
          .then((passwordsEqual) => {
            if(!passwordsEqual) {
              throw new BadRequestException('Incorrect password.');
            }

            if(user.isVerified === false) {
              throw new UnauthorizedException('Account is not verified!');
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
   * @returns {Promise<UserContextType>} user data.
   */
  async whoami(token: Token): Promise<UserContextType> {
    return this.verifyToken(token.accessToken);
  }

  /**
   * Method used to register an account as verified.
   * 
   * @param {string} token verification token sent by the user. 
   * @returns {Promise<AuthResponse>} true if success, error if not.
   */
  async verifyAccount(token: VerificationTokenDto): Promise<AuthResponse> {
    return this.accountModel.updateOne({ accountVerificationToken: token.verificationToken }, { isVerified: true })
      .then((account) => {
        if(_.isNil(account)) {
          throw new NotFoundException('Invalid verification token!')
        }

        return { success: true };
      })
  }

  /**
   * Method used to request a password reset.
   * 
   * @param {RequestResetPasswordDto} form reset request form sent by user.
   * @returns {Promise<AuthResponse>} true if success, error if not.
   */
  async requestResetPassword(form: RequestResetPasswordDto): Promise<AuthResponse> {
    return this.accountModel.findOne({ email: form.email })
      .then((account) => {
        if(_.isNil(account)) {
          throw new NotFoundException('User not found');
        }

        return this.generateVerificationToken();
      })
      .then((resetToken) => {
        return this.accountModel.updateOne({ email: form.email }, { passwordResetToken: resetToken });
      })
      .then((updatedAccount) => {
        if(_.isNil(updatedAccount)) {
          throw new NotFoundException('User not found');
        }
        this.sendResetPasswordEmail(updatedAccount.email, updatedAccount.passwordResetToken);

        return { success: true };
      })
  }

  /**
   * Method used to reset a user password.
   * 
   * @param {ResetPasswordFormDto} form reset password form with new password and reset token.
   * @returns {Promise<AuthResponse>} true if success, error if not.
   */
  async resetPassword(form: ResetPasswordFormDto): Promise<AuthResponse> {
    return this.accountModel.findOne({ passwordResetToken: form.resetToken })
      .then(async (account) => {
        if(_.isNil(account)) {
          throw new NotFoundException('Account not found');
        }
        const hashedPassword = await this.hashPassword(form.password);

        return this.accountModel.updateOne({ _id: account.id }, { password: hashedPassword })
      })
      .then((account) => {
        if(_.isNil(account)) {
          throw new NotFoundException('User not found');
        }

        return { success: true };
      })
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

  /**
   * Method used to generate a jwt token.
   * 
   * @param {AccountType} userData user account data.
   * @returns {Promsie<string>} access token.
   */
  private async generateToken(userData: AccountType): Promise<string> {
    const payload = { id: userData.id, email: userData.email, role: userData.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return this.accountModel.updateOne({ _id: userData.id }, { accessToken })
      .then(user => user!.accessToken);
  }

  /**
   * Method used to generate a verification token.
   * 
   * @returns {string} random verification token.
   */
  private generateVerificationToken(): string {
    return randomUUID().toString();
  }

  /**
   * Method used to validate a jwt token.
   * 
   * @param {string} token jwt token.
   * @returns {Promise<UserContextType>} user context.
   */
  private async verifyToken(token: string): Promise<UserContextType> {
    return this.jwtService.verifyAsync(token)
      .then((decodedToken) => 
        this.accountModel.findOne({ _id: decodedToken['id'], email: decodedToken['email'], role: decodedToken['role'], accessToken: token }))
      .then(user => {
        if(_.isNil(user)) {
          throw new UnauthorizedException('Invalid user data!');
        }
        return {
          id: user.id,
          email: user.email,
          role: user.role
        }
      })
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

  /**
   * Method used to send a reset password email.
   * 
   * @param {string} email email of the user to reset password for.
   * @param {string} resetToken reset token.
   * @returns {void} sends an email.
   */
  private sendResetPasswordEmail(email: string, resetToken: string): void {
    this.mailClient.emit(config.rabbitMQ.mailer.messages.resetPassword, { to: email, resetToken });
  }
}
