import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import _ from "lodash";

@Schema({
  timestamps: true,
  collection: 'users',
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
export class UserType extends BaseSchema {
  @Prop({ required: true, unique: true, type: String, })
  email!: string;

  @Prop({ required: true, type: String, })
  fullName!: string;

  // @Prop({ required: true, unique: true, type: String, })
  // email!: string;
}

export const UserSchema = SchemaFactory.createForClass(UserType);