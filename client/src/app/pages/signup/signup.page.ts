import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { tap } from "rxjs";
import { ValidationService } from "src/app/services/validation.service";
import { SignupService } from "./signup.service";

@Component({
  selector: 'signup-page',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: SignupService
  ) { 
    this.signupForm = this.formBuilder.group({  // Fix: Initialize empty form
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.initLoginForm();
    console.log(this.signupForm)
  }

  private initLoginForm() {
    this.registrationService.getValidationRules().pipe(
      tap((validation) => {
        const usernameValidations = ValidationService.createValidators(validation.username);
        const emailValidations = ValidationService.createValidators(validation.email);
        const passwordValidations = ValidationService.createValidators(validation.password);
        const confirmPasswordValidations = ValidationService.createValidators(validation.confirmPassword);
        this.signupForm = this.formBuilder.group({
          username: ['', usernameValidations],
          email: ['', emailValidations],
          password: ['', passwordValidations],
          confirmPassword: ['', confirmPasswordValidations]
        })
      })
    ).subscribe();
  }

  onSubmit() {
    if(this.signupForm.valid) {
      this.registrationService.handleSignup(this.signupForm.value).subscribe();
    }
  }
}