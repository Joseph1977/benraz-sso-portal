import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@josephbenraz/npm-authorization';
import { NotificationService, ValidationService } from '@josephbenraz/npm-common';
import { Subject } from 'rxjs';
import { GetTokenByMfaCodeModel, MfaCode, MfaCodeToken, MfaData } from '../../../shared/shared.model';
import { InternalLoginService } from '../../internal-login.service';

@Component({
  selector: 'app-confirm-create-account',
  templateUrl: './confirm-create-account.component.html',
  styleUrls: ['./confirm-create-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmCreateAccountComponent implements OnInit, OnDestroy {
  @Input() data: MfaData;
  @Input() userEmail: string;

  @Output() resend = new EventEmitter();
  @Output() back = new EventEmitter();

  mfaCodeLength: number;
  isLoading = false;
  isTimerFinished = false;
  isCodeDisabled = false;
  resetSubject = new Subject();
  form: UntypedFormGroup;
  mfaCodeToken: MfaCodeToken;

  @ViewChild('codeSubmit') codeSubmit: ElementRef;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
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
      actionType: MfaCode.confirmEmail,
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
          this.router.navigate(['/confirm-email'], { fragment: `userId=${this.mfaCodeToken.userId}&code=${this.mfaCodeToken.code}` });
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
