import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef 
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService, UserService } from '@josephbenraz/npm-authorization';
import { InternalUrlsService, NotificationService, ValidationService } from '@josephbenraz/npm-common';
import { environment } from '../../../environments/environment';
import { AuthorizationFailedReasonCode, CreateMfaModel, Login, MfaCode, MfaData, MfaMode } from '../../shared/shared.model';
import { State } from '../../shared/state/state.model';
import { StateService } from '../../shared/state/state.service';
import { SsoProvidersService } from '../../shared/sso-providers/sso-providers.service';
import { SsoProvider, SsoProviderCode } from '../../shared/sso-providers/sso-providers.model';
import { InternalLoginService } from '../internal-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  isPasswordShown = false;
  form: UntypedFormGroup;
  state: string;
  enabledSsoProviders: SsoProvider[];
  ssoProviderCode = SsoProviderCode;
  isPasswordPage = false;
  isMfaCodePage: boolean = false;
  mfaData: MfaData;
  @ViewChild('btnLogin', { read: ElementRef }) btnLogin : ElementRef;
  @ViewChild('btnNext', { read: ElementRef }) btnNext : ElementRef;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private internalLoginService: InternalLoginService,
    private authService: AuthService,
    private userService: UserService,
    private stateService: StateService,
    private ssoProvidersService: SsoProvidersService,
    private internalUrlsService: InternalUrlsService,
    private validationService: ValidationService,
    private notificationService: NotificationService) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    const state = State.fromParams(this.route.snapshot.queryParams);
    if (state.applicationId) {
      this.stateService.saveState(state);
    }
    else {
      state.applicationId = environment.defaultApplication;
      this.stateService.saveState(state);
    }

    this.loadSsoProviders();
  }

  ngOnDestroy() {
    this.isLoading = false;
  }

  get formControls(){
    return this.form.controls;
  }

  loadSsoProviders() {
    const applicationId = this.stateService.getState()?.applicationId;
    if (!applicationId) {
      this.enabledSsoProviders =  [
        {
          code: SsoProviderCode.internal, // Set the code to the internal enum value
          name: 'Internal Provider'       // You can define the name, or leave it undefined
        }
      ];

      return;
    }

    this.isLoading = true;
    this.ssoProvidersService
      .getServerSsoProviders(applicationId)
      .subscribe(
        ssoProviders => {
          this.enabledSsoProviders = ssoProviders;
        },
        error => this.notifyError(error)
      )
      .add(() => this.isLoading = false);
  }

  onNext(){
    this.formControls.username.markAsTouched();
    if (!this.formControls.username.valid) {
      this.notificationService.error('Invalid email');
      return;
    }

    this.isPasswordPage = true;
  }

  onBack(){
    this.isPasswordPage = false;
  }

  onLogin() {
    this.validationService.validate(this.form);
    if (!this.form.valid) {
      this.notificationService.error('Form is invalid');
      return;
    }

    const state = this.stateService.getState();
    if (!state || !state.applicationId) {
      this.notificationService.error('Something went wrong, please close the window and try again');
      return;
    }

    const model = this.form.value as Login;
    model.state = State.toString(state);

    this.isLoading = true;
    this.internalLoginService
      .login(model)
      .subscribe(
        loginResult => {
          if (loginResult.errorReasonCode === AuthorizationFailedReasonCode.emailUnconfirmed) {
            this.sendMfaConfirmationCode();
            return;
          }

          if (loginResult.error) {
            this.notifyError(loginResult.error);
            return;
          }
debugger
          this.authService.setToken(loginResult.accessToken);
          const user = this.userService.createUserFromToken(loginResult.accessToken);
          if (user.isPasswordExpired) {
            this.notificationService.notify('Your password has expired and should be changed');
            this.router.navigate(['change-password']);
            return;
          }

          this.internalLoginService.redirectTo(loginResult.callbackUrl);
        },
        error => this.notifyError(error)
      );
  }

  onLoginWithGoogle() {
    this.ssoLogin('google');
  }

  onLoginWithFacebook() {
    this.ssoLogin('facebook');
  }

  onLoginWithMicrosoft() {
    this.ssoLogin('microsoft');
  }

  onForgotPassword() {
    this.router.navigate(['restore-password'],
      { queryParams: { username: this.form.value.username } });
  }

  onCreateAccount() {
    this.router.navigate(['create-account']);
  }

  isSupported(code: SsoProviderCode) {
    return this.enabledSsoProviders?.some(x => x.code === code);
  }

  dynamicClasses(code: SsoProviderCode) {
    if(SsoProviderCode.microsoft === code){
      if(this.enabledSsoProviders?.some(x => x.code === SsoProviderCode.facebook)){
        return 'pe-3'
      }
      else if(this.enabledSsoProviders?.some(x => x.code === SsoProviderCode.google)){
        return 'pe-1'
      }
      else{
        return 'pe-0'
      }
    }
    else if(SsoProviderCode.google === code){
      if(this.enabledSsoProviders?.some(x => x.code === SsoProviderCode.facebook)){
        return 'ps-3'
      }
      else if(this.enabledSsoProviders?.some(x => x.code === SsoProviderCode.microsoft)){
        return 'ps-1'
      }
      else{
        return 'ps-0'
      }
    }
  }

  isDividerShown() {
    const isExternalSupported =
      this.isSupported(SsoProviderCode.google) ||
      this.isSupported(SsoProviderCode.facebook) ||
      this.isSupported(SsoProviderCode.microsoft);

    return this.isSupported(SsoProviderCode.internal) && isExternalSupported;
  }

  isCenter() {
    const isExternalSupported =
      this.isSupported(SsoProviderCode.google) ||
      this.isSupported(SsoProviderCode.facebook) ||
      this.isSupported(SsoProviderCode.microsoft);

    return !this.isSupported(SsoProviderCode.internal) && isExternalSupported;
  }

  sendMfaConfirmationCode(): void{
    const confirmMfa = {
      userEmail: this.form.get('username').value,
      actionType: MfaCode.confirmEmail,
      mode: MfaMode.email
    } as CreateMfaModel;

    this.isLoading = true;
    this.internalLoginService
      .createMfa(confirmMfa)
      .subscribe(
        (data) => {
          this.mfaData = data;
        },
        error => {
          this.notificationService.error(error);
          this.isMfaCodePage = false;
        },
        () => {
          this.isMfaCodePage = true;
        }
      )
      .add(() => this.isLoading = false);
  }

  onBackToLogin(): void{
    this.isMfaCodePage = false;
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    if ((e.which == 13 || e.keyCode == 13)) {
      e.preventDefault();
      if(this.isPasswordPage)
      {
        this.btnLogin.nativeElement.click();
      }
      else{
        this.btnNext.nativeElement.click();
      }
    }
  }
  
  private ssoLogin(ssoProvider: string) {
    this.isLoading = true;

    const state = this.stateService.getState();
    if (!state || !state.applicationId) {
      this.notificationService.error('Something went wrong, please close the window and try again');
      return;
    }

    const ssoUrl = this.internalUrlsService.getAuthorizationUrl() +
      '?applicationId=' + state.applicationId +
      '&ssoProviderCode=' + ssoProvider;

    this.internalLoginService.redirectTo(ssoUrl);
  }

  private notifyError(error) {
    this.notificationService.error(error);
    this.isLoading = false;
  }
}
