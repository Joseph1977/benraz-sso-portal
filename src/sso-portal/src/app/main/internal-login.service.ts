import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternalUrlsService } from '@josephbenraz/npm-common';
import {
  SetPassword,
  LoginResult,
  Login,
  ChangePassword,
  RestorePassword,
  SignUp,
  SendConfirmationEmail,
  ConfirmEmail,
  SignUpResult,
  MfaData,
  GetTokenByMfaCodeModel,
  MfaCodeToken,
  CreateMfaModel
} from '../shared/shared.model';

@Injectable()
export class InternalLoginService {
  constructor(
    private internalUrlsService: InternalUrlsService,
    private http: HttpClient) {
  }

  login(model: Login): Observable<LoginResult> {
    return this.http.post<LoginResult>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login`, model);
  }

  signUp(model: SignUp): Observable<SignUpResult> {
    return this.http.post<SignUpResult>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login/sign-up`, model);
  }

  sendConfirmationEmail(model: SendConfirmationEmail): Observable<void> {
    return this.http.post<void>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login/send-confirmation-email`, model);
  }

  confirmEmail(model: ConfirmEmail): Observable<void> {
    return this.http.post<void>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login/confirm-email`, model);
  }

  setPassword(model: SetPassword): Observable<void> {
    return this.http.post<void>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login/set-password`, model);
  }

  changePassword(model: ChangePassword): Observable<void> {
    return this.http.post<void>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login/change-password`, model);
  }

  restorePassword(restorePassword: RestorePassword): Observable<void> {
    return this.http.post<void>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login/restore-password`, restorePassword);
  }

  createMfa(createMfaModel: CreateMfaModel): Observable<MfaData> {
    return this.http.post<MfaData>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login/mfa`, createMfaModel);
  }

  getOneTimeTokenByMfaCode(mfaCodeModel: GetTokenByMfaCodeModel): Observable<MfaCodeToken> {
    return this.http.post<MfaCodeToken>(
      `${this.internalUrlsService.getApiBaseUrl()}/internal-login/mfa/token`, mfaCodeModel);
  }

  redirectTo(url: string) {
    window.location.href = url;
  }
}
