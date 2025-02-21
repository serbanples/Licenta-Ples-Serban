import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class BaseSchema extends mongoose.Document {
    @Prop({ default: Date.now })
    createdAt!: Date;

    @Prop({ default: Date.now })
    updatedAt!: Date;
}