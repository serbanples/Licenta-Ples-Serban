import { Controller } from '@nestjs/common';
import { AutzService } from './autz.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AutzAuthorizedType } from '@app/shared_types';
import { config } from '@app/config';

@Controller()
export class AutzController {
  constructor(private readonly autzService: AutzService) {}

  @MessagePattern(config.rabbitMQ.autz.messages.authorize)
  authorize(@Payload() data: AutzAuthorizedType): boolean {
    return this.autzService.isAuthorized(data.usercontext.role, data.resource, data.action);
  }
}
