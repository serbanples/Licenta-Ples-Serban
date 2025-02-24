import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { RequestWrapper, ResourceWithPagination } from '@app/shared';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { UsersApiService } from './users-api.service';
import { JwtGuard } from '../guards/jwt.guard';
import { UserBrowseFilter, UserUpdateType } from 'libs/shared/src/types/core/user.types';
import { UserType } from '@app/database/schema/user.schema';

/**
 * Users api controller class used to handle user related requests.
 */
@Controller('users')
@UseGuards(JwtGuard)
export class UsersApiControler {
  private readonly service: UsersApiService;

  /**
   * Constructor method.
   * 
   * @param {UsersApiService} service users service used to communicate with core microservice.
   */
  constructor(service: UsersApiService) {
    this.service = service;
  }

  /**
   * Method used to handle register requests.
   * 
   * @param {NewAccountDto} registerData registration form.
   * @returns {Observable<SuccessResponse>} register response.
   */
  @Post('browse')
  @HttpCode(HttpStatus.OK)
  browse(@Req() req: RequestWrapper, @Body() browseFilter: UserBrowseFilter): Observable<ResourceWithPagination<UserType>> {
    return this.service.browse(req.user!, browseFilter);
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  update(@Req() req: RequestWrapper, @Body() updateData: UserUpdateType): Observable<UserType> {
    return this.service.update(req.user!, updateData);
  }
}
