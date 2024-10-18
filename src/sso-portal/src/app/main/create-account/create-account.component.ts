import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationService, NotificationService, CustomValidators } from '@josephbenraz/ngx-common';
import { CreateMfaModel, MfaCode, MfaData, MfaMode, SignUp, SignUpResult, ValidationRules } from '../../shared/shared.model';
import { InternalLoginService } from '../internal-login.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAccountComponent implements OnInit {

  ValidationRules = ValidationRules;

  mfaData: MfaData;
  isLoading = false;
  isPasswordShown = false;
  isRepeatPasswordShown = false;
  isMfaCodePage: boolean = false;
  form: UntypedFormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private internalLoginService: InternalLoginService,
    private notificationService: NotificationService,
    private validationService: ValidationService) {
    this.form = this.fb.group({
      username: [, [Validators.required, Validators.email]],
      firstName: [, [Validators.required, CustomValidators.notEmptyOrWhitespace]],
      lastName: [, [Validators.required, CustomValidators.notEmptyOrWhitespace]],
      phoneNumber: [, [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
      password: [, [Validators.required, Validators.pattern(ValidationRules.PASSWORD_REGEX)]],
      repeatPassword: [, [Validators.required, Validators.pattern(ValidationRules.PASSWORD_REGEX)]]
    });
  }

  ngOnInit() {
  }

  onCreateAccount() {
    this.validationService.validate(this.form);

    if (this.form.get('password').value !== this.form.get('repeatPassword').value) {
      this.form.get('repeatPassword').setErrors({ passwords: 'Passwords do not match' });
    }

    if (!this.form.valid) {
      return;
    }

    const model = this.form.value as SignUp;
    model.sendConfirmationEmail = false;

    this.isLoading = true;
    this.internalLoginService
      .signUp(model)
      .subscribe(
        signUpResult => {
          this.sendMfaConfirmationCode();
        },
        error => {
          this.isLoading = false;
          this.notificationService.error(error)
        }
      )
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onLogIn(){
    this.router.navigate(['login']);
  }

  onBackToCreate(){
    this.isMfaCodePage = false;
  }

  sendMfaConfirmationCode(){
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
}
