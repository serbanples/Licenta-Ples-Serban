import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { SessionService } from "../services/session.service";

export const canActivateLoggedin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const isUserLgoggedIn = inject(SessionService).isUserLoggedIn;
  const router = inject(Router);

  if(isUserLgoggedIn) {
    return true;
  }
  
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  })
  return false;
}