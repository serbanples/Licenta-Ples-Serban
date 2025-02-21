import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "./login.service";
import { tap } from "rxjs";
import { ValidationService } from "src/app/services/validation.service";

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  loginError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({  // Fix: Initialize empty form
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  private initLoginForm() {
    this.loginService.getValidationRules().pipe(
      tap((validation) => {
        const emailValidations = ValidationService.createValidators(validation.email);
        this.loginForm = this.formBuilder.group({
          email: ['', emailValidations],
          password: ['', Validators.required]
        })
      })
    ).subscribe();
  }

  onSubmit() {
    this.isSubmitting = true;
    this.loginError = null;
    if (this.loginForm.valid) {
      this.loginService.handleLogin(this.loginForm.value).pipe(
        tap(() => this.isSubmitting  = false)
      )
      .subscribe();
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
    this.isSubmitting = false;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}