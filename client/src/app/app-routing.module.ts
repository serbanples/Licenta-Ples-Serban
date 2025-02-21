import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing.page';
import { LoginPage } from './pages/login/login.page';
import { SignupPage } from './pages/signup/signup.page';
import { SessionResolver } from './resolvers/session.resolver';
import { canActivateLoggedOut } from './guards/unauth.guard';
import { canActivateLoggedin } from './guards/auth.guard';

const routes: Routes = [
  { path: '', resolve: { session: SessionResolver }, children: [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingPage },
    { path: 'auth', canActivate: [canActivateLoggedOut], children: [
      { path: 'login', component: LoginPage, pathMatch: 'full' },
      { path: 'signup', component: SignupPage, pathMatch: 'full' }
    ]},
    // { path: '', canActivate: [canActivateLoggedin], children: [

    // ]}
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
