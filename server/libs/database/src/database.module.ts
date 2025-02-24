import { config } from '@app/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema, AccountType } from './schema/account.schema';
import { AccountModel } from './models/account.model';
import { UserSchema, UserType } from './schema/user.schema';
import { UserModel } from './models/user.model';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongodb.data_db_uri),
    MongooseModule.forFeature([
      { name: AccountType.name, schema: AccountSchema },
      { name: UserType.name, schema: UserSchema }
    ]),
  ],
  providers: [AccountModel, UserModel],
  exports: [MongooseModule, AccountModel, UserModel],
})
export class DatabaseModule {}
