import { Observable } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { config } from '@app/config';
import { UserType } from '@app/database';
import { ResourceWithPagination, UserBrowseFilter, UserContextType, UserUpdateType, WithContext } from '@app/shared';

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

  browse(userContext: UserContextType, browseFilter: UserBrowseFilter): Observable<ResourceWithPagination<UserType>> {
    const payload: WithContext<UserBrowseFilter> = {
      userContext,
      data: browseFilter,
    }
    return this.coreServer.send(config.rabbitMQ.core.messages.usersBrowse, payload);
  }

  update(userContext: UserContextType, updateBody: UserUpdateType): Observable<UserType> {
    const payload: WithContext<UserUpdateType> = {
      userContext,
      data: updateBody
    }
    return this.coreServer.send(config.rabbitMQ.core.messages.usersUpdate, payload);
  }
}
