import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginValidationRules } from "./types";
import { HttpClient } from "@angular/common/http";
import { DatasourceService } from "src/app/services/datasource.service";
import { GenericErrorHandler } from "src/app/decorators/errorHandler.decorator";
import { SnackbarService } from "src/app/services/snackbar.service";

@Injectable()
export class LoginService {
  constructor(
    private datasourceService: DatasourceService,
    private httpClient: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  getValidationRules(): Observable<LoginValidationRules> {
    const url = this.datasourceService.makeRequestUrl(this.datasourceService.loginValidation);

    return this.httpClient.get<LoginValidationRules>(url);
  }

  @GenericErrorHandler()
  handleLogin(loginForm: Object): Observable<any> {
    const url = this.datasourceService.makeRequestUrl(this.datasourceService.loginRequest);

    return this.httpClient.post(url, loginForm);
  }
}