import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@josephbenraz/npm-authorization';
import { NotificationService, ValidationService } from '@josephbenraz/npm-common';
import { Subject } from 'rxjs';
import { GetTokenByMfaCodeModel, MfaCode, MfaCodeToken, MfaData } from '../../../shared/shared.model';
import { InternalLoginService } from '../../internal-login.service';

@Component({
  selector: 'app-confirm-restore-password',
  templateUrl: './confirm-restore-password.component.html',
  styleUrls: ['./confirm-restore-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmRestorePasswordComponent implements OnInit, OnDestroy {
  @Input() data: MfaData;
  @Input() userEmail: string;

  @Output() resend = new EventEmitter();
  @Output() back = new EventEmitter();

  mfaCodeLength: number;
  isLoading = false;
  isTimerFinished = false;
  isCodeDisabled = false;
  resetSubject = new Subject();
  form: FormGroup;
  mfaCodeToken: MfaCodeToken;

  @ViewChild('codeSubmit') codeSubmit: ElementRef;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private internalLoginService: InternalLoginService,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    if (this.data && this.data.accessToken) {
      this.authService.setToken(this.data.accessToken);
    }

    if(this.data){
      this.mfaCodeLength = this.data.numberOfDigits;
    }

    this.generateForm();
  }

  ngOnDestroy() {
    this.isLoading = false;
  }

  onBack() {
    this.resetSubject.next(null);
    this.form.reset();
    this.back.emit();
  }

  onTimerFinished() {
    this.isTimerFinished = true;
  }

  onResendCode() {
    this.resend.emit();
  }

  onCheckCode() {
    this.isLoading = true;
    this.isCodeDisabled = true;
    this.validationService.validate(this.form);

    if (this.form.invalid) {
      this.notificationService.error('Code is not valid');
      this.resetSubject.next(null);
      this.form.reset();
      this.isCodeDisabled = false;
      this.isLoading = false;

      return;
    }

    let getTokenData = {
      userEmail: this.userEmail,
      actionType: MfaCode.resetPassword,
      code: this.form.get('code').value,
    } as GetTokenByMfaCodeModel;

    this.internalLoginService
      .getOneTimeTokenByMfaCode(getTokenData)
      .subscribe(
        (data) => {
          this.mfaCodeToken = data;
        },
        error => {
          this.notificationService.error(error);
          this.resetSubject.next(null);
          this.form.reset();
          this.isCodeDisabled = false;
          this.isLoading = false;
        },
        () => {
          this.router.navigate(['/set-password'], { fragment: `code=${this.mfaCodeToken.code}&access_token=${this.mfaCodeToken.accessToken}` });
        }
      )
      .add(() => {
        this.isLoading = false
      });
  }

  private generateForm() {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(this.mfaCodeLength), Validators.maxLength(this.mfaCodeLength)]]
    });
  }
}
