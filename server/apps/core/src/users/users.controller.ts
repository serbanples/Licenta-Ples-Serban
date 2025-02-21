import { config } from "@app/config";
import { UserType } from "@app/database/schema/user.schema";
import { LoggingInterceptor } from "@app/logger";
import { ResourceWithPagination, RpcErrorEncoder, UserBrowseFilter, UserCreateType, UserDeleteType, UserUpdateType, WithContext } from "@app/shared";
import { Controller, UseInterceptors } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Authorize } from "@app/shared";

@UseInterceptors(LoggingInterceptor)
@Controller()
export class UsersController {
  @MessagePattern(config.rabbitMQ.core.messages.usersBrowse)
  @Authorize("users:browse")
  @RpcErrorEncoder()
  browse(@Payload() data: WithContext<UserBrowseFilter>): Promise<ResourceWithPagination<UserType>> {
    // const { userContext, filter } = data;

    // some function calls;
    console.log(data)

    return null as unknown as Promise<ResourceWithPagination<UserType>>;
  }

  // action used by auth service when user registers
  @MessagePattern(config.rabbitMQ.core.messages.usersCreate)
  @Authorize("users:create")
  @RpcErrorEncoder()
  create(@Payload() data: WithContext<UserCreateType>): void {
    console.log(data);
    // call service save method;
  }

  @MessagePattern(config.rabbitMQ.core.messages.usersUpdate)
  @Authorize("users:update")
  @RpcErrorEncoder()
  update(@Payload() data: WithContext<UserUpdateType>): Promise<UserType> {
    console.log(data);

    return null as unknown as Promise<UserType>
  }

  // action used by auth service when user deletes account
  @MessagePattern(config.rabbitMQ.core.messages.usersDelete)
  @Authorize("users:delete")
  @RpcErrorEncoder()
  delete(@Payload() data: WithContext<UserDeleteType>): void {
    console.log(data)
    // call service delete method
  }

}