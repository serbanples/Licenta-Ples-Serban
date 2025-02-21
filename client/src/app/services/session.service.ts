import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserContext } from '../types/global.types';
import { HttpClient } from '@angular/common/http';
import { DatasourceService } from './datasource.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private userContextSubject = new BehaviorSubject<UserContext | null>(null);
  user$ = this.userContextSubject.asObservable();
  isUserLoggedIn: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private datasourceService: DatasourceService
  ) {}

  fetchUserContext(): Observable<UserContext> {
    const whoamiUrl = this.datasourceService.makeRequestUrl(this.datasourceService.whoami);

    return this.httpClient.get<UserContext>(whoamiUrl).pipe(
      tap((userContext) => {
        console.log(userContext)
        this.userContextSubject.next(userContext);
        this.isUserLoggedIn = true;
      })
    )
  }

  getContext(): UserContext | null {
    return this.userContextSubject.value;
  }

  clearContext(): void {
    this.userContextSubject.next(null);
    this.isUserLoggedIn = false;
  }

}
