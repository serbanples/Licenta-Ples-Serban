import { config } from "@app/config";
import { LoggingInterceptor } from "@app/logger";
import { RpcErrorEncoder, UserContextType } from "@app/shared";
import { Controller, UseInterceptors } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Authorize } from "libs/shared/src";

@UseInterceptors(LoggingInterceptor)
@Controller()
export class UsersController {
  @MessagePattern(config.rabbitMQ.core.messages.usersBrowse)
  @Authorize("users:browse")
  @RpcErrorEncoder()
  browse(@Payload() data: { userContext: UserContextType, filter: any }): Promise<any> {
    // const { userContext, filter } = data;

    // some function calls;
    console.log(data)

    return Promise.resolve(null);
  }
}