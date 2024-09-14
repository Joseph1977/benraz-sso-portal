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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@josephbenraz/npm-authorization';
import { ValidationService, NotificationService } from '@josephbenraz/npm-common';
import { SetPassword, ValidationRules } from '../../shared/shared.model';
import { FragmentService } from '../../shared/fragment.service';
import { InternalLoginService } from '../internal-login.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SetPasswordComponent implements OnInit, OnDestroy {
  ValidationRules = ValidationRules;

  isLoading = false;
  isPasswordSet = false;

  isNewPasswordShown = false;
  isRepeatNewPasswordShown = false;

  lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
  uppercase: string = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
  symbols: string = '~!@-#$';
  numbers: string = '0123456789';

  form: FormGroup;

  passwordValidationRules = [
    { isValid: false, regexp: '.{8,}', message: '8+ characters' },
    { isValid: false, regexp: '(?=.*[^a-zA-Z0-9])', message: '1+ non-alphanumeric character' },
    { isValid: false, regexp: '(?=.*[a-z])', message: '1+ lowercase (‘a’-’z’)' },
    { isValid: false, regexp: '(?=.*[A-Z])', message: '1+ uppercase (‘A’-’Z’)' },
    { isValid: false, regexp: '(?=.*[0-9])', message: '1+ digit (‘0’-’9’)' },
  ]
  @ViewChild('btnChangePassword', { read: ElementRef }) btnChangePassword : ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private internalLoginService: InternalLoginService,
    private fragmentService: FragmentService,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    private authService: AuthService) {
    this.form = this.fb.group({
      code: [''],
      newPassword: ['', [Validators.required, Validators.pattern(ValidationRules.PASSWORD_REGEX)]],
      repeatNewPassword: ['', [Validators.required, Validators.pattern(ValidationRules.PASSWORD_REGEX)]]
    });
  }

  ngOnInit() {
    const fragment = this.route.snapshot.fragment;
    if (!fragment) {
      return;
    }

    const fragmentPartPairs = this.fragmentService.getFragment();
    this.form.get('code').setValue(fragmentPartPairs.code);

    const accessToken = new URLSearchParams(fragment).get('access_token');
    if (accessToken) {
      this.authService.setToken(accessToken);
    }
  }

  ngOnDestroy() {
    this.isLoading = false;
  }

  onChecked() {
    let has8Characters = this.form.get('has8Characters').value;
    let hasSymbols = this.form.get('hasNonAlphaNumeric').value;
    let hasLowerCase = this.form.get('hasLowerCase').value;
    let hasUpperCase = this.form.get('hasUpperCase').value;
    let hasNumbers = this.form.get('hasDigit').value;

    const characterList = [
      hasSymbols ? this.symbols : [],
      hasNumbers ? this.numbers : [],
      hasLowerCase ? this.lowercase : [],
      hasUpperCase ? this.uppercase : []
    ].join('');

    const result = Array.from({
      length: has8Characters ? Math.floor(Math.random() * 14) + 8 : Math.floor(Math.random() * 8) + 6
    },
      () => Math.floor(Math.random() * characterList.length))
      .map(number => characterList[number])
      .join('');

    this.form.get('newPassword').setValue(result);
  }

  changePassword() {
    this.validationService.validate(this.form);

    if (this.form.get('newPassword').value !== this.form.get('repeatNewPassword').value) {
      this.form.get('repeatNewPassword').setErrors({ passwords: 'Passwords do not match' });
    }

    if (!this.form.valid) {
      return;
    }

    const setPassword = this.form.value as SetPassword;
    this.isLoading = true;
    this.internalLoginService
      .setPassword(setPassword)
      .subscribe(
        () => {
          this.isPasswordSet = true;
        },
        error => this.notificationService.error(error)
      )
      .add(() => this.isLoading = false);
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onCheckNewPasswordRules(valueEvent: any) {
    const value = valueEvent.target.value;
    this.passwordValidationRules.forEach(item => {
      const regExp = new RegExp(item.regexp);
      item.isValid = regExp.test(value);
    });
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    if ((e.which == 13 || e.keyCode == 13)) {
      e.preventDefault();
      this.btnChangePassword.nativeElement.click();
    }
  }
}
