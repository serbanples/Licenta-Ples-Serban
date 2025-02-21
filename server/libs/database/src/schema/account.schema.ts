import { UserRoleEnum } from "@app/shared";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as _ from 'lodash';
import { BaseSchema } from "./base.schema";

/* eslint-disable @typescript-eslint/no-dynamic-delete */

/**
 * Class used to define the user schema.
 */
@Schema({
  timestamps: true,
  collection: 'accounts',
  toJSON: {
    virtuals: true,
    transform: (__, ret) => {
      if (!_.isNil(ret['_id'])) {
        ret['_id'] = ret['_id'].toString();
      }
      delete ret['_id'];
      delete ret['__v'];
    }
  },
  toObject: {
    virtuals: true,
    transform: (__, ret) => {
      if (!_.isNil(ret['_id'])) {
        ret['_id'] = ret['_id'].toString();
      }
      delete ret['_id'];
      delete ret['__v'];
    }
  }
})
export class AccountType extends BaseSchema {
  @Prop({ required: true, unique: true, type: String })
  email!: string;

  @Prop({ required: true, select: false, type: String })
  password!: string;

  @Prop({ required: true, type: String })
  fullName!: string;

  @Prop({ required: true, enum: UserRoleEnum, default: UserRoleEnum.USER, type: String })
  role!: UserRoleEnum;

  @Prop({ default: false, type: Boolean })
  isVerified!: boolean;

  @Prop({ required: false })
  accountVerificationToken!: string;

  @Prop({})
  verificationTokenExipration!: number;

  @Prop({ required: false })
  passwordResetToken!: string;

  @Prop({})
  resetTokenExpiration!: number;

  @Prop({ type: String })
  accessToken!: string;
}

export const AccountSchema = SchemaFactory.createForClass(AccountType);