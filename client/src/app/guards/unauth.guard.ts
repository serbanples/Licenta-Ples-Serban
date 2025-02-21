import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { SessionService } from "../services/session.service";

export const canActivateLoggedOut: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const isUserLoggedIn = inject(SessionService).isUserLoggedIn;
  const router = inject(Router);
  
  if(!isUserLoggedIn) {
    return true;
  }

  router.navigate(['/home'], {
    queryParams: { returnUrl: state.url }
  })
  return false;
}