import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AutzAuthorizedType, RpcErrorEncoder } from '@app/shared';
import { config } from '@app/config';
import { LoggingInterceptor } from '@app/logger';
import { AutzService } from './autz.service';

/** 
 * Authorization controller class.
 */
@Controller()
@UseInterceptors(LoggingInterceptor)
export class AutzController {
  private readonly service: AutzService;

  /**
   * Constructor method.
   * 
   * @param {AutzService} autzService authorization service.
   */
  constructor(autzService: AutzService) {
    this.service = autzService;
  }

  /**
   * Method used to authorize a user, based on the resource accessed and the user role.
   * 
   * @param {AutzAuthorizedType} data object containing user role, resource accessed and action.
   * @returns {boolean} true if user is authorized, false if not.
   */
  @MessagePattern(config.rabbitMQ.auth.messages.authorize)
  @RpcErrorEncoder()
  authorize(@Payload() data: AutzAuthorizedType): boolean {
    return this.service.isAuthorized(data.usercontext.role, data.resource, data.action);
  }
}
