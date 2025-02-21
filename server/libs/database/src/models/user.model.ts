import { Injectable } from "@nestjs/common";
import { AbstractModel } from "./abstract.model";
import { UserType } from "../schema/user.schema";
import { LoggerService } from "@app/logger";
import { PopulateOpts } from "@app/shared";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";

/**
 * Class used to access mongo db logic for users.
 */
@Injectable()
export class UserModel extends AbstractModel<UserType> {
  protected override textSearchFields: string[] = ['email', 'fullName'];
  protected override populateOptions: PopulateOpts = [];

  /**
   * Constructor method.
   * 
   * @param {mongoose.Model<UserType>} model user model type to use.
   * @param {LoggerService} logger logger used to log errors.
   */
  constructor(@InjectModel(UserType.name) model: mongoose.Model<UserType>, logger: LoggerService) {
    super(model, logger);
  }
}