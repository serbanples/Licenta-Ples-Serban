import _ from "lodash";
import { DeleteResult } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { IApi, ResourceWithPagination, UserBrowseFilter, UserContextType, UserCreateType, UserDeleteType, UserUpdateType } from "@app/shared";
import { UserModel, UserType } from "@app/database";

@Injectable()
export class UserService implements IApi<UserType> {
  private readonly userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  browse(__: UserContextType, filter: UserBrowseFilter): Promise<ResourceWithPagination<UserType>> {
    const pagination = filter.pagination || {};

    return this.userModel.findWithPagination(pagination, filter, filter.populate)
  }

  create(__: UserContextType, newDocument: UserCreateType): Promise<UserType> {
    return this.userModel.create(newDocument)
  }

  update(__: UserContextType, updatedDocument: UserUpdateType): Promise<UserType> {
    return this.userModel.updateOne({ _id: updatedDocument.id }, updatedDocument.updateBody )
      .then((updatedUser) => {
        if(_.isNil(updatedUser)) {
          throw new NotFoundException('User not found');
        }

        return updatedUser;
      })
  }

  delete(__: UserContextType, deletedDocument: UserDeleteType): Promise<DeleteResult> {
    return this.userModel.deleteOne({ email: deletedDocument.email })
  }
}