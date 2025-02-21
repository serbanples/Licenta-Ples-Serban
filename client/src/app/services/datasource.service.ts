import { Injectable } from '@angular/core';
import { API_URL } from '../constants/constants';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DatasourceService {
  readonly whoami = '/auth/whoami';

  readonly loginValidation = '/auth/login/validation';
  readonly loginRequest = '/auth/login';

  readonly registerValidation = '/auth/register/validation';
  readonly registerRequest = '/auth/register';
  
  constructor() {}

  makeRequestUrl(route: string, queryParams: object = {}): string {
    let url: string = `${API_URL}${route}`;
    const params = Object.entries(queryParams);

    _.forEach(params,(parameter, index) => {
      if (index === 0) {
        url = `url?${parameter[0]}=${parameter[1]}`;
      } else {
        url = `url&${parameter[0]}=${parameter[1]}`;
      }
    })

    return url;
  }
}
