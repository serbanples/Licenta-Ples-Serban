import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SignupValidationRules } from "./types";
import { HttpClient } from "@angular/common/http";
import { DatasourceService } from "src/app/services/datasource.service";
import { GenericErrorHandler } from "src/app/decorators/errorHandler.decorator";
import { SnackbarService } from "src/app/services/snackbar.service";

@Injectable()
export class SignupService {
  constructor(
    private datasourceService: DatasourceService,
    private httpClient: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  getValidationRules(): Observable<SignupValidationRules> {
    const url = this.datasourceService.makeRequestUrl(this.datasourceService.registerValidation);

    return this.httpClient.get<SignupValidationRules>(url);
  }

  @GenericErrorHandler()
  handleSignup(registerForm: Object): Observable<any> {
    const url = this.datasourceService.makeRequestUrl(this.datasourceService.registerRequest);

    return this.httpClient.post(url, registerForm);
  }
}