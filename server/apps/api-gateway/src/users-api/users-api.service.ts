import { config } from '@app/config';
import { UserContextType } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

/**
 * Users api service class used to communicate with core server.
 */
@Injectable()
export class UsersApiService {
  private readonly coreServer: ClientProxy;

  /**
   * Constructor method.
   * 
   * @param {ClientProxy} coreServer proxy used to send messages to core server.
   */
  constructor(@Inject(config.rabbitMQ.core.serviceName) coreServer: ClientProxy) {
    this.coreServer = coreServer;
  }

  browse(userContext: UserContextType, browseFilter: any): Observable<any> {
    const payload = {
        userContext,
        browseFilter
    }
    return this.coreServer.send(config.rabbitMQ.core.messages.usersBrowse, payload);
  }

}
