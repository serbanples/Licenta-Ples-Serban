import { Controller } from '@nestjs/common';
import { AutzService } from './autz.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AutzAuthorizedType } from '@app/shared_types';
import { config } from '@app/config';

/** 
 * Authorization controller class.
 */
@Controller()
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
  @MessagePattern(config.rabbitMQ.autz.messages.authorize)
  authorize(@Payload() data: AutzAuthorizedType): boolean {
    return this.service.isAuthorized(data.usercontext.role, data.resource, data.action);
  }
}
