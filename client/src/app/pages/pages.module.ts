import { NgModule } from "@angular/core";
import { LandingPage } from "./landing/landing.page";
import { LoginPage } from "./login/login.page";
import { SignupPage } from "./signup/signup.page";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    LandingPage,
    LoginPage,
    SignupPage
  ],
  imports: [
    SharedModule
  ],
  providers: [],
})
export class PagesModule {}