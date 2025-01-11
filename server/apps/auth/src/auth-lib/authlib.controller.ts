import { config } from '@app/config';
import { NewAccountDto } from '@app/shared_types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  @MessagePattern(config.rabbitMQ.auth.messages.register)
  createAccount(@Payload() newAccount: NewAccountDto) {
    console.log('aici')
    console.log(newAccount)
    return newAccount;
  }
}
