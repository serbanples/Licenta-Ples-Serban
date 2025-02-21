import { config } from '@app/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema, AccountType } from './schema/account.schema';
import { AccountModel } from './models/account.model';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongodb.data_db_uri),
    MongooseModule.forFeature([{ name: AccountType.name, schema: AccountSchema }]),
  ],
  providers: [AccountModel],
  exports: [MongooseModule, AccountModel],
})
export class DatabaseModule {}
