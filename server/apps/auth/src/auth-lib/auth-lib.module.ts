import { Module } from '@nestjs/common';
import { AuthController } from './authlib.controller';
import { AuthService } from './authlib.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '@app/config';
import { AccountSchema, AccountType } from './model/account.schema';
import { AccountModel } from './model/account.model';

/**
 * Auth lib module class.
 */
@Module({
  imports: [
    JwtModule.register({
      secret: 'super secret key',
      signOptions: { expiresIn: '24h'},
    }),
    MongooseModule.forRoot(config.mongodb.auth_db_uri),
    MongooseModule.forFeature([{ name: AccountType.name, schema: AccountSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, AccountModel],
})
export class AuthLibModule {}
