import { MessagePattern, Payload } from "@nestjs/microservices";
import { Controller, UseInterceptors } from "@nestjs/common";
import { config } from "@app/config";
import { UserType } from "@app/database";
import { LoggingInterceptor } from "@app/logger";
import { Authorize, ResourceWithPagination, RpcErrorEncoder, UserBrowseFilter, UserCreateType, UserDeleteType, UserUpdateType, WithContext } from "@app/shared";
import { UserService } from "./users.service";

@UseInterceptors(LoggingInterceptor)
@Controller()
export class UsersController {
  private readonly userService: UserService;

  constructor(service: UserService) {
    this.userService = service;
  }

  @MessagePattern(config.rabbitMQ.core.messages.usersBrowse)
  @Authorize("users:browse")
  @RpcErrorEncoder()
  browse(@Payload() data: WithContext<UserBrowseFilter>): Promise<ResourceWithPagination<UserType>> {
    return this.userService.browse(data.userContext, data.data);
  }

  // action used by auth service when user registers
  @MessagePattern(config.rabbitMQ.core.messages.usersCreate)
  @Authorize("users:create")
  @RpcErrorEncoder()
  create(@Payload() data: WithContext<UserCreateType>): void {
    this.userService.create(data.userContext, data.data);
  }

  @MessagePattern(config.rabbitMQ.core.messages.usersUpdate)
  @Authorize("users:update")
  @RpcErrorEncoder()
  update(@Payload() data: WithContext<UserUpdateType>): Promise<UserType> {
    return this.userService.update(data.userContext, data.data);
  }

  // action used by auth service when user deletes account
  @MessagePattern(config.rabbitMQ.core.messages.usersDelete)
  @Authorize("users:delete")
  @RpcErrorEncoder()
  delete(@Payload() data: WithContext<UserDeleteType>): void {
    this.userService.delete(data.userContext, data.data);
  }

}