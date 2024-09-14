import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@josephbenraz/npm-authorization';
import { NotificationService, ValidationService } from '@josephbenraz/npm-common';
import { ChangePassword, ValidationRules } from '../../shared/shared.model';
import { UserService } from '../../shared/user.service';
import { State } from '../../shared/state/state.model';
import { StateService } from '../../shared/state/state.service';
import { InternalLoginService } from '../internal-login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  ValidationRules = ValidationRules;

  isLoading = false;
  isOldPasswordShown = false;
  isNewPasswordShown = false;
  isRepeatNewPasswordShown = false;
  form: FormGroup;
  @ViewChild('btnChangePassword', { read: ElementRef }) btnChangePassword : ElementRef;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private internalLoginService: InternalLoginService,
    private authService: AuthService,
    private userService: UserService,
    private stateService: StateService,
    private notificationService: NotificationService,
    private validationService: ValidationService) {
    this.form = this.fb.group({
      userId: [''],
      name: [''],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.pattern(ValidationRules.PASSWORD_REGEX)]],
      repeatNewPassword: ['', [Validators.required, Validators.pattern(ValidationRules.PASSWORD_REGEX)]]
    });
  }

  ngOnInit() {
    const user = this.userService.createUserFromToken(this.authService.getToken());
    if (user) {
      this.form.get('userId').setValue(user.id);
      this.form.get('name').setValue(user.name);
    }
  }

  ngOnDestroy() {
    this.isLoading = false;
  }

  changePassword() {
    this.validationService.validate(this.form);

    if (this.form.get('newPassword').value !== this.form.get('repeatNewPassword').value) {
      this.form.get('repeatNewPassword').setErrors({ passwords: 'Passwords do not match' });
    }

    if (!this.form.valid) {
      this.notificationService.error('Form is not valid');
      return;
    }

    const state = this.stateService.getState();
    if (!state || !state.applicationId) {
      this.notificationService.error('Something went wrong, please close the window and try again');
      return;
    }

    const model = this.form.value as ChangePassword;
    model.state = State.toString(state);

    this.isLoading = true;
    this.internalLoginService
      .changePassword(model)
      .subscribe(
        () => {
          this.authService.removeToken();
          this.notificationService.success('Password successfully changed');
          this.router.navigate(['login']);
        },
        error => this.notificationService.error(error)
      )
      .add(() => this.isLoading = false);
  }

  onBack() {
    this.router.navigate(['/']);
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    if ((e.which == 13 || e.keyCode == 13)) {
      e.preventDefault();
      this.btnChangePassword.nativeElement.click();
    }
  }
}
